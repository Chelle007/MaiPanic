import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

const shelters = [
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

//this code will add a function to open directions
const openDirections = (latitude: number, longitude: number, label: string) => {
  const scheme = Platform.select({
    ios: 'maps://0,0?q=',
    android: 'geo:0,0?q=',
  });

  const latLng = `${latitude},${longitude}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  Linking.openURL(url ?? '');
};

const BombSheltersScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const filteredShelters = shelters.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-gray-900 pt-16 px-4">
      {/* Header: Back button + Centered title */}
      <View className="relative items-center justify-center mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute left-0"
        >
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold">
          Nearby Bomb Shelters
        </Text>
      </View>

      {/* Search Bar */}
      <View className="bg-gray-800 rounded-xl px-4 py-2 mb-6">
        <TextInput
          placeholder="Search shelters..."
          placeholderTextColor="#ccc"
          value={search}
          onChangeText={setSearch}
          className="text-white"
        />
      </View>

      {/* Shelter List */}
      <FlatList
        data={filteredShelters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-gray-800 rounded-xl px-4 py-3 mb-3 flex-row justify-between items-center"
            onPress={() => openDirections(
              item.latitude ?? 1.3521, // fallback to default if missing
              item.longitude ?? 103.8198,
              item.name
            )}
          >
            <View className="flex-row items-center">
              <Image
                source={require('../assets/bombshelter.png')}
                style={{ width: 40, height: 40, marginRight: 12 }}
              />
              <View>
                <Text className="text-white text-base font-medium">{item.name}</Text>
                <Text className="text-gray-400 text-sm">{item.distance}</Text>
              </View>
            </View>
            <Text className="text-white text-xl">{'>'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BombSheltersScreen;
