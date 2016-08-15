export const Types = {
  INITIALISE: 'INITIALISE',
  ADD_CHILD: 'ADD_CHILD',
  REMOVE_CHILD: 'REMOVE_CHILD',
  SELECT_CHILD: 'SELECT_CHILD',
  FETCH_UP: 'FETCH_UP',
  FETCH_DOWN: 'FETCH_DOWN',
  SET_SCORE: 'SET_SCORE'
};

export const Actions = {
  initialise: () => {
    return {type: Types.INITIALISE};
  },
  addChild: (id, name, gender) => {
    return {type: Types.ADD_CHILD, id: id, name: name, gender: gender};
  },
  removeChild: (id) => {
    return {type: Types.REMOVE_CHILD, id: id};
  },
  selectChild: (id) => {
    return {type: Types.SELECT_CHILD, id: id};
  },
  fetchUp: (childId) => {
    return {type: Types.FETCH_UP, childId: childId};
  },
  fetchDown: (childId) => {
    return {type: Types.FETCH_DOWN, childId: childId};
  },
  setScore: (childId, date, task, value) => {
    return {type: Types.SET_SCORE, childId: childId, date: date, task: task, value: value};
  }
};
