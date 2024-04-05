import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Image } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Que dois-je faire ?</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgb(41, 134, 204)" />
      <Image
        // style={styles.tinyLogo}
        source={ require('@/assets/images/dreams.jpeg')}
        style={styles.image}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgb(41, 134, 204)" />
      <EditScreenInfo path="app/options.tsx" />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  image: {
    width: '90%',
    height: '30%',
    // marginTop: '5%'
  }
});
