import { useState, useEffect } from "react";
import { View, Text, StyleSheet, } from "react-native";
import Button from "./Button";

export default function Item({ id, ayah, ayahRef, onShare, onFav }) {
  const [star, setStar] = useState('★');

  async function handleFav() {
    const isCurFav = star === '★';
    setStar(isCurFav ? '☆' : '★');
    await onFav(id, ayah, ayahRef, !isCurFav);
  }

  return (
    <View style={styles.container}>
      <View style={styles.ayahContainer}>
        <Text style={styles.ayah}>{ayah}</Text>
        <Text style={styles.ayahRef}>{ayahRef}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title='🔗' onPress={() => onShare(ayah, ayahRef)} />
        <Button title={star} onPress={handleFav} />
        {/* <Button title='🔊' onPress={onAudio} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  ayahContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  ayah: {
    fontSize: 25,
    textAlign: 'center',
  },
  ayahRef: {
    fontSize: 15,
    textAlign: 'center',
  },
});