import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Divider, List, ListItem } from 'react-native-elements';
import { NavigationAction, NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { connect, MapStateToProps } from 'react-redux';
import { signIn, signOut } from 'src/actions/auth';
import { switchChild } from 'src/actions/child';
import { Profile } from 'src/api/auth';
import { Child } from 'src/api/child';
import { ChildDetailParams } from 'src/components/child/ChildDetailView';
import { CONFIG } from 'src/config';
import { COLORS, FONT_SIZES, SHARED_STYLES } from 'src/constants';
import { selectChildren } from 'src/selectors/child';
import { AppState } from 'src/store';

interface OwnProps {
  navigation: NavigationScreenProp<NavigationRoute<void>, NavigationAction>;
}

interface StateProps {
  profile: Profile | undefined;
  children: Array<Child>;
}
interface DispatchProps {
  switchChild: typeof switchChild;
  signIn: typeof signIn;
  signOut: typeof signOut;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
}

class DrawerViewInner extends React.PureComponent<Props, State> {

  private switchChild = (id: string) => {
    this.props.navigation.navigate('DrawerClose');
    this.props.switchChild(id);
  }

  private signOut = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to sign out?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes', onPress: async () => {
            this.props.navigation.navigate('DrawerClose');
            this.props.signOut(undefined);
          }
        }
      ],
      { cancelable: false }
    );
  }

  private signIn = () => {
    this.props.navigation.navigate('DrawerClose');
    this.props.signIn(undefined);
  }

  private addChild = () => {
    const params: ChildDetailParams = {
      childId: undefined
    };
    this.props.navigation.navigate('ChildDetail', params);
  }

  public render(): JSX.Element {

    if (this.props.profile === undefined) {
      return (
        <SafeAreaView style={styles.container}>
          <List containerStyle={styles.listContainer}>
            <ListItem
              onPress={this.signIn}
              title="Sign In"
              leftIcon={{ name: 'md-log-in', type: 'ionicon', style: styles.listItemIcon }}
              containerStyle={styles.listItemContainer}
              titleStyle={styles.listItemTitle}
              chevronColor={COLORS.secondary}
            />
          </List>
        </SafeAreaView>
      );
    } else {
      const onSwitches: Array<() => void> = this.props.children.map(c =>
        (): void => { this.switchChild(c.id); }
      );
      const { picture, name, nickname, given_name, email } = this.props.profile;
      const displayName = name || given_name || nickname;

      return (
        <SafeAreaView style={styles.container}>
          <List containerStyle={styles.listContainer}>
            <ListItem
              hideChevron={true}
              roundAvatar
              avatar={<Avatar rounded large source={{ uri: picture }} />}
              title={displayName}
              subtitle={email}
              containerStyle={styles.listItemContainer}
              titleStyle={styles.listItemTitle}
              subtitleStyle={styles.listItemSubtitle}
            />
            <Divider style={styles.listDivider} />
            {
              this.props.children.map((c, i) => {
                return (
                  <ListItem key={i}
                    hideChevron={true}
                    onPress={onSwitches[i]}
                    title={c.name}
                    leftIcon={{ name: 'person', type: 'material', style: styles.listItemIcon }}
                    badge={{ value: c.totalScore, containerStyle: styles.listItemBadge }}
                    containerStyle={styles.listItemContainer}
                    titleStyle={styles.listItemTitle}
                  />
                );
              })
            }
            <ListItem
              onPress={this.addChild}
              title="Add Child"
              leftIcon={{ name: 'person-add', type: 'material', style: styles.listItemIcon }}
              containerStyle={styles.listItemContainer}
              titleStyle={styles.listItemTitle}
              chevronColor={COLORS.secondary}
            />
            <Divider style={styles.listDivider} />
            <ListItem
              onPress={this.signOut}
              title="Sign Out"
              leftIcon={{ name: 'md-log-out', type: 'ionicon', style: styles.listItemIcon }}
              containerStyle={styles.listItemContainer}
              titleStyle={styles.listItemTitle}
              chevronColor={COLORS.secondary}
            />
          </List>
          <Text style={styles.version}>{CONFIG.semver}</Text>
        </SafeAreaView>
      );
    }
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState): StateProps => {
  const profile = state.auth.profile;
  const children = selectChildren(state);
  return {
    profile,
    children
  };
};

export const DrawerView = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps, {
    switchChild,
    signIn,
    signOut
  }
)(DrawerViewInner);

const styles = StyleSheet.create({
  ...SHARED_STYLES,
  version: {
    color: COLORS.lightBorder,
    fontSize: FONT_SIZES.xsmall,
    textAlign: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 5
  }
});