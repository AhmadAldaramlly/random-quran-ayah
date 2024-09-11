import { View, Text, StyleSheet, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { setItem, getItem, mergeItem } from "../utils/CustomAsyncStorage";
import Item from "../components/Item";
import Button from "../components/Button";

const FAV_AYAHS_STRING = 'favAyahs';

export default function FavAyahsView({ onClose, onShare, onFav }) {
  const [favAyahs, setFavAyahs] = useState([]);

  useEffect(() => {
    (async function fetchFavAyahs () {
      await getItem(FAV_AYAHS_STRING).then(newFavAyahs => {
        if (JSON.stringify(favAyahs) !== JSON.stringify(Object.values(newFavAyahs))) {
          setFavAyahs(Object.values(newFavAyahs));
        }
      });
    })();
  }, [favAyahs]);

  return (
    <View style={styles.container}>
      <Button title='X' onPress={onClose} />
      <FlatList
        data={favAyahs}
        renderItem={({item}) => <Item id={item.id} ayah={item.ayah} ayahRef={item.ayahRef} onShare={onShare} onFav={onFav} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 20,
  },
});
