import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, StatusBar, Image} from 'react-native';
import {StackActions} from '@react-navigation/native';

function SplashScreen({navigation}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.dispatch(StackActions.replace('Login'));
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#09090b',
      }}>
      <StatusBar backgroundColor={'#09090b'} barStyle={'light-content'} />

      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FFFFFF',
          fontFamily: 'LexendZetta',
          fontWeight: 'semibold',
        }}>
        E-JIMPITAN
      </Text>
      <Text style={{color: '#FFFFFF'}}></Text>
      <ActivityIndicator
        style={{marginTop: 30}}
        size={'large'}
        color={'#FFFFFF'}
      />
    </View>
  );
}

export default SplashScreen;
