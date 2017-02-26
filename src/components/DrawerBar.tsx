import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';

import { logoutAsync } from '../actions/auth';
import { switchChild } from '../actions/child';
import * as Constants from '../constants';
import * as routes from '../routes';
import store from '../store';
import theme from '../theme';
import { Child } from '../types/api';
import { Profile } from '../types/auth';

export interface Props {
  navigator: RN.Navigator;
  // tslint:disable-next-line:no-any
  drawer: any; //NB.Drawer;
  profile: Profile;
  childList?: Array<Child>;
}

class DrawerBar extends React.PureComponent<Props, void> {

  private getDisplayName(profile: Profile) {
    return profile.given_name || profile.nickname || profile.name || 'Unknown';
  }

  private switchChild(id: string) {
    store.dispatch(switchChild(id));
    this.openDrawer();
  }

  private addChild() {
    this.props.navigator.push(routes.editChildRoute({ navigator: this.props.navigator }));
    this.closeDrawer();
  }

  private openDrawer() {
    this.props.drawer._root.open();
  }
  private closeDrawer() {
    this.props.drawer._root.close();
  }

  private logout() {
    RN.Alert.alert(
      'Confirm',
      'Are you sure you want to sign out?',
      [
        {
          text: 'No'
        }, {
          text: 'Yes', onPress: () => {
            store.dispatch(logoutAsync());
            this.closeDrawer();
          }
        }
      ]
    );
  }

  private renderChildRow(child: Child) {
    return (
      <NB.ListItem key={child.id} icon onPress={this.switchChild.bind(this, child.id)}>
        <NB.Left>
          <NB.Icon name={child.gender === Constants.GENDER_MALE ? theme.icons.male : theme.icons.female} />
        </NB.Left>
        <NB.Body>
          <NB.Text ellipsizeMode="tail" numberOfLines={1}>{child.name}</NB.Text>
        </NB.Body>
        <NB.Right>
          <NB.Text note>{child.totalScore}</NB.Text>
        </NB.Right>
      </NB.ListItem>
    );
  }

  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Container>
          <NB.Content>
            <NB.ListItem thumbnail last style={styles.header}>
              <NB.Left>
                <NB.Thumbnail circular size={50} source={{ uri: this.props.profile.picture }} />
              </NB.Left>
              <NB.Body style={styles.headerBody}>
                <NB.Text ellipsizeMode="tail" numberOfLines={1}>{this.getDisplayName(this.props.profile)}</NB.Text>
                <NB.Text note ellipsizeMode="middle" numberOfLines={1}>{this.props.profile.email}</NB.Text>
              </NB.Body>
              <NB.Right />
            </NB.ListItem>
            <NB.Separator bordered>
              <NB.Text note>CHILDREN</NB.Text>
            </NB.Separator>
            {this.props.childList && this.props.childList.map((child: Child) => this.renderChildRow(child))}
            <NB.ListItem icon last
              onPress={this.addChild.bind(this)}>
              <NB.Left>
                <NB.Icon name={theme.icons.addChild} />
              </NB.Left>
              <NB.Body>
                <NB.Text>Add Child</NB.Text>
              </NB.Body>
            </NB.ListItem>
            <NB.Separator bordered>
              <NB.Text note>OTHERS</NB.Text>
            </NB.Separator>
            <NB.ListItem icon last onPress={this.logout.bind(this)}>
              <NB.Left>
                <NB.Icon name={theme.icons.signOut} />
              </NB.Left>
              <NB.Body>
                <NB.Text>Sign Out</NB.Text>
              </NB.Body>
              <NB.Right />
            </NB.ListItem>
          </NB.Content>
        </NB.Container>
      </NB.StyleProvider>
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
