import * as React from 'react-native';

declare module 'native-base' {

  namespace NativeBase {

    interface StyleProvider {
      style: Object;
    }
    interface Content {
      contentContainerStyle?: React.ViewStyle
    }
    interface Left extends React.ViewProperties { }
    interface Body extends React.ViewProperties {
      headerStyle?: boolean;
    }
    interface Right extends React.ViewProperties { }
    interface Button extends React.TouchableOpacityProperties {
      title?: undefined;
      transparent?: boolean;
      deleteStyle?: boolean;
      light?: boolean;
    }
    interface Seperator {
      bordered?: boolean;
    }
    interface Picker {
      note?: boolean;
    }
    interface Badge {
      info?: boolean;
    }
    interface Icon {
      active?: boolean;
    }
    interface Text {
      large?: boolean;
    }
    interface Form {
    }
    interface Item {
      success?: boolean;
      error?: boolean;
    }
    interface Input extends React.TextInputProperties {
      ref?: any;
    }
    interface Picker extends React.PickerProperties {
      textStyle?: React.TextStyle
    }
    interface List extends React.ScrollViewProperties {
      ref?: any;
      dataSource?: undefined;
    }
    interface ListItem {
      last?: boolean;
      thumbnail?: boolean;
      headerStyle?: boolean;
    }
    interface Text extends React.TextProperties { }
    interface Title extends Text { }
  }

  export class Form extends React.Component<NativeBase.Form, any>{ }
  export class StyleProvider extends React.Component<NativeBase.StyleProvider, any> { }

  export function connectStyle<StyleProps, OwnProps>(
    name: string, componentStyle: {}
  ): { (component: React.ComponentClass<StyleProps>): React.ComponentClass<OwnProps> };

}
