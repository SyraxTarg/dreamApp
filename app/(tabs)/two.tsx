import { StyleSheet, SafeAreaView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Searchbar, Dialog, Portal, Button, TextInput, Checkbox, Switch } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View } from '@/components/Themed';

import DreamCard from '@/components/DreamCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import API_KEY from '@/API_KEY';

export default function TabTwoScreen() {
  const [dreamFormDataArray, setDreamFormDataArray] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [dialogVisible, setDialogVisible] = useState(Array(dreamFormDataArray.length).fill(false));
  const [expanded, setExpanded] = useState(true);
  const [deleteVisible, setDeleteVisible] = useState(Array(dreamFormDataArray.length).fill(false));
  const [deleteTagVisible, setDeleteTagVisible] = useState(Array(dreamFormDataArray.length).fill(false));
  const [modifyDreamVisible, setModifyDreamVisible] = useState(Array(dreamFormDataArray.length).fill(false));
  const [newTitreValue, setNewTitreValue] = useState('');
  const [newDescriptionValue, setNewDescriptionValue] = useState('');
  const [newMemorableValue, setNewMemorableValue] = useState('');
  const [newPersonnesValue, setNewPersonnesValue] = useState('');
  const [isNewLucidDream, setIsNewLucidDream] = useState(false);
  const [isNewCauchemarOn, setIsNewCauchemarOn] = useState(false);
  const [newSelectedDate, setNewSelectedDate] = useState(new Date());
  const [newDatePickerVisible, setNewDatePickerVisible] = useState(false);
  const [generalDialogVisible, setGeneralDialogVisible] = useState(Array(dreamFormDataArray.length).fill(false));
  const [currentPage, setCurrentPage] = useState(1); //Numéro de la page actuelle, qd on revfresh l'application on revient sur la page 1 
  const [itemsPerPage, setItemsPerPage] = useState(5); // Nombre d'éléments par page
  const sortedDreams = dreamFormDataArray.slice().reverse(); // Copie et inverse l'ordre des rêves

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentItems = sortedDreams.slice(indexOfFirstItem, indexOfLastItem);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await AsyncStorage.getItem('dreamFormDataArray');
          if (data) {
            const dataArray = JSON.parse(data);
            setDreamFormDataArray(dataArray);
            console.log("c ok");
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
        }
      };

      fetchData();
    }, [])
  );



  const handleSearch = () => {
    console.log(searchQuery);
  }

  const showDatePicker = () => {
    setNewDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setNewDatePickerVisible(false);
  };

  const handleConfirm = (d) => {
    setNewSelectedDate(d);
    hideDatePicker();
};

const handleInputChange = (text: string) => {
  setInputValue(text);
};

const handleNewTitreChange = (text: String) => {
  setNewTitreValue(text);
}

const handleNewDescriptionChange = (text: String) => {
  setNewDescriptionValue(text);
}

const handleNewMemorableChange = (text: String) => {
  setNewMemorableValue(text);
}

