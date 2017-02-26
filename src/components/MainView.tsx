import moment from 'moment';
import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { logoutAsync } from '../actions/auth';
import {
  createRedeemAsync,
  fetchMoreAsync,
  getRedeemsAsync,
  listChildrenAsync,
  refreshAsync,
  setScoreAsync,
  switchChild
} from '../actions/child';
import { resetFailure } from '../actions/failure';
import * as routes from '../routes';
import theme from '../theme';
import { Child, Redeem } from '../types/api';
import { AppState, AuthState, ChildState } from '../types/states';
import { alert } from '../utils/alert';
import DrawerBar from './DrawerBar';
import ScoreList from './ScoreList';

interface StateProps {
  auth: AuthState;
  childList?: Array<Child>;
  child?: ChildState;
  errors: Array<Error>;
}

interface DispatchProps {
  switchChild: (childId?: string) => void;
  listChildrenAsync: () => void;
  logoutAsync: () => void;
  refreshAsync: (childId: string) => void;
  fetchMoreAsync: (childId: string) => void;
  setScoreAsync: (childId: string, date: string, task: string, value: number) => void;
  createRedeemAsync: (childId: string, description: string, value: number) => void;
  getRedeemsAsync: (childId: string) => void;
  resetFailure: () => void;
}

export interface OwnProps {
  navigator: RN.Navigator;
}

type Props = OwnProps & StateProps & DispatchProps;

type TabId = 'main' | 'redeem';

interface State {
  activeTab: TabId;
}

class MainView extends React.PureComponent<Props, State> {

  // tslint:disable-next-line:no-any
  private drawer: any;

  private openDrawer() {
    this.drawer._root.open();
  }

  private changeTab(tabId: TabId) {
    if (this.state.activeTab !== tabId) {
      this.setState({
        activeTab: tabId
      });
    }
  }
  public componentWillMount() {
    this.state = {
      activeTab: 'main'
    };
  }
  public componentDidMount() {
    if (this.props.errors.length > 0) {
      alert(this.props.errors);
    }
    this.props.listChildrenAsync();
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (this.props.errors.length > 0 && nextProps.errors.length !== 0) {
      return false;
    }
    return true;
  }

  public componentDidUpdate() {
    if (this.props.errors.length > 0) {
      alert(this.props.errors);
    } else if (!this.props.auth.profile) {
      this.props.navigator.replace(routes.launchRoute());
    } else if (this.props.childList && this.props.childList.length === 0) {
      this.openDrawer();
    } else if (this.props.child && Object.keys(this.props.child.weeklyScores).length === 0) {
      this.props.refreshAsync(this.props.child.child.id);
    }
  }

  private renderDrawer() {
    if (!this.props.auth.profile) {
      return <NB.Container></NB.Container>;
    }
    return (
      <DrawerBar
        navigator={this.props.navigator}
        drawer={this.drawer}
        profile={this.props.auth.profile}
        childList={this.props.childList}
      ></DrawerBar>
    );
  }

  private renderEmpty() {
    return (
      <NB.Container>
        <NB.Header>
          <NB.Left>
            <NB.Button transparent onPress={this.openDrawer.bind(this)}>
              <NB.Icon name={theme.icons.menu} />
            </NB.Button>
          </NB.Left>
        </NB.Header>
        <NB.Content contentContainerStyle={styles.spinnerContainer}>
          <NB.Spinner size="small" inverse animating={!this.props.childList} />
        </NB.Content>
      </NB.Container>
    );
  }

  private renderMain() {
    if (!this.props.child) {
      return undefined;
    }
    return (
      <NB.Container>
        <NB.Header>
          <NB.Left>
            <NB.Button transparent onPress={this.openDrawer.bind(this)}>
              <NB.Icon name={theme.icons.menu} />
            </NB.Button>
          </NB.Left>
          <NB.Body>
            <NB.Title ellipsizeMode="tail" numberOfLines={1}>{this.props.child.child.name}</NB.Title>
            <NB.Text note>Total: {this.props.child.child.totalScore}</NB.Text>
          </NB.Body>
          <NB.Right>
            <NB.Button transparent onPress={() =>
              this.props.navigator.push(routes.editChildRoute({ navigator: this.props.navigator, child: this.props.child }))}>
              <NB.Icon name={theme.icons.settings} />
            </NB.Button>
          </NB.Right>
        </NB.Header>
        <ScoreList
          style={styles.list}
          ref="listView"
          child={this.props.child}
          refreshAsync={this.props.refreshAsync}
          fetchMoreAsync={this.props.fetchMoreAsync}
          setScoreAsync={this.props.setScoreAsync} />
        {this.renderFooter()}
      </NB.Container >
    );
  }

