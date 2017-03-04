import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchMoreAsync, refreshAsync, setScoreAsync } from '../actions/child';
import * as routes from '../routes';
import theme from '../theme';
import { AppState, ChildState } from '../types/states';
import DrawerBar from './DrawerBar';
import ScoreList from './ScoreList';

export interface OwnProps {
  navigator: RN.Navigator;
}

interface StateProps {
  child?: ChildState;
}

interface DispatchProps {
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  openDrawer: boolean;
}

class MainView extends React.PureComponent<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      openDrawer: false
    };
  }

  private setDrawer(open: boolean) {
    if (this.state.openDrawer !== open) {
      this.setState({
        ...this.state,
        openDrawer: open
      });
    }
  }

  public componentDidMount() {
    if (!this.props.child) {
      this.setDrawer(true);
    }
  }

  private renderDrawer() {
    return (
      <DrawerBar navigator={this.props.navigator} closeDrawer={() => this.setDrawer(false)} />
    );
  }

  private renderMain() {
    if (!this.props.child) {
      return (
        <NB.Container>
          <NB.Header>
            <NB.Left>
              <NB.Button transparent onPress={() => this.setDrawer(true)}>
                <NB.Icon name={theme.icons.menu} />
              </NB.Button>
            </NB.Left>
          </NB.Header>
        </NB.Container>
      );
    }
    return (
      <NB.Container>
        <NB.Header>
          <NB.Left>
            <NB.Button transparent onPress={() => this.setDrawer(true)}>
              <NB.Icon name={theme.icons.menu} />
            </NB.Button>
          </NB.Left>
          <NB.Body>
            <NB.Title ellipsizeMode="tail" numberOfLines={1}>{this.props.child.child.name}</NB.Title>
            <NB.Text note>Total: {this.props.child.child.totalScore}</NB.Text>
          </NB.Body>
          <NB.Right>
            <NB.Button transparent onPress={() => {
              this.props.navigator.push(
                routes.editChildRoute({ navigator: this.props.navigator, child: this.props.child }));
            }}>
              <NB.Icon name={theme.icons.settings} />
            </NB.Button>
          </NB.Right>
        </NB.Header>
        <ScoreList childId={this.props.child.child.id} />
        <NB.Footer>
          <NB.FooterTab>
            <NB.Button active>
              <NB.Icon name={theme.icons.tabMain} active />
              <NB.Text>Main</NB.Text>
            </NB.Button>
            <NB.Button onPress={() => {
              this.props.navigator.push(
                routes.redeemListRoute({ navigator: this.props.navigator }));
            }}>
              <NB.Icon name={theme.icons.tabRedeem} />
              <NB.Text>Redeem</NB.Text>
            </NB.Button>
          </NB.FooterTab>
        </NB.Footer>
      </NB.Container>
    );
  }

  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Drawer
          open={this.state.openDrawer}
          onOpen={() => this.setDrawer(true)}
          onClose={() => this.setDrawer(false)}
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
          {this.renderMain()}
        </NB.Drawer>
      </NB.StyleProvider>
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState) => {
  return {
    child: Object.keys(state.children).map(k => state.children[k]).find(c => c.isCurrent)
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch: Dispatch<AppState>) => {
  return bindActionCreators(
    {
      refreshAsync,
      fetchMoreAsync,
      setScoreAsync
    },
    dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(MainView);

const styles = {
  drawer: {
    drawer: {
      backgroundColor: theme.variables.defaultBg,
      shadowColor: '#000',
      shadowOpacity: 0.8,
      shadowRadius: 0
    }
  }
};
