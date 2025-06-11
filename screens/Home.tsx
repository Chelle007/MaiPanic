import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import type { MapView as MapViewType } from 'react-native-maps';
import { Modalize } from 'react-native-modalize';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle } from 'lucide-react-native';
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

const HomeScreen = ({ route }: HomeScreenProps) => {
  const mapRef = useRef<MapViewType | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const bottomSheetRef = useRef<Modalize>(null);
  const snapPoints = useMemo(() => ['40%', '50%', '90%'], []);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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