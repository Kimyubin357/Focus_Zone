// HomeScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';

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
  const [focusLocations, setFocusLocations] = useState(initialLocations);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const sheetHeight = useRef(new Animated.Value(screenHeight * 0.6)).current;
  const collapsedHeight = 60;
  const expandedHeight = screenHeight * 0.88;
  const isExpanded = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        let newHeight = isExpanded.current
          ? expandedHeight - gestureState.dy
          : collapsedHeight - gestureState.dy;
        newHeight = Math.max(collapsedHeight, Math.min(expandedHeight, newHeight));
        sheetHeight.setValue(newHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldExpand = gestureState.dy < -50;
        Animated.timing(sheetHeight, {
          toValue: shouldExpand ? expandedHeight : collapsedHeight,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          isExpanded.current = shouldExpand;
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 36.6282,
          longitude: 127.4563,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={{
          latitude: 36.6282,
          longitude: 127.4563,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {focusLocations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={loc.coordinate}
            title={loc.name}
            description={loc.address}
          />
        ))}
      </MapView>

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

      <TouchableOpacity style={styles.addButton}>
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
