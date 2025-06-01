// src/screens/auth/StartSignUpScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function StartSignUpScreen({ navigation }: any) {
  const handleEmailPress = () => {
    navigation.navigate('SignUp');
  };

  const handleNotImplemented = (provider: string) => {
    Alert.alert(`${provider} 로그인은 추후 지원됩니다.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>집중장소</Text>
      <Text style={styles.subtitle}>시작해볼까요?</Text>

      <TouchableOpacity style={[styles.button, styles.emailButton]} onPress={handleEmailPress}>
        <Text style={styles.buttonText}>✉ 이메일로 계속하기</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.or}>또는</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={[styles.button, styles.naverButton]} onPress={() => handleNotImplemented('네이버')}>
        <Text style={styles.buttonText}>N 네이버로 계속하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.kakaoButton]} onPress={() => handleNotImplemented('카카오')}>
        <Text style={styles.buttonText}>💬 카카오로 계속하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.appleButton]} onPress={() => handleNotImplemented('Apple')}>
        <Text style={[styles.buttonText, { color: 'white' }]}> Apple로 계속하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={() => handleNotImplemented('Google')}>
        <Text style={styles.buttonText}>G Google로 계속하기</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        계속하면, 개인정보 보호정책 및 이용약관에 동의하게 됩니다
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  emailButton: {
    backgroundColor: '#339AF0',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#AAA',
  },
  or: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#888',
  },
  termsText: {
    marginTop: 24,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});
