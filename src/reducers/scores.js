import update from 'react-addons-update';

import * as Types from '../actions/ActionTypes';
import dateUtil from '../utils/dateUtil';

export default function (state = {}, action) {
  switch (action.type) {
    case Types.ADD_CHILD:
      {
        return update(state, {
          $merge: {
            [action.id]: {
              total: 0,
              days: {},
              weeks: {}
            }
          }
        });
      }
    case Types.REMOVE_CHILD:
      {
        return Object.keys(state).filter(key => key !== action.id).reduce((result, key) => {
          result[key] = state[key];
          return result;
        }, {});
      }
    case Types.UPDATE_SCORES:
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
            },
            weeks: {
              //todo: performance enhancement
              $set: transform(Object.assign({}, state[action.childId].days, action.days.reduce((result, day) => {
                result[day.date] = day;
                return result;
              }, {})))
            }
          }
        });
      }
    default:
      return state;
  }
}

const transform = (dayScores) => {
  // group days by week
  const weekGroup = Object.values(dayScores).reduce((g, day) => {
    const week = dateUtil.firstDayOfWeek(new Date(day.date)).toISOString();
    if (g[week] === undefined) {
      g[week] = [day];
    } else {
      g[week].push(day);
    }
    return g;
  }, {});
  // build rows for each section (week)
  return Object.keys(weekGroup).sort().reverse().reduce((result, week) => {
    const days = weekGroup[week];
    // combine tasks in order
    const tasks = Object.values(days.reduce((r, d) => {
      return Object.values(d.tasks).reduce((r, t) => {
        r[t.task] = {
          task: t.task,
          pos: t.position
        };
        return r;
      }, r);
    }, {})).sort((x, y) => x.pos - y.pos).map(x => x.task);
    // build a row for each task
    result[week] = tasks.map(task => {
      return {
        week: week,
        task: task,
        items: dateUtil.allDaysOfWeek(week).map(d => {
          const date = d.toISOString();
          const existingRecord = days.find(d => d.date === date && d.tasks[task] !== undefined);
          let value = 0;
          if (existingRecord !== undefined) {
            value = existingRecord.tasks[task].value;
          }
          return { date: date, value: value };
        })
      };
    });
    return result;
  }, {});
};