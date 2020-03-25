import { CONFIG } from 'src/config';
import { toQueryString } from 'src/utils/url';

export async function callApiAsync(
  authToken: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  uri: string,
  body?: {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const url: string = `${CONFIG.apiBaseUrl}/${uri}`;
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${authToken}`);
  const request: Request = new Request(
    `${url}`,
    {
      headers,
      method,
      body: body !== undefined ? JSON.stringify(body) : undefined
    }
  );
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }
  try {
    return await response.json();
  } catch (e) {
    return;
  }
}

export async function getPreferenceAsync(authToken: string): Promise<Preference> {
  return callApiAsync(authToken, 'GET', 'preference');
}

export async function setPreferenceAsync(authToken: string, preference: Preference): Promise<void> {
  return callApiAsync(authToken, 'PUT', 'preference', preference);
}

export async function getChildrenListAsync(authToken: string): Promise<Child[]> {
  return callApiAsync(authToken, 'GET', 'children');
}

export async function createChildAsync(
  authToken: string,
  childId: ChildId,
  name: string,
  gender: Gender,
  tasks: string[]
): Promise<ScoreResult> {
  return callApiAsync(authToken, 'POST', 'children', {
    childId,
    name,
    gender,
    tasks
  });
}

export async function deleteChildAsync(authToken: string, childId: ChildId): Promise<void> {
  return callApiAsync(authToken, 'DELETE', `children/${childId}`);
}

export async function updateChildAsync(
  authToken: string,
  childId: ChildId,
  name?: string,
  gender?: Gender,
  tasks?: string[]
): Promise<ScoreResult> {
  return callApiAsync(authToken, 'PUT', `children/${childId}`, {
    childId,
    name,
    gender,
    tasks
  });
}

export async function getScoresAsync(
  authToken: string,
  childId: ChildId,
  rewindFrom: WeekId,
  numOfWeeks: number
): Promise<ScoreResult> {
  const qs = toQueryString({
    rewindFrom,
    numOfWeeks: numOfWeeks.toString()
  });
  return callApiAsync(authToken, 'GET', `children/${childId}/scores?${qs}`);
}

export async function setScoreAsync(
  authToken: string,
  childId: ChildId,
  date: string,
  task: string,
  value: number
): Promise<void> {
  return callApiAsync(authToken, 'PUT', `children/${childId}/scores`, {
    childId,
    date,
    task,
    value
  });
}

export async function createRedeemAsync(
  authToken: string,
  childId: ChildId,
  description: string,
  value: number
): Promise<Redeem> {
  return callApiAsync(authToken, 'POST', `children/${childId}/redeems`, {
    childId,
    description,
    value
  });
}

export async function getRedeemsAsync(
  authToken: string,
  childId: ChildId,
  offset: number,
  limit: number
): Promise<Redeem[]> {
  const qs = toQueryString({
    limit: limit.toString(),
    offset: offset.toString()
  });
  return callApiAsync(authToken, 'GET', `children/${childId}/redeems?${qs}`);
}

export interface Preference {
  timeZoneOffset: number;
}

export type ChildId = string;
export type WeekId = string;
export type Gender = 'M' | 'F';

export interface Child {
  id: ChildId;
  name: string;
  gender: Gender;
  totalScore: number;
}

export interface ScoreResult {
  child: Child;
  weeklyScores: WeeklyScore[];
}

export interface WeeklyScore {
  week: WeekId;
  tasks: string[];
  scores: Score[];
}

export interface Score {
  date: string;
  task: string;
  value: number;
}

export interface Redeem {
  timestamp: string;
  description: string;
  value: number;
}
