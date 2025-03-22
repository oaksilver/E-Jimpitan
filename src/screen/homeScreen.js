import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const menuItems = [
  {id: '1', name: 'Input Jimpitan', icon: require('../assets/icons/input.png')},
  {id: '2', name: 'Jadwal Ronda', icon: require('../assets/icons/jadwal.png')},
  {
    id: '3',
    name: 'Presensi Ronda',
    icon: require('../assets/icons/absensi.png'),
  },
];

const HomeScreen = ({route, navigation}) => {
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Cek apakah user ada di route params
    if (route.params?.user) {
      setUser(route.params.user);
    } else {
      // Jika tidak, ambil dari AsyncStorage
      const fetchUser = async () => {
        try {
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [route.params]);

  // Jika user belum dimuat, tampilkan loading
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Memuat...</Text>
      </View>
    );
  }

  // Filter menu berdasarkan teks pencarian
  const filteredMenu = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <Image
            source={
              user.foto_profil
                ? {uri: user.foto_profil}
                : require('../assets/icons/default-avatar.png')
            }
            style={styles.avatar}
          />
          <Text style={styles.greeting}>
            Halo, <Text style={styles.userName}>{user.nama || 'Pengguna'}</Text>
          </Text>
        </View>
        <TouchableOpacity>
          <Icon
            name="notifications-outline"
            size={24}
            color="white"
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Fitur"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Grid Menu */}
      <FlatList
        data={filteredMenu}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.menuContainer}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              if (item.name === 'Presensi Ronda') {
                navigation.navigate('Presensi');
              }
              if (item.name === 'Input Jimpitan') {
                navigation.navigate('Jimpitan');
              }
              if (item.name === 'Jadwal Ronda') {
                navigation.navigate('Jadwal');
              }
            }}>
            <Image source={item.icon} style={styles.menuIcon} />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 13,
    backgroundColor: '#09090b',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  greeting: {
    color: 'white',
    fontSize: 16,
  },
  userName: {
    fontWeight: 'bold',
  },
  notificationIcon: {
    marginRight: 10,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 11,
    margin: 10,
    elevation: 3, // Shadow Android
    shadowColor: '#000', // Shadow iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '34%',
    marginVertical: 13,
  },
  menuIcon: {
    width: 50,
    height: 50,
  },
  menuText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default HomeScreen;
