import moment from 'moment';
import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchMoreAsync, refreshAsync, setScoreAsync } from '../actions/scores';
import { DATE_FORMAT } from '../constants';
import theme from '../theme';
import { Child, Score } from '../types/api';
import { AppState, ChildState, ScoresState, TaskRow, WeeklyState } from '../types/states';

interface OwnProps {
  childId: string;
}
interface StateProps {
  child: Child;
  scores: ScoresState;
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

  private createDataSource = () => {
    return new RN.ListView.DataSource({
      sectionHeaderHasChanged: () => {
        return false;
      },
      rowHasChanged: (r1, r2) => {
        return r1 !== r2;
      }
    });
  }

  private renderSectionHeader = (_: WeeklyState, sectionID: RN.ReactText) => {
    const week = sectionID as number;
    const dates = [0, 1, 2, 3, 4, 5, 6].map((i: number) => {
      const today = moment().format(DATE_FORMAT);
      const mo = moment(week).day(i);
      const key = mo.format(DATE_FORMAT);
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

  private renderRow = (rowData: TaskRow, sectionID: RN.ReactText, rowID: RN.ReactText) => {
    const week = sectionID;
    const task = rowID.toString();
    const stars = Array.from({ length: 7 }, (_, k) => k).map((i: number) => {
      const date = moment(week).day(i).format(DATE_FORMAT);
      const score = rowData.find(s => s.date === date);
      const value = score ? score.value : 0;
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
  private renderSeparator = (sectionID: RN.ReactText, rowID: RN.ReactText) => {
    return <RN.View style={styles.separator} key={`${sectionID}-${rowID}`} />;
  }

  private onRefresh = () => {
    if (!this.state.refreshing) {
      this.setState({ ...this.state, refreshing: true });
      this.props.refreshAsync(this.props.child.id);
      this.setState({ ...this.state, refreshing: false });
    }
  }
  private onEndReached = () => {
    if (!this.state.refreshing) {
      this.setState({ ...this.state, refreshing: true });
      this.props.fetchMoreAsync(this.props.child.id);
      this.setState({ ...this.state, refreshing: false });
    }
  }

  private convertMapToObject = (scores: ScoresState) => {
    // todo: either find a better way to do this, or use Object in store.
    const objScores: { [week: string]: { [task: string]: Array<Score> } } = {};
    scores.forEach((v, k) => {
      const objRow: { [task: string]: Array<Score> } = {};
      v.forEach((v2, k2) => { objRow[k2] = v2; return objRow; });
      objScores[k] = objRow;
    });
    return objScores;
  }

  public componentDidMount() {
    this.setState({
      ...this.state,
      dataSource: this.state.dataSource.cloneWithRowsAndSections({})
    });
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({
      ...this.state,
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertMapToObject(nextProps.scores))
    });
  }

  public render() {
    const refreshControl =
      <RN.RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />;

    return (
      <RN.ListView
        dataSource={this.state.dataSource}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        refreshControl={refreshControl}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0}
        enableEmptySections={true}
      />
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState, ownProps: OwnProps) => {
  const childState = state.children.get(ownProps.childId) as ChildState;
  return {
    child: childState.child,
    scores: childState.scores
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
