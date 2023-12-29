import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Image,
  Button,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Link } from "expo-router";
import InputCalendar from "../../components/InputCalendar"
import DropDownPicker from 'react-native-dropdown-picker';
import imageTemporary from '../../assets/images/musician.png';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [page, setPage] = useState(0)
  const [selectedDate, setSelectedDate] = useState("YYYY/MM/DD");
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [items, setItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ]);
  const [username, setUsername] = useState("")
  const musicians = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }]
  const [searching, setSearching] = useState("")

  const checkPasswordStrength = (password: string) => {
    const strongPassword = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    const mediumPassword = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
    );

    if (strongPassword.test(password)) {
      return "strong";
    } else if (mediumPassword.test(password)) {
      return "medium";
    } else {
      return "weak";
    }
  };

  const setPasswordAndCheckStrength = (text: string) => {
    setPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
  };

  const { createAnEOA, action } = useAuth();

  const handleSubmit = async () => {
    const tx = await createAnEOA(email, password);
    console.log("txx", tx);
    if (tx) {
      router.push("/(tabs)/");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="flex justify-center items-center m-1.5" style={{ width: 100 }}>
      <Image source={imageTemporary} width={90} height={90} />
      <Text className="text-[#F0F0F0] text-[14px]">Davido</Text>
      <Text className="text-[#808080] text-[10px]">81.1m Followers</Text>
      <Text className="text-[#F0F0F0] text-[10px]">Musician</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#071F3F]">
      <StatusBar style="light" />
      {
        page === 0 && <View className="px-[20px] py-4 h-full space-y-[16px] flex">
          <View className="flex items-center mt-20 mb-4">
            <Text className="text-[24px] font-opensans-bold text-[#fff] mb-14 text-center">
              Filmedia
            </Text>
            <Text className="text-[24px] font-opensans-bold text-[#fff] text-center mb-2">
              Set up your account
            </Text>
            <Text className="text-[14px] text-[#DDDDDD] font-opensans-regular text-center">
              Create your account and dive into a world of Blockchain.
            </Text>
          </View>

          <View className="space-y-2">
            <Text className="font-opensans-bold text-[#fff] font-bold text-[10px] text-white">
              What’s your email?
            </Text>
            <TextInput
              placeholder="johndoe@gmail.com"
              className="bg-white w-full rounded-full h-[48px] px-8"
              placeholderTextColor="#000"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Text className="font-opensans-regular font-bold text-[10px] text-[#FBF4FB]">You’ll need to confirm this email later.</Text>
          </View>
          <View className="space-y-2">
            <Text className="font-opensans-bold text-[#fff] font-bold text-[10px] text-white">
              Create a Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 24,
                height: 48,
                paddingHorizontal: 10,
              }}
            >
              <TextInput
                className="px-8"
                secureTextEntry={!passwordVisible}
                placeholder="*********"
                style={{ flex: 1 }}
                placeholderTextColor="#000"
                value={password}
                onChangeText={(text) => setPasswordAndCheckStrength(text)}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <FontAwesome
                  name={passwordVisible ? "eye" : "eye-slash"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

          </View>
          <View className="space-y-2">
            <Text className="font-opensans-bold text-[#fff] font-bold text-[10px] text-white">
              Confirm your Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 24,
                height: 48,
                paddingHorizontal: 10,
              }}
            >
              <TextInput
                className="px-8"
                secureTextEntry={!passwordVisible}
                placeholder="*********"
                style={{ flex: 1 }}
                placeholderTextColor="#000"
                value={passwordMatch}
                onChangeText={(text) => setPasswordMatch(text)}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <FontAwesome
                  name={passwordVisible ? "eye" : "eye-slash"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

          </View>
          <View className="w-full items-center justify-center flex-col flex-1">
            <TouchableOpacity
              onPress={() => {
                if (passwordMatch === password) {
                  checkPasswordStrength(password)
                  setPage(1)
                }
              }}
              className="bg-[#4169E1] rounded-full py-[16px] mt-[10px] items-center justify-center px-10"
            >
              <Text className="text-[16px]  font-opensans-bold text-[#fff]">
                {action ? action : "Next"}
              </Text>
            </TouchableOpacity>
            <View className="flex flex-row my-6">
              <Text className="font-opensans-regular font-bold text-[14px] text-white">Already signed up?</Text><Link className="font-opensans-bold text-[#4169E1] font-bold text-[14px] mx-2" href={"/login"}>Log In</Link>
            </View>
          </View>
        </View>
      }

      {
        page === 1 && <View className="px-[20px] py-4 h-full space-y-[16px] flex">
          <View className="flex items-center mt-20 mb-4">
            <Text className="text-[24px] font-opensans-bold text-[#fff] mb-14 text-center">
              Filmedia
            </Text>
            <Text className="text-[24px] font-opensans-bold text-[#fff] text-center mb-2">
              Set up your account
            </Text>
            <Text className="text-[14px] text-[#DDDDDD] font-opensans-regular text-center">
              Create your account and dive into a world of Blockchain.
            </Text>
          </View>

          <View className="space-y-2">
            <Text className="font-opensans-bold text-[#fff] font-bold text-[10px] text-white mb-2">
              What’s your Date of Birth
            </Text>
            <InputCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate}
            />

            <View className="flex flex-row">
              <Text className="font-opensans-regular text-[10px] text-[#FBF4FB] mr-1">This is required so we can tailor the contents with PG.</Text><Link className="font-opensans-bold text-[10px] text-[#FBF4FB]" href={"/"}>Read more</Link>
            </View>
          </View>
          <View className="space-y-2 z-10">
            <Text className="font-opensans-bold text-[#fff] font-bold text-[10px] text-white">
              What’s your Gender
            </Text>

            <DropDownPicker
              style={{
                borderWidth: 0,
                height: 40,
                borderRadius: 24,
                paddingLeft: 30
              }}
              open={open}
              value={gender}
              items={items}
              setOpen={setOpen}
              setValue={setGender}
              setItems={setItems}
            />

            <Text className="font-opensans-regular text-[10px] text-[#FBF4FB]">We have representation for every Identity</Text>

          </View>
          <View className="space-y-2">
            <Text className="font-opensans-bold text-[#fff] font-bold text-[10px] text-white">
              Choose a Username
            </Text>
            <TextInput
              placeholder="johndoe"
              className="bg-white w-full rounded-full h-[48px] px-8"
              placeholderTextColor="#000"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
            <Text className="font-opensans-regular text-[10px] text-[#FBF4FB]">This will be visible to everyone as a name to your Profile</Text>
          </View>
          <View className="w-full items-center justify-center flex-col flex-1">
            <TouchableOpacity
              onPress={() => {
                setPage(2)
              }}
              className="bg-[#4169E1] rounded-full py-[16px] mt-[10px] items-center justify-center px-10"
            >
              <Text className="text-[16px]  font-opensans-bold text-[#fff]">
                {action ? action : "Create Account"}
              </Text>
            </TouchableOpacity>
            <View className="flex flex-row my-6">
              <Text className="font-opensans-regular font-bold text-[14px] text-white">Already signed up?</Text><Link className="font-opensans-bold text-[#4169E1] font-bold text-[14px] mx-2" href={"/login"}>Log In</Link>
            </View>
          </View>
        </View>
      }
      {
        page === 2 && <ScrollView className="px-[20px] py-4 h-full space-y-[16px] flex">
          <View className="flex items-center mt-20 mb-4">
            <Text className="text-[24px] font-opensans-bold text-[#fff] mb-14 text-center">
              Filmedia
            </Text>
            <Text className="text-[24px] font-opensans-bold text-[#fff] text-center mb-2">
              Choose 3 or more Creators you like
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              backgroundColor: '#29435E',
              borderRadius: 24,
              paddingHorizontal: 10,
              height: 48,
            }}>
              <Ionicons name="search" size={24} color="white" style={{
                marginLeft: 5,
                marginRight: 10,
              }} />
              <TextInput

                placeholder="Search anything"
                style={{
                  flex: 1,
                  color: 'white',
                }}
                placeholderTextColor="white"
                value={searching}
                onChangeText={(text) => setSearching(text)}
              />
            </View>
          </View>
          <FlatList
            data={musicians}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              margin: 2
            }}
          />

          <View className="w-full items-center justify-center flex-col flex-1 pt-5">
            <TouchableOpacity
              onPress={() => {
                handleSubmit()
              }}
              className="bg-[#4169E1] rounded-full py-[16px] mt-[10px] items-center justify-center px-10"
            >
              <Text className="text-[16px]  font-opensans-bold text-[#fff]">
                {action ? action : "Next"}
              </Text>
            </TouchableOpacity>
            <View className="flex flex-row my-6">
              <Text className="font-opensans-regular font-bold text-[14px] text-white mb-6">Already signed up?</Text><Link className="font-opensans-bold text-[#4169E1] font-bold text-[14px] mx-2" href={"/login"}>Log In</Link>
            </View>
          </View>
        </ScrollView>
      }
    </View>
  );
};

export default SignUp;
