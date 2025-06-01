// src/screens/auth/SetNicknameScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SetNicknameScreen({ navigation }: any) {
  const [nickname, setNickname] = useState('');
  const isValid = nickname.trim().length > 0;

  const handleNext = () => {
    if (!isValid) return;
    // TODO: 닉네임 저장 로직 (예: Firebase에 저장)
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="close" size={28} color="#5B5B5B" />
      </TouchableOpacity>

      <Text style={styles.title}>누구라고 해야 할까요?</Text>

      <TextInput
        placeholder="이름"
        style={[styles.input, isValid && styles.inputActive]}
        placeholderTextColor="#bbb"
        value={nickname}
        onChangeText={setNickname}
        returnKeyType="done"
      />

      <TouchableOpacity
        style={[styles.button, isValid && styles.buttonActive]}
        onPress={handleNext}
        disabled={!isValid}
      >
        <Text style={[styles.buttonText]}>계속하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF1F9',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#bbb',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 12,
    color: '#333',
  },
  inputActive: {
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    backgroundColor: '#ccc',
    marginTop: 60,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#339AF0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});