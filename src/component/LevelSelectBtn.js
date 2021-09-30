import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
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

export default function LevelSelectBtn ({level}) {
  const navigation = useNavigation()
  return(
    <TouchableOpacity
      style={{
        alignItems: "center",
        borderRadius: 12,
        paddingVertical: 10,
        width: "60%",
        backgroundColor: "cyan",
        marginBottom: 30,
        borderColor: "black",
        borderWidth: 2
      }}
      onPress={() => {
        /* 1. Navigate to the Details route with params */
        navigation.navigate('Game', {
          level: level
        });
      }}
    >
      <Text style={{
        color: "black"
      }}>{level}</Text>
    </TouchableOpacity>
  )
}
