import React, { useState, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

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

  useEffect(() => {
    // Check if we received a success message from navigation params
    if (route?.params?.showSuccessToast) {
      setToastMessage('Report submitted successfully! 🚨');
      setShowToast(true);
      // Clear the param to prevent showing toast again
      route.params.showSuccessToast = false;
    }
  }, [route?.params]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <CustomToast
        visible={showToast}
        message={toastMessage}
        onHide={() => setShowToast(false)}
      />
      <Text className="text-lg font-bold text-orange-500">🏠 Home Page</Text>
    </View>
  );
}