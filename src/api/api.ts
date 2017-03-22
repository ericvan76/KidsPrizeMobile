import config from '../__config__';
import * as url from '../utils/url';
import { getBearerToken } from './token';

import { Child, Gender, Preference, Redeem, ScoreResult } from '../types/api';

// tslint:disable-next-line:no-any
export async function callApi(uri: string, init: RequestInit = {}): Promise<any> {
  const bearer = await getBearerToken();
  const url = `${config.api.baseUrl}${uri}`;

  if (!init.headers) {
    init.headers = new Headers();
  }
  if (init.body) {
    init.body = JSON.stringify(init.body);
    init.headers.set('Content-Type', 'application/json');
  }
  init.headers.set('Authorization', `Bearer ${bearer}`);
  return await fetchOrThrow(url, init);
}

// tslint:disable-next-line:no-any
export async function fetchOrThrow(input: string, init: RequestInit): Promise<any> {
  try {
    const response = await fetch(input, init);
    const text = await response.text();
    if (response.ok) {
      return text ? JSON.parse(text) : undefined;
    } else {
      throw new Error(`${response.status} ${text}`);
    }
  } catch (err) {
    throw new Error(`Error: ${err.message}`);
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

export async function listChildren(): Promise<Array<Child>> {
  return await callApi('/children');
}

export async function createChild(childId: string, name: string, gender: Gender, tasks: Array<string>): Promise<ScoreResult> {
  return await callApi('/children', {
    method: 'POST',
    body: {
      childId,
      name,
      gender,
      tasks
    }
  });
}

export async function deleteChild(childId: string) {
  return await callApi(`/children/${childId}`, {
    method: 'DELETE'
  });
}

export async function updateChild(childId: string, name?: string, gender?: Gender, tasks?: Array<string>): Promise<ScoreResult> {
  let body = {
    childId
  };
  if (name) { body = Object.assign(body, { name }); }
  if (gender) {
    body = Object.assign(body, { gender });
  }
  if (tasks && tasks.length > 0) {
    body = Object.assign(body, { tasks });
  }
  return await callApi(`/children/${childId}`, {
    method: 'PUT',
    body
  });
}

export async function getScores(childId: string, rewindFrom: string, numOfWeeks: number): Promise<ScoreResult> {
  const qs = url.encodeQueryString({
    rewindFrom,
    numOfWeeks: numOfWeeks.toString()
  });
  return await callApi(`/children/${childId}/scores?${qs}`);
}

export async function setScore(childId: string, date: string, task: string, value: number): Promise<ScoreResult> {
  return await callApi(`/children/${childId}/scores`, {
    method: 'PUT',
    body: {
      childId,
      date,
      task,
      value
    }
  });
}

export async function createRedeem(childId: string, description: string, value: number): Promise<Redeem> {
  return await callApi(`/children/${childId}/redeems`, {
    method: 'POST',
    body: {
      childId,
      description,
      value
    }
  });
}

export async function getRedeems(childId: string, limit: number, offset: number): Promise<Array<Redeem>> {
  const qs = url.encodeQueryString({
    limit: limit.toString(),
    offset: offset.toString()
  });
  return await callApi(`/children/${childId}/redeems?${qs}`);
}
