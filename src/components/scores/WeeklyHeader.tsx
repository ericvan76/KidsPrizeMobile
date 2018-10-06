import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { COLORS, DATE_FORMAT, FONT_SIZES } from 'src/constants';
import { WeekId } from '../../api/child';

export const WeeklyHeader: React.SFC<{ weekId: WeekId }> = (props) => {

  interface DateObj {
    up: string;
    down: string;
    isToday: boolean;
  }

  const dates: Array<DateObj> = [0, 1, 2, 3, 4, 5, 6].map((i: number) => {
    const today = moment().format(DATE_FORMAT);
    const mo = moment(props.weekId).day(i);
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
            // tslint:disable-next-line:no-object-literal-type-assertion
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

// tslint:disable:no-object-literal-type-assertion
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: COLORS.primary
  },
  headerLabel: {
    width: 36,
    textAlign: 'center',
    fontSize: FONT_SIZES.small,
    color: COLORS.white
  } as TextStyle
});
// tslint:enable:no-object-literal-type-assertion
