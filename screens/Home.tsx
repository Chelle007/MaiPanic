import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

// Define your navigation stack type
type RootStackParamList = {
  Home: undefined;
  BombShelters: undefined;
  // Add other screens here as needed
};

interface CustomToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

interface HomeScreenProps {
  route?: {
    params?: {
      showSuccessToast?: boolean;
    };
  };
}

const CustomToast: React.FC<CustomToastProps> = ({ visible, message, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 1000,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View className="bg-green-500 rounded-xl p-4 flex-row items-center shadow-lg">
        <CheckCircle size={24} color="white" style={{ marginRight: 12 }} />
        <Text className="text-white font-semibold flex-1">{message}</Text>
      </View>
    </Animated.View>
  );
};

export default function HomeScreen({ route }: HomeScreenProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const mapRef = useRef<MapView | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Check if we received a success message from navigation params
    if (route?.params?.showSuccessToast) {
      setToastMessage('Report submitted successfully! 🚨');
      setShowToast(true);
      // Clear the param to prevent showing toast again
      route.params.showSuccessToast = false;
    }
  }, [route?.params]);

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
      {/* Toast Notification */}
      <CustomToast
        visible={showToast}
        message={toastMessage}
        onHide={() => setShowToast(false)}
      />

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
      />

      {/* CUSTOM LOCATION BUTTON - above the overlay card */}
      {/* Uncomment if you want to use the custom location button
      <TouchableOpacity 
        onPress={handleRecenter} 
        className="absolute right-5" 
        style={{ 
          bottom: 120,
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
      </TouchableOpacity>
      */}

      {/* OVERLAY CARD */}
      <View className="absolute bottom-0 inset-x-0">
        <View className="w-full max-w-xl bg-gray-900 rounded-t-2xl pt-10 pb-20 px-20 flex-row justify-between items-center">
          {/* Bomb Shelters Button */}
          <TouchableOpacity
            className="items-center"
            onPress={() => navigation.navigate('BombShelters')}
          >
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
}