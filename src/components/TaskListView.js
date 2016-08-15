import React, {Component} from 'react';
import {View, Text, ListView, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Seperator from '../components/Seperator';
import * as dateUtil from '../common/dateUtil';

const styles = StyleSheet.create({
  // section
  section: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: '#000000',
    paddingLeft: 5,
    paddingRight: 5
  },
  date: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#ffffff'
  },
  // row
  row: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5
  },
  task: {
    fontSize: 16
  },
  starRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  star: {
    width: 40,
    fontSize: 32,
    textAlign: 'center'
  }
});

export default class TaskListView extends Component {
  _buildDataSource() {
    const weekGroup = Object.values(this.props.child.days).reduce((g, day) => {
      const week = dateUtil.firstDayOfWeek(day.date).toISOString();
      if (g[week] === undefined) {
        g[week] = [day];
      } else {
        g[week].push(day);
      }
      return g;
    }, {});

    // build rows with section
    const rows = Object.keys(weekGroup).sort().reverse().reduce((rows, week) => {
      const days = weekGroup[week];
      const tasks = Object.keys(days[0].scores);
      rows[week] = tasks.map(task => {
        return {
          week: week,
          task: task,
          items: days.map(d => {
            return {date: d.date, value: d.scores[task].value};
          }).sort((x, y) => x.date.valueOf() - y.date.valueOf())
        };
      });
      return rows;
    }, {});

    let ds = new ListView.DataSource({
      sectionHeaderHasChanged: () => {
        return false;
      },
      rowHasChanged: (r1, r2) => {
        return [...new Array(7).keys()].every(i => r1.items[i].value === r2.items[i].value);
      }
    });
    return ds.cloneWithRowsAndSections(rows);
  }
  _renderSectionHeader(sectionData, sectionID) {
    const week = new Date(sectionID);
    let dates = [...new Array(7).keys()].map(i => {
      const d = dateUtil.addDays(week, i);
      const dayName = dateUtil.getWeekDayName(d.getUTCDay());
      const date = d.getUTCDate();
      let month = '';
      if (date === 1) {
        month = `/${d.getUTCMonth() + 1}`;
      }
      return (
        <Text style={styles.date} key={i}>{`${dayName}\n${date}${month}`}</Text>
      );
    });
    return (
      <View style={styles.section}>{dates}</View>
    );
  }
  _renderRow(row) {
    let stars = [...new Array(7).keys()].map(i => {
      const child = this.props.child;
      const task = row.task;
      const date = row.items[i].date;
      const value = row.items[i].value;
      const iconName = (value > 0)
        ? 'star'
        : 'star-o';
      const newValue = (value > 0)
        ? 0
        : 1;
      return (
        <TouchableHighlight
          key={i}
          underlayColor='white'
          onPress={() => this.props.actions.setScore(child.id, date, task, newValue)}>
          <Icon style={styles.star} name={iconName}/>
        </TouchableHighlight>
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
  _renderSeparator(sectionID, rowID) {
    return (<Seperator key={`${sectionID}-${rowID}`}/>);
  }
  render() {
    return (<ListView
      dataSource={this._buildDataSource()}
      renderSectionHeader={(sectionData, sectionID) => this._renderSectionHeader(sectionData, sectionID)}
      renderRow={(rowData) => this._renderRow(rowData)}
      renderSeparator={(sectionID, rowID) => this._renderSeparator(sectionID, rowID)}
      onEndReached={() => this.props.actions.fetchDown(this.props.child.id)}
      onEndReachedThreshold={-10}/>);
  }
}

TaskListView.propTypes = {
  child: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    gender: React.PropTypes.string.isRequired,
    total: React.PropTypes.number.isRequired,
    days: React.PropTypes.objectOf(React.PropTypes.shape({
      date: React.PropTypes.object.isRequired,
      scores: React.PropTypes.objectOf(React.PropTypes.shape({task: React.PropTypes.string.isRequired, value: React.PropTypes.number.isRequired}))
    })).isRequired
  }).isRequired,
  actions: React.PropTypes.object.isRequired
};
