import { View, Text, Pressable, Modal, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Book } from '@/types/book';

interface CameraModalProps {
    closeModal: () => void;
}

type apiReturn = {
    authors: string         // separated by commas
    excerpt: string
    isbn: string            // guaranteed to be provided, ISBN 13
    page_count: number      // -1 if not given
    published_date: string  // YYYY-MM-DD
    publisher: string
    rating: number          // -1.0 if not given
    summary: string
    thumbnail: string
    title: string
};

const tempBook1: Book = {
    id: "192083745131",
    title: "holy hell1",
    author: "joe mama1",
    excerpt: "this is a sick excerpt1",
    summary: "wow sick summary1",
    image: "hmmm ill work on this1",
    isFavorite: false,
};

const tempBook2: Book = {
    id: "192083745132",
    title: "holy hell2",
    author: "joe mama2",
    excerpt: "this is a sick excerpt2",
    summary: "wow sick summary2",
    image: "hmmm ill work on this2",
    isFavorite: false,
};

const tempBook3: Book = {
    id: "192083745133",
    title: "holy hell3",
    author: "joe mama3",
    excerpt: "this is a sick excerpt3",
    summary: "wow sick summary3",
    image: "hmmm ill work on this3",
    isFavorite: false,
};

const tempBook4: Book = {
    id: "192083745134",
    title: "holy hell4",
    author: "joe mama4",
    excerpt: "this is a sick excerpt4",
    summary: "wow sick summary4",
    image: "hmmm ill work on this4",
    isFavorite: false,
};

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

        if (!result.canceled) {
            // console.log("start wait"); // for testing activity indicator
            // await sleep(5000); // for testing activity indicator
            // console.log("waited 5 seconds"); // for testing activity indicator
            // await uploadImage(result.assets[0].uri); 
            closeModal();
            userPickBook();
        }
        setIsProcessing(false);
    };

    // for testing activity indicator
    // async function sleep(ms: number): Promise<void> {
    //     return new Promise((resolve) => setTimeout(resolve, ms));
    // }

    const userPickBook = () => {

    }

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
            userPickBook();
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
                console.log('success');
                const result = await response.json();
                // console.log("result: ", result.results[0])
                if (result.results[0]) {
                    const book1 = jsonToBook(result.results[0]);
                    console.log("book1: ", book1);
                }
                if (result.results[1]) {
                    const book1 = jsonToBook(result.results[1]);
                    console.log("book2: ", book1);
                }
                if (result.results[2]) {
                    const book1 = jsonToBook(result.results[2]);
                    console.log("book3: ", book1);
                }
                if (result.results[3]) {
                    const book1 = jsonToBook(result.results[3]);
                    console.log("book4: ", book1);
                }
            } else {
                console.error("error uploading image: ", response.status);
                const errorText = await response.text();
                console.error("Error details: ", errorText);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    // returns a Book object from json given by google books
    const jsonToBook = (bookjson: apiReturn) => {
        const returnBook: Book = {
            id: bookjson.isbn,
            title: bookjson.title,
            author: bookjson.authors,
            excerpt: bookjson.excerpt,
            summary: bookjson.summary,
            image: bookjson.thumbnail,
            // rating: bookjson.rating, (cant do rating like this)
            isFavorite: false,
        }
        return returnBook;
    }

    return (
        <Modal animationType="fade" transparent visible>
            <TouchableWithoutFeedback onPress={closeModal}>
                <View className="flex-1 justify-center items-center">
                    <TouchableWithoutFeedback>
                        <View className="bg-white rounded-lg w-64 p-4 space-y-4">
                            {isProcessing && <ActivityIndicator size='large' color='#0000ff' />}
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
