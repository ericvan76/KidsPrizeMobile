import React, { Component } from 'react';
import { View, Text, ListView, RefreshControl, TouchableOpacity } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { Icon } from 'native-base';
import update from 'react-addons-update';

import Separator from './Seperator';
import theme from '../themes';
import dateUtil from '../utils/dateUtil';


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

class ScoreListView extends Component {

  static propTypes = {
    child: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      gender: React.PropTypes.string.isRequired
    }).isRequired,
    rows: React.PropTypes.objectOf(
      React.PropTypes.arrayOf(React.PropTypes.shape({
        task: React.PropTypes.string.isRequired,
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
          date: React.PropTypes.string.isRequired,
          value: React.PropTypes.number.isRequired
        })).isRequired
      }))).isRequired,
    actions: React.PropTypes.shape({
      refresh: React.PropTypes.func.isRequired,
      fetchMore: React.PropTypes.func.isRequired,
      setScore: React.PropTypes.func.isRequired
    }).isRequired,
    style: View.propTypes.style
  }


  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: createDataSource().cloneWithRowsAndSections(props.rows)
    };
  }
  renderSectionHeader(sectionData, sectionID) {
    const dates = dateUtil.allDaysOfWeek(sectionID).map(d => {
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
  onSetScore(childId, date, task, value) {
    this.props.actions.setScore(childId, date, task, value);
  }
  renderRow(row) {
    let stars = Array.from({
      length: 7
    }, (v, k) => k).map(i => {
      const value = row.items[i].value;
      const newValue = (value > 0) ?
        0 :
        1;
      const iconName = (value > 0) ?
        'ios-star' :
        'ios-star-outline';
      return (
        <TouchableOpacity
          key={i}
          onPress={() => this.onSetScore(this.props.child.id, row.items[i].date, row.task, newValue) }>
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
  onRefresh() {
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
  onEndReached() {
    this.props.actions.fetchMore(this.props.child.id);
  }
  componentWillReceiveProps(nextProps) {
    let ds = this.state.dataSource;
    if (nextProps.child.id !== this.props.child.id) {
      // create a new datasource for different child
      ds = createDataSource();
      this.refs.listView.scrollTo({ y: 0 });
    }
    this.setState(update(this.state, {
      dataSource: {
        $set: ds.cloneWithRowsAndSections(nextProps.rows)
      }
    }));
  }
  render() {
    const refreshControl =
      <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh() }/>;

    return (
      <ListView
        style={this.props.style}
        ref='listView'
        dataSource={this.state.dataSource}
        renderSectionHeader={(sectionData, sectionID) => this.renderSectionHeader(sectionData, sectionID)}
        renderRow={(rowData) => this.renderRow(rowData)}
        renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
        refreshControl={refreshControl}
        onEndReached={() => this.onEndReached()}
        onEndReachedThreshold={0}
        />
    );
  }
  scrollToTop() {
    this.refs.listView.scrollTo({ y: 0 });
  }
}

const styles = StyleSheet.create({
  // section
  section: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: theme.listDividerBg,
    paddingLeft: 5,
    paddingRight: 5

  },
  date: {
    width: '2.5rem',
    textAlign: 'center',
    fontSize: theme.subTitleFontSize,
    color: theme.subtitleColor
  },
  // row
  row: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5
  },
  task: {
    fontSize: '1rem'
  },
  starRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  star: {
    width: '2.5rem',
    fontSize: '2.5rem',
    textAlign: 'center'
  }
});

export default ScoreListView;