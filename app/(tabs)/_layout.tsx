import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Enregistrez votre rêve 🌙',
          tabBarIcon: ({ color }) => <FontAwesome
                                          name="cloud"
                                          size={25}
                                          color={'rgb(22,	83,	126)'}
                                      />,
          headerRight: () => (
            <Link href="/options" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={'rgb(41, 134, 204)'}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Historique 📖',
          tabBarIcon: ({ color }) => <FontAwesome
                                        name="book"
                                        size={25}
                                        color={'rgb(22,	83,	126)'}
                                      />,
                                      headerRight: () => (
                                        <Link href="/optionsHistorique" asChild>
                                          <Pressable>
                                            {({ pressed }) => (
                                              <FontAwesome
                                                name="info-circle"
                                                size={25}
                                                color={'rgb(41, 134, 204)'}
                                                style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                              />
                                            )}
                                          </Pressable>
                                        </Link>
                                      ),
                                  
        }}
      />
      
      {/* <Tabs.Screen 
      name="three" 
      options={{ 
        title: 'Tab Three', 
        tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />, 
      }} 
      />  */}

    </Tabs> 
    
  );
}

//pour ajouter une nouvelle page dans la barre de navigation il suffit d'ajouter le composant tabs.screen ...
//on importe la page dans le name = three mais on met pas l'extension