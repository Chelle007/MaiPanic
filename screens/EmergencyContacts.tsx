import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmergencyContacts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Emergency Contacts Placeholder</Text>
    </View>
  );
};

export default EmergencyContacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FF8000',
    fontSize: 20,
  },
});
