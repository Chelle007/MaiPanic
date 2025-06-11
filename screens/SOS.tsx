import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function SOSScreen() {
    const [isRecording, setIsRecording] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const cameraRef = useRef<CameraView>(null);
    const router = useRouter();

    const handleEndCall = async () => {
        // Stop recording if active
        if (isRecording && cameraRef.current) {
            try {
                await cameraRef.current.stopRecording();
            } catch (error) {
                console.log('Error stopping recording:', error);
            }
        }
        setIsRecording(false);
        router.push('/home');
    };

    const saveVideoToGallery = async (videoUri: string) => {
        try {
            // Check media library permission
            if (!mediaLibraryPermission?.granted) {
                const permission = await requestMediaLibraryPermission();
                if (!permission.granted) {
                    Alert.alert('Permission Required', 'Media library access is needed to save videos to gallery');
                    return;
                }
            }

            // Save to gallery
            const asset = await MediaLibrary.createAssetAsync(videoUri);
            await MediaLibrary.createAlbumAsync('Emergency Videos', asset, false);
            
            Alert.alert('Success', 'Emergency video saved to gallery');
            console.log('Video saved to gallery:', asset.uri);
        } catch (error) {
            console.log('Error saving to gallery:', error);
            Alert.alert('Error', 'Failed to save video to gallery');
        }
    };

    const toggleRecording = async () => {
        if (!cameraRef.current) return;

        try {
            if (isRecording) {
                // Stop recording
                const result = await cameraRef.current.stopRecording();
                setIsRecording(false);
                
                // Save to gallery if recording was successful
                if (result?.uri) {
                    console.log('Recording saved to:', result.uri);
                    await saveVideoToGallery(result.uri);
                    // Here you would typically also upload to emergency services
                }
            } else {
                // Start recording
                setIsRecording(true);
                const result = await cameraRef.current.recordAsync({
                    maxDuration: 600, // 10 minutes max
                });
                
                // This callback happens when recording stops
                if (result?.uri) {
                    console.log('Recording completed:', result.uri);
                    await saveVideoToGallery(result.uri);
                }
                setIsRecording(false);
            }
        } catch (error) {
            console.log('Recording error:', error);
            setIsRecording(false);
            Alert.alert('Recording Error', 'Unable to start/stop recording');
        }
    };

    const flipCamera = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    // Handle permission states
    if (!permission) {
        // Camera permissions are still loading
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-white text-lg">Loading camera...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View className="flex-1 bg-black justify-center items-center px-4">
                <Ionicons name="camera-off" size={80} color="gray" />
                <Text className="text-white text-lg mt-4 text-center">
                    Camera Permission Required
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center mb-6">
                    This app needs camera access to function properly in emergency situations.
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    className="bg-blue-500 px-6 py-3 rounded-lg mb-4"
                >
                    <Text className="text-white font-bold">Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/home')}
                    className="bg-red-500 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            {/* Camera View */}
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={facing}
                mode="video"
                videoQuality="720p"
            >
                {/* Header with Live Indicator */}
                <View className="absolute top-12 left-0 right-0 z-10">
                    <View className="bg-gray-800/80 mx-4 rounded-lg p-3">
                        <View className="flex-row items-center justify-center mb-2">
                            <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                            <Text className="text-white text-xl font-bold">LIVE</Text>
                        </View>
                        <Text className="text-white text-center text-sm">
                            This video will be streamed, recorded, and{'\n'}
                            shared with Emergency Services, your Trusted{'\n'}
                            Contacts, and nearby users
                        </Text>
                    </View>
                </View>

                {/* Police Officer Placeholder */}
                <View className="absolute top-56 left-6 z-10">
                    <View className="w-24 h-32 bg-gray-800/90 rounded-lg overflow-hidden border-2 border-gray-600">
                        <View className="flex-1 justify-center items-center">
                            <Ionicons name="person" size={40} color="white" />
                            <Text className="text-white text-xs mt-2 text-center">
                                Officer{'\n'}Connected
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Camera Controls */}
                <View className="absolute top-56 right-6 z-10">
                    <TouchableOpacity
                        onPress={flipCamera}
                        className="w-12 h-12 bg-gray-800/80 rounded-full justify-center items-center mb-3"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="camera-reverse" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={toggleRecording}
                        className={`w-12 h-12 rounded-full justify-center items-center ${
                            isRecording ? 'bg-red-500' : 'bg-gray-800/80'
                        }`}
                        activeOpacity={0.8}
                    >
                        <Ionicons 
                            name={isRecording ? "stop" : "videocam"} 
                            size={24} 
                            color="white" 
                        />
                    </TouchableOpacity>
                </View>

                {/* Bottom Controls */}
                <View className="absolute bottom-0 left-0 right-0 pb-12">
                    <View className="flex-row justify-center items-center">
                        {/* End Call Button */}
                        <TouchableOpacity
                            onPress={handleEndCall}
                            className="w-16 h-16 bg-red-500 rounded-full justify-center items-center"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="call" size={32} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recording Indicator */}
                {isRecording && (
                    <View className="absolute top-20 right-4 z-10">
                        <View className="flex-row items-center bg-red-500 px-3 py-1 rounded-full">
                            <View className="w-2 h-2 bg-white rounded-full mr-2" />
                            <Text className="text-white text-sm font-bold">REC</Text>
                        </View>
                    </View>
                )}
            </CameraView>
        </View>
    );
}