  private renderRedeem() {
    if (!this.props.child) {
      return undefined;
    }
    return (
      <NB.Container>
        <NB.Header>
          <NB.Left>
            <NB.Button transparent onPress={this.changeTab.bind(this, 'main')}>
              <NB.Icon name={theme.icons.back} />
            </NB.Button>
          </NB.Left>
          <NB.Body>
            <NB.Title ellipsizeMode="tail" numberOfLines={1}>{this.props.child.child.name}</NB.Title>
            <NB.Text note>Available: {this.props.child.child.totalScore}</NB.Text>
          </NB.Body>
          <NB.Right>
            <NB.Button transparent onPress={() => {
              if (this.props.child) {
                const child = this.props.child.child;
                this.props.navigator.push(routes.addRedeemRoute({
                  navigator: this.props.navigator,
                  child,
                  onSubmit: (description: string, value: number) => {
                    this.props.createRedeemAsync(child.id, description, value);
                    this.props.navigator.pop();
                  }
                }));
              }
            }}>
              <NB.Text>Add</NB.Text>
            </NB.Button>
          </NB.Right>
        </NB.Header>
        <NB.List style={styles.list}
          dataArray={this.props.child.redeems}
          onEndReached={() => {
            if (this.props.child) {
              this.props.getRedeemsAsync(this.props.child.child.id);
            }
          }}
          onEndReachedThreshold={0}
          renderRow={(redeem: Redeem) =>
            <NB.ListItem>
              <NB.Body>
                <NB.Text ellipsizeMode="middle" numberOfLines={1}>{redeem.description}</NB.Text>
                <NB.Text note>{moment(redeem.timestamp).format('DD-MMM-YYYY HH:mm')}</NB.Text>
              </NB.Body>
              <NB.Right>
                <NB.Text>{redeem.value}</NB.Text>
              </NB.Right>
            </NB.ListItem>
          } />
        {this.renderFooter()}
      </NB.Container>
    );
  }

  private renderFooter() {
    if (!this.props.child) {
      return undefined;
    }
    return (
      <NB.Footer>
        <NB.FooterTab>
          <NB.Button active={this.state.activeTab === 'main'} onPress={this.changeTab.bind(this, 'main')}>
            <NB.Icon name={theme.icons.tabMain} active={this.state.activeTab === 'main'} />
            <NB.Text>Main</NB.Text>
          </NB.Button>
          <NB.Button active={this.state.activeTab === 'redeem'} onPress={() => {
            this.changeTab('redeem');
            if (this.props.child && this.props.child.redeems.length === 0) {
              this.props.getRedeemsAsync(this.props.child.child.id);
            }
          }}>
            <NB.Icon name={theme.icons.tabRedeem} active={this.state.activeTab === 'redeem'} />
            <NB.Text>Redeem</NB.Text>
          </NB.Button>
        </NB.FooterTab>
      </NB.Footer>
    );
  }

  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Drawer
          // tslint:disable-next-line:no-any
          ref={(c: any) => this.drawer = c}
          type="overlay"
          content={this.renderDrawer()}
          tapToClose
          openDrawerOffset={0.2}
          styles={styles.drawer}
          tweenHandler={(ratio: number) => {
            return {
              drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
              main: { opacity: (2 - ratio) / 2 }
            };
          }}
          negotiatePan>
          {this.props.child && Object.keys(this.props.child.weeklyScores).length > 0 ? (
            this.state.activeTab === 'main' ? this.renderMain() : this.renderRedeem()
          ) : this.renderEmpty()}
        </NB.Drawer>
      </NB.StyleProvider >
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState) => {
  return {
    auth: state.auth,
    childList: Object.keys(state.children).map(k => state.children[k].child),
    child: Object.keys(state.children).map(k => state.children[k]).find(c => c.isCurrent),
    errors: state.errors
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch: Dispatch<AppState>) => {
  return bindActionCreators(
    {
      switchChild,
      listChildrenAsync,
      logoutAsync,
      refreshAsync,
      fetchMoreAsync,
      setScoreAsync,
      createRedeemAsync,
      getRedeemsAsync,
      resetFailure
    },
    dispatch);
};

const styles = {
  list: {
    flex: 1
  },
  drawer: {
    drawer: {
      backgroundColor: theme.variables.defaultBg,
      shadowColor: '#000',
      shadowOpacity: 0.8,
      shadowRadius: 0
    }
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.variables.toolbarHeight
  } as RN.ViewStyle
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(MainView);
