/* @flow */
import React, { Component } from 'react';
import { Alert } from 'react-native';
import {
  Container, Content, Icon, Text, Left, Body, Right,
  ListItem, Separator, Thumbnail, StyleProvider
} from 'native-base';

import theme from '../theme';

import { logoutAsync } from '../actions/auth';
import { switchChild } from '../actions/child';
import { ChildEditorRoute } from '../routes';
import store from '../store';

import type { Profile } from '../types/auth.flow';
import type { Child } from '../types/api.flow';

type Props = {
  navigator: Object,
  drawer: Object,
  profile: Profile,
  childList: ?Array<Child>
};

class DrawerBar extends Component {

  props: Props;

  constructor(props: Props) {
    super(props);
  }

  getDisplayName(profile: Profile) {
    return profile.given_name || profile.nickname || profile.name || 'Unknown';
  }

  switchChild(id: string) {
    store.dispatch(switchChild(id));
    this.props.drawer._root.close();
  }

  addChild() {
    this.props.navigator.push(new ChildEditorRoute());
    this.props.drawer._root.close();
  }

  logout() {
    Alert.alert(
      'Confirm',
      'Are you sure you want to sign out?',
      [
        {
          text: 'No'
        }, {
          text: 'Yes', onPress: () => {
            store.dispatch(logoutAsync());
            this.props.drawer._root.close();
          }
        }
      ]
    );
  }

  renderChildRow(child: Child) {
    return (
      <ListItem key={child.id} icon onPress={this.switchChild.bind(this, child.id)}>
        <Left>
          <Icon name={child.gender === 'M' ? theme.icons.male : theme.icons.female} />
        </Left>
        <Body>
          <Text ellipsizeMode='tail' numberOfLines={1}>{child.name}</Text>
        </Body>
        <Right>
          <Text note>{child.totalScore}</Text>
        </Right>
      </ListItem>
    );
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <Container>
          <Content>
            <ListItem thumbnail last style={styles.header}>
              <Left>
                <Thumbnail round size={50} source={{ uri: this.props.profile.picture }} />
              </Left>
              <Body style={styles.headerBody}>
                <Text ellipsizeMode='tail' numberOfLines={1}>{this.getDisplayName(this.props.profile)}</Text>
                <Text note ellipsizeMode='middle' numberOfLines={1}>{this.props.profile.email}</Text>
              </Body>
              <Right />
            </ListItem>
            <Separator bordered>
              <Text note>CHILDREN</Text>
            </Separator>
            {this.props.childList && this.props.childList.map((child: Child) => this.renderChildRow(child))}
            <ListItem icon last
              onPress={this.addChild.bind(this)}>
              <Left>
                <Icon name={theme.icons.addChild} />
              </Left>
              <Body>
                <Text>Add Child</Text>
              </Body>
              <Right />
            </ListItem>
            <Separator bordered>
              <Text note>OTHERS</Text>
            </Separator>
            <ListItem icon last onPress={this.logout.bind(this)}>
              <Left>
                <Icon name={theme.icons.signOut} />
              </Left>
              <Body>
                <Text>Sign Out</Text>
              </Body>
              <Right />
            </ListItem>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = {
  header: {
    height: 100,
    paddingTop: 10
  },
  headerBody: {
    borderBottomColor: 'transparent'
  }
};

export default DrawerBar;