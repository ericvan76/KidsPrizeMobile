import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { connect, MapStateToProps } from 'react-redux';
import { signIn } from 'src/actions/auth';
import { fetchChildren, fetchMoreStores, refreshScores, setScore } from 'src/actions/child';
import { clearErrors } from 'src/actions/requestState';
import { Profile } from 'src/api/auth';
import { Child, WeeklyScore } from 'src/api/child';
import { FooterIcon } from 'src/components/common/Icons';
import { ListEmptyComponent } from 'src/components/common/ListEmptyComponent';
import { WeeklyScores } from 'src/components/scores/WeeklyScores';
import { SHARED_STYLES } from 'src/constants';
import { selectCurrentChild, selectCurrentChildScores } from 'src/selectors/child';
import { AppState, RequestState } from 'src/store';
import { tryDisplayErrors } from 'src/utils/error';

interface OwnProps {
  navigation: NavigationScreenProp<{}>;
}

interface StateProps {
  profile: Profile | undefined;
  child: Child | undefined;
  scores: Array<WeeklyScore>;
  requestState: RequestState;
}

interface DispatchProps {
  refreshScores: typeof refreshScores;
  fetchMoreStores: typeof fetchMoreStores;
  setScore: typeof setScore;
  clearErrors: typeof clearErrors;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
}

interface Snapshot {
  childSwitched: boolean;
}

class ScoresViewInner extends React.PureComponent<Props, State> {

  public static navigationOptions = () => {
    return {
      tabBarLabel: 'Scores',
      tabBarIcon: (opt: { tintColor?: string }) => (
        <FooterIcon name="calendar-check" color={opt.tintColor} />
      )
    };
  }

  public constructor(props: Props) {
    super(props);
    this.props.navigation.setParams({
      onPressRight: this.editChild
    });
  }

  private editChild = () => {
    if (this.props.child) {
      this.props.navigation.navigate('ChildDetail');
    }
  }

  public getSnapshotBeforeUpdate(prevProps: Props, _: State): Snapshot {
    const currentId = this.props.child !== undefined ? this.props.child.id : undefined;
    const prevId = prevProps.child !== undefined ? prevProps.child.id : undefined;
    return {
      childSwitched: currentId !== prevId
    };
  }

  public componentDidUpdate(_: Props, _2: State, snapshot: Snapshot): void {
    if (tryDisplayErrors(this.props.requestState.errors)) {
      return;
    }
    if (snapshot.childSwitched) {
      this.scrollToTop();
    }
    if (this.props.child && this.props.scores.length === 0) {
      this.props.refreshScores(this.props.child.id);
    }
  }

  private keyExtractor = (item: WeeklyScore): string => {
    return item.week;
  }
  private renderItem = (info: ListRenderItemInfo<WeeklyScore>): JSX.Element => {
    const item = info.item;
    return (
      <WeeklyScores
        style={styles.weekly}
        childId={this.props.child !== undefined ? this.props.child.id : ''}
        weeklyScore={item}
        setScore={this.props.setScore} />
    );
  }
  private onRefresh = () => {
    if (this.props.child !== undefined) {
      this.props.refreshScores(this.props.child.id);
    }
  }
  private onEndReached = () => {
    if (this.props.child !== undefined) {
      this.props.fetchMoreStores(this.props.child.id);
    }
  }
  private scrollToTop = () => {
    // tslint:disable-next-line:no-any
    (this.refs.flatList as any).scrollToOffset({ offset: 0, animated: false });
  }

  public render(): JSX.Element {
    const refreshing =
      this.props.requestState.requesting[signIn.type] ||
      this.props.requestState.requesting[fetchChildren.type] ||
      this.props.requestState.requesting[refreshScores.type] || false;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FlatList
          ref="flatList"
          style={styles.flatList}
          data={this.props.scores}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.95}
          removeClippedSubviews={true}
          ListEmptyComponent={<ListEmptyComponent />}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState): StateProps => {
  const profile = state.auth.profile;
  const child = selectCurrentChild(state);
  const scores = selectCurrentChildScores(state);
  const requestState = state.requestState;
  return {
    profile,
    child,
    scores,
    requestState
  };
};

export const ScoresView = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps, {
    refreshScores,
    fetchMoreStores,
    setScore,
    clearErrors
  }
)(ScoresViewInner);

// tslint:disable:no-object-literal-type-assertion
const styles = StyleSheet.create({
  ...SHARED_STYLES,
  flatList: {
  },
  weekly: {
    marginTop: 10,
    marginHorizontal: 10,
    shadowOpacity: 0.5,
    shadowOffset: { width: 3, height: 3 }
  } as ViewStyle
});
// tslint:enable:no-object-literal-type-assertion
