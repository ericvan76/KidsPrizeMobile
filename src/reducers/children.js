import {ADD_CHILD, REMOVE_CHILD, UPDATE_SCORES} from '../actions';
import update from 'react-addons-update';

export default(state = {}, action) => {
  switch (action.type) {
    case ADD_CHILD:
      {
        return update(state, {
          $merge: {
            [action.child.id]: {
              id: action.child.id,
              name: action.child.name,
              gender: action.child.gender,
              total: action.child.total,
              days: {}
            }
          }
        });
      }
    case REMOVE_CHILD:
      {
        return update(state, {
          $merge: {
            [action.id]: undefined
          }
        });
      }
    case UPDATE_SCORES:
      {
        const earliest = action.scores.days.map(d => d.date).sort()[0];
        return update(state, {
          [action.scores.childId]: {
            earliest: {
              $apply: (e) => {
                if (earliest !== undefined && (e === undefined || earliest < e)) {
                  return earliest;
                }
                return e;
              }
            },
            total: {
              $set: action.scores.total
            },
            days: {
              $merge: Object.assign({}, ...action.scores.days.map(d => {
                return {
                  [d.date]: d
                };
              }))
            }
          }
        });
      }
    default:
      return state;
  }
};
