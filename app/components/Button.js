import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {themeColor} from '../utils/styles';

export default function Button({
    title,
    buttonStyle,
    textStyle,
    onPress
}) {
  return (
    <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 100,
    margin: 10,
    elevation: 5,
  },
  text: {
    color: themeColor,
    fontSize: 30,
  },
});