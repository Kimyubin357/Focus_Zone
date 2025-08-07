import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainStack';
import { useSharedValue } from 'react-native-reanimated';
import React, { useRef, useState } from 'react';
import { Platform, PermissionsAndroid, View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const screenHeight = Dimensions.get('window').height;
const initialLocations = [
  {
    id: '1',
    name: '도서관',
    address: '120-10, 개신동, 청주시',
    active: true,
    appCount: 1,
    coordinate: { latitude: 36.6282, longitude: 127.4563 },
  },
  {
    id: '2',
    name: '스터디카페',
    address: '청주 상당구',
    active: false,
    appCount: 3,
    coordinate: { latitude: 36.6255, longitude: 127.4532 },
  },
];

export default function HomeScreen() {
  // WebView ref for controlling the map
  const webViewRef = useRef<any>(null);

  // 내 위치로 이동 버튼 핸들러
  const handleMoveToMyLocation = async () => {
  console.log('내 위치 버튼 클릭됨');
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
        return;
      }
    }
    Geolocation.getCurrentPosition(
      (position: any) => {
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('내 위치 위도/경도:', location.latitude, location.longitude);
        if (webViewRef.current) {
          webViewRef.current.postMessage(
            JSON.stringify({ type: 'moveToMyLocation', ...location })
          );
        }
      },
      (error: any) => {
        console.log('위치 정보 에러:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
    );
  };
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [focusLocations, setFocusLocations] = useState(initialLocations);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const sheetHeight = useRef(new Animated.Value(screenHeight * 0.6)).current;
  const collapsedHeight = 60;
  const middleHeight = screenHeight * 0.6;
  const expandedHeight = screenHeight * 0.88;
  const isExpanded = useRef(false);

  let currentHeight = middleHeight;

  sheetHeight.addListener(({ value }) => {
    currentHeight = value;
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = currentHeight - gestureState.dy;
        sheetHeight.setValue(
          Math.max(collapsedHeight, Math.min(expandedHeight, newHeight))
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        const releasedHeight = currentHeight - gestureState.dy;

        const nearest = [collapsedHeight, middleHeight, expandedHeight].reduce((prev, curr) =>
          Math.abs(curr - releasedHeight) < Math.abs(prev - releasedHeight) ? curr : prev
        );

        Animated.timing(sheetHeight, {
          toValue: nearest,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          isExpanded.current = nearest === expandedHeight;
        });
      },
    })
  ).current;

  const toggleActive = (id: string) => {
    setFocusLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, active: !loc.active } : loc))
    );
  };

  const toggleMenu = (id: string) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const handlePresentModalPress = () => {
    navigation.navigate('AddFocusZone');
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => toggleActive(item.id)}>
        <Icon
          name={item.active ? 'checkmark-circle' : 'close-circle'}
          size={24}
          color={item.active ? '#2f9e44' : '#ccc'}
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <View style={styles.meta}>
          <Icon name="bar-chart-outline" size={14} color="#666" />
          <Text style={styles.metaText}>{item.appCount}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.menuButton} onPress={() => toggleMenu(item.id)}>
        <Icon name="ellipsis-vertical" size={20} color="#888" />
      </TouchableOpacity>

      {menuOpenId === item.id && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem}>
            <Icon name="pencil" size={16} color="#333" />
            <Text style={styles.dropdownText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem}>
            <Icon name="trash" size={16} color="red" />
            <Text style={[styles.dropdownText, { color: 'red' }]}>삭제…</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{
          html: `
            <!DOCTYPE html>
            <html lang="ko">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Kakao Map</title>
              <style>html,body,#map{height:100%;margin:0;padding:0;}</style>
              <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=f0bd2f3644baa4e63b88a544b691600d"></script>
            </head>
            <body>
              <div id="map" style="width:100vw;height:100vh;"></div>
              <button id="moveMyLocationBtn" style="display:none">내 위치로 이동</button>
              <script>
                var mapContainer = document.getElementById('map');
                var mapOption = {
                  center: new kakao.maps.LatLng(36.6282, 127.4563),
                  level: 3
                };
                var map = new kakao.maps.Map(mapContainer, mapOption);
                var positions = [
                  { title: '도서관', latlng: new kakao.maps.LatLng(36.6282, 127.4563) },
                  { title: '스터디카페', latlng: new kakao.maps.LatLng(36.6255, 127.4532) }
                ];
                positions.forEach(function(pos) {
                  new kakao.maps.Marker({
                    map: map,
                    position: pos.latlng,
                    title: pos.title
                  });
                });
                document.addEventListener('message', function(e) {
                  try {
                    var data = JSON.parse(e.data);
                    if (data.type === 'moveToMyLocation' && data.latitude && data.longitude) {
                      var latlng = new kakao.maps.LatLng(data.latitude, data.longitude);
                      map.setCenter(latlng);
                      new kakao.maps.Marker({
                        map: map,
                        position: latlng,
                        title: '내 위치'
                      });
                    }
                  } catch (err) {}
                });
              </script>
            </body>
            </html>
          `
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
        <Icon name="locate" size={28} color="#339AF0" />
      </TouchableOpacity>

      <Animated.View
        style={[styles.listContainer, { height: sheetHeight }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handleBar} />
        <FlatList
          data={focusLocations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<Text style={styles.sectionTitle}>집중장소</Text>}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </Animated.View>

      <TouchableOpacity style={styles.addButton} onPress={handlePresentModalPress}>
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  listContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#F3F6FD',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    overflow: 'hidden',
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  menuButton: {
    padding: 6,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    padding: 8,
    zIndex: 999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#339AF0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    zIndex: 999,
  },
});
