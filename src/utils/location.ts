import { Platform, PermissionsAndroid } from 'react-native';

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '내 위치로 이동하려면 위치 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return null;
      }
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
      );
    });
  } catch (e) {
    return null;
  }
}
