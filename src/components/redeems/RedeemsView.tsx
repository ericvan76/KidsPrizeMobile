import moment from 'moment';
import React from 'react';
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect, MapStateToProps } from 'react-redux';
import { signIn } from 'src/actions/auth';
import { createRedeem, fetchChildren, fetchMoreRedeems, refreshRedeems } from 'src/actions/child';
import { clearErrors } from 'src/actions/requestState';
import { Profile } from 'src/api/auth';
import { Child, Redeem } from 'src/api/child';
import { HeaderTitle } from 'src/components/common/HeaderTitle';
import { FooterIcon, HeaderIcon } from 'src/components/common/Icons';
import { ListEmptyComponent } from 'src/components/common/ListEmptyComponent';
import { SHARED_STYLES } from 'src/constants';
import { selectCurrentChild, selectCurrentChildRedeems } from 'src/selectors/child';
import { AppState, RequestState } from 'src/store';
import { displayErrors } from 'src/utils/error';
import { AddRedeemParams } from './AddRedeemView';

interface NavParams {
  onPressRight?(): void;
}

interface OwnProps {
  navigation: NavigationScreenProp<{ params: NavParams }>;
}

interface StateProps {
  profile: Profile | undefined;
  child: Child | undefined;
  redeems: Array<Redeem>;
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

class RedeemsViewInner extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: NavigationScreenProps) => {
    const params: NavParams = props.navigation.state.params || {};
    const openDrawer = () => props.navigation.navigate('DrawerOpen');
    return {
      headerLeft: <HeaderIcon name="menu" onPress={openDrawer} />,
      headerTitle: <HeaderTitle />,
      headerRight: <HeaderIcon name="plus" onPress={params.onPressRight} />,
      tabBarLabel: 'Redeems',
      tabBarIcon: (opt: { tintColor?: string }) => (
        <FooterIcon name="gift" color={opt.tintColor} />
      )
    };
  }

  private childSwitched = (otherProps: Props): boolean => {
    const currentId = this.props.child !== undefined ? this.props.child.id : undefined;
    const otherId = otherProps.child !== undefined ? otherProps.child.id : undefined;
    return currentId !== otherId;
  }

  private addRedeem = () => {
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
  }

  public componentWillMount(): void {
    this.props.navigation.setParams({
      onPressRight: this.addRedeem
    });
  }

  public componentDidMount(): void {
    if (this.props.child && this.props.redeems.length === 0) {
      this.props.refreshRedeems(this.props.child.id);
    }
  }

  public componentWillUpdate(nextProps: Props): void {
    if (this.childSwitched(nextProps)) {
      this.scrollToTop();
    }
  }

  public componentDidUpdate(prevProps: Props): void {
    if (Object.keys(this.props.requestState.errors).length > 0) {
      displayErrors(this.props.requestState.errors, this.props.clearErrors);
      return;
    }
    if (this.props.child && this.props.redeems.length === 0 && this.childSwitched(prevProps)) {
      this.props.refreshRedeems(this.props.child.id);
    }
  }

  private keyExtractor = (redeem: Redeem): string => {
    return redeem.timestamp;
  }

  private renderItem: ListRenderItem<Redeem> = (info: ListRenderItemInfo<Redeem>) => {
    const item = info.item;
    return (
      <ListItem
        containerStyle={styles.listItemContainer}
        wrapperStyle={styles.listItemWrapperStyle}
        // leftIcon={{ name: 'gift', type: 'material-community', style: styles.listItemIcon }}
        title={item.description}
        titleStyle={styles.listItemTitle}
        subtitle={moment(item.timestamp).format('DD-MMM-YYYY HH:mm')}
        subtitleStyle={styles.listItemSubtitle}
        rightTitle={item.value.toString()}
        rightTitleStyle={styles.listItemRightTitle}
        hideChevron={true}
      />
    );
  }

  private onRefresh = (): void => {
    if (this.props.child !== undefined) {
      this.props.refreshRedeems(this.props.child.id);
    }
  }
  private onEndReached = () => {
    if (this.props.child !== undefined) {
      this.props.fetchMoreRedeems(this.props.child.id);
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
  mapStateToProps, {
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
