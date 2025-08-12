// SetLocation.tsx

import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Platform, PermissionsAndroid, ActivityIndicator, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height },
});

export default function SetLocation() {
  const navigation = useNavigation();
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string | null>(null);
  const webViewRef = useRef<any>(null);
  const [selected, setSelected] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddr, setLoadingAddr] = useState(false);

  // 내 위치로 이동 버튼 핸들러
  const handleMoveToMyLocation = async () => {
    let location = null;
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
        setError('위치 권한이 거부되었습니다.');
        return;
      }
    }
    Geolocation.getCurrentPosition(
      (position) => {
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        if (webViewRef.current) {
          webViewRef.current.postMessage(
            JSON.stringify({ type: 'moveToMyLocation', ...location })
          );
        }
      },
      (error) => {
        setError('위치 정보 에러: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
    );
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
      <style>html,body,#map {height:100%;width:100%;margin:0;padding:0;}</style>
  <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey="></script>
    </head>
    <body>
      <div id="map" style="width:100%;height:100%;"></div>
      <script>
        var map = new kakao.maps.Map(document.getElementById('map'), {
          center: new kakao.maps.LatLng(37.5665, 126.9780),
          level: 3
        });
        var marker = null;
        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
          var latlng = mouseEvent.latLng;
          if (marker) marker.setMap(null);
          marker = new kakao.maps.Marker({
            position: latlng,
            map: map
          });
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              latitude: latlng.getLat(),
              longitude: latlng.getLng()
            }));
          }
        });
        // React Native에서 내 위치로 이동 메시지 받기
        document.addEventListener('message', function(e) {
          try {
            var data = JSON.parse(e.data);
            if (data.type === 'moveToMyLocation' && data.latitude && data.longitude) {
              var latlng = new kakao.maps.LatLng(data.latitude, data.longitude);
              map.setCenter(latlng);
              if (marker) marker.setMap(null);
              marker = new kakao.maps.Marker({
                position: latlng,
                map: map,
                title: '내 위치'
              });
            }
          } catch (err) {}
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {error && (
        <Text style={{ color: 'red', margin: 16 }}>WebView Error: {error}</Text>
      )}
      {log && (
        <Text style={{ color: 'blue', margin: 16 }}>WebView Log: {log}</Text>
      )}
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        onError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          setError(nativeEvent.description || 'Unknown error');
        }}
        onLoadEnd={() => setLog('WebView loaded')}
        onMessage={async event => {
          setLog('onMessage: ' + event.nativeEvent.data);
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.latitude && data.longitude) {
              setSelected({ latitude: data.latitude, longitude: data.longitude });
              setAddress(null);
              setLoadingAddr(true);
              // 카카오 REST API로 reverse geocoding
              const REST_API_KEY = '';
              const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${data.longitude}&y=${data.latitude}`;
              const res = await fetch(url, {
                headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
              });
              const json = await res.json();
              if (json.documents && json.documents.length > 0) {
                setAddress(json.documents[0].address?.address_name || '');
              } else {
                setAddress('주소를 찾을 수 없습니다');
              }
              setLoadingAddr(false);
            }
          } catch (e) {
            setAddress('주소 변환 실패');
            setLoadingAddr(false);
          }
        }}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 32,
          right: 16,
          backgroundColor: '#fff',
          borderRadius: 24,
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          zIndex: 1000,
        }}
        onPress={handleMoveToMyLocation}
      >
        <Text style={{ color: '#339AF0', fontWeight: 'bold', fontSize: 18 }}>내위치</Text>
      </TouchableOpacity>

      {/* 주소 및 계속하기 버튼 */}
      {selected && (
        <View style={{ position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 }}>
            {loadingAddr ? (
              <ActivityIndicator size="small" color="#339AF0" />
            ) : (
              <Text style={{ fontSize: 16, color: '#222' }}>{address || '주소를 불러오는 중...'}</Text>
            )}
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#339AF0', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 }}
            disabled={!address || loadingAddr}
            onPress={() => {
              if (!address) return;
              // 이전 화면으로 주소/좌표 전달 (params로 전달)
              navigation.navigate({
                name: 'AddFocusZone',
                params: { address, latitude: selected.latitude, longitude: selected.longitude },
                merge: true,
              });
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>계속하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
