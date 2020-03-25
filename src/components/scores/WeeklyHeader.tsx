import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { COLORS, DATE_FORMAT, FONT_SIZES } from 'src/constants';
import { WeekId } from '../../api/child';

export const WeeklyHeader: React.SFC<{ weekId: WeekId }> = (props) => {

  interface DateObj {
    up: string;
    down: string;
    isToday: boolean;
  }

  const today = moment()
    .format(DATE_FORMAT);
  const dates: DateObj[] = [0, 1, 2, 3, 4, 5, 6].map((i: number) => {
    const mo = moment(`${props.weekId}T00:00:00Z`)
      .weekday(i);
    const up = mo.format('ddd');
    const d = mo.date();
    const down = d === 1 ? `${d}/${mo.month() + 1}` : `${d}`;
    const isToday = mo.format(DATE_FORMAT) === today;
    return {
      up,
      down,
      isToday
    };
  });

  return (
    <View style={styles.container}>
      {
        dates.map((d: DateObj, i: number) => {
          const style = d.isToday
            ? [styles.headerLabel, { textDecorationLine: 'underline' } as TextStyle]
            : styles.headerLabel;
          return (
            <View key={i}>
              <Text style={style}>{d.up}</Text>
              <Text style={style}>{d.down}</Text>
            </View>
          );
        })
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: COLORS.primary,
    borderTopStartRadius: 9,
    borderTopEndRadius: 9
  } as ViewStyle,
  headerLabel: {
    width: 36,
    textAlign: 'center',
    fontSize: FONT_SIZES.small,
    color: COLORS.white
  } as TextStyle
});
