import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SectionList,
  TextInput,
  StatusBar,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'https://your-api.com/transactions';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Semua');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const sortedData = groupTransactionsByMonth(data);
      setHistory(sortedData);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Fungsi untuk mengelompokkan transaksi berdasarkan bulan
  const groupTransactionsByMonth = transactions => {
    const grouped = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleString('id-ID', {
        month: 'long',
        year: 'numeric',
      });

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(transaction);
    });

    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(month => ({
        title: month,
        data: grouped[month].sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        ),
      }));
  };

  // Fungsi Filter Berdasarkan Waktu
  const filterTransactions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset jam agar hanya tanggal yang dibandingkan

    let filtered = history;

    if (selectedFilter === 'Hari Ini') {
      filtered = history.map(section => ({
        ...section,
        data: section.data.filter(item => {
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0); // Reset jam untuk akurasi
          return itemDate.getTime() === today.getTime(); // Perbandingan hari ini
        }),
      }));
    } else if (selectedFilter === 'Minggu Ini') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 6); // 6 hari lalu + hari ini

      filtered = history.map(section => ({
        ...section,
        data: section.data.filter(item => {
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0); // Reset jam
          return itemDate >= oneWeekAgo && itemDate <= today;
        }),
      }));
    } else if (selectedFilter === 'Bulan Ini') {
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();

      filtered = history.map(section => ({
        ...section,
        data: section.data.filter(item => {
          const itemDate = new Date(item.date);
          return (
            itemDate.getMonth() === thisMonth &&
            itemDate.getFullYear() === thisYear
          );
        }),
      }));
    }

    return filtered.filter(section => section.data.length > 0);
  };

  const filteredHistory = filterTransactions()
    .map(section => ({
      ...section,
      data: section.data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter(section => section.data.length > 0);

  const renderItem = ({item}) => (
    <View style={styles.transactionItem}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{item.initials}</Text>
        </View>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text
          style={[
            styles.amount,
            item.amount < 0 ? styles.negative : styles.positive,
          ]}>
          {item.amount < 0
            ? `-Rp${Math.abs(item.amount)}`
            : `+Rp${item.amount}`}
        </Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <StatusBar backgroundColor={'#09090b'} barStyle="light-content" />
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {/* Search Bar & Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Cari History"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Icon
            name="filter"
            size={24}
            color="black"
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>

      {/* List Transaksi */}
      <SectionList
        sections={filteredHistory}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
        )}
      />

      {/* Modal Filter */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filter Transaksi</Text>
            {['Semua', 'Minggu Ini', 'Bulan Ini'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterOption,
                  selectedFilter === option && styles.selectedFilter,
                ]}
                onPress={() => {
                  setSelectedFilter(option);
                  setFilterVisible(false);
                }}>
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 15,
    paddingHorizontal: 10,
  },
  searchBar: {flex: 1, padding: 10},
  filterIcon: {marginLeft: 10},
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  leftSection: {flexDirection: 'row', alignItems: 'center'},
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {color: '#fff', fontWeight: 'bold'},
  name: {fontSize: 16, fontWeight: 'bold'},
  date: {fontSize: 12, color: 'gray'},
  rightSection: {alignItems: 'flex-end'},
  amount: {fontSize: 16, fontWeight: 'bold'},
  negative: {color: 'red'},
  positive: {color: 'green'},
  type: {fontSize: 12, color: 'gray'},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 250,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  filterOption: {padding: 10},
  selectedFilter: {backgroundColor: '#ddd', borderRadius: 5},
});

export default HistoryScreen;
