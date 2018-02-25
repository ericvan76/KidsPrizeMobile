import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setScore } from 'src/actions/child';
import { ChildId, Score, WeekId } from 'src/api/child';
import { COLORS, DATE_FORMAT, FONT_SIZES } from 'src/constants';

interface Props {
  childId: ChildId;
  weekId: WeekId;
  task: string;
  scores: Record<string, Score>;
  setScore: typeof setScore;
  last: boolean;
}

export const TaskRow: React.SFC<Props> = (props) => {
  const stars = Array.from({ length: 7 }, (_, k) => k).map((i: number) => {
    const date = moment(props.weekId).day(i).format(DATE_FORMAT);
    const score = props.scores[date];
    const value = score ? score.value : 0;
    const newValue = (value > 0) ? 0 : 1;
    const onPress = (): void => {
      props.setScore({
        childId: props.childId,
        date: date,
        task: props.task,
        value: newValue
      });
    };
    return (
      <TouchableOpacity key={i} onPress={onPress}>
        <MaterialCommunityIcons style={styles.star} name={value > 0 ? 'star' : 'star-outline'} />
      </TouchableOpacity>
    );
  });
  const rowStyle = props.last ? [styles.container, { borderBottomWidth: 0 }] : styles.container;
  return (
    <View style={rowStyle}>
      <Text style={styles.taskLabel} ellipsizeMode="tail" numberOfLines={1}>{props.task}</Text>
      <View style={styles.starRow}>{stars}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: COLORS.lightBorder,
    borderBottomWidth: 0.5
  },
  taskLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary
  },
  starRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  star: {
    textAlign: 'center',
    width: 36,
    fontSize: 32,
    color: COLORS.secondary
  }
});
