import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';

const shelters = [
    { id: '1', name: 'Bishan MRT Station', distance: '0.2 km' },
    { id: '2', name: 'Ang Mo Kio MRT Station', distance: '2.5 km' },
    { id: '3', name: 'Toa Payoh MRT Station', distance: '4.0 km' },
    { id: '4', name: 'Novena MRT Station', distance: '6.0 km' },
    { id: '5', name: 'City Hall MRT Station', distance: '7.0 km' },
];

export default function BombSheltersScreen() {
    const [search, setSearch] = useState('');

    const filteredShelters = shelters.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1 bg-gray-900 px-4 pt-16">
            {/* Title */}
            <Text className="text-white text-2xl font-semibold mb-4">Nearby Bomb Shelters</Text>

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

            {/* List */}
            <FlatList
                data={filteredShelters}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity className="bg-gray-800 rounded-xl px-4 py-3 mb-3 flex-row justify-between items-center">
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
}