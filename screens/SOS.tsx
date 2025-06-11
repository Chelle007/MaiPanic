import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, Dimensions, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SOSScreen() {
    const [isConnected, setIsConnected] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        let interval;
        if (isConnected) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isConnected]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSOSPress = () => {
        if (!isConnected) {
            setIsConnected(true);
            setIsRecording(true);
            Alert.alert(
                "Emergency Call Started",
                "Connecting to Emergency Services...\nYour location is being shared.",
                [{ text: "OK" }]
            );
        }
    };

    const handleEndCall = () => {
        setIsConnected(false);
        setIsRecording(false);
        setCallDuration(0);
        Alert.alert(
            "Call Ended",
            "Emergency call has been terminated.",
            [{ text: "OK" }]
        );
    };

    return (
        <View className="flex-1 bg-black">
            {/* Mock Camera Background - simulating back camera view */}
            <View className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900">
                {/* Simulated camera feed background */}
                <View className="flex-1 bg-gray-700 relative">
                    
                    {/* Status Bar */}
                    <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-between items-center px-4">
                        <View className="bg-red-600 px-3 py-1 rounded-full flex-row items-center">
                            <View className={`w-2 h-2 bg-white rounded-full mr-2 ${isRecording ? 'opacity-100' : 'opacity-50'}`} />
                            <Text className="text-white font-semibold text-sm">LIVE</Text>
                        </View>
                        {isConnected && (
                            <View className="bg-black bg-opacity-50 px-3 py-1 rounded-full">
                                <Text className="text-white font-mono">{formatTime(callDuration)}</Text>
                            </View>
                        )}
                    </View>

                    {/* Info Banner */}
                    <View className="absolute top-20 left-4 right-4 z-10 mt-8">
                        <View className="bg-black bg-opacity-70 p-4 rounded-lg">
                            <Text className="text-white text-center text-sm">
                                This video will be streamed, recorded, and{'\n'}
                                shared with <Text className="font-semibold">Emergency Services</Text>, <Text className="font-semibold">your Trusted{'\n'}
                                Contacts</Text>, and <Text className="font-semibold">nearby users</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Mock Camera Feed Content */}
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-400 text-lg">📹 Camera View</Text>
                        <Text className="text-gray-500 text-sm mt-2">Back Camera Feed</Text>
                    </View>

                    {/* Police Officer Placeholder - Top Left */}
                    <View className="absolute top-32 left-4 mt-20">
                        <View className="w-20 h-28 bg-gray-800 bg-opacity-90 rounded-lg overflow-hidden border-2 border-blue-500">
                            <View className="flex-1 justify-center items-center p-2">
                                <View className="w-12 h-12 bg-blue-600 rounded-full justify-center items-center mb-1">
                                    <Text className="text-white text-lg">👮‍♂️</Text>
                                </View>
                                <Text className="text-white text-xs text-center font-semibold">Officer{'\n'}Martinez</Text>
                                {isConnected && (
                                    <View className="absolute top-1 right-1">
                                        <View className="w-2 h-2 bg-green-400 rounded-full" />
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Recording Indicator */}
                    {isRecording && (
                        <View className="absolute top-32 right-4 mt-20">
                            <View className="bg-red-600 px-3 py-1 rounded-full flex-row items-center">
                                <View className="w-2 h-2 bg-white rounded-full mr-1" />
                                <Text className="text-white text-xs font-semibold">REC</Text>
                            </View>
                        </View>
                    )}

                    {/* Connection Status */}
                    {isConnected && (
                        <View className="absolute bottom-32 left-4 right-4 mb-20">
                            <View className="bg-green-600 bg-opacity-90 p-3 rounded-lg border border-green-400">
                                <Text className="text-white text-center font-semibold text-base">
                                    🔗 Connected to Emergency Services
                                </Text>
                                <Text className="text-white text-center text-sm mt-1 opacity-90">
                                    Help is on the way • Location shared • Recording active
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Not Connected State */}
                    {!isConnected && (
                        <View className="absolute bottom-32 left-4 right-4 mb-20">
                            <View className="bg-yellow-600 bg-opacity-80 p-3 rounded-lg border border-yellow-400">
                                <Text className="text-white text-center font-semibold">
                                    ⚠️ Press SOS to connect to Emergency Services
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {/* Bottom Controls */}
            <View className="absolute bottom-8 left-0 right-0">
                <View className="flex-row justify-center items-center px-8">
                    {/* Home Button */}
                    <TouchableOpacity 
                        className="w-12 h-12 justify-center items-center mx-3"
                        onPress={() => Alert.alert("Home", "Navigate to home screen")}
                    >
                        <View className="w-10 h-10 bg-gray-600 bg-opacity-70 rounded-full justify-center items-center">
                            <Text className="text-white text-lg">🏠</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Share Button */}
                    <TouchableOpacity 
                        className="w-12 h-12 justify-center items-center mx-3"
                        onPress={() => Alert.alert("Share", "Share emergency details")}
                    >
                        <View className="w-10 h-10 bg-gray-600 bg-opacity-70 rounded-full justify-center items-center">
                            <Text className="text-white text-lg">📋</Text>
                        </View>
                    </TouchableOpacity>

                    {/* SOS Button */}
                    <TouchableOpacity
                        onPress={handleSOSPress}
                        className={`w-20 h-20 rounded-full justify-center items-center mx-4 ${
                            isConnected ? 'bg-green-600 border-2 border-green-400' : 'bg-red-600 border-2 border-red-400'
                        }`}
                        disabled={isConnected}
                    >
                        <Text className="text-white font-bold text-lg">
                            {isConnected ? '✓' : 'SOS'}
                        </Text>
                    </TouchableOpacity>

                    {/* End Call / Profile Button */}
                    {isConnected ? (
                        <TouchableOpacity
                            onPress={handleEndCall}
                            className="w-12 h-12 bg-red-600 rounded-full justify-center items-center mx-3 border-2 border-red-400"
                        >
                            <Text className="text-white text-lg">📞</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            className="w-12 h-12 justify-center items-center mx-3"
                            onPress={() => Alert.alert("Profile", "Open user profile")}
                        >
                            <View className="w-10 h-10 bg-gray-600 bg-opacity-70 rounded-full justify-center items-center">
                                <Text className="text-white text-lg">👤</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Settings Button */}
                    <TouchableOpacity 
                        className="w-12 h-12 justify-center items-center mx-3"
                        onPress={() => Alert.alert("Settings", "Open settings menu")}
                    >
                        <View className="w-10 h-10 bg-gray-600 bg-opacity-70 rounded-full justify-center items-center">
                            <Text className="text-white text-lg">⚙️</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}