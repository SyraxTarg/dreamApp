// components/DreamForm.tsx
import React, { useState , useEffect} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, Checkbox, HelperText, Switch, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import API_KEY from '@/API_KEY';

import { useNavigation } from '@react-navigation/native';
//ici on récupère la valeur en pixels de mon écran
const { width } = Dimensions.get('window');

import * as Notifications from 'expo-notifications';



let dreamIdCounter = 0;

const idGenerator = async () => {
    const existingData = await AsyncStorage.getItem('dreamFormDataArray');
    if (existingData) {
        const dreams = JSON.parse(existingData);
        if (dreams.length > 0) {
            const maxId = dreams.reduce((max, dream) => Math.max(max, dream.id), 0);
            dreamIdCounter = maxId + 1;
        }
    }
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });


export default function DreamForm() {
    useEffect(() => {
        idGenerator();
    }, []);

    const navigation = useNavigation();
    //on watch dreamtext (le text input) et quand la page se reload setDreamText met la value du input à '' comme donné en usestate
    const [dreamText, setDreamText] = useState('');
    const [titreText, setTitreText] = useState('');
    const [memorableText, setMemorableText] = useState('');
    const [personnesText, setPersonnesText] = useState('');


    //on watch la checkbox et qaund la page se reload on remet la checkbox à false
    const [isLucidDream, setIsLucidDream] = useState(false);
    const [isCauchemarOn, setIsCauchemarOn] = useState(false);


    

    /*const handleDreamSubmission = () => {
        // Logique de traitement de la soumission du rêve
        console.log('Rêve soumis:', dreamText, 'Lucide:', isLucidDream);
        //le console log se fait dans le terminal
        // Réinitialisation du formulaire
        setDreamText('');
        setIsLucidDream(false);
    };*/
    
    var month = new Date().getMonth() +1 ;



    const [selectedDate, setSelectedDate] = useState(new Date());
    const [datePickerVisible, setDatePickerVisible] = useState(false);


    const handleDreamSubmission = async () => { 
        try { 

            const newDream = {
                id: dreamIdCounter++,
                titreText: titreText,
                dreamText: dreamText,
                isLucidDream: isLucidDream,
                personnesText: personnesText, 
                isCauchemarOn: isCauchemarOn,
                memorableText: memorableText,
                tag: [],
                apiResponse: {}

            }
            console.log(dreamIdCounter);

            const apiUrl = 'https://api.meaningcloud.com/topics-2.0';
            const language = 'fr';
            const tmpDream = dreamText;
            const apiKey = API_KEY;

            const formdata = new FormData();
            formdata.append('key', apiKey);
            formdata.append('txt', tmpDream);
            formdata.append('lang', language);

            const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
            };

            const response = await fetch(apiUrl, requestOptions);
            const responseData = await response.json();
            console.log(responseData)

        
            newDream.fullDate = selectedDate.getDate() + "/" + (selectedDate.getMonth() +1) + "/" + selectedDate.getFullYear();

            newDream.apiResponse = {
                conceptsList: responseData.concept_list,
                entitiesList: responseData.entity_list,
                entryList: [...responseData.concept_list, ...responseData.entity_list],
            }

        

        
            // Récupérer le tableau actuel depuis AsyncStorage si il ne trouve pas de données dans dreamFormDataArray il renvoie null
            const existingData = await AsyncStorage.getItem('dreamFormDataArray'); 
            // si il trouve le tableau il parse le json, si il ne le trouve pas il le crée
            const formDataArray = existingData ? JSON.parse(existingData) : []; 
            // Ajouter le nouveau formulaire au tableau 
            formDataArray.push(newDream); 
            // Sauvegarder le tableau mis à jour dans AsyncStorage 
            await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(formDataArray)); 
            //En fait, je récupère tout le contenu de mon tableau avec formDataArray, ensuite j'y ajoute mes nouvelles données puis je push le tout dans mon dreamFormDataArray
            const ConsoleTemporaire = await AsyncStorage.getItem('dreamFormDataArray');
            //vu que le console log est asynchrone je dois await mes données
            console.log( 
                'AsyncStorage: ', 
                ConsoleTemporaire
            ); 
        } catch (error) { 
            console.error('Erreur lors de la sauvegarde des données:', error); 
        } 
        await scheduleNotification();
        setTitreText('');
        setDreamText(''); 
        setIsLucidDream(false); 
        setMemorableText('');
        setPersonnesText('');
        setIsCauchemarOn(false);
        setSelectedDate(new Date());
    }; 

    const scheduleNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
              title: "C'est dans la boite !",
              body: 'Votre nouveau rêve a été enregistré avec succès !',
            },
            trigger: { seconds: 10 },
        });

        await Notifications.scheduleNotificationAsync({
            content: {
              title: "Avant d'oublier vos rêves",
              body: "N'oubliez pas de venir enregistrer vos rêves",
            },
            trigger: { seconds: 3600 },
        });
    };

    
      

    const handleResetDreams = async () => {
        try {
            AsyncStorage.clear();
            console.log( 
                "historique reset"
            ); 
            dreamIdCounter = 0;
        } catch{
            console.log("rien");
        }
    };

    const titreErrors = () => {
        return titreText.length > 35;
    };

    const onToggleSwitch = () => setIsCauchemarOn(!isCauchemarOn);



    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (d) => {
        setSelectedDate(d);
        hideDatePicker();
    };



    return (
        <View style={styles.container}>
        
            <TextInput
                label="Titre"
                value={titreText}
                onChangeText={(text) => setTitreText(text)}
                mode="outlined"
                multiline
                numberOfLines={1}
                style={[styles.input, { width: width * 0.8, alignSelf: 'center' }]}
                selectionColor='rgb(22,	83,	126)'
                underlineColor='rgb(41, 134, 204)'
                activeUnderlineColor='rgb(41, 134, 204)'
                outlineColor='rgb(41, 134, 204)'
                activeOutlineColor='rgb(41, 134, 204)'
            />
            <HelperText type="error" visible={titreErrors()}>
                Votre titre est trop long !
            </HelperText>
            <TextInput
                label="Description"
                value={dreamText}
                onChangeText={(text) => setDreamText(text)}
                mode="outlined"
                multiline
                numberOfLines={6}
                style={[styles.input, { width: width * 0.8, alignSelf: 'center' }]}
                selectionColor='rgb(22,	83,	126)'
                underlineColor='rgb(41, 134, 204)'
                activeUnderlineColor='rgb(41, 134, 204)'
                outlineColor='rgb(41, 134, 204)'
                activeOutlineColor='rgb(41, 134, 204)'
            />

            <TextInput
                label="Eléments mémorables ?"
                value={memorableText}
                onChangeText={(text) => setMemorableText(text)}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={[styles.input, { width: width * 0.8, alignSelf: 'center' }]}
                selectionColor='rgb(22,	83,	126)'
                underlineColor='rgb(41, 134, 204)'
                activeUnderlineColor='rgb(41, 134, 204)'
                outlineColor='rgb(41, 134, 204)'
                activeOutlineColor='rgb(41, 134, 204)'
            />

            <TextInput
                label="Personnes présentes dans le rêve ?"
                value={personnesText}
                onChangeText={(text) => setPersonnesText(text)}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={[styles.input, { width: width * 0.8, alignSelf: 'center' }]}
                selectionColor='rgb(22,	83,	126)'
                underlineColor='rgb(41, 134, 204)'
                activeUnderlineColor='rgb(41, 134, 204)'
                outlineColor='rgb(41, 134, 204)'
                activeOutlineColor='rgb(41, 134, 204)'
            />
            

            <View style={styles.checkboxContainer}>
                <Checkbox.Item
                    label="Rêve Lucide"
                    status={isLucidDream ? 'checked' : 'unchecked'}
                    onPress={() => setIsLucidDream(!isLucidDream)}
                    color='rgb(41, 134, 204)'
                />
            </View>

            <View style={styles.dateNightmare}>
                <View style={styles.cauchemarCheck}>
                    <Text>Cauchemar</Text>
                    <Switch value={isCauchemarOn} onValueChange={onToggleSwitch} color='rgb(41, 134, 204)'/>
                </View>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' , paddingLeft: 10}}>
                    {selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}
                    </Text>
                    <Button onPress={showDatePicker} style={{display: 'flex', alignSelf: 'flex-start', justifyContent: 'center'}} textColor='rgb(41, 134, 204)'>Date</Button>
                    <DateTimePickerModal
                    date={selectedDate}
                    isVisible={datePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    />
                </View>
            </View>

            <Button mode="contained" onPress={handleDreamSubmission} style={styles.buttonSoumettre}>
                Soumettre
            </Button>
    
      
            <Button mode="text" onPress={handleResetDreams} style={styles.button} textColor='rgb(240, 100, 100)'>
                Effacer l'historique 
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'rgb(255, 255, 255)'
    },
    input: {
        marginBottom: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        color: 'red',
        
    },
    chip:{
        paddingRight: 0,
        backgroundColor: 'rgb(41, 134, 204)',
        margin: 1,
        color: 'rgba(0,0,0,0)'
    },
    buttonSoumettre: {
        backgroundColor: 'rgb(41, 134, 204)',
        color: 'rgba(0,0,0,0)',
    },
    dateNightmare:{
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 0, 
        // alignContent: 'flex-end'   
        justifyContent: 'space-between'  
    },
    cauchemarCheck:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    

});
    