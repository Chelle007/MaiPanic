import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text , Image} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import type {  MapView as MapViewType } from 'react-native-maps';


const HomeScreen = () => {
  const mapRef = useRef<MapViewType | null>(null);

  const handleRecenter = () => {
    const singaporeRegion: Region = {
      latitude: 1.3521,
      longitude: 103.8198,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    mapRef.current?.animateToRegion(singaporeRegion, 1000);
  };
  return (
    <View className="flex-1">
      {/* MAP */}
      <MapView
        ref={mapRef}
        //provider={PROVIDER_GOOGLE}
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

      {/* CUSTOM LOCATION BUTTON - floating on map, above overlay */}
      <TouchableOpacity
        onPress={handleRecenter}
        className="absolute right-5 bottom-40 bg-gray-800 p-3 rounded-full shadow-lg"
        style={{ zIndex: 10 }}
      >
        <Image
          source={require('../assets/myLocation.png')}
          style={{ width: 24, height: 24, tintColor: 'white' }}
        />
      </TouchableOpacity>

      {/* OVERLAY CARD */}
      <View className="absolute bottom-0 inset-x-0 px-4">
        <View className="bg-gray-900 rounded-t-2xl pt-10 pb-20 px-20 flex-row  justify-between items-center">
          {/* Bomb Shelters Button */}
          <TouchableOpacity className="items-center">
            <Image
                source={require('../assets/bombshelter.png')} 
                style={{ width: 60, height: 60, resizeMode: 'contain' }}
              />
              <Text className="text-white mt-1">Bomb Shelters</Text>
          </TouchableOpacity>

          {/* Recents Button */}
          <TouchableOpacity className="items-center">
            <Image
              source={require('../assets/recentsLogo.png')}
              style={{ width: 55, height: 55, resizeMode: 'contain' }}
            />
            <Text className="text-white mt-1">Recents</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
