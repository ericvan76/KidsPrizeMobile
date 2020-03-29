import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Divider, ListItem } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import * as authAction from 'src/actions/auth';
import * as childAction from 'src/actions/child';
import { ChildDetailParams } from 'src/components/child/ChildDetailView';
import { BADGE_PROPS, COLORS, FONT_SIZES, SHARED_STYLES } from 'src/constants';
import { selectChildren } from 'src/selectors/child';
import { AppState } from 'src/store';
import Constants from 'expo-constants';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export const DrawerView = () => {

  const navigation = useNavigation();

  const { profile, children } = useSelector((state: AppState) => (
    {
      profile: state.auth.profile,
      children: selectChildren(state)
    }
  ));

  const dispatch = useDispatch();

  const signIn = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    dispatch(authAction.signIn(undefined));
  };

  const signOut = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to sign out?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes', onPress: async () => {
            navigation.dispatch(DrawerActions.closeDrawer());
            dispatch(authAction.signOut(undefined));
          }
        }
      ],
      { cancelable: false }
    );
  };

  const switchChild = (id: string) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    dispatch(childAction.switchChild(id));
  };

  const addChild = () => {
    const params: ChildDetailParams = {
      createNew: true
    };
    navigation.navigate('ChildDetail', params);
  };

  if (profile == null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          <ListItem
            onPress={signIn}
            title="Sign In"
            leftIcon={{ name: 'md-log-in', type: 'ionicon', iconStyle: styles.listItemIcon }}
            containerStyle={styles.listItemContainer}
            titleStyle={styles.listItemTitle}
          />
        </View>
        <View style={styles.bottom}>
          <Text style={styles.version}>{Constants.manifest.extra.semver}</Text>
        </View>
      </SafeAreaView>
    );
  } else {
    const onSwitches: (() => void)[] = children.map(c =>
      (): void => { switchChild(c.id); }
    );
    const { picture, name, nickname, given_name, email } = profile;
    const displayName = name || given_name || nickname;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          <ListItem
            leftAvatar={<Avatar rounded size="large" source={{ uri: picture }} />}
            title={displayName}
            subtitle={email}
            containerStyle={styles.listItemContainer}
            titleStyle={styles.listItemTitle}
            subtitleStyle={styles.listItemSubtitle}
          />
          <Divider style={styles.listDivider} />
          {
            children.map((c, i) => {
              return (
                <ListItem key={i}
                  onPress={onSwitches[i]}
                  title={c.name}
                  leftIcon={{ name: 'person', type: 'material', iconStyle: styles.listItemIcon }}
                  badge={{ value: c.totalScore, ...BADGE_PROPS }}
                  containerStyle={styles.listItemContainer}
                  titleStyle={styles.listItemTitle}
                />
              );
            })
          }
          <ListItem
            onPress={addChild}
            title="Add Child"
            leftIcon={{ name: 'person-add', type: 'material', iconStyle: styles.listItemIcon }}
            containerStyle={styles.listItemContainer}
            titleStyle={styles.listItemTitle}
          />
          <Divider style={styles.listDivider} />
          <ListItem
            onPress={signOut}
            title="Sign Out"
            leftIcon={{ name: 'md-log-out', type: 'ionicon', iconStyle: styles.listItemIcon }}
            containerStyle={styles.listItemContainer}
            titleStyle={styles.listItemTitle}
          />
        </View>
        <View style={styles.bottom}>
          <Text style={styles.version}>{Constants.manifest.extra.semver}</Text>
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  ...SHARED_STYLES,
  bottom: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  version: {
    color: COLORS.lightBorder,
    fontSize: FONT_SIZES.xsmall,
    fontFamily: 'Regular'
  }
});
