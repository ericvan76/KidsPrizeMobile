export function toQueryString(data: { [key: string]: string }): string {
  return Object.keys(data).map((key: string): string => {
    return [key, data[key]]
      .map(encodeURIComponent).join('=');
  }).join('&');
}
