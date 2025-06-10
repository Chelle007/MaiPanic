import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { X, AlertTriangle } from 'lucide-react-native';

type SOSModalProps = {
  visible: boolean;
  onClose: () => void;
  navigation: any; // You can type this better with RootStackParamList if you like later
};

export default function SOSModal({ visible, onClose, navigation }: SOSModalProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [containerWidth, setContainerWidth] = useState(200);
  const [isSliding, setIsSliding] = useState(false);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsSliding(true);
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.min(100, Math.max(0, (gestureState.moveX / containerWidth) * 100));
        setSliderValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeDistance = gestureState.dx;
        const isActivated = swipeDistance > containerWidth * 0.6; // 60% threshold

        if (isActivated && !isSOSActive) {
          setIsSOSActive(true);
          setSliderValue(100);
          Alert.alert(
            'SOS Activated',
            'Emergency services and your emergency contacts have been notified.'
          );
        } else if (isSOSActive) {
          setIsSOSActive(false);
          setSliderValue(0);
          Alert.alert('SOS Deactivated', 'SOS has been deactivated.');
        } else {
          setSliderValue(0);
        }
        setIsSliding(false);
      },
      onPanResponderTerminate: () => {
        setSliderValue(0);
        setIsSliding(false);
      },
    })
  ).current;

  const handleReportIncident = () => {
    onClose(); // Close the modal first
    navigation.navigate('Report'); // Then navigate to Report screen
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/70 justify-center items-center px-4"
      >
        <View
          onStartShouldSetResponder={() => true}
          className="w-full max-w-lg bg-gray-900 rounded-2xl p-6 pt-3 shadow-lg"
        >
          {/* Header */}
          <View className="flex-row justify-end mb-1">
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Report Button */}
          <TouchableOpacity
            onPress={handleReportIncident}
            activeOpacity={0.8}
            className="flex-row items-center justify-center bg-orange-500 rounded-xl px-5 py-4 mb-6"
          >
            <AlertTriangle size={24} color="white" />
            <Text className="text-white font-semibold text-lg ml-4">Report Incident</Text>
          </TouchableOpacity>

          {/* SOS Slider */}
          <View className="relative">
            <View
              {...panResponder.panHandlers}
              onLayout={handleLayout}
              className="h-14 rounded-full bg-white/20 border border-white/30 overflow-hidden relative"
            >
              {/* Filled slider part */}
              <View
                className="absolute top-0 bottom-0 left-0 bg-red-600/40 rounded-full"
                style={{ width: `${sliderValue}%` }}
              />

              {/* Draggable knob */}
              <View
                className="absolute w-12 h-12 rounded-full bg-red-500 justify-center items-center shadow-lg z-50 top-1/2 -translate-y-1/2"
                style={{
                  left: Math.min(containerWidth - 48, (sliderValue / 100) * (containerWidth - 48)),
                }}
              >
                <Text className="text-white font-extrabold text-lg">SOS</Text>
              </View>

              {/* Center label */}
              <View className="absolute inset-0 justify-center items-center pointer-events-none">
                <Text className="text-white font-medium text-base select-none">
                  {isSOSActive ? 'Release to confirm' : 'Slide to activate SOS'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
