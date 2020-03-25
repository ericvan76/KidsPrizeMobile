import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { COLORS, SHARED_STYLES } from 'src/constants';
import { HeaderIcon } from './Icons';
import { StackNavigationProp, StackNavigationOptions } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';
import { RouteProp } from '@react-navigation/native';

interface PickerItem<T> {
  name: string;
  value: T;
  icon: string;
  family?: string;
}

export interface PickerParams<T> {
  title?: string;
  items: PickerItem<T>[];
  selectedValue?: T;
  onSelect(value: T): void;
}

type TValue = unknown;

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Picker'>;
  route: RouteProp<RootStackParamList, 'Picker'>;
}

interface State {
  selectedValue?: TValue;
}

export class PickerView extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: Props): StackNavigationOptions => {
    const params = props.route.params;
    const goBack = () => props.navigation.goBack();
    return {
      headerLeft: () => <HeaderIcon name="close" onPress={goBack} />,
      headerTitle: params && params.title || 'Select',
      // drawerLockMode: 'locked-closed'
    };
  };

  public state: State = {
    selectedValue: this.props.route.params.selectedValue
  };

  private onSelect(selectedValue: TValue): void {
    this.setState((state: State) => ({
      ...state, selectedValue: selectedValue
    }));
    if (selectedValue !== this.props.route.params.selectedValue) {
      this.props.route.params.onSelect(selectedValue);
    }
    this.props.navigation.goBack();
  }

  public render(): JSX.Element {
    const { items } = this.props.route.params;
    const onPresses = items.map(item =>
      (): void => { this.onSelect(item.value); });
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          {
            items.map((item, i) => {
              const checkColor = item.value === this.state.selectedValue ? COLORS.primary : 'transparent';
              return (
                <ListItem
                  key={i}
                  onPress={onPresses[i]}
                  title={item.name}
                  leftIcon={{ name: item.icon, type: item.family, iconStyle: styles.listItemIcon }}
                  rightIcon={{ name: 'check', type: 'material', iconStyle: { color: checkColor } }}
                  containerStyle={styles.listItemContainer}
                  titleStyle={styles.listItemTitle}
                />
              );
            })
          }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  ...SHARED_STYLES
});
