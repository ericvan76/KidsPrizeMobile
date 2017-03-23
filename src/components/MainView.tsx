import * as NB from 'native-base';

import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import * as routes from '../routes';
import theme from '../theme';
import { AppState, ChildState } from '../types/states';
import DrawerBar from './DrawerBar';
import ScoreList from './ScoreList';
import Spinner from './Spinner';

export interface OwnProps {
  navigator: RN.Navigator;
}

interface StateProps {
  childState?: ChildState;
}

interface DispatchProps {
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  isDrawerOpen: boolean;
}

class MainView extends React.PureComponent<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      isDrawerOpen: false
    };
  }

  private openDrawer = () => {
    if (!this.state.isDrawerOpen) {
      this.setState({
        ...this.state,
        isDrawerOpen: true
      });
    }
  }
  private closeDrawer = () => {
    if (this.state.isDrawerOpen) {
      this.setState({
        ...this.state,
        isDrawerOpen: false
      });
    }
  }

  private onEditChild = () => {
    this.props.navigator.push(
      routes.editChildRoute({ navigator: this.props.navigator, child: this.props.childState }));
  }
  private onViewRedeems = () => {
    this.props.navigator.push(
      routes.redeemListRoute({ navigator: this.props.navigator }));
  }

  private renderMain = () => {
    if (!this.props.childState) {
      return (
        <NB.Container>
          <NB.Header>
            <NB.Left>
              <NB.Button transparent onPress={this.openDrawer}>
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
            <NB.Button transparent onPress={this.openDrawer}>
              <NB.Icon name={theme.icons.menu} />
            </NB.Button>
          </NB.Left>
          <NB.Body>
            <NB.Title ellipsizeMode="tail" numberOfLines={1}>{this.props.childState.child.name}</NB.Title>
          </NB.Body>
          <NB.Right>
            <NB.Button transparent onPress={this.onEditChild}>
              <NB.Icon name={theme.icons.settings} />
            </NB.Button>
          </NB.Right>
        </NB.Header>
        {this.props.childState.scores.size === 0 && <Spinner />}
        <ScoreList childId={this.props.childState.child.id} />
        <NB.Footer>
          <NB.FooterTab>
            <NB.Button active>
              <NB.Icon name={theme.icons.tabMain} active />
              <NB.Text>Main</NB.Text>
            </NB.Button>
            <NB.Button onPress={this.onViewRedeems}>
              <NB.Icon name={theme.icons.tabRedeem} />
              <NB.Text>Redeem</NB.Text>
            </NB.Button>
          </NB.FooterTab>
        </NB.Footer>
      </NB.Container>
    );
  }

  private onTween = (ratio: number) => {
    return {
      drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
      main: { opacity: (2 - ratio) / 2 }
    };
  }

  public componentDidMount() {
    if (!this.props.childState) {
      this.openDrawer();
    }
  }

  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Drawer
          open={this.state.isDrawerOpen}
          onOpen={this.openDrawer}
          onClose={this.closeDrawer}
          type="overlay"
          content={<DrawerBar navigator={this.props.navigator} closeDrawer={this.closeDrawer} />}
          tapToClose
          openDrawerOffset={0.2}
          styles={{
            drawer: {
              shadowColor: '#000',
              shadowOpacity: 0.8,
              shadowRadius: 0
            }
          }}
          tweenHandler={this.onTween}
          negotiatePan>
          {this.renderMain()}
        </NB.Drawer>
      </NB.StyleProvider >
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState) => {
  return {
    childState: [...state.children.values()].find(c => c.isCurrent)
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch: Dispatch<AppState>) => {
  return bindActionCreators(
    {},
    dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(MainView);
