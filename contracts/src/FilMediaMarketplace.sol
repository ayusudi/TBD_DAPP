// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// internal & private view & pure functions
// external & public view & pure functions

// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.8.18;

// import {FilMediaToken} from "./FilMediaToken.sol";
import {IERC20} from "./interface/IERC20.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {AutomationCompatible} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {IStructs} from "./interface/IStructs.sol";

contract FilMediaMarketplace is AutomationCompatibleInterface, IStructs {
    AggregatorV3Interface internal dataFeed;

    // Constants for time calculations
    uint256 constant ONE_MONTH_SECONDS = 30 days;
    uint256 public counter;
    uint256 public lastTimeStamp;
    SubriberAnalytics[] isSubcribed; // addresses of user subcribed on the platform (to any artist)
    LastChecked lastChecked;

    /////// STRUCTS ////////
    struct User {
        address userAddress;
        address[] subcribeToAddress; // this is the address he is subcribe to
        string[3] nfts; // this is the 3 NFT'w owned by an artist
    }

    struct ListMusicNFT {
        address nft;
        uint256 tokenId;
        address artist;
    }

    // help get the number of streams
    struct Music {
        address nft;
        uint256 tokenId;
        uint256 streams;
        address artist;
    }

    struct LastChecked {
        address artistAddress;
        address subcriberAddress;
        uint256 lastTimeStamp;
    }
    /////////// MAPPING /////////////////
    mapping(address user => uint256) balance;
    mapping(address artistAddress => Artist) artist;
    mapping(address userAddress => User) user;
    mapping(address artist => mapping(uint256 _tokenId => ListMusicNFT))
        internal _listMusicNfts;
    mapping(uint256 tokenId => Music) music;
    mapping(uint256 subcriberAddress => SubriberAnalytics) subribeAnalytics;
    mapping(address user => mapping(address artist => SubriberAnalytics)) userIsSubcribedToAnalystics;
    mapping(address user => mapping(address artist => bool))
        public isSubscribed;
    //helps get the token id of a user
    mapping(address user => mapping(address artist => uint256)) public _tokenId;
    //helps get the month  a user is subcribed
    mapping(uint256 year => mapping(address user => mapping(address artist => bool)))
        public monthlySubcriptionBool;

    ////////////// EVENTS /////////////////
    event ListedMusicNFT(
        address indexed nft,
        uint256 indexed tokenId,
        address indexed artist,
        uint256 chainid
    );

    event SubcribedToArtist(
        address indexed subcriber,
        address indexed artist,
        uint256 chainid
    );

    event CanceledSubcription(
        address indexed subcriber,
        address indexed artist,
        uint256 chainid
    );

    event ArtistAddedNFTs(address indexed artist, string[] nfts);

    /**
     * Network: Avalanche Testnet
     * Aggregator: AVAX / USD
     * Address: 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
     */
    constructor() {
        dataFeed = AggregatorV3Interface(
            0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
        );
        lastTimeStamp = block.timestamp;
        counter = 0;
    }

    // @notice For Listing Artist music to the DB
    // @dev this adds the a user to the artist struct
    // @param no params
    function listNFT(
        address _nft,
        uint256 tokenId,
        address _artistAddr
    ) public {
        Artist storage _artist = artist[_artistAddr];

        // @state changes
        _artist.tokenIds.push(tokenId);

        _listMusicNfts[_artistAddr][tokenId] = ListMusicNFT({
            nft: _nft,
            tokenId: tokenId,
            artist: _artistAddr
        });

        music[tokenId] = Music({
            nft: _nft,
            tokenId: tokenId,
            streams: 0,
            artist: _artistAddr
        });

        emit ListedMusicNFT(_nft, tokenId, _artistAddr, block.chainid);
    }

    function addNFTForArtist(address _artistAddr, string[] memory nfts) public {
        Artist storage artistStruct = artist[_artistAddr];

        //@state changes
        for (uint i = 0; i < nfts.length; i++) {
            artistStruct.nfts.push(nfts[i]);
        }

        emit ArtistAddedNFTs(_artistAddr, nfts);
    }

    function deposit() public payable {
        (bool success, ) = address(this).call{value: msg.value}("");
        require(success, "Unable to send Avax");

        balance[msg.sender] += msg.value;
    }

    // @notice For Subcribing to a particular artist
    // @dev this adds the a user to the artist struct
    // @param no params
    function subcribeToArtist(address _artistAddr) public payable {
        // @DO's
        // check if a user has enough enough token (up to 1dollar)
        // tranfser the token from the user
        // check if the user is already in the artist subcribers
        // YES -> SKIP next
        // NO -> add the user to the artist subcribers
        // call the chainlink func to call this same function 1 month
        // change user currently subcrib to true
        int answer = getChainlinkDataFeedLatestAnswer();

        uint256 avaxOneUsd = 1e18 / uint256(answer);
        uint256 balanceOfUser = balance[msg.sender];

        User storage _user = user[msg.sender];
        Artist storage _aritst = artist[_artistAddr];

        // @checks
        require(balanceOfUser >= avaxOneUsd, "Insufficient Balance");
        require(!isSubscribed[msg.sender][_artistAddr], "Already subscribed");

        balanceOfUser -= avaxOneUsd;

        // @state changes
        _aritst.allSubcribers.push(msg.sender);
        _user.subcribeToAddress.push(_artistAddr);
        isSubscribed[msg.sender][_artistAddr] = true;
        monthlySubcriptionBool[block.timestamp][msg.sender][_artistAddr] = true;

        userIsSubcribedToAnalystics[msg.sender][
            _artistAddr
        ] = SubriberAnalytics({
            lastPaymentTimestamp: block.timestamp,
            artist: _artistAddr,
            subcriber: msg.sender,
            currentlySubcribed: true,
            subcribedDate: block.timestamp
        });
        isSubcribed.push(
            SubriberAnalytics({
                lastPaymentTimestamp: block.timestamp,
                artist: _artistAddr,
                subcriber: msg.sender,
                currentlySubcribed: true,
                subcribedDate: block.timestamp
            })
        );
        emit SubcribedToArtist(msg.sender, _artistAddr, block.chainid);
    }

    function cancelSubcribtion(address _artistAddr) public {
        // @DO's
        // remove the user from the artist address
        // change user currently subcrib to false
        /// after removing, VRF wont be able to deduct money
        SubriberAnalytics
            storage _currentlySubribed = userIsSubcribedToAnalystics[
                msg.sender
            ][_artistAddr];

        // @state changes
        _currentlySubribed.currentlySubcribed = false;
        isSubscribed[msg.sender][_artistAddr] = false;
        monthlySubcriptionBool[block.timestamp][msg.sender][
            _artistAddr
        ] = false;

        emit CanceledSubcription(msg.sender, _artistAddr, block.chainid);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        // loop throught the isSubcribed(all users that are subcribed);
        // check get the user
        // check if the time has passed to subcribed then if yes call
        for (uint i = 0; i < isSubcribed.length; i++) {
            address artistAddress = isSubcribed[i].artist;
            address subcriberAddress = isSubcribed[i].subcriber;
            SubriberAnalytics memory analystics = userIsSubcribedToAnalystics[
                subcriberAddress
            ][artistAddress];

            if (
                (block.timestamp - analystics.lastPaymentTimestamp) >
                ONE_MONTH_SECONDS
            ) {
                lastChecked = LastChecked({
                    artistAddress: artistAddress,
                    subcriberAddress: subcriberAddress,
                    lastTimeStamp: analystics.lastPaymentTimestamp
                });
                upkeepNeeded = true;
            }
        }
        // upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        LastChecked memory _lastChecked = lastChecked;

        if (
            (block.timestamp - _lastChecked.lastTimeStamp) > ONE_MONTH_SECONDS
        ) {
            address _user = _lastChecked.subcriberAddress;
            address _artist = _lastChecked.artistAddress;
            int answer = getChainlinkDataFeedLatestAnswer();

            uint256 avaxOneUsd = 1e18 / uint256(answer);

            SubriberAnalytics
                storage _subcribeAnalytics = userIsSubcribedToAnalystics[_user][
                    _artist
                ];

            uint256 userBalance = balance[_user];

            if (userBalance >= avaxOneUsd) {
                userBalance--;
                _subcribeAnalytics.lastPaymentTimestamp = block.timestamp;
                monthlySubcriptionBool[block.timestamp][_user][_artist] = true;
            } else {
                monthlySubcriptionBool[block.timestamp][_user][_artist] = false;
                _subcribeAnalytics.currentlySubcribed = false;
                // userIsSubcribedTo[_lastCheckedAddress] = false;
            }
        }
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function setTokenId(
        address subcriberAddress,
        address artistAddress,
        uint256 tokenId
    ) external {
        // some important chekcs here
        _tokenId[subcriberAddress][artistAddress] = tokenId;
    }

    //////////////// GETTERS (PURE AND VIEW)/////////////////////////
    function checkIfUserIsSubcribed(
        address artistAddr
    ) external view returns (SubriberAnalytics memory _analytics) {
        return userIsSubcribedToAnalystics[msg.sender][artistAddr];
    }

    function getSubcribers()
        external
        view
        returns (SubriberAnalytics[] memory)
    {
        return isSubcribed;
    }

    function getAnalytics(
        address subcriberAddress,
        address artistAddress
    ) external view returns (SubriberAnalytics memory) {
        return userIsSubcribedToAnalystics[subcriberAddress][artistAddress];
    }

    function getArtistNFTs(
        address artistAddress
    ) external view returns (Artist memory) {
        return artist[artistAddress];
    }

    function getTokenId(
        address subcriberAddress,
        address artistAddress
    ) external view returns (uint256) {
        return _tokenId[subcriberAddress][artistAddress];
    }
}
