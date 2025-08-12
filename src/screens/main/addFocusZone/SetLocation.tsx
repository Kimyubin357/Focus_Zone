// SetLocation.tsx

import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height },
});

import { WebView } from 'react-native-webview';

export default function SetLocation() {


  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string | null>(null);
  const webViewRef = useRef<any>(null);

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
        onMessage={event => setLog('onMessage: ' + event.nativeEvent.data)}
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
    </View>
  );
}
