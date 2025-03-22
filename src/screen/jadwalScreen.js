import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const rondaSchedule = {
  Senin: ['Pak Budi', 'Pak Wawan'],
  Selasa: ['Pak Ari', 'Pak Eko'],
  Rabu: ['Erlangga', 'Pak Rio'],
  Kamis: ['Pak Deni', 'Pak Nugroho'],
  Jumat: ['Pak Hasan', 'Pak Agus'],
  Sabtu: ['Pak Doni', 'Pak Santoso'],
  Minggu: ['Pak Satria', 'Pak Hendri'],
};

const JadwalScreen = ({navigation}) => {
  const [selectedDay, setSelectedDay] = useState('Senin');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setPeople(rondaSchedule[selectedDay] || []);
  }, [selectedDay]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>JADWAL RONDA</Text>
      </View>
      <View style={styles.cards}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Pilih Hari Ronda</Text>
          <DropDownPicker
            open={openDropdown}
            value={selectedDay}
            items={Object.keys(rondaSchedule).map(day => ({
              label: day,
              value: day,
            }))}
            setOpen={setOpenDropdown}
            setValue={setSelectedDay}
            placeholder="Pilih Hari"
            style={styles.dropdown}
          />
        </View>
        {/* Dropdown Pilih Hari */}
        {/* Daftar Peserta Ronda */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 Peserta Ronda:</Text>
          {people.length > 0 ? (
            <FlatList
              data={people}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <Text style={styles.peopleText}>👥 {item}</Text>
              )}
            />
          ) : (
            <Text style={styles.peopleText}>Tidak ada peserta.</Text>
          )}
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button}>
            <Icon name="document-text-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Lihat Aturan Ronda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Icon name="notifications-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Set Notifikasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  header: {
    height: 60,
    backgroundColor: '#09090b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    elevation: 3,
  },
  cards: {
    padding: 15,
  },

  backButton: {
    position: 'absolute',
    left: 10,
    padding: 10,
  },

  headerTitle: {color: '#fff', fontSize: 18, fontWeight: 'bold'},

  dropdownContainer: {
    marginBottom: 15,
    zIndex: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  dropdown: {
    backgroundColor: '#fafafa',
  },

  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  cardTitle: {fontSize: 16, fontWeight: 'bold'},

  peopleText: {fontSize: 14, marginTop: 5},

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  button: {
    flexDirection: 'row',
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },

  buttonText: {color: 'white', marginLeft: 5},
});

export default JadwalScreen;
