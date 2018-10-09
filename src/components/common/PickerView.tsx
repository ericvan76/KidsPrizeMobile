import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { COLORS, SHARED_STYLES } from 'src/constants';
import { HeaderIcon } from './Icons';

interface PickerItem<T> {
  name: string;
  value: T;
  icon: string;
  family?: string;
}

export interface PickerParams<T> {
  title?: string;
  items: Array<PickerItem<T>>;
  selectedValue?: T;
  onSelect(value: T): void;
}

// tslint:disable-next-line:no-any
type TValue = any;

interface Props {
  navigation: NavigationScreenProp<{ params: PickerParams<TValue> }>;
}

interface State {
  selectedValue?: TValue;
}

export class PickerView extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: NavigationScreenProps) => {
    const params = props.navigation.state.params as PickerParams<TValue>;
    const goBack = () => props.navigation.goBack();
    return {
      headerLeft: <HeaderIcon name="close" onPress={goBack} />,
      headerTitle: params && params.title || 'Select',
      drawerLockMode: 'locked-closed'
    };
  }

  public state: State = {
    selectedValue: this.props.navigation.state.params.selectedValue
  };

  private onSelect(selectedValue: TValue): void {
    this.setState((state: State) => ({
      ...state, selectedValue: selectedValue
    }));
    if (selectedValue !== this.props.navigation.state.params.selectedValue) {
      this.props.navigation.state.params.onSelect(selectedValue);
    }
    this.props.navigation.goBack();
  }

  public render(): JSX.Element {
    const { items } = this.props.navigation.state.params;
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
