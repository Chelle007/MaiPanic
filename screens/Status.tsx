import {
    AlertCircle,
    AlertTriangle,
    Battery,
    CheckCircle,
    ChevronRight,
    Clock,
    MapPin,
    MessageCircle,
    Phone,
    Settings,
    Shield,
    WifiOff,
    X,
    XCircle
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FamilyMember {
    id: number;
    name: string;
    avatar: string;
    status: 'safe' | 'help' | 'unknown';
    lastSeen: Date;
    battery: number;
    location: string;
    coordinates: { lat: number; lng: number };
    isOnline: boolean;
    phone: string;
}

interface FamilyCircle {
    id: number;
    name: string;
    members: FamilyMember[];
}

const StatusScreen = () => {
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
    const [showEmergencyNudgeModal, setShowEmergencyNudgeModal] = useState(false);
    const [showLostFoundModal, setShowLostFoundModal] = useState(false); const [nudgeInterval, setNudgeInterval] = useState<ReturnType<typeof setInterval> | null>(null);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedCircleId, setSelectedCircleId] = useState(1);

    // Sample family circles data
    const [familyCircles, setFamilyCircles] = useState<FamilyCircle[]>([
        {
            id: 1,
            name: "Johnson Family",
            members: [
                {
                    id: 1,
                    name: "Sarah (You)",
                    avatar: "S",
                    status: "safe",
                    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
                    battery: 85,
                    location: "Home",
                    coordinates: { lat: 1.3521, lng: 103.9448 },
                    isOnline: true,
                    phone: "+65 9123 4567"
                },
                {
                    id: 2,
                    name: "John",
                    avatar: "J",
                    status: "safe",
                    lastSeen: new Date(Date.now() - 15 * 60 * 1000),
                    battery: 45,
                    location: "CBD Office",
                    coordinates: { lat: 1.2840, lng: 103.8510 },
                    isOnline: true,
                    phone: "+65 9234 5678"
                },
                {
                    id: 3,
                    name: "Emma",
                    avatar: "E",
                    status: "unknown",
                    lastSeen: new Date(Date.now() - 45 * 60 * 1000),
                    battery: 15,
                    location: "School",
                    coordinates: { lat: 1.3400, lng: 103.8600 },
                    isOnline: false,
                    phone: "+65 9345 6789"
                },
                {
                    id: 4,
                    name: "Mike",
                    avatar: "M",
                    status: "help",
                    lastSeen: new Date(Date.now() - 2 * 60 * 1000),
                    battery: 25,
                    location: "Marina Bay",
                    coordinates: { lat: 1.2834, lng: 103.8607 },
                    isOnline: true,
                    phone: "+65 9456 7890"
                }
            ]
        }
    ]);

    const currentCircle = familyCircles.find(circle => circle.id === selectedCircleId);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'safe': return 'bg-green-500';
            case 'help': return 'bg-red-500';
            case 'unknown': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'safe': return CheckCircle;
            case 'help': return XCircle;
            case 'unknown': return AlertCircle;
            default: return AlertCircle;
        }
    };

    const formatTimeAgo = (date: Date) => {
        const minutes = Math.floor((currentTime.getTime() - date.getTime()) / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const getBatteryColor = (level: number) => {
        if (level > 50) return 'text-green-500';
        if (level > 20) return 'text-orange-500';
        return 'text-red-500';
    };

    const handleMarkSafe = () => {
        setFamilyCircles(prev => prev.map(circle =>
            circle.id === selectedCircleId
                ? {
                    ...circle,
                    members: circle.members.map(member =>
                        member.name.includes('You')
                            ? { ...member, status: 'safe' as const, lastSeen: new Date() }
                            : member
                    )
                }
                : circle
        ));
        Alert.alert('Status Updated', 'You have been marked as safe!');
    };

    const handleNudgeMember = (memberId: number) => {
        const member = currentCircle?.members.find(m => m.id === memberId);
        Alert.alert('Nudge Sent', `Nudge sent to ${member?.name}`);
    };

    const confirmEmergencyNudge = () => {
        if (nudgeInterval) {
            clearInterval(nudgeInterval);
            setNudgeInterval(null);
            setShowEmergencyNudgeModal(false);
            Alert.alert('Emergency Nudging Stopped', 'Automatic nudges have been disabled.');
        } else {
            const interval = setInterval(() => {
                const membersToNudge = currentCircle?.members.filter(member =>
                    !member.name.includes('You') && (currentTime.getTime() - member.lastSeen.getTime()) > 30 * 60 * 1000
                );
                if (membersToNudge && membersToNudge.length > 0) {
                    console.log('Emergency nudge sent to:', membersToNudge.map(m => m.name));
                }
            }, 5 * 60 * 1000);
            setNudgeInterval(interval);
            setShowEmergencyNudgeModal(false);
            Alert.alert('Emergency Nudging Started', 'Automatic nudges will be sent every 5 minutes.');
        }
    };

    const renderMap = () => (
        <View className="h-64 bg-gray-700 rounded-xl overflow-hidden mb-6">
            <View className="flex-1 bg-gray-800 relative">
                {currentCircle?.members.map((member, index) => (
                    <TouchableOpacity
                        key={member.id}
                        className="absolute"
                        style={{
                            top: `${30 + index * 20}%`,
                            left: `${20 + index * 25}%`,
                        }}
                        onPress={() => setSelectedMember(member)}
                    >
                        <View className="relative">
                            <View
                                className={`w-10 h-10 rounded-full border-2 border-white justify-center items-center ${getStatusColor(member.status)}`}
                            >
                                <Text className="text-white font-bold">{member.avatar}</Text>
                            </View>
                            {!member.isOnline && (
                                <View className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 rounded-full border-2 border-white justify-center items-center">
                                    <WifiOff size={8} color="white" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}

                <View className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3">
                    <Text className="text-white text-xs font-semibold mb-2">Family Status</Text>
                    <View className="flex-row items-center mb-1">
                        <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                        <Text className="text-white text-xs">Safe</Text>
                    </View>
                    <View className="flex-row items-center mb-1">
                        <View className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
                        <Text className="text-white text-xs">Unknown</Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                        <Text className="text-white text-xs">Need Help</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderMemberCard = (member: FamilyMember) => {
        const StatusIcon = getStatusIcon(member.status);

        return (
            <TouchableOpacity
                key={member.id}
                className="bg-gray-800 rounded-xl p-4 border border-gray-600"
                onPress={() => setSelectedMember(member)}
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1">
                        <View className="relative mr-3">
                            <View
                                className={`w-12 h-12 rounded-full justify-center items-center ${getStatusColor(member.status)}`}
                            >
                                <Text className="text-white font-bold text-lg">{member.avatar}</Text>
                            </View>
                            {!member.isOnline && (
                                <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-800 justify-center items-center">
                                    <WifiOff size={8} color="white" />
                                </View>
                            )}
                        </View>

                        <View className="flex-1">
                            <Text className="text-white text-base font-semibold mb-1">{member.name}</Text>
                            <View className="flex-row items-center mb-1">
                                <MapPin size={14} color="#9CA3AF" />
                                <Text className="text-gray-400 text-sm ml-1">{member.location}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="flex-row items-center mr-4">
                                    <Clock size={12} color="#6B7280" />
                                    <Text className="text-gray-500 text-xs ml-1">{formatTimeAgo(member.lastSeen)}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Battery size={12} color={member.battery > 50 ? '#10B981' : member.battery > 20 ? '#F59E0B' : '#EF4444'} />
                                    <Text className={`text-xs ml-1 ${getBatteryColor(member.battery)}`}>{member.battery}%</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <StatusIcon
                            size={20}
                            color={member.status === 'safe' ? '#10B981' : member.status === 'help' ? '#EF4444' : '#F59E0B'}
                        />
                        <ChevronRight size={16} color="#9CA3AF" className="ml-2" />
                    </View>
                </View>

                {!member.name.includes('You') && (
                    <View className="flex-row mt-3 pt-3 border-t border-gray-600">
                        <TouchableOpacity
                            onPress={() => handleNudgeMember(member.id)}
                            className="flex-1 bg-orange-500/20 py-2 px-3 rounded-lg mr-2"
                        >
                            <Text className="text-orange-500 text-sm font-semibold text-center">Nudge</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-gray-600 p-2 rounded-lg mr-1">
                            <Phone size={16} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-gray-600 p-2 rounded-lg">
                            <MessageCircle size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderMemberDetail = () => (
        <Modal
            visible={selectedMember !== null}
            animationType="slide"
            transparent={true}
        >
            <View className="flex-1 bg-black/75 justify-end">
                <View className="bg-gray-900 rounded-t-2xl px-4 pt-4 max-h-4/5">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-xl font-bold">{selectedMember?.name}</Text>
                        <TouchableOpacity
                            onPress={() => setSelectedMember(null)}
                            className="p-1"
                        >
                            <X size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1">
                        <View className="bg-gray-800 rounded-xl p-4 mb-4">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-400 text-sm">Status</Text>
                                <View className="flex-row items-center">
                                    <View
                                        className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(selectedMember?.status || '')}`}
                                    />
                                    <Text className="text-white text-sm font-semibold">
                                        {selectedMember?.status ?
                                            selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1) :
                                            ''
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row mb-4">
                            <View className="bg-gray-800 rounded-xl p-4 flex-1 mr-2">
                                <View className="flex-row items-center mb-2">
                                    <MapPin size={16} color="#F97316" />
                                    <Text className="text-gray-400 text-xs ml-2">Location</Text>
                                </View>
                                <Text className="text-white text-base font-semibold">{selectedMember?.location}</Text>
                            </View>

                            <View className="bg-gray-800 rounded-xl p-4 flex-1 ml-2">
                                <View className="flex-row items-center mb-2">
                                    <Battery size={16} color={selectedMember?.battery && selectedMember.battery > 50 ? '#10B981' : selectedMember?.battery && selectedMember.battery > 20 ? '#F59E0B' : '#EF4444'} />
                                    <Text className="text-gray-400 text-xs ml-2">Battery</Text>
                                </View>
                                <Text className="text-white text-base font-semibold">{selectedMember?.battery}%</Text>
                            </View>
                        </View>

                        <View className="bg-gray-800 rounded-xl p-4 mb-4">
                            <View className="flex-row items-center mb-2">
                                <Clock size={16} color="#F97316" />
                                <Text className="text-gray-400 text-xs ml-2">Last Seen</Text>
                            </View>
                            <Text className="text-white text-base font-semibold">{formatTimeAgo(selectedMember?.lastSeen || new Date())}</Text>
                        </View>

                        {!selectedMember?.name.includes('You') && (
                            <View className="mt-4 mb-4">
                                <TouchableOpacity
                                    onPress={() => handleNudgeMember(selectedMember?.id || 0)}
                                    className="bg-orange-500 py-3 rounded-xl mb-3"
                                >
                                    <Text className="text-white text-base font-semibold text-center">Send Check-In Nudge</Text>
                                </TouchableOpacity>

                                <View className="flex-row">
                                    <TouchableOpacity className="bg-gray-800 py-3 px-4 rounded-xl flex-1 flex-row justify-center items-center mr-2">
                                        <Phone size={16} color="white" />
                                        <Text className="text-white text-sm font-semibold ml-2">Call</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-gray-800 py-3 px-4 rounded-xl flex-1 flex-row justify-center items-center ml-2">
                                        <MessageCircle size={16} color="white" />
                                        <Text className="text-white text-sm font-semibold ml-2">Message</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    const renderEmergencyNudgeModal = () => (
        <Modal
            visible={showEmergencyNudgeModal}
            animationType="fade"
            transparent={true}
        >
            <View className="flex-1 bg-black/75 justify-center items-center">
                <View className="bg-gray-900 rounded-2xl p-6 mx-4 items-center">
                    <View className="w-16 h-16 bg-orange-500 rounded-full justify-center items-center mb-4">
                        <AlertTriangle size={32} color="white" />
                    </View>
                    <Text className="text-white text-xl font-bold text-center mb-2">
                        {nudgeInterval ? 'Stop Emergency Nudging' : 'Start Emergency Nudging'}
                    </Text>
                    <Text className="text-gray-400 text-sm text-center mb-6 leading-5">
                        {nudgeInterval
                            ? 'This will stop sending automatic nudges to all family members'
                            : 'This will send automatic nudges every 5 minutes to family members who haven\'t checked in recently'
                        }
                    </Text>

                    <View className="w-full">
                        <TouchableOpacity
                            onPress={confirmEmergencyNudge}
                            className={`py-3 rounded-xl mb-3 ${nudgeInterval ? 'bg-red-500' : 'bg-orange-500'}`}
                        >
                            <Text className="text-white text-base font-semibold text-center">
                                {nudgeInterval ? 'Stop Nudging' : 'Start Emergency Nudge'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowEmergencyNudgeModal(false)}
                            className="bg-gray-800 py-3 rounded-xl"
                        >
                            <Text className="text-white text-base font-semibold text-center">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderLostFoundModal = () => (
        <Modal
            visible={showLostFoundModal}
            animationType="slide"
            transparent={true}
        >
            <View className="flex-1 bg-black/75 justify-end">
                <View className="bg-gray-900 rounded-t-2xl px-4 pt-4 pb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-xl font-bold">Report Lost/Found</Text>
                        <TouchableOpacity
                            onPress={() => setShowLostFoundModal(false)}
                            className="p-1"
                        >
                            <X size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <View className="mt-4">
                        <TouchableOpacity
                            className="bg-red-500/20 border-2 border-red-500 py-4 rounded-xl mb-4"
                            onPress={() => {
                                Alert.alert('Report Missing', 'This would report a family member as missing');
                                setShowLostFoundModal(false);
                            }}
                        >
                            <Text className="text-red-500 text-base font-semibold text-center">Report Family Member Missing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-green-500/20 border-2 border-green-500 py-4 rounded-xl"
                            onPress={() => {
                                Alert.alert('Report Found', 'This would report a family member as found');
                                setShowLostFoundModal(false);
                            }}
                        >
                            <Text className="text-green-500 text-base font-semibold text-center">Report Family Member Found</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-800">
                <View className="flex-1">
                    <Text className="text-white text-xl font-bold">Family Circle</Text>
                    <Text className="text-gray-400 text-sm">{currentCircle?.name}</Text>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => setShowLostFoundModal(true)}
                        className="p-2 ml-2"
                    >
                        <AlertTriangle size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 ml-2">
                        <Settings size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content */}
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {renderMap()}

                {/* Quick Actions */}
                <View className="flex-row mb-6">
                    <TouchableOpacity
                        onPress={handleMarkSafe}
                        className="flex-1 bg-green-500 py-4 rounded-xl flex-row justify-center items-center mr-2"
                    >
                        <Shield size={20} color="white" />
                        <Text className="text-white font-semibold text-base ml-2">I'm Safe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowEmergencyNudgeModal(true)}
                        className={`flex-1 py-4 rounded-xl flex-row justify-center items-center ml-2 ${nudgeInterval ? 'bg-red-500' : 'bg-orange-500'
                            }`}
                    >
                        <AlertTriangle size={20} color="white" />
                        <Text className="text-white font-semibold text-base ml-2">
                            {nudgeInterval ? 'Stop Nudging' : 'Emergency Nudge'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Family Members */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-lg font-semibold">Family Members</Text>
                        <Text className="text-gray-400 text-sm">{currentCircle?.members.length} members</Text>
                    </View>

                    <View className="space-y-3">
                        {currentCircle?.members.map(renderMemberCard)}
                    </View>
                </View>
            </ScrollView>

            {/* Modals */}
            {renderMemberDetail()}
            {renderEmergencyNudgeModal()}
            {renderLostFoundModal()}
        </SafeAreaView>
    );
};

export default StatusScreen;