import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../navigation/SettingsStack';

const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>EMERGENCY</Text>

      <SettingsItem title="Emergency Profile" subtitle="Allergies, medical history, medications" onPress={() => navigation.navigate('EmergencyProfile')} />
      <SettingsItem title="Emergency Contacts" subtitle="Family, friends, medical contacts" onPress={() => navigation.navigate('EmergencyContacts')} />

      <Text style={styles.sectionTitle}>PERSONAL</Text>
      <SettingsItem title="Preferences" subtitle="Notifications, language, accessibility" onPress={() => navigation.navigate('Preferences')} />

      <Text style={styles.sectionTitle}>SUPPORT</Text>
      <SettingsItem title="Help & Support" subtitle="FAQs, contact support" onPress={() => navigation.navigate('HelpSupport')} />
      <SettingsItem title="About MaiPanic" subtitle="Version 2.1.0" onPress={undefined} />

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>🟢 Emergency Ready</Text>
        <Text style={styles.statusSubText}>All systems operational – Last check: 2 min ago</Text>
      </View>

      <TouchableOpacity style={styles.signOutBtn}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const SettingsItem = ({ title, subtitle, onPress }: { title: string, subtitle: string, onPress?: () => void }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress} disabled={!onPress}>
    <Text style={styles.itemTitle}>{title}</Text>
    <Text style={styles.itemSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    color: '#FF8000',
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'Poppins-Medium',
  },
  itemContainer: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 12,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  itemSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  statusBox: {
    marginTop: 30,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  statusText: {
    color: '#00FF00',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  statusSubText: {
    color: '#CBD5E1',
    fontSize: 13,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  signOutBtn: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#FF4D4F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#FF4D4F',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

export default SettingsScreen;
