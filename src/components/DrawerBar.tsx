import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppState } from '../types/states';

import { logoutAsync } from '../actions/auth';
import { switchChild } from '../actions/child';
import * as Constants from '../constants';
import * as routes from '../routes';
import theme from '../theme';
import { Child } from '../types/api';
import { Profile } from '../types/auth';

interface OwnProps {
  navigator: RN.Navigator;
  closeDrawer: () => void;
}

interface StateProps {
  profile: Profile;
  childList: Array<Child>;
}

interface DispatchProps {
  switchChild: typeof switchChild;
  logoutAsync: typeof logoutAsync;
}

class DrawerBar extends React.PureComponent<OwnProps & StateProps & DispatchProps, void> {

  private getDisplayName(profile: Profile) {
    return profile.given_name || profile.nickname || profile.name || 'Unknown';
  }

  private switchChild(id: string) {
    this.props.switchChild(id);
    this.props.closeDrawer();
  }

  private addChild() {
    this.props.closeDrawer();
    this.props.navigator.push(routes.editChildRoute({ navigator: this.props.navigator }));
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
            this.props.logoutAsync();
            this.props.closeDrawer();
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

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState) => {
  return {
    profile: state.auth.profile as Profile,
    childList: Object.keys(state.children).map(k => state.children[k].child)
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch): DispatchProps => {
  return bindActionCreators(
    {
      switchChild,
      logoutAsync
    },
    dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(DrawerBar);

const styles = {
  header: {
    height: 100,
    paddingTop: 10
  },
  headerBody: {
    borderBottomColor: 'transparent'
  }
};
