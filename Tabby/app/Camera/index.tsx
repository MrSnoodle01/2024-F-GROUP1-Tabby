import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, Text, TouchableOpacity, View, Image } from "react-native";
import { Link } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  let cameraRef = useRef();
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="content-center flex-1">
        <Text className="text-center pb-2.5">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  let takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  let pickImage = async () => {
    // no permissions request is necessary for launching image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="justify-center items-center flex-col space-y-8 h-full bg-[#1d232b]">
      <TouchableOpacity onPress={takePicture}>
        <Text className="text-white">Take Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage}>
        <Text className="text-white">Use image from camera roll</Text>
      </TouchableOpacity>

      <Link href="/Library">
        <Text className="text-white">Cancel</Text>
      </Link>

      {/* {image && <Image source={{ uri: image }} className="w-50 h-50" />} */}
    </View>
  );
}
