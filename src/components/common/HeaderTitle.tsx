import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { connect, MapStateToProps } from 'react-redux';
import { COLORS, FONT_SIZES, SHARED_STYLES } from 'src/constants';
import { selectCurrentChild } from 'src/selectors/child';
import { AppState } from 'src/store';

interface OwnProps { }
interface StateProps {
  title: string;
}
type Props = OwnProps & StateProps;

class HeaderTitleInner extends React.PureComponent<Props> {
  public render(): JSX.Element {
    return (
      <Text
        style={styles.title}
        numberOfLines={1}
        ellipsizeMode="tail"
      >{this.props.title}</Text>
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState): StateProps => {
  const child = selectCurrentChild(state);
  let title = '';
  if (child !== undefined) {
    title = child.name;
  }
  return {
    title
  };
};

export const HeaderTitle = connect<StateProps, {}, OwnProps>(
  mapStateToProps,
  {}
)(HeaderTitleInner);

const styles = StyleSheet.create({
  ...SHARED_STYLES,
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xlarge,
    fontFamily: 'Bold'
  }
});
