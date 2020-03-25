export function toQueryString(data: { [key: string]: string }): string {
  return Object.keys(data)
    .map((key: string): string => [key, data[key]]
      .map(encodeURIComponent)
      .join('='))
    .join('&');
}
