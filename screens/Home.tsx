// screens/Home.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { AlertTriangle, Clock } from 'lucide-react-native';

const HomeScreen = () => {
  return (
    <View className="flex-1">
      {/* MAP */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      />

      {/* OVERLAY CARD */}
      <View className="absolute bottom-20 inset-x-0 px-4">
      <View className="bg-gray-900 rounded-t-2xl flex-row justify-between items-center" style={{ height: 160, paddingHorizontal: 16, paddingVertical: 0 }}>
          {/* Bomb Shelters Button */}
          <TouchableOpacity className="items-center">
            <AlertTriangle color="#FACC15" size={32} />
            <Text className="text-white mt-1">Bomb Shelters</Text>
          </TouchableOpacity>

          {/* Recents Button */}
          <TouchableOpacity className="items-center">
            <Clock color="#F3F4F6" size={32} />
            <Text className="text-white mt-1">Recents</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
