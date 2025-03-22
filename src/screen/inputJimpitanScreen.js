import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';

// URL API (Ganti dengan API backend Anda)
const API_URL = 'http://10.0.2.2:5000';

const JimpitanScreen = ({navigation}) => {
  const [selectedJalan, setSelectedJalan] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [warga, setWarga] = useState([]);
  const [jalanOptions, setJalanOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJalanOptions();
  }, []);

  useEffect(() => {
    if (selectedJalan) {
      fetchWarga(selectedJalan);
    }
  }, [selectedJalan]);

  const fetchJalanOptions = async () => {
    try {
      const response = await fetch(`${API_URL}/jalan`);
      const data = await response.json();

      const jalanList = data.map(item => ({
        label: item.nama,
        value: item.nama,
      }));

      setJalanOptions(jalanList);
    } catch (error) {
      console.error('Error fetching jalan:', error);
      Alert.alert('Error', 'Gagal mengambil daftar jalan');
    }
  };

  const fetchWarga = async jalan => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/warga?jalan=${jalan}`);
      const data = await response.json();
      console.log('Data dari API:', data);

      const wargaData = data.map(item => ({
        id: item.id,
        name: item.nama,
        checked: false,
        amount: 0,
      }));

      setWarga(wargaData);
    } catch (error) {
      console.error('Error fetching warga:', error);
      Alert.alert('Error', 'Gagal mengambil data warga');
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = id => {
    setWarga(prevWarga =>
      prevWarga.map(item =>
        item.id === id
          ? {...item, checked: !item.checked, amount: !item.checked ? 500 : 0}
          : item,
      ),
    );
  };

  const totalJimpitan = warga.reduce((total, item) => total + item.amount, 0);

  const handleSubmit = async () => {
    if (warga.length === 0) {
      Alert.alert('Peringatan', 'Tidak ada data warga');
      return;
    }

    const payload = {
      jalan: selectedJalan,
      warga: warga.map(item => ({
        id: item.id,
        amount: item.amount,
      })),
      total: totalJimpitan,
    };

    console.log('Payload yang dikirim:', payload);

    try {
      const response = await fetch(`${API_URL}/jimpitan`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert(
          'Sukses',
          `Data Jimpitan berhasil dikirim! Total: Rp ${totalJimpitan}`,
        );
      } else {
        const err = await response.json();
        console.error('Gagal mengirim data:', err);
        Alert.alert('Error', err.error || 'Gagal mengirim data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Gagal mengirim data');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Tombol Kembali */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Title tetap di tengah */}
        <Text style={styles.headerTitle}>JIMPITAN RT 01</Text>
      </View>

      <Text style={styles.title}>Formulir Jimpitan</Text>
      <View style={styles.card}>
        {/* Dropdown Pilih Jalan */}
        <DropDownPicker
          open={openDropdown}
          value={selectedJalan}
          items={jalanOptions}
          setOpen={setOpenDropdown}
          setValue={setSelectedJalan}
          onSelectItem={item => setSelectedJalan(item.value)}
          placeholder="Pilih Jalan"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
        />

        {loading && <ActivityIndicator size="large" color="#007bff" />}

        {/* Daftar Warga */}
        <FlatList
          data={warga}
          keyExtractor={item => item.id.toString()} // item.id harus tidak undefined
          renderItem={({item}) => (
            <View style={styles.inputRow}>
              <TouchableOpacity onPress={() => toggleCheckbox(item.id)}>
                <Icon
                  name={item.checked ? 'checkbox-outline' : 'square-outline'}
                  size={24}
                  color={item.checked ? '#007bff' : '#666'}
                />
              </TouchableOpacity>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.amount}>Rp {item.amount}</Text>
            </View>
          )}
        />

        {/* Total Jimpitan */}
        <Text style={styles.total}>Jumlah : Rp {totalJimpitan}</Text>

        {/* Tombol Kirim */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: '6%',
    backgroundColor: '#09090b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Menjaga teks tetap di tengah
    paddingHorizontal: 10,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    left: 10, // Posisikan di kiri atas
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  card: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: 15,
    zIndex: 10, // Agar dropdown tampil di atas elemen lain
  },
  dropdown: {
    backgroundColor: '#fafafa',
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default JimpitanScreen;
