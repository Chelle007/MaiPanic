import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Home, Video, Bell, User } from 'lucide-react-native';

const videoData = [
  { title: "Fire Escape: Exit Routes", duration: "02:01", videoId: "TciQ1iOKBkA" },
  { title: "CPR & First Aid Basics", duration: "04:41", videoId: "2PngCv7NjaI" },
  { title: "Flood Safety & Evacuation", duration: "03:19", videoId: "WFpn6Z0a0uc" },
  { title: "Building Emergency Kit", duration: "01:17", videoId: "x_--5fuM1Dc" },
  { title: "Stop, Drop & Roll Technique", duration: "02:16", videoId: "KPfT2O358pE" },
  { title: "Heimlich Maneuver Guide", duration: "04:10", videoId: "ZVYOEMP5sKo" },
  { title: "Wild Fires and Smoke", duration: "02:39", videoId: "vzUSV2RlZ98" },
  { title: "Burns: What to Do", duration: "03:53", videoId: "JwlSXhSg69A" },
];

export default function VideoPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = useMemo(() => {
    return videoData.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-black px-4 pt-12">
      {/* Search Bar */}
      <TextInput
        className="bg-white rounded-xl p-3 mb-4 text-base"
        placeholder="Search video"
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Video Grid */}
      <ScrollView>
        <View className="flex-row flex-wrap justify-between">
          {filteredVideos.map((video, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] bg-slate-800 rounded-xl mb-4 overflow-hidden"
              onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.videoId}`)}
            >
              <Image
                source={{ uri: `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg` }}
                className="h-28 w-full"
              />
              <View className="p-2">
                <Text className="text-white font-bold text-xs">{video.title}</Text>
                <Text className="text-gray-300 text-[10px] mt-1">{video.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Fallback if no results */}
          {filteredVideos.length === 0 && searchQuery.trim() !== '' && (
            <View className="w-full items-center mt-10">
              <Text className="text-white mb-2">No results found.</Text>
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={() => Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`)}
              >
                <Text className="text-white font-semibold">Search on YouTube</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900 flex-row justify-around items-center">
        <TouchableOpacity><Home color="white" /></TouchableOpacity>
        <TouchableOpacity><Video color="white" /></TouchableOpacity>
        <TouchableOpacity className="bg-red-500 rounded-full p-4 -mt-10 z-10 shadow-md">
          <Text className="text-white font-bold">SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity><Bell color="white" /></TouchableOpacity>
        <TouchableOpacity><User color="white" /></TouchableOpacity>
      </View>
    </View>
  );
}
