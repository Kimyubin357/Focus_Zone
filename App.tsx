// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import NavigatorTab from './src/navigation/NavigatorTab';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './src/services/firebase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null; // or splash screen

  return (
    <NavigationContainer>
      {user ? <NavigatorTab /> : <AuthStack />}
    </NavigationContainer>
  );
}
