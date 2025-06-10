import React, { useRef, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  LayoutChangeEvent,
  PanResponder,
} from 'react-native';
import { X, AlertTriangle } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SOSModal: React.FC<Props> = ({ visible, onClose }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [containerWidth, setContainerWidth] = useState(200);
  const sliderContainerRef = useRef<View>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const handleReportIncident = useCallback(() => {
    Alert.alert('Report Incident', 'Incident reporting functionality will be implemented here.');
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.min(
          100,
          Math.max(0, (gestureState.moveX / containerWidth) * 100)
        );
        setSliderValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeDistance = gestureState.dx;
        const isActivated = swipeDistance > containerWidth * 0.6;

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
      },
      onPanResponderTerminate: () => {
        setSliderValue(0);
      },
    })
  ).current;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity
        className="flex-1 bg-black/70 justify-center items-center absolute inset-0"
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className="w-[90%] bg-gray-800 rounded-2xl p-5 shadow-lg"
          onStartShouldSetResponder={() => true}
        >
          <View className="flex-row justify-end mb-5">
            <TouchableOpacity onPress={onClose} className="p-1">
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="flex-row items-center bg-orange-500 rounded-xl p-4 mb-4"
            onPress={handleReportIncident}
            activeOpacity={0.8}
          >
            <AlertTriangle size={20} color="white" className="mr-3" />
            <Text className="text-white font-semibold text-base">Report incident</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-between">
            <View className="flex-1 h-16 justify-center">
              <View
                className="h-12 bg-white/15 border border-white/20 rounded-full relative overflow-hidden"
                onLayout={handleLayout}
                ref={sliderContainerRef}
                {...panResponder.panHandlers}
              >
                <View className="absolute inset-0 bg-red-400/30 rounded-full z-0" />
                <View
                  className="absolute w-10 h-10 bg-white rounded-full justify-center items-center shadow z-10"
                  style={{
                    transform: [
                      {
                        translateX: Math.min(
                          containerWidth - 50,
                          Math.max(0, (sliderValue / 100) * (containerWidth - 50))
                        ),
                      },
                    ],
                  }}
                >
                  <Text className="text-red-500 font-extrabold text-sm">SOS</Text>
                </View>
                <Text className="absolute inset-0 text-center text-gray-200 text-base font-medium z-0">
                  {isSOSActive ? 'Release to confirm' : 'Slide to activate SOS'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SOSModal;
