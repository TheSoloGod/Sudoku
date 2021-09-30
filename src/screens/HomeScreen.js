import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  Button,
} from "react-native";
import LevelSelectBtn from "../component/LevelSelectBtn";
const Stack = createNativeStackNavigator()
function HomeScreen({navigation}){
  return (
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Home" component={LevelScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LevelSelectBtn level={"EASY"}/>
      <LevelSelectBtn level={"MEDIUM"}/>
      <LevelSelectBtn level={"HARD"}/>
    </View>
  );
}

export default HomeScreen;
