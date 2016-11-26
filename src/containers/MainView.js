/* @flow */

import React, { Component } from 'react';
import { Alert } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { Drawer, Container, Header, Title, Content, Button, Icon, Text, List, ListItem } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';
import * as childActions from '../actions/child';
import * as failureActions from '../actions/failure';
import ScoreListView from '../components/ScoreListView';
import ListItemDivider from '../components/ListItemDivider';
import Spinning from '../components/Spinning';
import { EditChildRoute, LoginRoute } from '../routes';
import theme from '../themes';

import type { AppState, AuthState, WeeklyScoresState } from '../types/states.flow';

type StoreProps = {
  auth: AuthState,
  childList: ?Array<Child>,
  child: ?Child,
  weeklyScores: WeeklyScoresState,
  errors: Error[]
}

type ActionProps = {
  switchChild: (childId: string) => void,
  getUserInfoAsync: () => void,
  listChildrenAsync: () => void,
  logoutAsync: () => void,
  refreshAsync: (childId: string) => void,
  fetchMoreAsync: (childId: string) => void,
  setScoreAsync: (childId: string, date: string, task: string, value: number) => void,
  resetFailure: () => void
};

type Props = StoreProps & ActionProps & {
  navigator: Object
}

class MainView extends Component {

  props: Props;

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    auth: React.PropTypes.object.isRequired,
    childList: React.PropTypes.arrayOf(React.PropTypes.object),
    child: React.PropTypes.object,
    weeklyScores: React.PropTypes.object,
    // actions
    switchChild: React.PropTypes.func.isRequired,
    getUserInfoAsync: React.PropTypes.func.isRequired,
    listChildrenAsync: React.PropTypes.func.isRequired,
    logoutAsync: React.PropTypes.func.isRequired,
    refreshAsync: React.PropTypes.func.isRequired,
    fetchMoreAsync: React.PropTypes.func.isRequired,
    setScoreAsync: React.PropTypes.func.isRequired,
    resetFailure: React.PropTypes.func.isRequired,
  };

  constructor(props: Props) {
    super(props);
  }

  renderDrawer() {
    let childrenRows = [];
    if (this.props.childList) {
      childrenRows = this.props.childList.map((c: Child) => {
        return (
          <ListItem key={c.id} iconLeft button
            onPress={() => {
              this.props.switchChild(c.id);
              this.refs.drawer.close();
            } }>
            <Icon name={c.gender === 'M' ? 'ios-man-outline' : 'ios-woman-outline'} />
            <Text>{c.name}</Text>
            <Text note style={theme.listNote}>{c.totalScore}</Text>
          </ListItem>
        );
      });
    }
    return (
      <Container theme={theme}>
        <Header>
          <Button transparent>
            <Icon name='ios-contact-outline' />
          </Button>
          <Title>{this.props.auth.user ? this.props.auth.user.name : ''}</Title>
        </Header>
        <Content>
          <List>
            <ListItemDivider title='CHILDREN' />
            {childrenRows}
            <ListItem iconLeft button
              onPress={() => {
                this.props.navigator.push(new EditChildRoute());
                this.refs.drawer.close();
              } }>
              <Icon name='ios-person-add-outline' />
              <Text>Add Child</Text>
            </ListItem>
            <ListItemDivider title='OTHERS' />
            <ListItem iconLeft button
              onPress={() => {
                this.props.logoutAsync();
                this.refs.drawer.close();
              } }>
              <Icon name='ios-exit-outline' />
              <Text>Sign Out</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.errors.length > 0 && nextProps.errors.length > 0) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    if (this.props.errors.length > 0) {
      Alert.alert(
        'Oops!',
        this.props.errors[0].message,
        [
          { text: 'OK', onPress: () => { this.props.resetFailure(); } }
        ]);
    }
    if (this.props.auth.initialised) {
      if (!this.props.auth.token) {
        this.props.navigator.push(new LoginRoute());
      } else if (!this.props.auth.user) {
        this.props.getUserInfoAsync();
      } else if (!this.props.childList) {
        this.props.listChildrenAsync();
      } else if (this.props.childList.length === 0) {
        this.refs.drawer.open();
      } else if (this.props.child && Object.keys(this.props.weeklyScores).length === 0) {
        this.props.refreshAsync(this.props.child.id);
      }
    }
  }

  render() {
    let mainElem = null;
    if (!this.props.auth.user || !this.props.childList) {
      mainElem = <Spinning />;
    } else if (!this.props.child || Object.keys(this.props.weeklyScores).length === 0) {
      mainElem = (
        <Container theme={theme}>
          <Header>
            <Button transparent onPress={() => this.refs.drawer.open()}>
              <Icon name='ios-menu' />
            </Button>
            <Title></Title>
          </Header>
          <Content horizontal={true} scrollEnabled={false}>
          </Content>
        </Container>
      );
    } else {
      mainElem = (
        <Container theme={theme}>
          <Header onPress={() => this.refs.listView.scrollToTop()} >
            <Button transparent onPress={() => this.refs.drawer.open()}>
              <Icon name='ios-menu' />
            </Button>
            <Title>{this.props.child.name}</Title>
            <Button transparent
              onPress={() => this.props.navigator.push(new EditChildRoute({ childId: this.props.child.id }))}>
              <Icon name='ios-settings-outline' />
            </Button>
          </Header>
          <Content horizontal={true} scrollEnabled={false}>
            <ScoreListView ref='listView' style={styles.listView}
              child={this.props.child}
              rows={this.props.weeklyScores}
              refreshAsync={this.props.refreshAsync}
              fetchMoreAsync={this.props.fetchMoreAsync}
              setScoreAsync={this.props.setScoreAsync} />
          </Content>
        </Container>
      );
    }
    return (
      <Drawer
        ref='drawer'
        type='overlay'
        content={this.renderDrawer()}
        tapToClose
        openDrawerOffset={0.2}
        styles={{
          drawer: {
            backgroundColor: theme.inverseTextColor,
            shadowColor: theme.shadowColor,
            shadowOpacity: theme.shadowOpacity,
            shadowRadius: 0
          }
        }}
        tweenHandler={(ratio: number) => {
          return {
            drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
            main: { opacity: (2 - ratio) / 2 },
          };
        } }
        negotiatePan>
        {mainElem}
      </Drawer>
    );
  }
}

const mapStateToProps = (state: AppState): StoreProps => {
  return {
    auth: state.auth,
    childList: state.children.isNotLoaded ? null : Object.keys(state.children).map(k => state.children[k].child),
    child: state.currentChild ? state.children[state.currentChild].child : null,
    weeklyScores: state.currentChild ? state.children[state.currentChild].weeklyScores : {},
    errors: state.errors
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators({
    ...authActions,
    ...childActions,
    ...failureActions
  }, dispatch);
};

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    width: '100%'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainView);