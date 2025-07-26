// src/navigation/NavigatorTab.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainStack from './MainStack'; // ✅ 여기서 HomeScreen을 대신함
import StatsScreen from '../screens/main/StatsScreen';
import GroupScreen from '../screens/main/GroupScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function NavigatorTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Group') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#339AF0',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* ✅ Home 탭은 이제 MainStack만 포함 */}
      <Tab.Screen name="Home" component={MainStack} options={{ title: '집중장소' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: '통계' }} />
      <Tab.Screen name="Group" component={GroupScreen} options={{ title: '그룹장소' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '프로필' }} />
    </Tab.Navigator>
  );
}
