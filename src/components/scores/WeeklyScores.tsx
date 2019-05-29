import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { setScore } from 'src/actions/child';
import { ChildId, Score, WeeklyScore } from 'src/api/child';
import { COLORS } from 'src/constants';
import { TaskRow } from './TaskRow';
import { WeeklyHeader } from './WeeklyHeader';

interface Props {
  childId: ChildId;
  weeklyScore: WeeklyScore;
  setScore: typeof setScore;
  style: ViewStyle;
}

export class WeeklyScores extends React.PureComponent<Props> {

  public render(): JSX.Element {
    return (
      <View style={[styles.container, this.props.style]} >
        <WeeklyHeader weekId={this.props.weeklyScore.week} />
        <View style={styles.weeklyBody}>
          {
            this.props.weeklyScore.tasks.map((task: string, index: number) => {
              const scores = this.props.weeklyScore.scores
                .filter((s: Score) => s.task.toLowerCase() === task.toLowerCase())
                .reduce((p: Record<string, Score>, c: Score) => { p[c.date] = c; return p; }, {});
              const last = index === this.props.weeklyScore.tasks.length - 1;
              return (
                <TaskRow
                  last={last}
                  key={task}
                  childId={this.props.childId}
                  weekId={this.props.weeklyScore.week}
                  task={task}
                  scores={scores}
                  setScore={this.props.setScore}
                />
              );
            })
          }
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: COLORS.white
  },
  weeklyBody: {
    paddingTop: 2,
    paddingHorizontal: 5
  }
});
