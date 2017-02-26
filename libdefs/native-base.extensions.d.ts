import * as React from 'react-native';

declare module 'native-base' {

  namespace NativeBase {

    interface StyleProvider {
      style: Object;
    }
    interface Content {
      contentContainerStyle?: React.ViewStyle;
    }
    interface Left extends React.ViewProperties { }
    interface Body extends React.ViewProperties { }
    interface Right extends React.ViewProperties { }
    interface Button extends React.TouchableOpacityProperties {
      title?: undefined;
      transparent?: boolean;
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
    interface List extends React.ScrollViewProperties {
      ref?: any;
      dataSource?: undefined;
    }
    interface ListItem {
      last?: boolean;
      thumbnail?: boolean;
    }
    interface Text extends React.TextProperties { }
    interface Title extends Text { }
  }

  export class Form extends React.Component<NativeBase.Form, any>{ }
  export class StyleProvider extends React.Component<NativeBase.StyleProvider, any> { }
  export class Separator extends React.Component<NativeBase.Seperator, any> { }

}
