import React, {Component} from 'react';
import {View, Text, ListView, RefreshControl, TouchableOpacity} from 'react-native';
import update from 'react-addons-update';
import StyleSheet from 'react-native-extended-stylesheet';

import Icon from './Icon';
import Separator from './Seperator';
import * as dateUtil from '../common/dateUtil';

const allDaysOfWeek = (week) => {
  const wk = new Date(week);
  return Array.from({
    length: 7
  }, (v, k) => k).map(i => {
    return dateUtil.addDays(wk, i);
  });
};

const createDataSource = () => {
  return new ListView.DataSource({
    sectionHeaderHasChanged: () => {
      return false;
    },
    rowHasChanged: (r1, r2) => {
      return Array.from({
        length: 7
      }, (v, k) => k).some(i => r1.items[i].value !== r2.items[i].value);
    }
  });
};

const buildDataRows = (scores) => {
  // group days by week
  const weekGroup = Object.values(scores.days).reduce((g, day) => {
    const week = dateUtil.firstDayOfWeek(new Date(day.date)).toISOString();
    if (g[week] === undefined) {
      g[week] = [day];
    } else {
      g[week].push(day);
    }
    return g;
  }, {});
  // build rows for each section (week)
  return Object.keys(weekGroup).sort().reverse().reduce((rows, week) => {
    const days = weekGroup[week];
    // combine tasks in order
    const tasks = Object.values(days.reduce((r, d) => {
      return Object.values(d.tasks).reduce((r, t) => {
        r[t.task] = {
          task: t.task,
          pos: t.position
        };
        return r;
      }, r);
    }, {})).sort((x, y) => x.pos - y.pos).map(x => x.task);
    // build a row for each task
    rows[week] = tasks.map(task => {
      return {
        week: week,
        task: task,
        items: allDaysOfWeek(week).map(d => {
          const date = d.toISOString();
          const existingRecord = days.find(d => d.date === date && d.tasks[task] !== undefined);
          let value = 0;
          if (existingRecord !== undefined) {
            value = existingRecord.tasks[task].value;
          }
          return {date: date, value: value};
        })
      };
    });
    return rows;
  }, {});
};

export default class ScoreListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: createDataSource().cloneWithRowsAndSections(buildDataRows(props.scores))
    };
  }
  renderSectionHeader(sectionData, sectionID) {
    const dates = allDaysOfWeek(sectionID).map(d => {
      const dayName = dateUtil.getWeekDayName(d.getUTCDay());
      const date = d.getUTCDate();
      let month = '';
      if (date === 1) {
        month = `/${d.getUTCMonth() + 1}`;
      }
      return (
        <Text style={styles.date} key={d.toISOString()}>{`${dayName}\n${date}${month}`}</Text>
      );
    });
    return (
      <View>
        <Separator key='s0'/>
        <View style={styles.section}>
          {dates}
        </View>
        <Separator key='s1'/>
      </View>
    );
  }
  handleSetScore(childId, date, task, value) {
    this.props.actions.setScore(childId, date, task, value);
  }
  renderRow(row) {
    let stars = Array.from({
      length: 7
    }, (v, k) => k).map(i => {
      const value = row.items[i].value;
      const newValue = (value > 0)
        ? 0
        : 1;
      const iconName = (value > 0)
        ? '#fa:star'
        : '#fa:star-o';
      return (
        <TouchableOpacity
          key={i}
          onPress={this.handleSetScore.bind(this, this.props.child.id, row.items[i].date, row.task, newValue)}>
          <Icon style={styles.star} name={iconName}/>
        </TouchableOpacity>
      );
    });
    return (
      <View style={styles.row}>
        <Text style={styles.task} ellipsizeMode='tail' numberOfLines={1}>{row.task}</Text>
        <View style={styles.starRow}>
          {stars}
        </View>
      </View>
    );
  }
  renderSeparator(sectionID, rowID) {
    return (<Separator key={`${sectionID}-${rowID}`}/>);
  }
  handleRefresh() {
    this.setState(update(this.state, {
      refreshing: {
        $set: true
      }
    }));
    this.props.actions.refresh(this.props.child.id);
    this.setState(update(this.state, {
      refreshing: {
        $set: false
      }
    }));
  }
  handleEndReached() {
    this.props.actions.fetchMore(this.props.child.id);
  }
  componentWillReceiveProps(nextProps) {
    let ds = this.state.dataSource;
    if (nextProps.child.id !== this.props.child.id) {
      // create a new datasource for different child
      ds = createDataSource();
      this.refs.listView.scrollTo({y: 0});
    }
    this.setState(update(this.state, {
      dataSource: {
        $set: ds.cloneWithRowsAndSections(buildDataRows(nextProps.scores))
      }
    }));
  }
  render() {
    const refreshControl = <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.handleRefresh()}/>;
    return (
      <ListView
        ref='listView'
        dataSource={this.state.dataSource}
        renderSectionHeader={(sectionData, sectionID) => this.renderSectionHeader(sectionData, sectionID)}
        renderRow={(rowData) => this.renderRow(rowData)}
        renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
        refreshControl={refreshControl}
        onEndReached={() => this.handleEndReached()}
        onEndReachedThreshold={0}></ListView>
    );
  }
  scrollToTop() {
    this.refs.listView.scrollTo({y: 0});
  }
}

ScoreListView.propTypes = {
  child: React.PropTypes.shape({id: React.PropTypes.string.isRequired, name: React.PropTypes.string.isRequired, gender: React.PropTypes.string.isRequired}).isRequired,
  scores: React.PropTypes.shape({
    total: React.PropTypes.number.isRequired,
    days: React.PropTypes.objectOf(React.PropTypes.shape({
      date: React.PropTypes.string.isRequired,
      tasks: React.PropTypes.objectOf(React.PropTypes.shape({task: React.PropTypes.string.isRequired, position: React.PropTypes.number.isRequired, value: React.PropTypes.number.isRequired}))
    })).isRequired
  }).isRequired,
  actions: React.PropTypes.shape({refresh: React.PropTypes.func.isRequired, fetchMore: React.PropTypes.func.isRequired, setScore: React.PropTypes.func.isRequired}).isRequired
};

const styles = StyleSheet.create({
  // section
  section: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: '$section.backgroundColor',
    paddingLeft: 5,
    paddingRight: 5
  },
  date: {
    width: '2.5rem',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '$normal.textColor'
  },
  // row
  row: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5
  },
  task: {
    fontSize: '1rem',
    color: '$normal.textColor'
  },
  starRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  star: {
    width: '2.5rem',
    fontSize: '2rem',
    textAlign: 'center',
    color: '$normal.textColor'
  }
});
