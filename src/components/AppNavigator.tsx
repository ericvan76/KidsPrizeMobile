import { Constants } from 'expo';
import React from 'react';
import { Platform } from 'react-native';
import {
  createAppContainer,
  createBottomTabNavigator,
  createDrawerNavigator,
  createStackNavigator,
  NavigationScreenProps
} from 'react-navigation';
import { ChildDetailView } from 'src/components/child/ChildDetailView';
import { TasksEditorView } from 'src/components/child/TasksEditorView';
import { PickerView } from 'src/components/common/PickerView';
import { TextInputView } from 'src/components/common/TextInputView';
import { DrawerView } from 'src/components/DrawerView';
import { AddRedeemView } from 'src/components/redeems/AddRedeemView';
import { RedeemsView } from 'src/components/redeems/RedeemsView';
import { ScoresView } from 'src/components/scores/ScoresView';
import { COLORS, FONT_SIZES } from 'src/constants';
import { HeaderTitle } from './common/HeaderTitle';
import { HeaderIcon } from './common/Icons';

const TabNav = createBottomTabNavigator(
  {
    Scores: {
      screen: ScoresView
    },
    Redeems: {
      screen: RedeemsView
    }
  },
  {
    animationEnabled: false,
    swipeEnabled: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      style: {
        borderTopWidth: 0.5,
        borderTopColor: COLORS.primary,
        backgroundColor: COLORS.white
      },
      tabStyle: {
        paddingTop: 6
      },
      labelStyle: {
        fontSize: FONT_SIZES.small
      },
      activeTintColor: COLORS.primary,
      inactiveTintColor: COLORS.lightBorder
    }
  }
);

TabNav.navigationOptions = (props: NavigationScreenProps) => {
  const openDrawer = () => props.navigation.openDrawer();
  const openChildDetail = () => props.navigation.navigate('ChildDetail');
  return {
    headerLeft: <HeaderIcon name="menu" onPress={openDrawer} />,
    headerTitle: <HeaderTitle />,
    headerRight: <HeaderIcon name="account-card-details" onPress={openChildDetail} />
  };
};

const StackNav = createStackNavigator(
  {
    TabNav: { screen: TabNav },
    ChildDetail: { screen: ChildDetailView },
    TextInput: { screen: TextInputView },
    Picker: { screen: PickerView },
    TasksEditor: { screen: TasksEditorView },
    AddRedeem: { screen: AddRedeemView }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: COLORS.primary,
        borderBottomColor: COLORS.primary,
        // android status bar trick
        marginTop: Platform.select({ android: Constants.statusBarHeight * -1 })
      },
      headerTitleStyle: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xlarge
      },
      // tslint:disable-next-line: no-null-keyword
      headerBackTitle: null
    }
  }
);

const AppNavigator = createDrawerNavigator(
  {
    StackNav: { screen: StackNav }
  },
  {
    drawerBackgroundColor: COLORS.white,
    contentComponent: (props) => <DrawerView navigation={props.navigation} />
  }
);

export const AppContainer = createAppContainer(AppNavigator);
