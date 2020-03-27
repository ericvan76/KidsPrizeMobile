import { createSelector } from 'reselect';
import { Child, ChildId, Redeem, WeeklyScore } from 'src/api/child';
import { AppState, ChildState } from 'src/store';

export const selectChild = createSelector(
  (s: AppState) => s.children,
  (_: AppState, childId: ChildId | undefined) => childId,
  (
    children: Record<ChildId, ChildState>,
    childId: ChildId | undefined
  ): Child | undefined => {
    if (childId !== undefined && children[childId] !== undefined) {
      return children[childId].child;
    }
    return undefined;
  }
);

export const selectTasks = createSelector(
  (s: AppState) => s.children,
  (_: AppState, childId: ChildId | undefined) => childId,
  (
    children: Record<ChildId, ChildState>,
    childId: ChildId | undefined
  ): string[] | undefined => {
    if (childId !== undefined && children[childId] !== undefined) {
      const scores = children[childId].scores;
      const currentWeek = Object
        .keys(scores)
        .sort()
        .reverse()[0];
      if (scores[currentWeek] !== undefined) {
        return scores[currentWeek].tasks;
      }
    }
    return undefined;
  }
);

export const selectCurrentChild = createSelector(
  (s: AppState) => s.children,
  (s: AppState) => s.currentChild,
  (
    children: Record<ChildId, ChildState>,
    childId: ChildId | null
  ): Child | undefined => {
    if (childId !== null) {
      return children[childId].child;
    }
    return undefined;
  }
);

export const selectCurrentChildScores = createSelector(
  (s: AppState) => s.children,
  (s: AppState) => s.currentChild,
  (
    children: Record<ChildId, ChildState>,
    childId: ChildId | null
  ): WeeklyScore[] => {
    if (childId !== null && children[childId] !== undefined) {
      return Object
        .values(children[childId].scores)
        .sort((a: WeeklyScore, b: WeeklyScore) => a.week < b.week ? 1 : -1);
    }
    return [];
  }
);

export const selectCurrentChildRedeems = createSelector(
  (s: AppState) => s.children,
  (s: AppState) => s.currentChild,
  (
    children: Record<ChildId, ChildState>,
    childId: ChildId | null
  ): Redeem[] => {
    if (childId !== null && children[childId] !== undefined) {
      return Object
        .values(children[childId].redeems)
        .sort((a: Redeem, b: Redeem) => a.timestamp < b.timestamp ? 1 : -1);
    }
    return [];
  }
);

export const selectChildren = createSelector(
  (s: AppState) => s.children,
  (
    children: Record<ChildId, ChildState>
  ): Child[] => {
    return Object
      .values(children)
      .map(i => i.child);
  }
);
