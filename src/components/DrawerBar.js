/* @flow */
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Content, Icon, Text, List, ListItem, Thumbnail } from 'native-base';

import { logoutAsync } from '../actions/auth';
import { switchChild } from '../actions/child';
import ListItemDivider from './ListItemDivider';
import { EditChildRoute } from '../routes';
import store from '../store';
import theme from '../themes';

import type { Profile } from '../types/auth.flow';

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
    this.props.drawer.close();
  }

  addChild() {
    this.props.navigator.push(new EditChildRoute());
    this.props.drawer.close();
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
            this.props.drawer.close();
          }
        }
      ]
    );
  }

  render() {
    let childrenRows = [];
    if (this.props.childList) {
      childrenRows = this.props.childList.map((c: Child) => {
        return (
          <ListItem key={c.id} iconLeft button
            onPress={this.switchChild.bind(this, c.id)}>
            <Icon name={c.gender === 'M' ? 'ios-man-outline' : 'ios-woman-outline'} />
            <Text ellipsizeMode='tail' numberOfLines={1}>{c.name}</Text>
            <Text note style={theme.listNote}>{c.totalScore}</Text>
          </ListItem>
        );
      });
    }
    return (
      <Container theme={theme}>
        <Content>
          <List>
            <ListItem>
              <Thumbnail style={{ marginTop: 10, marginBottom: 10 }} round size={40} source={{ uri: this.props.profile.picture }} />
              <Text style={{ fontSize: theme.titleFontSize }}
                ellipsizeMode='tail' numberOfLines={1}>{this.getDisplayName(this.props.profile)}</Text>
              <Text note style={{ fontSize: theme.subTitleFontSize, lineHeight: Math.round(theme.lineHeight * 0.8) }}
                ellipsizeMode='middle' numberOfLines={1}>{this.props.profile.email}</Text>
            </ListItem>
            <ListItemDivider title='CHILDREN' />
            {childrenRows}
            <ListItem iconLeft button
              onPress={this.addChild.bind(this)}>
              <Icon name='ios-person-add-outline' />
              <Text>Add Child</Text>
            </ListItem>
            <ListItemDivider title='OTHERS' />
            <ListItem iconLeft button
              onPress={this.logout.bind(this)}>
              <Icon name='ios-log-out-outline' />
              <Text>Sign Out</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export default DrawerBar;