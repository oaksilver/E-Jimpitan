import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'https://your-api.com';

const PresensiScreen = ({navigation}) => {
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [absen, setAbsen] = useState({});

  useEffect(() => {
    fetchPesertaRonda();
  }, []);

  const fetchPesertaRonda = async () => {
    setLoading(true);
    try {
      const today = new Date().toLocaleString('id-ID', {weekday: 'long'});
      const response = await fetch(`${API_URL}/ronda?hari=${today}`);
      const data = await response.json();

      const initialAbsen = data.reduce((acc, item) => {
        acc[item.id] = true;
        return acc;
      }, {});

      setPeserta(data);
      setAbsen(initialAbsen);
    } catch (error) {
      console.error('Error fetching ronda:', error);
      Alert.alert('Error', 'Gagal mengambil data peserta ronda');
    } finally {
      setLoading(false);
    }
  };

  const togglePresensi = id => {
    setAbsen(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const totalDenda = Object.values(absen).reduce(
    (total, hadir) => total + (hadir ? 0 : 10000),
    0,
  );

  const handleSubmit = async () => {
    const presensiData = peserta.map(item => ({
      id: item.id,
      name: item.name,
      hadir: absen[item.id],
      denda: absen[item.id] ? 0 : 10000,
    }));

    try {
      const response = await fetch(`${API_URL}/presensi-ronda`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({presensi: presensiData, totalDenda}),
      });

      if (response.ok) {
        Alert.alert(
          'Sukses',
          `Presensi berhasil disimpan! Total denda: Rp ${totalDenda}`,
        );
      } else {
        Alert.alert('Error', 'Gagal menyimpan presensi');
      }
    } catch (error) {
      console.error('Error submitting presensi:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan presensi');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Presensi Ronda</Text>
      </View>

      <Text style={styles.title}>Peserta Ronda Malam Ini</Text>

      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {/* Wrapper agar daftar bisa di-scroll */}
      <View style={styles.listContainer}>
        <FlatList
          data={peserta}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.inputRow}>
              <TouchableOpacity onPress={() => togglePresensi(item.id)}>
                <Icon
                  name={absen[item.id] ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  color={absen[item.id] ? '#007bff' : '#666'}
                />
              </TouchableOpacity>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.amount}>
                Rp {absen[item.id] ? '0' : '10.000'}
              </Text>
            </View>
          )}
          contentContainerStyle={{paddingBottom: 80}} // Ruang agar tombol tidak tertutup
        />
      </View>

      {/* Total Denda */}
      <Text style={styles.total}>Total Denda: Rp {totalDenda}</Text>

      {/* Tombol Simpan */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Simpan Presensi</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20, // Memberikan ruang agar tombol tidak terlalu bawah
  },
  header: {
    height: '6%',
    backgroundColor: '#09090b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1, // Supaya daftar bisa di-scroll
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20, // Supaya tombol tidak terlalu ke pinggir
    marginBottom: 15, // Jaga jarak dengan bawah
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PresensiScreen;
