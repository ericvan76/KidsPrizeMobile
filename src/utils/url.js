/* @flow */

export function encodeQueryString(data: Object): string {
  return Object.keys(data).map((key: string): string => {
    return [key, data[key]]
      .map(encodeURIComponent).join('=');
  }).join('&');
}

