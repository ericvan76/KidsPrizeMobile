import moment from 'moment';
import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchScoresAsync, refreshAsync, setScoreAsync } from '../actions/scores';
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
  fetchScoresAsync: typeof fetchScoresAsync;
  setScoreAsync: typeof setScoreAsync;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  refreshing: boolean;
  dataSource: RN.ListViewDataSource;
}
interface SectionData {
  [week: string]: RowData;
}
interface RowData {
  [task: string]: Array<Score>;
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
    const getRowData = (dataBlob: ScoresState, sectionID: string, rowID: string) => {
      const secionData = dataBlob.get(sectionID);
      if (secionData) {
        return secionData.get(rowID);
      }
      return undefined;
    };
    const getSectionHeaderData = (dataBlob: ScoresState, sectionID: string) => {
      return dataBlob.get(sectionID);
    };
    const rowHasChanged = (prevRowData: RowData, nextRowData: RowData) => {
      return prevRowData !== nextRowData;
    };
    const sectionHeaderHasChanged = (prevSectionData: SectionData, nextSectionData: SectionData) => {
      return prevSectionData !== nextSectionData;
    };
    return new RN.ListView.DataSource({
      getRowData,
      getSectionHeaderData,
      rowHasChanged,
      sectionHeaderHasChanged
    });
  }

  private renderSectionHeader = (_: WeeklyState, sectionID: string) => {
    const week = sectionID as string;
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

  private renderRow = (rowData: TaskRow, sectionID: string, rowID: string) => {
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
  private renderSeparator = (sectionID: string, rowID: string) => {
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
    this.props.fetchScoresAsync(this.props.child.id);
  }
  private scrollToTop = () => {
    // tslint:disable-next-line:no-any
    (this.refs.listview as any).scrollTo({ y: 0, animated: true });
  }

  public componentDidMount() {
    this.setState({
      ...this.state,
      dataSource: this.state.dataSource.cloneWithRowsAndSections({}, [], [])
    });
  }
  public componentDidUpdate(prevProps: Props) {
    if (this.props.childId !== prevProps.childId) {
      if (this.props.scores.size === 0) {
        this.props.refreshAsync(this.props.child.id);
      } else {
        this.scrollToTop();
      }
    }
  }
  public componentWillReceiveProps(nextProps: Props) {
    const sectionIdentities: Array<string> = [];
    const rowIdentities: Array<Array<string>> = [];
    nextProps.scores.forEach((v, k) => {
      sectionIdentities.push(k);
      rowIdentities.push([...v.keys()]);
    });
    this.setState({
      ...this.state,
      dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.scores, sectionIdentities, rowIdentities)
    });
  }
  public render() {
    const refreshControl = <RN.RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />;
    return (
      <RN.ListView
        ref="listview"
        dataSource={this.state.dataSource}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        refreshControl={refreshControl}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0}
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
      fetchScoresAsync,
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
