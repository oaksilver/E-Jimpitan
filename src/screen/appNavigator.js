import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screen/homeScreen';
import PresensiScreen from '../screen/presensiScreen';

// Buat Stack Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Presensi') {
            iconName = 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false, // Menghilangkan teks di bawah icon
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          height: 60,
          paddingBottom: 10,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Presensi"
        component={PresensiScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={PresensiScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Presensi"
          component={PresensiScreen}
          options={{title: 'Presensi Ronda'}}
        />
        <Stack.Screen
          name="Jadwal"
          component={JadwalScreen}
          options={{title: 'Jadwal Ronda'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
