// src/screens/auth/SignUpScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const allValid = isEmailValid && isPasswordValid;

  const handleLogin = async () => {
    if (!allValid) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);

    } catch (e: any) {
      Alert.alert('로그인 실패', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={28} color="#666" />
      </TouchableOpacity>

      <Text style={styles.title}>이메일로 계속하기</Text>


      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          placeholder="이메일"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor="#ccc"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          placeholder="암호"
          style={styles.input}
          secureTextEntry={!showPassword}
          maxLength={20}
          onChangeText={setPassword}
          value={password}
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#ccc"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotText}>암호 잊음</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, allValid && styles.submitButtonActive]}
        onPress={handleLogin}
        disabled={!allValid}
      >
        <Text style={[styles.submitText]}>계속하기</Text>
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
    alignSelf: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#000',
  },
  icon: {
    marginRight: 4,
  },
  forgotText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#ccc',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonActive: {
    backgroundColor: '#339AF0',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});