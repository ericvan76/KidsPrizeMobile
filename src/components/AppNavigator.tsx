import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChildDetailView, ChildDetailParams } from 'src/components/child/ChildDetailView';
import { DrawerView } from 'src/components/DrawerView';
import { RedeemsView } from 'src/components/redeems/RedeemsView';
import { ScoresView } from 'src/components/scores/ScoresView';
import { TextInputView, TextInputParams } from './common/TextInputView';
import { PickerView, PickerParams } from './common/PickerView';
import { TasksEditorView, TasksEditorParams } from './child/TasksEditorView';
import { AddRedeemView, AddRedeemParams } from './redeems/AddRedeemView';
import { COLORS, FONT_SIZES } from 'src/constants';
import { signIn } from 'src/actions/auth';
import { FooterIcon, HeaderIcon } from './common/Icons';
import { AppState } from 'src/store';
import { tryDisplayErrors } from 'src/utils/error';

const stackNavigationOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: COLORS.primary,
    borderBottomColor: COLORS.primary
  },
  headerTitleStyle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.large,
    fontFamily: 'Bold'
  },
  headerBackTitleVisible: false
};

export type RootStackParamList = {
  Home: undefined;
  ChildDetail: ChildDetailParams;
  TextInput: TextInputParams;
  Picker: PickerParams<unknown>;
  TaskEditor: TasksEditorParams;
  AddRedeem: AddRedeemParams;
};

export type TabStackParamList = {
  Scores: undefined;
  Redeems: undefined;
};

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator tabBarOptions={{
      style: {
        borderTopWidth: 0.5,
        borderTopColor: COLORS.primary,
        backgroundColor: COLORS.white,
        paddingVertical: 8,
        height: 56
      },
      labelStyle: { fontSize: FONT_SIZES.small, fontFamily: 'Regular' },
      activeTintColor: COLORS.primary,
      inactiveTintColor: COLORS.lightBorder
    }} >
      <Tab.Screen name="Scores" component={ScoresView} options={{
        tabBarLabel: 'Scores',
        tabBarIcon: (opt: { color: string }) => (
          <FooterIcon name="calendar-check" color={opt.color} />
        )
      }} />
      <Tab.Screen name="Redeems" component={RedeemsView} options={{
        tabBarLabel: 'Redeems',
        tabBarIcon: (opt: { color: string }) => (
          <FooterIcon name="gift" color={opt.color} />
        )
      }} />
    </Tab.Navigator>
  );
}

function Home() {
  return (
    <Drawer.Navigator
      drawerContent={() => <DrawerView />}
      drawerStyle={{ backgroundColor: COLORS.white }} >
      <Drawer.Screen name="Tabs" component={Tabs} />
    </Drawer.Navigator>
  );
}

const homeOptions = (props: { navigation: StackNavigationProp<RootStackParamList, 'Home'> }): StackNavigationOptions => {

  const { profile, title } = useSelector((state: AppState) =>
    ({
      profile: state.auth.profile,
      title: state.currentChild != null ? state.children[state.currentChild].child.name : ''
    })
  );

  const openDrawer = () => props.navigation.dispatch(DrawerActions.openDrawer());
  const openChildDetail = () => props.navigation.navigate('ChildDetail', {});
  return {
    headerLeft: () => <HeaderIcon name="menu" onPress={openDrawer} />,
    headerTitle: title, //<HeaderTitle />,
    headerRight: profile ? () => <HeaderIcon name="account-card-details" onPress={openChildDetail} /> : undefined
  };
};

export const AppContainer = () => {

  const { profile, requestState } = useSelector((state: AppState) => (
    {
      profile: state.auth.profile,
      requestState: state.requestState,
    }
  ));

  const [signing, setSigning] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (tryDisplayErrors(requestState.errors)) {
      return;
    }
    if (profile == null && !signing) {
      setSigning(true);
      dispatch(signIn(undefined));
    }
    if (profile != null && signing) {
      setSigning(false);
    }
  });

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={stackNavigationOptions}>
        <RootStack.Screen name="Home" component={Home} options={homeOptions} />
        <RootStack.Screen name="ChildDetail" component={ChildDetailView} options={ChildDetailView.WrappedComponent.navigationOptions} />
        <RootStack.Screen name="TextInput" component={TextInputView} options={TextInputView.navigationOptions} />
        <RootStack.Screen name="Picker" component={PickerView} options={PickerView.navigationOptions} />
        <RootStack.Screen name="TaskEditor" component={TasksEditorView} options={TasksEditorView.navigationOptions} />
        <RootStack.Screen name="AddRedeem" component={AddRedeemView} options={AddRedeemView.navigationOptions} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
