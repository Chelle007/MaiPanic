import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EmergencyProfile = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Profile</Text>
      <Text style={styles.subtitle}>This is a placeholder screen.</Text>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Text style={styles.buttonText}>⬅ Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmergencyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#FF8000',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    fontFamily: 'Poppins-Regular',
    marginBottom: 40,
  },
  button: {
    padding: 12,
    backgroundColor: '#FF8000',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
