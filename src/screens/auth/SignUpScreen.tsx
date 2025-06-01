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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';


export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const allValid = isEmailValid && isPasswordValid;

  const handleSignUp = async () => {
    if (!allValid) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ 사용자 생성 성공 시 닉네임 설정 화면으로 이동
      navigation.replace('SetNickname');
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        Alert.alert('회원가입 실패', '이미 가입된 이메일입니다.');
      } else {
        Alert.alert('회원가입 실패', e.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={28} color="#666" />
      </TouchableOpacity>

      <Text style={styles.title}>이메일로 가입하기</Text>

      {/* 이메일 입력 */}
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#666" style={styles.icn} />
        <TextInput
          placeholder="이메일"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      {/* 비밀번호 입력 */}
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#666" style={styles.icon} />

        <TextInput
          placeholder="암호"
          style={styles.input}
          secureTextEntry={!showPassword}
          maxLength={20}
          onChangeText={setPassword}
          value={password}
        />
        <Text style={{ color: password.length >= 8 ? 'green' : password.length === 0 ? '#ccc' : 'red' }}>
          {password.length}/8
        </Text>
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#666"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, allValid && styles.submitButtonActive]}
        onPress={handleSignUp}
        disabled={!allValid}
      >
        <Text style={[styles.submitText, allValid && styles.submitTextActive]}>계속하기</Text>
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
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
  },
  loginText: {
    textAlign: 'center',
    color: '#ggg',
    marginVertical: 20,
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
  submitTextActive: {
    color: '#fff',
  },
});