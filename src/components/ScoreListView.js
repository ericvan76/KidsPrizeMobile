import React, {Component} from 'react';
import {
  View,
  Text,
  ListView,
  RefreshControl,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import update from 'react-addons-update';
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

const allDaysOfWeek = (week) => {
  const wk = new Date(week);
  return [...new Array(7).keys()].map(i => {
    return dateUtil.addDays(wk, i);
  });
};

const createDataSource = () => {
  return new ListView.DataSource({
    sectionHeaderHasChanged: () => {
      return false;
    },
    rowHasChanged: (r1, r2) => {
      return [...new Array(7).keys()].some(i => r1.items[i].value !== r2.items[i].value);
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
  _renderSectionHeader(sectionData, sectionID) {
    const dates = allDaysOfWeek(sectionID).map(d => {
      const dayName = dateUtil.getWeekDayName(d.getUTCDay());
      const date = d.getUTCDate();
      let month = '';
      if (date === 1) {
        month = `/${d.getUTCMonth() + 1}`;
      }
      return (
        <Text style={[styles.date, this.props.styles.sectionText]} key={d.toISOString()}>{`${dayName}\n${date}${month}`}</Text>
      );
    });
    return (
      <View style={[styles.section, this.props.styles.section]}>{dates}</View>
    );
  }
  _renderRow(row) {
    let stars = [...new Array(7).keys()].map(i => {
      const value = row.items[i].value;
      const newValue = (value > 0)
        ? 0
        : 1;
      const iconName = (value > 0)
        ? 'star'
        : 'star-o';
      return (
        <TouchableHighlight
          key={i}
          underlayColor='white'
          onPress={() => this.props.actions.setScore(this.props.child.id, row.items[i].date, row.task, newValue)}>
          <Icon style={[styles.star, this.props.styles.star]} name={iconName}/>
        </TouchableHighlight>
      );
    });
    return (
      <View style={[styles.row]}>
        <Text style={[styles.task, this.props.styles.task]} ellipsizeMode='tail' numberOfLines={1}>{row.task}</Text>
        <View style={styles.starRow}>
          {stars}
        </View>
      </View>
    );
  }
  _renderSeparator(sectionID, rowID) {
    return (<Seperator key={`${sectionID}-${rowID}`}/>);
  }
  _onRefresh() {
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
  _onEndReached() {
    this.props.actions.fetchMore(this.props.child.id);
  }
  componentWillReceiveProps(nextProps) {
    let ds = this.state.dataSource;
    if (nextProps.child.id !== this.props.child.id) {
      // create a new datasource for different child
      ds = createDataSource();
    }
    this.setState(update(this.state, {
      dataSource: {
        $set: ds.cloneWithRowsAndSections(buildDataRows(nextProps.scores))
      }
    }));
  }
  render() {
    const refreshControl = <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this._onRefresh()}/>;
    return (
      <ListView
        ref='listView'
        dataSource={this.state.dataSource}
        renderSectionHeader={(sectionData, sectionID) => this._renderSectionHeader(sectionData, sectionID)}
        renderRow={(rowData) => this._renderRow(rowData)}
        renderSeparator={(sectionID, rowID) => this._renderSeparator(sectionID, rowID)}
        refreshControl={refreshControl}
        onEndReached={() => this._onEndReached()}
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
  actions: React.PropTypes.shape({refresh: React.PropTypes.func.isRequired, fetchMore: React.PropTypes.func.isRequired, setScore: React.PropTypes.func.isRequired}).isRequired,
  styles: React.PropTypes.shape({section: React.PropTypes.number, sectionText: React.PropTypes.number, task: React.PropTypes.number, star: React.PropTypes.number})
};
