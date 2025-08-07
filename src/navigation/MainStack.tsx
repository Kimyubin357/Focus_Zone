// src/navigation/MainStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/main/HomeScreen';
import AddFocusZone from '../screens/main/addFocusZone/AddFocusZone'; // 추가
import SetLocation from '../screens/main/addFocusZone/SetLocation';
import SetBlockApp from '../screens/main/addFocusZone/SetBlockApp';

export type MainStackParamList = {
  HomeScreen: undefined;
  AddFocusZone: undefined;
  SetLocation: undefined;
  SetBlockApp: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddFocusZone"
        component={AddFocusZone}
        options={{ title: '집중 장소 추가' }}
      />
      <Stack.Screen
        name="SetLocation"
        component={SetLocation}
        options={{ title: '위치 설정' }}
      />
      <Stack.Screen name="SetBlockApp"
        component={SetBlockApp}
        options={{ title: '차단 앱 설정' }}
      />
    </Stack.Navigator>
  );
}
