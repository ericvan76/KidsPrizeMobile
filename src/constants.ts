import { TextStyle, ViewStyle } from 'react-native';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const WEEKS_PAGE_SIZE = 4;
export const REDEEMS_PAGE_SIZE = 20;

export const COLORS = Object.freeze({
  primary: '#1570a6',
  lightBorder: '#aaa',
  white: '#eee',
  error: '#f35e4c'
});

export const FONT_SIZES = Object.freeze({
  xlarge: 22,
  large: 20,
  medium: 18,
  small: 14,
  xsmall: 12
});

export const ICON_SIZE = 24;
export const DIVIDER_SIZE = 20;

interface BadgeProps {
  textStyle: TextStyle;
  badgeStyle: ViewStyle;
  containerStyle: ViewStyle;
}

export const BADGE_PROPS: BadgeProps = {
  textStyle: {
    fontSize: FONT_SIZES.small,
    fontFamily: 'Regular'
  },
  badgeStyle: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 5,
    height: 22,
    borderRadius: 11
  },
  containerStyle: {
  }
};

export const SHARED_STYLES = {
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  listContainer: {
    marginTop: 0,
    borderTopWidth: 0,
    backgroundColor: 'transparent'
  },
  listDivider: {
    backgroundColor: COLORS.lightBorder,
    height: DIVIDER_SIZE
  },
  listItemContainer: {
    borderTopWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightBorder,
    paddingVertical: 12
  } as ViewStyle,
  listItemIcon: {
    color: COLORS.primary
  } as ViewStyle,
  listItemTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
    fontFamily: 'Regular'
  },
  listItemSubtitle: {
    color: COLORS.lightBorder,
    fontSize: FONT_SIZES.small,
    fontFamily: 'Regular'
  },
  listItemRightTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
    fontFamily: 'Regular'
  },
  button: {
    borderRadius: 3,
    marginVertical: 10,
    marginHorizontal: 40
  },
  buttonTitle: {
    fontSize: FONT_SIZES.medium,
    fontFamily: 'Regular'
  } as TextStyle
};

