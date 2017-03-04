import moment from 'moment';
import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchMoreAsync, refreshAsync, setScoreAsync } from '../actions/child';
import * as Constants from '../constants';
import theme from '../theme';
import { Child } from '../types/api';
import { AppState, TaskRowState, WeeklyScoresState, WeeklyState } from '../types/states';

interface OwnProps {
  childId: string;
}
interface StateProps {
  child: Child;
  weeklyScores: WeeklyScoresState;
}

interface DispatchProps {
  refreshAsync: typeof refreshAsync;
  fetchMoreAsync: typeof fetchMoreAsync;
  setScoreAsync: typeof setScoreAsync;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  refreshing: boolean;
  dataSource: RN.ListViewDataSource;
}

class ScoreList extends React.PureComponent<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: this.createDataSource()
    };
  }

  private createDataSource() {
    return new RN.ListView.DataSource({
      sectionHeaderHasChanged: () => {
        return false;
      },
      rowHasChanged: (r1: TaskRowState, r2: TaskRowState) => {
        return r1 !== r2;
      }
    });
  }

  private renderSectionHeader(_: WeeklyState, sectionID: RN.ReactText) {
    const week = sectionID.toString();
    // tslint:disable-next-line:no-shadowed-variable
    const dates = Array.from({ length: 7 }, (_, k) => k).map((i: number) => {
      const today = moment().format(Constants.DATE_FORMAT);
      const mo = moment(week).day(i);
      const key = mo.format(Constants.DATE_FORMAT);
      let month = '';
      if (mo.date() === 1) {
        month = `/${mo.month() + 1}`;
      }

      return (
        <NB.Text key={key}
          style={{
            ...styles.sectionText,
            fontWeight: today === key ? 'bold' : 'normal'
          }}
        >{`${mo.format('ddd')}\n${mo.date()}${month}`}</NB.Text>
      );
    });
    return (
      <RN.View>
        <RN.View style={styles.separator} />
        <RN.View style={styles.section}>{dates}</RN.View>
        <RN.View style={styles.separator} />
      </RN.View>
    );
  }

  private renderRow(rowData: TaskRowState, sectionID: RN.ReactText, rowID: RN.ReactText) {
    const week = sectionID.toString();
    const task = rowID.toString();
    const stars = Array.from({ length: 7 }, (_, k) => k).map((i: number) => {
      const date = moment(week).day(i).format(Constants.DATE_FORMAT);
      const value = rowData[date] || 0;
      const newValue = (value > 0) ? 0 : 1;
      return (
        <RN.TouchableOpacity
          key={i}
          onPress={() => this.props.setScoreAsync(this.props.child.id, date, task, newValue)}>
          <NB.Icon name="star" active={value > 0}
            style={styles.star} />
        </RN.TouchableOpacity>
      );
    });
    return (
      <RN.View style={styles.row}>
        <NB.Text large
          style={styles.task}
          ellipsizeMode="tail"
          numberOfLines={1}
        >{task}</NB.Text>
        <RN.View style={styles.starRow}>{stars}</RN.View>
      </RN.View>
    );
  }
  private renderSeparator(sectionID: RN.ReactText, rowID: RN.ReactText) {
    return <RN.View style={styles.separator} key={`${sectionID}-${rowID}`} />;
  }

  private onRefresh() {
    this.setState({ ...this.state, refreshing: true });
    this.props.refreshAsync(this.props.child.id);
    this.setState({ ...this.state, refreshing: false });
  }
  private onEndReached() {
    this.props.fetchMoreAsync(this.props.child.id);
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({
      ...this.state,
      dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.weeklyScores)
    });
  }

  public componentDidMount() {
    if (Object.keys(this.props.weeklyScores).length === 0) {
      this.onRefresh();
    }
  }

  public componentDidUpdate() {
    if (Object.keys(this.props.weeklyScores).length === 0) {
      this.onRefresh();
    }
  }

  public render() {
    const refreshControl =
      <RN.RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />;

    return (
      <RN.ListView
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
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps: OwnProps) => {
  const childState = state.children[ownProps.childId];
  return {
    child: childState.child,
    weeklyScores: childState.weeklyScores
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch) => {
  return bindActionCreators(
    {
      refreshAsync,
      fetchMoreAsync,
      setScoreAsync
    },
    dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ScoreList);

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
  } as RN.ViewStyle,
  sectionText: {
    width: theme.variables.starSize,
    textAlign: 'center',
    fontSize: theme.variables.noteFontSize,
    color: theme.variables.subtitleColor,
    lineHeight: theme.variables.subtitleLineHeight
  } as RN.TextStyle,
  row: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5
  } as RN.ViewStyle,
  task: {
    margin: 5,
    marginBottom: 0
  } as RN.TextStyle,
  starRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  } as RN.ViewStyle,
  star: {
    color: theme.variables.starColor,
    width: theme.variables.starSize,
    fontSize: theme.variables.starSize,
    textAlign: 'center'
  } as RN.TextStyle,
  separator: {
    height: theme.variables.borderWidth,
    alignSelf: 'stretch',
    backgroundColor: theme.variables.listDividerBg
  } as RN.ViewStyle
};
