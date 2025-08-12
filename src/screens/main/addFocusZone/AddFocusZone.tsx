import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/MainStack'; // 주의: MainStack에 두 화면 등록 필요

import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AddFocusZone() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity><Text style={styles.cancel}>취소</Text></TouchableOpacity>
        <Text style={styles.title}>집중장소 등록</Text>
        <TouchableOpacity><Text style={styles.save}>저장</Text></TouchableOpacity>
      </View>

      {/* Placeholder for Map */}
      <View style={styles.mapPlaceholder} />

      {/* Focus Zone Name */}
      <View style={styles.section}>
        <Text style={styles.label}>집중장소명</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>새로운 집중장소</Text>
        </View>
      </View>

      {/* 위치 선택 */}
      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('SetLocation')}>
        <Text style={styles.label}>위치</Text>
        <View style={styles.inputBox}>
          <Ionicons name="send" size={16} color="#339AF0" />
          <Text style={styles.inputText}>51-1, 충대로13번길, 청주시</Text>
        </View>
      </TouchableOpacity>

      {/* 차단 앱 선택 */}
      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('SetBlockApp')}>
        <Text style={styles.label}>차단할 앱</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>앱 목록</Text>
          <Ionicons name="apps" size={16} color="#339AF0" style={{ marginLeft: 4 }} />
          <Text style={styles.badge}>0</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
// ...중복된 styles 선언 제거...
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F6FD' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 'bold' },
  cancel: { color: '#fa5252', fontWeight: 'bold' },
  save: { color: '#228be6', fontWeight: 'bold' },
  mapPlaceholder: { height: 100, backgroundColor: '#ddd', borderRadius: 8, marginBottom: 12 },
  section: { marginVertical: 8 },
  // ...기존 스타일 유지...
  label: { fontSize: 14, color: '#888', marginBottom: 4 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  inputText: { fontSize: 14, marginLeft: 8 },
  badge: {
    marginLeft: 6,
    fontSize: 12,
    color: '#339AF0',
    fontWeight: 'bold',
  },
});
