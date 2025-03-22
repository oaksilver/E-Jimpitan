import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const AccountScreen = ({navigation}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('User Data:', parsedUser); // ✅ Debugging: Cek isi user
          setUser(parsedUser);
        } else {
          Alert.alert('Error', 'User tidak ditemukan, silakan login kembali');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Gagal mengambil user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      Alert.alert('Logout Berhasil', 'Anda telah keluar.');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error', 'Gagal logout. Coba lagi.');
    }
  };

  if (!user) {
    return <Text style={styles.loadingText}>Memuat...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <StatusBar backgroundColor={'#09090b'} barStyle="light-content" />
        <Text style={styles.headerTitle}>Akun</Text>
      </View>

      {/* Foto Profil */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              user.foto_profil ||
              'https://oaqffnqobdczbgzmyfhc.supabase.co/storage/v1/object/public/profile-pictures/default.png',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.nama || 'Tidak Ada Nama'}</Text>
      </View>

      {/* Kartu Informasi */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.cardText}>Username</Text>
          <Text style={styles.cardValue}>{user.username || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.cardText}>Role</Text>
          <Text style={styles.cardValue}>{user.role || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.cardText}>Status Akun</Text>
          <Text style={styles.cardValue}>Aktif</Text>
        </View>
      </View>

      {/* Tombol Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="white" />
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    height: '8%',
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  profileSection: {alignItems: 'center', marginVertical: 20},
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ccc',
  },
  profileName: {fontSize: 20, fontWeight: 'bold', marginTop: 10},
  card: {
    backgroundColor: '#09090b',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardText: {color: '#fff', fontSize: 14},
  cardValue: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  loadingText: {textAlign: 'center', marginTop: 50, fontSize: 16},

  // Styling Logout Button
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AccountScreen;
