import moment from 'moment';
import React from 'react';
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { connect, MapStateToProps } from 'react-redux';
import { signIn } from 'src/actions/auth';
import { createRedeem, fetchChildren, fetchMoreRedeems, refreshRedeems } from 'src/actions/child';
import { clearErrors } from 'src/actions/requestState';
import { Profile } from 'src/api/auth';
import { Child, Redeem } from 'src/api/child';
import { ListEmptyComponent } from 'src/components/common/ListEmptyComponent';
import { COLORS, SHARED_STYLES } from 'src/constants';
import { selectCurrentChild, selectCurrentChildRedeems } from 'src/selectors/child';
import { AppState, RequestState } from 'src/store';
import { tryDisplayErrors } from 'src/utils/error';
import { AddRedeemParams } from './AddRedeemView';
import { RootStackParamList } from '../AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

interface OwnProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

interface StateProps {
  profile: Profile | undefined;
  child: Child | undefined;
  redeems: Redeem[];
  requestState: RequestState;
}

interface DispatchProps {
  refreshRedeems: typeof refreshRedeems;
  fetchMoreRedeems: typeof fetchMoreRedeems;
  createRedeem: typeof createRedeem;
  clearErrors: typeof clearErrors;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
}

interface Snapshot {
  childSwitched: boolean;
}

class RedeemsViewInner extends React.PureComponent<Props, State> {

  public constructor(props: Props) {
    super(props);
  }

  private readonly addRedeem = () => {
    if (this.props.child) {
      const addRedeem: AddRedeemParams = {
        onSubmit: (description: string, value: number) => {
          if (this.props.child) {
            this.props.createRedeem({
              childId: this.props.child.id,
              description,
              value
            });
          }
        }
      };
      this.props.navigation.navigate('AddRedeem', addRedeem);
    }
  };

  public componentDidMount(): void {
    if (this.props.child && this.props.redeems.length === 0) {
      this.props.refreshRedeems(this.props.child.id);
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
    if (this.props.child && this.props.redeems.length === 0 && snapshot.childSwitched) {
      this.props.refreshRedeems(this.props.child.id);
    }
  }

  private readonly keyExtractor = (redeem: Redeem): string => {
    return redeem.timestamp;
  };

  private readonly renderItem: ListRenderItem<Redeem> = (info: ListRenderItemInfo<Redeem>) => {
    const item = info.item;
    return (
      <ListItem
        containerStyle={styles.listItemContainer}
        // leftIcon={{ name: 'gift', type: 'material-community', style: styles.listItemIcon }}
        title={item.description}
        titleStyle={styles.listItemTitle}
        subtitle={moment(item.timestamp)
          .format('DD-MMM-YYYY HH:mm')}
        subtitleStyle={styles.listItemSubtitle}
        rightTitle={item.value.toString()}
        rightTitleStyle={styles.listItemRightTitle}
      />
    );
  };

  private readonly onRefresh = (): void => {
    if (this.props.child !== undefined) {
      this.props.refreshRedeems(this.props.child.id);
    }
  };
  private readonly onEndReached = () => {
    if (this.props.child !== undefined) {
      this.props.fetchMoreRedeems(this.props.child.id);
    }
  };
  private readonly scrollToTop = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.refs.flatList as any).scrollToOffset({ offset: 0, animated: false });
  };

  public render(): JSX.Element {
    const refreshing =
      this.props.requestState.requesting[signIn.type] ||
      this.props.requestState.requesting[fetchChildren.type] ||
      this.props.requestState.requesting[refreshRedeems.type] || false;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          ref="flatList"
          style={styles.flatList}
          data={this.props.redeems}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.95}
          removeClippedSubviews={true}
          ListEmptyComponent={<ListEmptyComponent />}
        />
        <Button
          titleStyle={styles.buttonTitle}
          buttonStyle={[styles.button, { backgroundColor: COLORS.primary }]}
          title="Add Redeem"
          icon={{ name: 'plus', type: 'material-community', color: COLORS.white }}
          onPress={this.addRedeem} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState): StateProps => {
  const profile = state.auth.profile;
  const child = selectCurrentChild(state);
  const redeems = selectCurrentChildRedeems(state);
  const requestState = state.requestState;
  return {
    profile,
    child,
    redeems,
    requestState
  };
};

export const RedeemsView = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  {
    refreshRedeems,
    fetchMoreRedeems,
    createRedeem,
    clearErrors
  }
)(RedeemsViewInner);

const styles = StyleSheet.create({
  ...SHARED_STYLES,
  flatList: {
  },
  listItemContainer: {
    ...SHARED_STYLES.listItemContainer,
    marginLeft: -5
  }
});
