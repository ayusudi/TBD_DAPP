import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Link, router } from "expo-router";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

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

  const { signin } = useAuth();

  const handleSubmit = async () => {
    const tx = await signin(email, password);
    if (tx) {
      router.push("/(tabs)");
    }
  };
  return (
    <View className="flex-1 bg-[#071F3F]">
      <StatusBar style="light" />
      <View className="px-[20px] py-4 h-full space-y-[16px] flex">
        <View className="flex items-center mt-20 mb-4">
          <Text className="text-[24px] font-opensans-bold text-[#fff] mb-14 text-center">
            Filmedia
          </Text>
          <Text className="text-[24px] font-opensans-bold text-[#fff] text-center mb-2">
            Log In to your account
          </Text>
          <Text className="text-[14px] text-[#DDDDDD] font-opensans-regular text-center">
            Back to the world of Blockchain.
          </Text>
        </View>

        <View className="space-y-2">
          <Text className="font-opensans-bold text-[#fff] font-bold text-[10px] text-white">
            Email
          </Text>
          <TextInput
            placeholder="johndoe@gmail.com"
            className="bg-white w-full rounded-full h-[48px] px-8"
            placeholderTextColor="#000"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View className="space-y-2">
          <Text className="font-opensans-bold text-[#fff] font-bold text-[10px] text-white">
            Password
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

        <View className="w-full items-center justify-end flex-col flex-1">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#4169E1] rounded-full py-[16px] mt-[10px] items-center justify-center px-10"
          >
            <Text className="text-[16px]  font-opensans-bold text-[#fff]">
              Login
            </Text>
          </TouchableOpacity>
          <View className="flex flex-row my-6 justify-center">
            <Text className="font-opensans-regular font-bold text-[14px] text-white">Don't have an account?</Text><Link className="font-opensans-bold text-[#4169E1] font-bold text-[14px] mx-2" href={"/(auth)/"}>Sign Up</Link>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LogIn;
