import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native';
import { NavigationAction, NavigationRoute, NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect, MapStateToProps } from 'react-redux';
import { fetchChildren, fetchMoreStores, refreshScores, setScore } from 'src/actions/child';
import { clearErrors } from 'src/actions/requestState';
import { Profile } from 'src/api/auth';
import { Child, WeeklyScore } from 'src/api/child';
import { ChildDetailParams } from 'src/components/child/ChildDetailView';
import { HeaderTitle } from 'src/components/common/HeaderTitle';
import { FooterIcon, HeaderIcon } from 'src/components/common/Icons';
import { WeeklyScores } from 'src/components/scores/WeeklyScores';
import { SHARED_STYLES } from 'src/constants';
import { selectCurrentChild, selectCurrentChildScores } from 'src/selectors/child';
import { AppState, RequestState } from 'src/store';
import { displayErrors } from 'src/utils/error';
import { signIn } from '../../actions/auth';

interface NavParams {
  onPressRight?(): void;
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute<NavParams>, NavigationAction>;
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

class ScoresViewInner extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: NavigationScreenProps<NavParams>) => {
    const params = props.navigation.state.params || {};
    const openDrawer = () => props.navigation.navigate('DrawerOpen');
    return {
      headerLeft: <HeaderIcon name="menu" onPress={openDrawer} />,
      headerTitle: <HeaderTitle />,
      headerRight: <HeaderIcon name="settings" onPress={params.onPressRight} />,
      tabBarLabel: 'Scores',
      tabBarIcon: (opt: { tintColor?: string }) => (
        <FooterIcon name="calendar-check" color={opt.tintColor} />
      )
    };
  }

  private childSwitched = (otherProps: Props): boolean => {
    const currentId = this.props.child !== undefined ? this.props.child.id : undefined;
    const otherId = otherProps.child !== undefined ? otherProps.child.id : undefined;
    return currentId !== otherId;
  }

  private editChild = () => {
    if (this.props.child) {
      const editorParams: ChildDetailParams = {
        childId: this.props.child.id
      };
      this.props.navigation.navigate('ChildDetail', editorParams);
    }
  }

  public componentWillMount(): void {
    this.props.navigation.setParams({
      onPressRight: this.editChild
    });
  }

  public componentWillUpdate(nextProps: Props): void {
    if (this.childSwitched(nextProps)) {
      this.scrollToTop();
    }
  }

  public componentDidUpdate(_: Props): void {
    if (this.props.profile === undefined || this.props.child === undefined) {
      return;
    }
    if (Object.keys(this.props.requestState.errors).length > 0) {
      displayErrors(this.props.requestState.errors, clearErrors);
      return;
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

const styles = StyleSheet.create({
  ...SHARED_STYLES,
  flatList: {
  },
  weekly: {
    marginTop: 10,
    marginHorizontal: 10,
    shadowOpacity: 0.5,
    shadowOffset: { width: 3, height: 3 }
  }
});
