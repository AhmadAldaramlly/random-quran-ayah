import { useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet, Share } from "react-native";
import SoundPlayer from "react-native-sound-player";
import Button from "./components/Button";
import { setItem, getItem } from "./utils/CustomAsyncStorage";
import FavAyahsView from "./views/FavAyahsView";

const FAV_AYAHS_STRING = 'favAyahs';

export default function App() {
  const [id, setId] = useState(0);
  const [ayah, setAyah] = useState('');
  const [ayahRef, setAyahRef] = useState('');
  const [star, setStar] = useState('☆');
  const [isFavFolderOpen, setIsFavFolderOpen] = useState(false);

  if (id === 0) { handleRefresh(); }
  
  useEffect(() => {
    (async function updateFavStar() {
      await getItem(FAV_AYAHS_STRING).then(favAyahs => id in favAyahs ? setStar('★') : setStar('☆'));
    })();
  }, [isFavFolderOpen]);

  async function handleRefresh() {
    if (await getItem(FAV_AYAHS_STRING) === null) { await setItem(FAV_AYAHS_STRING, {}); }
    const basmalaResponse = await fetchAyahJson(1);
    const ayahResponse = await fetchAyahJson();
    const ayahText = processAyah(ayahResponse['data']['text'], basmalaResponse['data']['text']);
    const ayahRef = `[${ayahResponse['data']['surah']['name']}:${ayahResponse['data']['numberInSurah']}]`;
    const isFav = await getItem(FAV_AYAHS_STRING).then(favAyahs => ayahResponse['data']['number'] in favAyahs);
    setId(ayahResponse['data']['number']);
    setAyah(ayahText);
    setAyahRef(ayahRef);
    setStar(isFav ? '★' : '☆');
  }

  async function handleShare(ayah, ayahRef) {
    try {
      await Share.share({ message: `${ayah}\n${ayahRef}` });
    } catch (error) {
      Alert.alert('Error:', error.message);
    }
  }

  async function handleFavLogic(id, ayah, ayahRef, isFav) {
    if (isFav) {
      await getItem(FAV_AYAHS_STRING)
          .then(async favAyahs => {
            favAyahs[id] = {id, ayah, ayahRef};
            await setItem(FAV_AYAHS_STRING, favAyahs);
          });
    } else {
      await getItem(FAV_AYAHS_STRING)
          .then(async favAyahs => {
            delete favAyahs[id];
            await setItem(FAV_AYAHS_STRING, favAyahs);
          });
    }
  }

  async function handleFav() {
    const isCurFav = star === '★';
    setStar(isCurFav ? '☆' : '★');
    await handleFavLogic(id, ayah, ayahRef, !isCurFav);
  }

  return isFavFolderOpen ?
    (
      <FavAyahsView onClose={() => setIsFavFolderOpen(false)} onShare={handleShare} onFav={handleFavLogic} />
    )
  :
    (
      <View style={styles.container}>
        <View style={styles.ayahContainer}>
          <Text style={styles.ayah}>{ayah}</Text>
          <Text style={styles.ayahRef}>{ayahRef}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Button title='🔗' onPress={() => handleShare(ayah, ayahRef)} />
          {/* <Button title='🔊' onPress={handleAudio} /> */}
          <Button title='⟳' onPress={handleRefresh} />
          <Button title={star} onPress={handleFav} />
          <Button title='📁' onPress={() => setIsFavFolderOpen(true)} />
        </View>
      </View>
    );
}

function processAyah(ayah, basmala) {
  // last char in basmala is ascii 10 (line feed) vs ascii 32 (space) in ayah
  if (ayah.startsWith(basmala.slice(0, -1)) && ayah.length > basmala.length) {
    ayah = ayah.slice(basmala.length);
  }
  return `{${ayah.slice(0, -1)}}`; // remove last char \n (line break)
}

async function fetchAyahJson(number=null) {
  const randomNumber = Math.floor(Math.random() * 6236) + 1;
  const response = await fetch(`http://api.alquran.cloud/v1/ayah/${number || randomNumber}`);
  return await response.json();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 20,
  },
  ayahContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '20%',
    marginVertical: 0,
  },
  ayah: {
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 5,
  },
  ref: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
  },
});