const handleNewPersonnesChange = (text: String) => {
  setNewPersonnesValue(text);
}

  const showDialog = (index) => {
    let newDialogVisible = [...dialogVisible];
    newDialogVisible[index] = true;
    setDialogVisible(newDialogVisible);
  };

  const hideDialog = (index) => {
    let newDialogVisible = [...dialogVisible];
    newDialogVisible[index] = false;
    setDialogVisible(newDialogVisible);
  };

  const showDelete = (index) => {
    let newDeleteVisible = [...deleteVisible];
    newDeleteVisible[index] = true;
    setDeleteVisible(newDeleteVisible);
  }
  
  const hideDelete = (index) => {
    let newDeleteVisible = [...deleteVisible];
    newDeleteVisible[index] = false;
    setDeleteVisible(newDeleteVisible);
  }

  const showDeleteTag = (index) => {
    let newDeleteVisible = [...deleteVisible];
    newDeleteVisible[index] = true;
    setDeleteTagVisible(newDeleteVisible);
  }
  
  const hideDeleteTag = (index) => {
    let newDeleteTagVisible = [...deleteTagVisible];
    newDeleteTagVisible[index] = false;
    setDeleteTagVisible(newDeleteTagVisible);
  }

  const showModifyDream = (index, dream) => {
    let newModifyDreamVisible = [...modifyDreamVisible];
    newModifyDreamVisible[index] = true;
    setModifyDreamVisible(newModifyDreamVisible);
    setIsNewLucidDream(dreamFormDataArray[dreamFormDataArray.indexOf(dream)].isLucidDream);
  }
  
  const hideModifyDream = (index) => {
    let newModifyDreamVisible = [...modifyDreamVisible];
    newModifyDreamVisible[index] = false;
    setModifyDreamVisible(newModifyDreamVisible);
  }

  const showGeneralDialog = (index) => {
    let newGeneralDialogVisible = [...generalDialogVisible];
    newGeneralDialogVisible[index] = true;
    setGeneralDialogVisible(newGeneralDialogVisible);
  }
  
  const hideGeneralDialog = (index) => {
    let newGeneralDialogVisible = [...generalDialogVisible];
    newGeneralDialogVisible[index] = false;
    setGeneralDialogVisible(newGeneralDialogVisible);
  }


  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleModify = async (dream) => {
    if(!newTitreValue){
      dreamFormDataArray[dreamFormDataArray.indexOf(dream)].titreText = dream.titreText;
    } else{
      dreamFormDataArray[dreamFormDataArray.indexOf(dream)].titreText = newTitreValue;
    }
    
    if(!newDescriptionValue){
      dreamFormDataArray[dreamFormDataArray.indexOf(dream)].dreamText = dream.dreamText;
    } else{
      dreamFormDataArray[dreamFormDataArray.indexOf(dream)].dreamText = newDescriptionValue;
      const apiUrl = 'https://api.meaningcloud.com/topics-2.0';
      const language = 'fr';
      const tmpDream = newDescriptionValue;;
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
      dreamFormDataArray[dreamFormDataArray.indexOf(dream)].apiResponse = {
        conceptsList: responseData.concept_list,
        entitiesList: responseData.entity_list,
        entryList: [...responseData.concept_list, ...responseData.entity_list],
    }
    console.log(dream.apiResponse)
    }

    if(!newMemorableValue){
      dreamFormDataArray[dreamFormDataArray.indexOf(dream)].memorableText = dream.memorableText;
    } else{
      dreamFormDataArray[dreamFormDataArray.indexOf(dream)].memorableText = newMemorableValue;
    }

    if(!newPersonnesValue){
      dreamFormDataArray[dreamFormDataArray.indexOf(dream)].personnesText = dream.personnesText;
    } else{
      dreamFormDataArray[dreamFormDataArray.indexOf(dream)].personnesText = newPersonnesValue;
    }    
    dreamFormDataArray[dreamFormDataArray.indexOf(dream)].isLucidDream = isNewLucidDream;
    dreamFormDataArray[dreamFormDataArray.indexOf(dream)].isCauchemarOn = isNewCauchemarOn;
    let newFullDate = newSelectedDate.getDate() + "/" + (newSelectedDate.getMonth() +1) + "/" + newSelectedDate.getFullYear();
    dreamFormDataArray[dreamFormDataArray.indexOf(dream)].fullDate = newFullDate;

    
    await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(dreamFormDataArray));
    setNewTitreValue('');
    setNewDescriptionValue('');
    setNewMemorableValue('');
    setNewPersonnesValue('');
    setIsNewLucidDream(false); 
    setIsNewCauchemarOn(false);
    setNewSelectedDate(new Date());
    window.location.reload();    
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Searchbar
          placeholder="Rechercher par date, tag ou titre"
          onChangeText={setSearchQuery}
          onChange={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          mode='view'
        />
        <View style={styles.dreamContainer}>
          {currentItems.filter(dream => searchQuery === '' || dream.tag.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || dream.titreText.toLowerCase().includes(searchQuery.toLowerCase()) || dream.fullDate.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
            <Text>Aucun résultat trouvé</Text>
          ) : currentItems.filter(dream => searchQuery === '' || dream.tag.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || dream.titreText.toLowerCase().includes(searchQuery.toLowerCase()) || dream.fullDate.toLowerCase().includes(searchQuery.toLowerCase())).map((dream, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => showGeneralDialog(index)} onLongPress={() => showDelete(index)}>
              <View style={styles.dreamCardContainer}>
                <DreamCard
                  titre={dream.titreText}
                  description={dream.dreamText}
                  date={dream.fullDate}
                  lucide={dream.isLucidDream}
                  cauchemar={dream.isCauchemarOn}
                  conceptsList={dream.apiResponse.conceptsList}
                  entitiesList={dream.apiResponse.entryList}
                  tag={dream.tag}
                  personnesImportantes={dream.personnesText}
                  id={dream.id}
                  memorableText={dream.memorableText}
                />
                <Portal>
                  <Dialog visible={generalDialogVisible[index]} onDismiss={() => hideGeneralDialog(index)} style={styles.dialog}>
                    <Dialog.Content>
                        <Text variant='bodyMedium' style={{textAlign: 'center'}}>Que souhaitez-vous faire ?</Text>
                    </Dialog.Content>
                    <Dialog.Actions style={{display: 'flex', flexDirection: 'column'}}>
                      <Button onPress={() => showDialog(index)}>Ajouter un tag</Button>
                      <Button onPress={() => showDeleteTag(index)}>Supprimer un tag</Button>
                      <Button onPress={() => showModifyDream(index, dream)}>Modifier ce rêve</Button>
                      <Button onPress={() => hideGeneralDialog(index)} mode='elevated' style={{width: '100%'}}>Annuler</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
                <Portal>
                  <Dialog visible={dialogVisible[index]} onDismiss={() => hideDialog(index)} style={styles.dialog}>
                    <Dialog.Title>Donnez un tag à ce rêve</Dialog.Title>
                    <Dialog.Content>
                      <TextInput
                        label="Entrée"
                        value={inputValue}
                        onChangeText={handleInputChange}
                      />
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={async () => {
                        console.log('Valeur de l\'entrée:', inputValue);
                        console.log("le tag de ce rêve: ", dream.tag);
                        dreamFormDataArray[dreamFormDataArray.indexOf(dream)].tag.push(inputValue);
                        await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(dreamFormDataArray));
                        setInputValue('');
                        hideDialog(index);
                      }}>Confirmer</Button>
                      <Button onPress={() => hideDialog(index)}>Annuler</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>

                
                  <Portal>
                    <Dialog visible={modifyDreamVisible[index]} onDismiss={() => hideModifyDream(index)} style={styles.dialog}>
                      <Dialog.Title>Modifiez votre rêve</Dialog.Title>
                      <Dialog.Content>
                        <TextInput
                          label="Titre"
                          onChangeText={handleNewTitreChange}
                          defaultValue={dream.titreText}
                          style={styles.input}
                          mode="outlined"
                          multiline
                          numberOfLines={1}
                          selectionColor='rgb(22,	83,	126)'
                          underlineColor='rgb(41, 134, 204)'
                          activeUnderlineColor='rgb(41, 134, 204)'
                          outlineColor='rgb(41, 134, 204)'
                          activeOutlineColor='rgb(41, 134, 204)'
                        />
                        <TextInput
                          label="Description"
                          onChangeText={handleNewDescriptionChange}
                          defaultValue={dream.dreamText}
                          style={styles.input}
                          multiline
                          numberOfLines={3}
                          selectionColor='rgb(22,	83,	126)'
                          underlineColor='rgb(41, 134, 204)'
                          activeUnderlineColor='rgb(41, 134, 204)'
                          outlineColor='rgb(41, 134, 204)'
                          activeOutlineColor='rgb(41, 134, 204)'
                          mode="outlined"
                        />
                        <TextInput
                          label="Elements mémorables"
                          onChangeText={handleNewMemorableChange}
                          defaultValue={dream.memorableText}
                          style={styles.input}
                          multiline
                          numberOfLines={1}
                          selectionColor='rgb(22,	83,	126)'
                          underlineColor='rgb(41, 134, 204)'
                          activeUnderlineColor='rgb(41, 134, 204)'
                          outlineColor='rgb(41, 134, 204)'
                          activeOutlineColor='rgb(41, 134, 204)'
                          mode="outlined"
                        />
                        <TextInput
                          label="Personnes présentes dans le rêve"
                          onChangeText={handleNewPersonnesChange}
                          defaultValue={dream.personnesText}
                          style={styles.input}
                          multiline
                          numberOfLines={1}
                          selectionColor='rgb(22,	83,	126)'
                          underlineColor='rgb(41, 134, 204)'
                          activeUnderlineColor='rgb(41, 134, 204)'
                          outlineColor='rgb(41, 134, 204)'
                          activeOutlineColor='rgb(41, 134, 204)'
                          mode="outlined"
                        />
                        <View style={styles.checkboxContainer}>
                          <Checkbox.Item
                            label="Rêve Lucide"
                            status={isNewLucidDream ? 'checked' : 'unchecked'}
                            onPress={() => setIsNewLucidDream(!isNewLucidDream)}
                            color='rgb(41, 134, 204)'
                          />
                        </View>

                        <View style={styles.dateNightmare}>
                            <View style={styles.cauchemarCheck}>
                            <Text>Cauchemar</Text>
                            <Switch
                                  value={dream.isCauchemarOn} 
                                  onValueChange={(value) => {
                                    setIsNewCauchemarOn(value); 
                                    const updatedDreams = [...dreamFormDataArray];
                                    updatedDreams[dreamFormDataArray.indexOf(dream)].isCauchemarOn = value;
                                    setDreamFormDataArray(updatedDreams);
                                    AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(updatedDreams));
                                  }} 
                                  color='rgb(41, 134, 204)'
                                />
                          </View>
                          <View style={{backgroundColor: 'rgb(207, 226, 243)'}}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10 }}>
                              {dream.fullDate ? dream.fullDate : 'No date selected'}
                            </Text>
                            <Button onPress={showDatePicker} style={{ display: 'flex', alignSelf: 'flex-start', justifyContent: 'center' }} textColor='rgb(41, 134, 204)'>Date</Button>
                            <DateTimePickerModal
                              date={newSelectedDate}
                              isVisible={newDatePickerVisible}
                              mode="date"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                            />
                          </View>
                        </View>
                        
                        

                      </Dialog.Content>
                      <Dialog.Actions>
                        <Button onPress={async () => {
                          handleModify(dream)
                          hideModifyDream(index);
                        }}>Confirmer</Button>
                        <Button onPress={() => hideModifyDream(index)}>Annuler</Button>
                      </Dialog.Actions>
                    </Dialog>
                  </Portal>
                

                <Portal>
                
                  <Dialog visible={deleteTagVisible[index]} onDismiss={() => hideDeleteTag(index)} style={styles.dialog}>
                    <Dialog.Actions>
                      <View style={styles.tagDialog}>
                        {dream.tag.map((tog) => (
                          <Button onPress={async () => {
                            const updatedTags = [...dream.tag]; 
                            updatedTags.splice(dream.tag.indexOf(tog), 1); 
                            dreamFormDataArray[dreamFormDataArray.indexOf(dream)].tag = updatedTags; 
                            await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(dreamFormDataArray)); 
                            hideDeleteTag(index);
                        }} mode='elevated'>{tog}</Button>
                        ))}
                      </View>
                      
                      <Button onPress={() => hideDeleteTag(index)}>Annuler</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>

                <Portal>
                  <Dialog visible={deleteVisible[index]} onDismiss={() => hideDelete(index)} style={styles.dialog}>
                    <Dialog.Actions>
                      <Button onPress={async () => {
                        console.log(dreamFormDataArray.indexOf(dream))
                        dreamFormDataArray.splice(dreamFormDataArray.indexOf(dream), 1);
                        await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(dreamFormDataArray));
                        hideDelete(index)
                      }}>Supprimer le rêve</Button>
                      <Button onPress={() => hideDelete(index)}>Annuler</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              </View>
            </TouchableWithoutFeedback>
          ))}
          <Text>Page {currentPage}</Text>
          <Button onPress={prevPage} disabled={currentPage === 1}>Précédent</Button>
          <Button onPress={nextPage} disabled={currentPage === Math.ceil(dreamFormDataArray.length / itemsPerPage)}>Suivant</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 255, 255)'
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  dreamContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dreamCardContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  searchBar: {
    marginBottom: '3%',
    backgroundColor: 'rgb(219,	230,	245)'
  },
  dialog:{
    backgroundColor: 'rgb(207, 226, 243)'
},
tagDialog: {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '80%',
  backgroundColor: 'rgb(207, 226, 243)'
},
input: {
  marginBottom: 16,
},
checkboxContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 16,
  backgroundColor: 'rgb(207, 226, 243)'
},
dateNightmare:{
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 0, 
  justifyContent: 'space-between',
  backgroundColor: 'rgb(207, 226, 243)'  
},
cauchemarCheck:{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgb(207, 226, 243)'
},
  
});
