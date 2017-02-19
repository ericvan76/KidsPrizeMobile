/* @flow */

import React, { Component } from 'react';
import { View, ListView, RefreshControl, TouchableOpacity } from 'react-native';
import { Icon, Text } from 'native-base';
import update from 'react-addons-update';
import moment from 'moment';

import Separator from './Seperator';
import theme from '../native-base-theme';

import type { ChildState, WeeklySectionState, TaskRowState } from '../types/states.flow';

function createDataSource() {
  return new ListView.DataSource({
    sectionHeaderHasChanged: () => {
      return false;
    },
    rowHasChanged: (r1: TaskRowState, r2: TaskRowState) => {
      return r1 !== r2;
    }
  });
}

type Props = {
  child: ChildState,
  refreshAsync: (childId: string) => void,
  fetchMoreAsync: (childId: string) => void,
  setScoreAsync: (childId: string, date: string, task: string, value: number) => void
};

type State = {
  refreshing: boolean,
  dataSource: any
};

class ScoreList extends Component {

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: createDataSource().cloneWithRowsAndSections(props.child.weeklyScores)
    };
  }

  renderSectionHeader(sectionData: WeeklySectionState, sectionID: string) {
    const week = sectionID;
    const dates = Array.from({ length: 7 }, (v, k) => k).map((i: number) => {
      const today = moment().format('YYYY-MM-DD');
      const mo = moment(week).day(i);
      const key = mo.format('YYYY-MM-DD');
      let month = '';
      if (mo.date() === 1) {
        month = `/${mo.month() + 1}`;
      }

      return (
        <Text key={key}
          style={{
            ...styles.sectionText,
            fontWeight: today === key ? 'bold' : 'normal'
          }}
        >{`${mo.format('ddd')}\n${mo.date()}${month}`}</Text>
      );
    });
    return (
      <View>
        <Separator key='s0' />
        <View
          style={styles.section}>{dates}</View>
        <Separator key='s1' />
      </View>
    );
  }

  renderRow(rowData: TaskRowState, sectionID: string, rowID: string) {
    const week = sectionID;
    const task = rowID;
    const stars = Array.from({ length: 7 }, (v, k) => k).map((i: number) => {
      const date = moment(week).day(i).format('YYYY-MM-DD');
      const value = rowData[date] || 0;
      const newValue = (value > 0) ? 0 : 1;
      return (
        <TouchableOpacity
          key={i}
          onPress={() => this.props.setScoreAsync(this.props.child.child.id, date, task, newValue)}>
          <Icon name='star' active={value > 0}
            style={styles.star} />
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={styles.row}>
        <Text large
          style={styles.task}
          ellipsizeMode='tail'
          numberOfLines={1}>{task}</Text>
        <View
          style={styles.starRow}>{stars}</View>
      </View>
    );
  }
  renderSeparator(sectionID: string, rowID: string) {
    return (<Separator key={`${sectionID}-${rowID}`} />);
  }
  onRefresh() {
    this.setState(update(this.state, {
      refreshing: {
        $set: true
      }
    }));
    this.props.refreshAsync(this.props.child.child.id);
    this.setState(update(this.state, {
      refreshing: {
        $set: false
      }
    }));
  }
  onEndReached() {
    this.props.fetchMoreAsync(this.props.child.child.id);
  }
  componentWillReceiveProps(nextProps: Props) {
    let ds = this.state.dataSource;
    if (nextProps.child.child.id !== this.props.child.child.id) {
      // create a new datasource for different child
      ds = createDataSource();
      this.refs.listView.scrollTo({ y: 0 });
    }
    this.setState(update(this.state, {
      dataSource: {
        $set: ds.cloneWithRowsAndSections(nextProps.child.weeklyScores)
      }
    }));
  }
  render() {
    const refreshControl =
      <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />;

    return (
      <ListView
        ref='listView'
        dataSource={this.state.dataSource}
        renderSectionHeader={(sectionData, sectionID) => this.renderSectionHeader(sectionData, sectionID)}
        renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
        renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
        refreshControl={refreshControl}
        onEndReached={this.onEndReached.bind(this)}
        onEndReachedThreshold={0}
      />
    );
  }
  scrollToTop() {
    this.refs.listView.scrollTo({ y: 0 });
  }
}

const styles = {
  section: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: theme.variables.listDividerBg,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5
  },
  sectionText: {
    width: theme.variables.starSize,
    textAlign: 'center',
    fontSize: theme.variables.noteFontSize,
    color: theme.variables.subtitleColor,
    lineHeight: theme.variables.subtitleLineHeight
  },
  row: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5
  },
  task: {
    margin: 5,
    marginBottom: 0
  },
  starRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  star: {
    color: theme.variables.starColor,
    width: theme.variables.starSize,
    fontSize: theme.variables.starSize,
    textAlign: 'center'
  }
};

export default ScoreList;