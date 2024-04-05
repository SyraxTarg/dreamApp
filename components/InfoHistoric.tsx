import React from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';

export default function InfoHistoric({ path }: { path: string }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
            Bienvenue dans votre historique de rêves !
            Tous les rêves que vous enregistrez apparaissent ici, du plus récent au plus ancien.
            En cliquant sur vos rêves, vous pouvez leur donner un tag ainsi que supprimer ceux que vous leur avez déjà donnés.
            En appuyant de manière insistante sur vos rêves, vous avez la possibilité de les supprimer.
            Lorsque vous enregistre un rêve, la descriotion de celui-ci est traitée, ce qui vous donne des explications sur certains concepts qui apparaissent dans vos rêves.
            N'hésitez pas à cliquer sur les liens pour plus d'informations sur certains concepts abordés. 
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
