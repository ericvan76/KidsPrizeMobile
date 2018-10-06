import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from 'src/constants';

interface Props {
  text?: string;
}

export const ListEmptyComponent: React.SFC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text || 'Nothing To Display'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10
  },
  text: {
    color: COLORS.lightBorder
  }
});
