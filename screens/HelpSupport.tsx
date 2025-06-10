import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelpSupport = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Preferences Placeholder</Text>
    </View>
  );
};

export default HelpSupport;

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
