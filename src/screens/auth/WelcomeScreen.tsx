// src/screens/auth/WelcomeScreen.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  navigation: any;
  route: any;
}

export default function WelcomeScreen({ navigation, route }: Props) {
  const nickname = route.params?.nickname || '사용자';

  const handleStart = () => {
    navigation.replace('Home');
  };

  const handleBackToNickname = () => {
    navigation.navigate('SetNickname');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleBackToNickname}>
        <Icon name="close" size={28} color="#5B5B5B" />
      </TouchableOpacity>

      <Text style={styles.title}>
        <Text style={{ fontWeight: 'bold' }}>집중장소</Text>
        <Text>에 오신 걸 환영합니다, {'\n'}</Text>
        <Text style={styles.nickname}>{nickname} 님</Text>
      </Text>

      <Image
//         source={require('../../assets/welcome.png')} // 앱 로고 또는 관련 이미지 경로
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF1F9',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 34,
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#339AF0',
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#339AF0',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});