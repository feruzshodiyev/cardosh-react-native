import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthFlow from './src/AppNavigator'
import {Root, StyleProvider } from 'native-base';


import App2 from "./src/app/App2";

export default function App() {

  return (
      <Root>

              <AuthFlow/>


      </Root>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
