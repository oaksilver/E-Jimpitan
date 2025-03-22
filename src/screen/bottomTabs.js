import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {View, TouchableOpacity} from 'react-native';

// Import Screens
import HomeScreen from './homeScreen';
import accountScreen from './accountScreen';
import historyScreen from './historyScreen';

const Tab = createBottomTabNavigator();

const CustomTabButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
    onPress={onPress}>
    {children}
  </TouchableOpacity>
);

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#09090b',
          elevation: 5,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({size}) => (
            <View style={{marginTop: 3}}>
              <Icon name="home-outline" color="#fff" size={size} />
            </View>
          ),
          tabBarButton: props => <CustomTabButton {...props} />,
        }}
      />

      <Tab.Screen
        name="History"
        component={historyScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({size}) => (
            <View style={{marginTop: 3}}>
              <Icon name="reader-outline" color="#fff" size={size} />
            </View>
          ),
          tabBarButton: props => <CustomTabButton {...props} />,
        }}
      />

      {/*
      <Tab.Screen
        name="Aktivitas"
        component={AktivitasScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="mail-outline" color={color} size={size} />
          ),
        }}
      />*/}
      <Tab.Screen
        name="Akun"
        component={accountScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({size}) => (
            <View style={{marginTop: 3}}>
              <Icon name="person-circle-outline" color="#fff" size={size} />
            </View>
          ),
          tabBarButton: props => <CustomTabButton {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
