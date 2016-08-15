import {Types} from '../actions';
import * as dateUtil from '../common/dateUtil';
import update from 'react-addons-update';

const generateMutation = (fromDate, numOfDays) => {
  let mutation = {};
  const tasks = ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'];
  for (let idx = 1; idx <= numOfDays; idx++) {
    const date = dateUtil.addDays(fromDate, -1 * idx);
    mutation[date.toISOString()] = {
      date: date,
      scores: Object.assign({}, ...tasks.map(task => {
        return {
          [task]: {
            task: task,
            value: 0
          }
        };
      }))
    };
  }
  return mutation;
};

const children = (state = {}, action) => {
  switch (action.type) {
    case Types.ADD_CHILD:
      {
        return update(state, {
          $merge: {
            [action.id]: {
              id: action.id,
              name: action.name,
              gender: action.gender,
              total: 0,
              days: {}
            }
          }
        });
      }
    case Types.REMOVE_CHILD:
      {
        return update(state, {
          $merge: {
            [action.id]: undefined
          }
        });
      }
    case Types.SELECT_CHILD:
      {
        return children(state, {
          type: Types.FETCH_UP,
          childId: action.id
        });
      }
    case Types.FETCH_UP:
      {
        const child = state[action.childId];
        const nextWeek = dateUtil.addDays(dateUtil.thisWeek(), 7);
        let numOfDays = 28;
        if (Object.keys(child.days).length > 0) {
          const latestDay = child.days[Object.keys(child.days).sort().reverse()[0]].date;
          const latestWeek = dateUtil.firstDayOfWeek(latestDay);
          const diffDays = dateUtil.substractAsDays(nextWeek, latestWeek);
          /* if (diffDays == 7) {
            return state;
          }*/
          numOfDays = Math.max(numOfDays, diffDays);
        }
        let mutation = generateMutation(nextWeek, numOfDays);
        return update(state, {
          [action.childId]: {
            days: {
              $merge: mutation
            }
          }
        });
      }
    case Types.FETCH_DOWN:
      {
        const child = state[action.childId];
        if (Object.keys(child.days).length === 0) {
          return children(state, {
            type: Types.FETCH_UP,
            childId: action.childId
          });
        }
        const earliestDay = child.days[Object.keys(child.days).sort()[0]].date;
        const earliestWeek = dateUtil.firstDayOfWeek(earliestDay);
        let mutation = generateMutation(earliestWeek, 28);
        return update(state, {
          [action.childId]: {
            days: {
              $merge: mutation
            }
          }
        });
      }
    case Types.SET_SCORE:
      {
        return update(state, {
          [action.childId]: {
            total: {
              $apply: x => (action.value === 1)
                ? x + 1
                : x - 1
            },
            days: {
              [action.date.toISOString()]: {
                scores: {
                  $merge: {
                    [action.task]: {
                      task: action.task,
                      value: action.value
                    }
                  }
                }
              }
            }
          }
        });
      }
    default:
      return state;
  }
};

export default children;
