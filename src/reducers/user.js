import {Types} from '../actions';
import uuid from 'react-native-uuid';

const user = (state = {}, action) => {
  switch (action.type) {
    case Types.INITIALISE:
      {
        return {id: uuid.v4(), name: 'Eric Fan'};
      }
    case Types.SELECT_CHILD:
      {
        return Object.assign({}, state, {currentChildId: action.id});
      }
    default:
      return state;
  }
};

export default user;
