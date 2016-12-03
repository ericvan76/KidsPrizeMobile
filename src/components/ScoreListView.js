/* @flow */

import React, { Component } from 'react';
import { View, ListView, RefreshControl, TouchableOpacity } from 'react-native';
import { Icon, Text } from 'native-base';
import update from 'react-addons-update';
import moment from 'moment';

import Separator from './Seperator';
import theme from '../themes';

import type { WeeklyScoresState, WeeklySectionState, TaskRowState } from '../types/states.flow';

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
  child: Child,
  rows: WeeklyScoresState,
  refreshAsync: (childId: string) => void,
  fetchMoreAsync: (childId: string) => void,
  setScoreAsync: (childId: string, date: string, task: string, value: number) => void,
  style: any
};

type State = {
  refreshing: boolean,
  dataSource: any
};

class ScoreListView extends Component {

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: createDataSource().cloneWithRowsAndSections(props.rows)
    };
  }

  renderSectionHeader(sectionData: WeeklySectionState, sectionID: string) {
    const week = sectionID;
    const dates = Array.from({ length: 7 }, (v, k) => k).map((i: number) => {
      const today = moment(Date.now()).format('YYYY-MM-DD');
      const mo = moment(Date.parse(week)).utc().day(i);
      const key = mo.format('YYYY-MM-DD');
      let month = '';
      if (mo.date() === 1) {
        month = `/${mo.month() + 1}`;
      }
      return (
        <Text
          style={{
            width: theme.starSize,
            textAlign: 'center',
            fontSize: theme.subTitleFontSize,
            color: theme.subtitleColor,
            lineHeight: theme.lineHeight * 0.8,
            fontWeight: today === key ? 'bold' : 'normal'
          }}
          key={key}
          >{`${mo.format('ddd')}\n${mo.date()}${month}`}</Text>
      );
    });
    return (
      <View>
        <Separator key='s0' />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'stretch',
            justifyContent: 'flex-end',
            backgroundColor: theme.listDividerBg,
            paddingLeft: 5,
            paddingRight: 5
          }}>{dates}</View>
        <Separator key='s1' />
      </View>
    );
  }

  renderRow(rowData: TaskRowState, sectionID: string, rowID: string) {
    const week = sectionID;
    const task = rowID;
    const stars = Array.from({ length: 7 }, (v, k) => k).map((i: number) => {
      const mo = moment(Date.parse(week)).utc().day(i);
      const date: string = mo.format('YYYY-MM-DD');
      const value = rowData[date] || 0;
      const newValue = (value > 0) ? 0 : 1;
      const iconName = (value > 0) ? 'ios-star' : 'ios-star-outline';
      return (
        <TouchableOpacity
          key={i}
          onPress={() => this.props.setScoreAsync(this.props.child.id, date, task, newValue)}>
          <Icon name={iconName}
            style={{
              width: theme.starSize,
              fontSize: theme.starSize,
              textAlign: 'center'
            }} />
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          paddingLeft: 5,
          paddingRight: 5
        }}>
        <Text large
          style={{
            margin: 5,
            marginBottom: 0,
            fontSize: theme.taskFontSize
          }}
          ellipsizeMode='tail'
          numberOfLines={1}>{task}</Text>
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>{stars}</View>
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
    this.props.refreshAsync(this.props.child.id);
    this.setState(update(this.state, {
      refreshing: {
        $set: false
      }
    }));
  }
  onEndReached() {
    this.props.fetchMoreAsync(this.props.child.id);
  }
  componentWillReceiveProps(nextProps: Props) {
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
      <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />;

    return (
      <ListView
        style={this.props.style}
        ref='listView'
        dataSource={this.state.dataSource}
        renderSectionHeader={(sectionData, sectionID) => this.renderSectionHeader(sectionData, sectionID)}
        renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
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

export default ScoreListView;