// SetLocation.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SetLocation() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>위치를 설정하는 화면입니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16 },
});
