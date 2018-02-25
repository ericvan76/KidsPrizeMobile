import React from 'react';
import {
  DrawerNavigator,
  StackNavigator,
  TabNavigator
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

const TabNav = TabNavigator(
  {
    Scores: { screen: ScoresView },
    Redeems: { screen: RedeemsView }
  },
  {
    animationEnabled: false,
    swipeEnabled: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      style: {
        borderTopWidth: 0.5,
        borderTopColor: COLORS.secondary,
        backgroundColor: 'transparent'
      },
      tabStyle: {
        paddingTop: 8
      },
      labelStyle: {
        fontSize: FONT_SIZES.xsmall
      },
      activeTintColor: COLORS.primary,
      activeBackgroundColor: COLORS.secondary,
      inactiveTintColor: COLORS.secondary,
      inactiveBackgroundColor: 'transparent'
    }
  }
);

const StackNav = StackNavigator(
  {
    TabNav: { screen: TabNav },
    ChildDetail: { screen: ChildDetailView },
    TextInput: { screen: TextInputView },
    Picker: { screen: PickerView },
    TasksEditor: { screen: TasksEditorView },
    AddRedeem: { screen: AddRedeemView }
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: COLORS.primary,
        borderBottomColor: COLORS.primary
      },
      headerTitleStyle: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xlarge
      },
      headerBackTitle: null
    }
  }
);

export const AppNavigator = DrawerNavigator(
  {
    StackNav: { screen: StackNav }
  },
  {
    drawerBackgroundColor: COLORS.white,
    // tslint:disable-next-line:no-any
    contentComponent: (props: any) => <DrawerView navigation={props.navigation} />,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle'
    // tslint:disable-next-line:no-any
  } as any
);
