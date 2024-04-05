import { StyleSheet, TouchableWithoutFeedback, Keyboard, SafeAreaView,
  ScrollView,
  StatusBar, } from 'react-native';
  import App from '@/components/Notif';


import { Text, View } from '@/components/Themed';

//j'importe mon composant dreamform
import DreamForm from '@/components/DreamForm'

export default function TabOneScreen() {
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Text style={styles.title}>Enregistrez votre rêve</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(94, 78, 182, 0.88)" />
              <DreamForm/> 
              {/* <App/> */}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
    
  );
}//ici j'appelle mon composant dreamform

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 255, 255)'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30
  },
  separator: {
    height: 1,
    width: '80%',
  },
});
