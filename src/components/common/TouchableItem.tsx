/**
 * https://github.com/react-navigation/react-navigation/blob/master/src/views/TouchableItem.js
 *
 * TouchableItem renders a touchable that looks native on both iOS and Android.
 *
 * It provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity.
 *
 * On iOS you can pass the props of TouchableOpacity, on Android pass the props
 * of TouchableNativeFeedback.
 */
import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

const ANDROID_VERSION_LOLLIPOP = 21;

type Props = {
  onPress?(): void;
  delayPressIn?: number;
  borderless?: boolean;
  pressColor?: string;
  activeOpacity?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
};

export class TouchableItem extends React.PureComponent<Props> {
  public static defaultProps: Props = {
    borderless: true,
    pressColor: 'rgba(0, 0, 0, .32)',
    style: {
      paddingHorizontal: 15,
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: 'transparent'
    },
    delayPressIn: 0
  };

  public render(): JSX.Element {
    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      const { style, ...rest } = this.props;
      return (
        <TouchableNativeFeedback
          {...rest}
          background={TouchableNativeFeedback.Ripple(
            this.props.pressColor || '',
            this.props.borderless || false
          )}
        >
          <View style={style}>{React.Children.only(this.props.children)}</View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>
    );
  }
}
