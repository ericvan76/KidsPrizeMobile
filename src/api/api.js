/* @flow */

import * as url from '../utils/url';
import { getAccessToken } from './token';
import config from '../__config__';

export async function callApi(uri: string, init?: Object = {}): Promise<any> {
  const access_token = await getAccessToken();
  const url = `${config.api.baseUrl}${uri}`;

  if (!init.headers) {
    init.headers = new Headers();
  }
  if (init.body) {
    init.body = JSON.stringify(init.body);
    init.headers.set('Content-Type', 'application/json');
  }
  init.headers.set('Authorization', `Bearer ${access_token}`);

  return await fetchOrThrow(url, init);
}

export async function fetchOrThrow(input: string, init?: Object): Promise<any> {
  try {
    const response = await fetch(input, init);
    if (response.ok) {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (err) {
    throw err;
  }
}

export async function getPreference(): Promise<Preference> {
  return await callApi('/preference');
}

export async function setPreference(preference: Preference): Promise<void> {
  return await callApi('/preference', {
    method: 'PUT',
    body: preference
  });
}

export async function listChildren(): Promise<Child[]> {
  return await callApi('/children');
}

export async function createChild(childId: string, name: string, gender: Gender, tasks: string[]): Promise<ScoreResult> {
  return await callApi('/children', {
    method: 'POST',
    body: {
      childId: childId,
      name: name,
      gender: gender,
      tasks: tasks
    }
  });
}

export async function deleteChild(childId: string) {
  return await callApi(`/children/${childId}`, {
    method: 'DELETE'
  });
}

export async function updateChild(childId: string, name: ?string, gender: ?Gender, tasks: ?string[]): Promise<ScoreResult> {
  let body: Object = {
    childId: childId
  };
  if (name) body = Object.assign(body, { name: name });
  if (gender) body = Object.assign(body, { gender: gender });
  if (tasks && tasks.length > 0) body = Object.assign(body, { tasks: tasks });
  return await callApi(`/children/${childId}`, {
    method: 'PUT',
    body: body
  });
}

export async function getScores(childId: string, rewindFrom: string, numOfWeeks: number): Promise<ScoreResult> {
  return await callApi(`/children/${childId}/scores?${url.encodeQueryString({
    rewindFrom: rewindFrom,
    numOfWeeks: numOfWeeks
  })}`);
}

export async function setScore(childId: string, date: string, task: string, value: number): Promise<ScoreResult> {
  return await callApi(`/children/${childId}/scores`, {
    method: 'PUT',
    body: {
      childId: childId,
      date: date,
      task: task,
      value: value
    }
  });
}

