import { View, Text, Pressable, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import axios from 'axios';
// import { useCameraPermissions } from "expo-camera";

interface CameraModalProps {
    closeModal: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ closeModal }) => {
    // const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    // use to disable the buttons temporarily when clicking them to prevent multiple clicks
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle taking a picture by requesting permissions before taking the picture if necessary
    const handleTakePicture = async () => {
        setIsProcessing(true);
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (!granted) {
            setIsProcessing(false);
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        setIsProcessing(false);
        if (!result.canceled) {
            await uploadImage(result.assets[0].uri);
            closeModal();
        }
    };

    // Handle picking an image from the gallery by requesting permissions before picking the image if necessary
    const handlePickImage = async () => {
        setIsProcessing(true);
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) {
            setIsProcessing(false);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            await uploadImage(result.assets[0].uri);
            closeModal();
        }
        setIsProcessing(false);
    };

    // uploads image to scan_cover endpoint
    const uploadImage = async (imageUri: string) => {
        try {
            console.log("testing koyeb image");

            // convert image to blob raw data
            const res = await fetch(imageUri);
            const blob = await res.blob();

            // fetch scan_cover
            const response = await fetch('https://just-ulrike-tabby-app-9d270e1b.koyeb.app/books/scan_cover', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                body: blob,
            });

            // TODO: if response is good show 4 options for user
            if (response.ok) {
                const result = await response.json();
                console.log("upload successful", result);
            } else {
                console.error("error uploading image: ", response.status);
                const errorText = await response.text();
                console.error("Error details: ", errorText);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <Modal animationType="fade" transparent visible>
            <TouchableWithoutFeedback onPress={closeModal}>
                <View className="flex-1 justify-center items-center">
                    <TouchableWithoutFeedback>
                        <View className="bg-white rounded-lg w-64 p-4 space-y-4">
                            <Pressable
                                onPress={handleTakePicture}
                                disabled={isProcessing}
                                className={`p-2 rounded items-center bg-blue-500`}
                                testID="takePictureButton"
                            >
                                <Text className="text-white">Take Picture</Text>
                            </Pressable>
                            <Pressable
                                onPress={handlePickImage}
                                disabled={isProcessing}
                                className={`p-2 rounded items-center bg-blue-500`}
                                testID="pickPhotoButton"
                            >
                                <Text className="text-white">Pick from Camera Roll</Text>
                            </Pressable>
                            <Pressable onPress={closeModal} className="p-2 bg-red-500 rounded items-center">
                                <Text className="text-white">Cancel</Text>
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default CameraModal;
