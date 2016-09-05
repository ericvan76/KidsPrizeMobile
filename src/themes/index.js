import theme from './light';

export default Object.assign({}, theme, {
  // my themes and overrides

  listNote: {
    color: theme.listNoteColor,
    fontSize: theme.fontSizeBase,
    fontWeight: 'normal',
  },

  iconRight: {
    color: theme.listNoteColor,
    fontSize: theme.iconFontSize * 0.8,
    fontWeight: 'normal',
  }

});