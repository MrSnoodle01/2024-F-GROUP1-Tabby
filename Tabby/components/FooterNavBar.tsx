import { View, Pressable, Text, Modal, FlatList, Image } from "react-native";
import { Link, usePathname } from "expo-router";
import React, { useState } from "react";
import SelectedLibrary from "@/assets/navbar-images/selectedLibrary";
import NotSelectedLibrary from "@/assets/navbar-images/notSelectedLibrary";
import SelectedExplore from "@/assets/navbar-images/selectedExplore";
import NotSelectedExplore from "@/assets/navbar-images/notSelectedExplore";
import SelectedFavorite from "@/assets/navbar-images/selectedFavorite";
import NotSelectedFavorite from "@/assets/navbar-images/notSelectedFavorite";
import Settings from "@/assets/navbar-images/settings";
import CameraIcon from "@/assets/navbar-images/camera";
import CameraModal from "@/components/camera/CameraModel";
import { Book } from '@/types/book';

const tempBook1: Book = {
  id: "192083745131",
  title: "holy hell1",
  author: "joe mama1",
  excerpt: "this is a sick excerpt1",
  summary: "wow sick summary1",
  image: "https://m.media-amazon.com/images/I/81QuEGw8VPL._AC_UF1000,1000_QL80_.jpg",
  isFavorite: false,
};

const tempBook2: Book = {
  id: "192083745132",
  title: "holy hell2",
  author: "joe mama2",
  excerpt: "this is a sick excerpt2",
  summary: "wow sick summary2",
  image: 'https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg',
  isFavorite: false,
};

const tempBook3: Book = {
  id: "192083745133",
  title: "holy hell3",
  author: "joe mama3",
  excerpt: "this is a sick excerpt3",
  summary: "wow sick summary3",
  image: "https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg",
  isFavorite: false,
};

const tempBook4: Book = {
  id: "192083745134",
  title: "holy hell4",
  author: "joe mama4",
  excerpt: "this is a sick excerpt4",
  summary: "wow sick summary4",
  image: "https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg",
  isFavorite: false,
};

const tempBooks: Book[] = [tempBook1, tempBook2, tempBook3, tempBook4];

const FooterNavBar = () => {
  // set to true to show camera modal
  const [isCameraModalVisible, setCameraModalVisible] = useState(false);
  const [isBookSelectionModalVisible, setBookSelectionModalVisible] = useState(false);
  const pathname = usePathname();
  const size = 40;

  return (
    <View className="flex-row bg-[#1d232b] w-full py-1 justify-around">
      <Link href="/library" asChild>
        <Pressable className="flex-col mx-auto">
          {pathname.includes("/library") ? (
            <SelectedLibrary height={size} width={size} />
          ) : (
            <NotSelectedLibrary height={size} width={size} />
          )}
          <Text className="text-center text-white">Library</Text>
        </Pressable>
      </Link>

      <Link href="/recommendations" asChild>
        <Pressable className="flex-col mx-auto">
          {pathname.includes("/recommendations") ? (
            <SelectedExplore />
          ) : (
            <NotSelectedExplore />
          )}
          <Text className="text-center text-white">Explore</Text>
        </Pressable>
      </Link>

      {/* Camera Button to show camera modal */}
      <Pressable testID="CameraButton" onPress={() => setCameraModalVisible(true)} className="flex-col mx-auto">
        <View className="w-16 h-16 items-center justify-center">
          <CameraIcon />
        </View>
      </Pressable>

      <Link href="/favorites" asChild>
        <Pressable testID="favoritesButton" className="flex-col mx-auto">
          {pathname.includes("/favorites") ? (
            <SelectedFavorite />
          ) : (
            <NotSelectedFavorite />
          )}
          <Text className="text-center text-white">Liked</Text>
        </Pressable>
      </Link>

      <Link href="/setting" asChild>
        <Pressable className="flex-col mx-auto">
          <Settings />
          <Text className="text-center text-white">Settings</Text>
        </Pressable>
      </Link>

      {/* Camera Modal */}
      {isCameraModalVisible && (
        <CameraModal closeModal={() => setCameraModalVisible(false)}
          onBookSelectionStart={() => {
            setCameraModalVisible(false);
            setBookSelectionModalVisible(true);
          }} />
      )}
      {isBookSelectionModalVisible && (
        <Modal animationType="slide" transparent visible>
          <View className="flex-1 justify-center items-center  bg-opacity-50">
            <View className="bg-white rounded-lg w-80 p-4 space-y-4">
              <Text className="text-lg font-bold text-center">Select a Book</Text>
              <FlatList
                data={tempBooks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      console.log("Book selected:", item);
                      setBookSelectionModalVisible(false); // Close after selection
                    }}
                    className="p-2 border rounded-lg mb-2"
                  >
                    <Image source={{ uri: item.image }} className='w-16 h-20' />
                    <Text className="text-center">{item.title}</Text>
                  </Pressable>
                )}
              />
              <Pressable
                onPress={() => setBookSelectionModalVisible(false)}
                className="p-2 bg-red-500 rounded items-center"
              >
                <Text className="text-white">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )
      }
    </View >
  );
};

export default FooterNavBar;
