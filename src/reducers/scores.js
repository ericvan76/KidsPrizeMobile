import {ADD_CHILD, REMOVE_CHILD, UPDATE_SCORES} from '../actions';
import update from 'react-addons-update';

const scores = (state = {}, action) => {
  switch (action.type) {
    case ADD_CHILD:
      {
        return update(state, {
          $merge: {
            [action.id]: {
              total: 0,
              days: {}
            }
          }
        });
      }
    case REMOVE_CHILD:
      {
        return Object.keys(state).filter(key => key !== action.id).reduce((result, key) => {
          result[key] = state[key];
          return result;
        }, {});
      }
    case UPDATE_SCORES:
      {
        const earliest = action.days.map(d => d.date).sort()[0];
        return update(state, {
          [action.childId]: {
            earliest: {
              $apply: (e) => {
                if (earliest !== undefined && (e === undefined || earliest < e)) {
                  return earliest;
                }
                return e;
              }
            },
            total: {
              $set: action.total
            },
            days: {
              $merge: action.days.reduce((result, day) => {
                result[day.date] = day;
                return result;
              }, {})
            }
          }
        });
      }
    default:
      return state;
  }
};

export default scores;
