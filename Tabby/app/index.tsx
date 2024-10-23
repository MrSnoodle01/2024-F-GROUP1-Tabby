import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const WelcomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-[#1E1E1E] h-full">
      <Text className="mb-4 text-4xl font-bold text-white">
        Welcome to Tabby
      </Text>
      <Text className="mb-8 text-lg text-center text-white">
        Scan books and store your book information effortlessly.
      </Text>
      <Link
        className="px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded"
        href={"/library"}
      >
        Get Started
      </Link>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
