// SetBlockApp.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SetBlockApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>차단할 앱을 선택하는 화면입니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16 },
});
