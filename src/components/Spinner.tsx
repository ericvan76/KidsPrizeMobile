import * as NB from 'native-base';
import React from 'react';

interface Props {
  middle?: boolean;
}

class Spinner extends React.PureComponent<Props, void> {
  public render() {
    return (
      <NB.Spinner {...this.props} inverse size="small" />
    );
  }
}

export default Spinner;
