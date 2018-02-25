export const DATE_FORMAT = 'YYYY-MM-DD';
export const WEEKS_TO_LOAD = 4;
export const REDEEMS_TO_LOAD = 20;

export const COLORS = Object.freeze({
  primary: '#283593',
  secondary: '#5c6bc0',
  lightBorder: '#ccc',
  white: '#eee',
  error: '#d50000'
});

export const FONT_SIZES = Object.freeze({
  xlarge: 20,
  large: 18,
  medium: 16,
  small: 14,
  xsmall: 12
});

export const ICON_SIZE = 24;
export const DIVIDER_SIZE = 20;

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
    borderBottomColor: COLORS.lightBorder
  },
  listItemWrapperStyle: {
  },
  listItemIcon: {
    color: COLORS.secondary
  },
  listItemTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium
  },
  listItemSubtitle: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.small
  },
  listItemRightTitle: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.medium
  },
  listItemBadge: {
    backgroundColor: COLORS.secondary
  }
};
