import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Linking, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function DreamCard({ titre, description, date, lucide, cauchemar, entitiesList, tag, personnesImportantes, id, memorableText, onUpdate }: { titre: String, description: String, date: String, lucide: Boolean, cauchemar: Boolean, entitiesList: Object, tag: Array<String>, personnesImportantes: String, id: Number, memorableText: String }) {

    
    

    const [entityWiki, setEntityWiki] = useState(null);
    const [motsFaits, setMotsFaits] = useState([]);

    async function fetchEntitiesWiki() {
        if (entitiesList) {
            const entityWikiList = await Promise.all(entitiesList.map(async (entry) => {
                if(!motsFaits.some(motFait => motFait == entry.form)){
                    motsFaits.push(entry.form)
                    motsFaits[motsFaits.indexOf(entry.form)].key = motsFaits.indexOf(entry.form);
                    return  await fetchWord(entry.form);
                }
                
            }));
            if(entityWikiList.length > 0){
                setEntityWiki(entityWikiList); 
            }
            if(motsFaits.length > 0){
                setMotsFaits(motsFaits);
            }
        }
    }


    const moreInfo = (lien) => {
        Linking.openURL(lien);
      };
    

    useEffect(() => {
        if(entitiesList != []){
            fetchEntitiesWiki();
        }
    }, []);


    async function fetchWord(mot) {
            const response = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${mot}&explaintext=1&format=json`);
            const data = await response.json();
        
            if (data && data.query && data.query.pages) {
                const pageId = Object.keys(data.query.pages)[0]; 
                let extract = data.query.pages[pageId].extract; 
        
                if (extract) {
                    if(extract.length >= 200){
                        extract = extract.slice(0, 200) + '...\n';
                    }
                    console.log(motsFaits)
                    return extract; 
                } else {
                    return;
                }
            } else {
                return;
            }
    }

    
    

    return (
        <View>
            <Card style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.entryNumber}>
                        <Text variant="bodyMedium" style={{backgroundColor: 'rgb(244,204,204)', borderRadius: 5, padding: 5}}> Entrée n°{id}</Text>
                    </View>
                    
                    <View>
                        <Text variant="displayMedium"style={styles.titre} >{titre}</Text>
                    </View>
                    <View style={styles.cornerRight}>
                        {lucide && <Text variant="bodyMedium" style={{backgroundColor: 'rgb(255,229,153)', borderRadius: 5, padding: 5}}>Rêve Lucide ✨</Text>}
                        {cauchemar && <Text variant="bodyMedium" style={{backgroundColor: 'rgb(103,78,167)', borderRadius: 5, padding: 5}}>Cauchemar 🦇</Text>}
                    </View>
                </View>
                <Card.Content>
                    {date && <Text variant="titleMedium">🕰️ Le : {date}</Text>}
                    <View>
                        <View>
                            <Text variant="titleMedium" style={styles.headLines}>✒️ Description: </Text>
                        </View>
                        <View style={styles.headlineView}>
                            <Text variant="bodyMedium">{description}</Text>
                        </View>
                        
                    </View>
                    
                    {personnesImportantes && 
                    <View>
                        <View>
                           <Text variant="titleMedium" style={styles.headLines}>👯 Personnes Importantes: </Text> 
                        </View>
                        <View style={styles.headlineView}>
                            <Text variant="bodyMedium">{personnesImportantes}</Text>
                        </View>
                    </View>}
                    {memorableText && 
                    <View>
                        <View>
                           <Text variant="titleMedium" style={styles.headLines}>🧠 Elements mémorables:  </Text> 
                        </View>
                        <View style={styles.headlineView}>
                            <Text variant="bodyMedium">{memorableText}</Text>
                        </View>
                        
                    </View>}
                    {entityWiki && (
                        <View>
                            <Text variant='titleMedium' style={styles.headLines}>ℹ️ Informations:</Text>
                                <View style={styles.infosList}>
                                    {entityWiki.map((info) => ( 
                                        info && info.length > 0 && ( 
                                            <View style={styles.headlineView}> 
                                                <Text variant="bodyMedium">{info}</Text>
                                            </View>
                                            
                                        )
                                    ))}
                                </View>
                        </View>
                    )}


                    
                    <View>
                        {motsFaits && motsFaits.map((mot) => (
                            <View style={{ flexDirection: 'row', marginBottom: 5, width: Dimensions.get('window').width - 50, justifyContent: 'center', marginTop: 3 }}>
                                <TouchableOpacity onPress={() => moreInfo(`https://fr.wikipedia.org/wiki/${mot}`)}>
                                    <Text style={styles.link}>Plus d'infos sur "{mot}"</Text>
                                </TouchableOpacity>    
                            </View>
                        ))}
                    </View>
                    <View>
                    {tag && tag.length > 0 && (
                        <View>
                            <Text style={{textAlign: 'center'}} variant='titleMedium'>Tags:</Text>
                            <View style={styles.tags}>
                            {tag.map((tog, index) => (
                                <Text variant="bodyMedium" style={styles.tag} key={index}>
                                    {tog} 
                                </Text>
                            ))}
                            </View>
                        </View>
                    )}

                    </View>
                </Card.Content>
            </Card>
        </View>
    );
}


const styles = StyleSheet.create({
    card:{
        display: 'flex',
        flexWrap: 'wrap',
        width: Dimensions.get('window').width - 20, 
        alignSelf: 'center',
        backgroundColor: 'rgb(171, 199, 237)'
    },
    infos: {
        marginTop: '2%',
        marginBottom: '2%'
    },
    titre: {
        // fontWeight: '100'
        marginLeft: 10
    },
    tag: {
        backgroundColor: 'rgb(207,226,243)',
        color: 'rgb(11,83,148)',
        display: 'flex',
        justifyContent: 'flex-end',
        borderWidth: 1, 
        borderColor: 'rgb(11,83,148)', 
        borderRadius: 5, 
        padding: 5, 
        margin: 2,
        borderStyle: 'dashed'
    },
    tags: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        borderWidth: 1, 
        borderColor: 'rgb(41,134,204)', 
        borderRadius: 10, 
        padding: 5, 
        margin: 2,
        borderStyle: 'dashed',
        backgroundColor: 'rgb(233,244,253)'

    },
    headLines: {
        padding: '3%',
        textDecorationLine: 'underline'
    },
    entryNumber: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end',
        marginBottom: '5%',
        marginTop: '5%', 
        // backgroundColor: 'rgb(217,210,233)',
        padding: 5
    },
    headlineView: {
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 8, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
        backgroundColor: 'rgb(20, 124, 215)'
    },
    infosList: {
        gap: 10,
        shadowColor: 'rgba(0, 0, 0, 0.35)',
        shadowOffset: {width: 0, height: 5},
        shadowRadius: 15,
    },
    link: {
        color: 'rgb(103,78,167)',
        textDecorationLine: 'underline',
        textAlign: 'center'
    },
    cardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end', 
        marginRight: 20,
        flexWrap: 'wrap'
    },
    
    cornerRight: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        marginBottom: '5%',
        marginTop: '5%',  
    },


});

