import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppState } from '../types/states';

import { logoutAsync } from '../actions/auth';
import { switchChild } from '../actions/children';
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

  private getDisplayName = (profile: Profile) => {
    return profile.given_name || profile.nickname || profile.name || 'Unknown';
  }

  private switchChild = (id: string) => {
    this.props.closeDrawer();
    this.props.switchChild(id);
  }

  private onAddChild = () => {
    this.props.closeDrawer();
    this.props.navigator.push(routes.editChildRoute({ navigator: this.props.navigator }));
  }

  private onLogout = () => {
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

  private renderChildRow = (child: Child) => {
    const onSwitchChild = () => this.switchChild(child.id);
    return (
      <NB.ListItem key={child.id} icon onPress={onSwitchChild}>
        <NB.Left>
          <NB.Icon name={theme.icons.face} />
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
            <NB.ListItem thumbnail last headerStyle>
              <NB.Left>
                <NB.Thumbnail circular size={50} source={{ uri: this.props.profile.picture }} />
              </NB.Left>
              <NB.Body headerStyle>
                <NB.Text ellipsizeMode="tail" numberOfLines={1}>{this.getDisplayName(this.props.profile)}</NB.Text>
                <NB.Text note ellipsizeMode="middle" numberOfLines={1}>{this.props.profile.email}</NB.Text>
              </NB.Body>
              <NB.Right />
            </NB.ListItem>
            <NB.ListItem itemDivider>
              <NB.Text note>CHILDREN</NB.Text>
            </NB.ListItem>
            {this.props.childList && this.props.childList.map((child: Child) => this.renderChildRow(child))}
            <NB.ListItem icon last onPress={this.onAddChild}>
              <NB.Left>
                <NB.Icon name={theme.icons.addChild} />
              </NB.Left>
              <NB.Body>
                <NB.Text>Add Child</NB.Text>
              </NB.Body>
            </NB.ListItem>
            <NB.ListItem itemDivider>
              <NB.Text note>OTHERS</NB.Text>
            </NB.ListItem>
            <NB.ListItem icon last onPress={this.onLogout}>
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
    childList: [...state.children.values()].map(c => c.child)
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
