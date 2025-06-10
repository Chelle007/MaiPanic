import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import type { MapView as MapViewType } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';


//example of bomshelters coordinates
const shelterData = [
  {
    id: '1',
    name: 'Bishan MRT Station',
    latitude: 1.3510,
    longitude: 103.8480,
    distance: '0.2 km'
  },
  {
    id: '2',
    name: 'Ang Mo Kio MRT Station',
    latitude: 1.3690,
    longitude: 103.8454,
    distance: '2.5 km'
  },
  {
    id: '3',
    name: 'Toa Payoh MRT Station',
    latitude: 1.3323,
    longitude: 103.8474,
    distance: '4.0 km'
  },
  {
    id: '4',
    name: 'Novena MRT Station',
    latitude: 1.3202,
    longitude: 103.8430,
    distance: '6.0 km'
  },
  {
    id: '5',
    name: 'City Hall MRT Station',
    latitude: 1.2930,
    longitude: 103.8520,
    distance: '7.0 km'
  },
];

const HomeScreen = () => {
  const mapRef = useRef<MapViewType | null>(null);
  const navigation = useNavigation();

  const handleRecenter = () => {
    const singaporeRegion: Region = {
      latitude: 1.3521,
      longitude: 103.8198,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    mapRef.current?.animateToRegion(singaporeRegion, 1000);
  };

  const handleMarkerPress = (shelter: typeof shelterData[0]) => {
    //add navigation or show more details here
    console.log(`Selected Shelter: ${shelter.name}`);
  }

  return (
    <View className="flex-1">
      {/* MAP */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {shelterData.map((shelter) => (
          <Marker
            key={shelter.id}
            coordinate={{
              latitude: shelter.latitude,
              longitude: shelter.longitude,
            }}
            image={require('../assets/bombshelter.png')}
            title={shelter.name}
            description='Bomb Shelter'
            />
        ))}
      </MapView>


      {/* CUSTOM LOCATION BUTTON - above the overlay card */}
      {/* <TouchableOpacity
        onPress={handleRecenter}
        className="absolute right-5"
        style={{
          bottom: 120, // Adjust this to sit *above* the overlay card
          backgroundColor: '#1f2937',
          padding: 12,
          borderRadius: 999,
          zIndex: 20,
          elevation: 5,
        }}
      >
        <Image
          source={require('../assets/myLocation.png')}
          style={{ width: 24, height: 24, tintColor: 'white' }}
        />
      </TouchableOpacity> */}

      {/* OVERLAY CARD */}
      <View className="absolute bottom-0 inset-x-0 ">
        <View className="w-full max-w-xl bg-gray-900 rounded-t-2xl pt-10 pb-20 px-20 flex-row justify-between items-center">
          {/* Bomb Shelters Button */}
          <TouchableOpacity className="items-center" onPress={() => navigation.navigate('BombShelters')}>
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
