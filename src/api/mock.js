import uuid from 'react-native-uuid';
import * as dateUtil from '../common/dateUtil';

const tasks = ['Task A', 'Task B', 'Task C', 'Task D'];

const children = [
  {
    id: uuid.v4(),
    name: 'Olivia',
    gender: 'Female',
    total: 0,
    days: {}
  }, {
    id: uuid.v4(),
    name: 'Michael',
    gender: 'Male',
    total: 0,
    days: {}
  }
];

const data = {
  user: {
    id: uuid.v4(),
    name: 'Eric'
  },
  children: Object.assign({}, ...children.map(c => {
    return {
      [c.id]: c
    };
  }))
};

export const getUserInfo = () => {
  return Promise.resolve(data.user);
};

export const listChild = () => {
  const result = Object.values(data.children).map(c => {
    return {id: c.id, name: c.name, gender: c.gender, total: c.total};
  });
  return Promise.resolve(result);
};

export const addChild = (id, name, gender) => {
  const newChild = {
    id: id,
    name: name,
    gender: gender,
    total: 0
  };
  data.children[id] = Object.assign({}, newChild, {days: {}});
  return Promise.resolve(newChild);
};

export const removeChild = (id) => {
  delete data.children[id];
  return Promise.resolve();
};

export const setScore = (childId, date, task, value) => {
  const child = data.children[childId];
  let day = child.days[date];
  if (day !== undefined) {
    const oldValue = day.scores[task].value || 0;
    day.scores[task].value = value;
    child.total = child.total + value - oldValue;
  } else {
    day = {
      date: date,
      scores: Object.assign({}, ...tasks.map((t, i) => {
        return {
          [t]: {
            task: t,
            position: i,
            value: t === task
              ? value
              : 0
          }
        };
      }))
    };
    child.days[date] = day;
    child.total = child.total + value;
  }
  return Promise.resolve({childId: childId, total: child.total, days: [day]});
};

export const fetchScores = (childId, beforeDate, numOfDays) => {
  const child = data.children[childId];
  const result = {
    childId: childId,
    total: child.total,
    days: [...new Array(numOfDays).keys()].map(i => {
      let date = dateUtil.addDays(new Date(beforeDate), -1 * (i + 1)).toISOString();
      return child.days[date] || {
        date: date,
        scores: Object.assign({}, ...tasks.map((t, idx) => {
          return {
            [t]: {
              task: t,
              position: idx,
              value: 0
            }
          };
        }))
      };
    })
  };
  return Promise.resolve(result);
};
