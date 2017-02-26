declare module 'react-native-sortable-listview' {

  import * as React from 'react-native';

  interface SortableListViewProperties {
    style?: React.ScrollViewStyle;
    sortRowStyle?: React.ViewStyle;
    dataSource?: undefined;
    data: any;
    order: Array<any>;
    onRowMoved: (row: any) => void;
    renderRow: (row: any) => void;
  }

  class SortableListView extends React.Component<SortableListViewProperties, void>{ }

  export default SortableListView;
}
