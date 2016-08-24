import * as dateUtil from '../common/dateUtil';
import uuid from '../common/uuid';

const _defaultTasks = ['Task A', 'Task B', 'Task C', 'Task D'];

const children = [
  {
    id: uuid.v4(),
    name: 'Olivia',
    gender: 'F',
    tasks: _defaultTasks,
    total: 0,
    days: {}
  }, {
    id: uuid.v4(),
    name: 'Michael',
    gender: 'M',
    tasks: _defaultTasks,
    total: 0,
    days: {}
  }
];

const data = {
  user: {
    id: uuid.v4(),
    name: 'Eric'
  },
  children: children.reduce((result, child) => {
    result[child.id] = child;
    return result;
  }, {})
};

export const getUserInfo = () => {
  return Promise.resolve(data.user);
};

export const listChild = () => {
  const result = Object.values(data.children).map(c => {
    return {id: c.id, name: c.name, gender: c.gender, total: c.total, tasks: c.tasks};
  });
  return Promise.resolve(result);
};

export const addChild = (id, name, gender, tasks) => {
  const newChild = {
    id: id,
    name: name,
    gender: gender,
    total: 0,
    tasks: tasks
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
  if (day !== undefined && day.tasks[task] !== undefined) {
    const oldValue = day.tasks[task].value || 0;
    day.tasks[task].value = value;
    child.total = child.total + value - oldValue;
  } else {
    day = {
      date: date,
      tasks: _defaultTasks.reduce((result, t, idx) => {
        result[t] = {
          task: t,
          position: idx,
          value: t === task
            ? value
            : 0
        };
        return result;
      }, {})
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
    days: Array.from({
      length: numOfDays
    }, (v, k) => k).map(i => {
      let date = dateUtil.addDays(new Date(beforeDate), -1 * (i + 1)).toISOString();
      return child.days[date] || {
        date: date,
        tasks: _defaultTasks.reduce((result, t, idx) => {
          result[t] = {
            task: t,
            position: idx,
            value: 0
          };
          return result;
        }, {})
      };
    })
  };
  return Promise.resolve(result);
};
