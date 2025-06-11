import React, { useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import type { MapView as MapViewType } from 'react-native-maps';
import { Modalize } from 'react-native-modalize';
import { useNavigation } from '@react-navigation/native';

// Shelter coordinates
const shelterData = [
  {
    id: '1',
    name: 'Bishan MRT Station',
    latitude: 1.3510,
    longitude: 103.8480,
    distance: '0.2 km',
  },
  {
    id: '2',
    name: 'Ang Mo Kio MRT Station',
    latitude: 1.3690,
    longitude: 103.8454,
    distance: '2.5 km',
  },
  {
    id: '3',
    name: 'Toa Payoh MRT Station',
    latitude: 1.3323,
    longitude: 103.8474,
    distance: '4.0 km',
  },
  {
    id: '4',
    name: 'Novena MRT Station',
    latitude: 1.3202,
    longitude: 103.8430,
    distance: '6.0 km',
  },
  {
    id: '5',
    name: 'City Hall MRT Station',
    latitude: 1.2930,
    longitude: 103.8520,
    distance: '7.0 km',
  },
];

// Example recent events
const recentData = [
  {
    id: '1',
    location: 'Bedok',
    timeAgo: '8m ago',
    image: require('../assets/incident1.png'),
  },
  {
    id: '2',
    location: 'Beauty World',
    timeAgo: '12m ago',
    image: require('../assets/incident2.png'),
  },
  {
    id: '3',
    location: 'Woodlands',
    timeAgo: '8m ago',
    image: require('../assets/incident3.png'),
  },
];

const HomeScreen = () => {
  const mapRef = useRef<MapViewType | null>(null);
  const navigation = useNavigation();
  const bottomSheetRef = useRef<Modalize>(null);
  const snapPoints = useMemo(() => ['40%', '50%', '90%'], []);

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
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
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
            description="Bomb Shelter"
          />
        ))}
      </MapView>

      {/* Bottom Sheet */}
      <Modalize
        ref={bottomSheetRef}
        //index={0}
        snapPoint={400}
        //enablePanDownToClose={false}
        modalStyle={{
          backgroundColor: '#111827',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        handleStyle={{ backgroundColor: '#9CA3AF' }}
        alwaysOpen={150}
      >
        <View className="px-6 pt-4">
          {/* Bomb Shelter & Recents Buttons */}
          <View className="flex-row justify-center gap-x-20 mb-4">
            <TouchableOpacity
              className="items-center"
              onPress={() => navigation.navigate('BombShelters')}
            >
              <Image
                source={require('../assets/bombshelter.png')}
                style={{ width: 60, height: 40 }}
              />
              <Text className="text-white text-xs mt-1">Bomb Shelters</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <Image
                source={require('../assets/recentsLogo.png')}
                style={{ width: 40, height: 40 }}
              />
              <Text className="text-white text-xs mt-1">Recents</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Events List */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentData.map((item) => (
              <View key={item.id} className="mr-4 w-40">
                <Image
                  source={item.image}
                  style={{ width: '100%', height: 100, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <Text className="text-white font-semibold mt-2">{item.location}</Text>
                <Text className="text-gray-400 text-xs">{item.timeAgo}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modalize>
    </View>
  );
};

export default HomeScreen;
