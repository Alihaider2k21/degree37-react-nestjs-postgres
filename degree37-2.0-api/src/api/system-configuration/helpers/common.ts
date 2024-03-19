export function getSubdomain(url: string) {
  if (!url) {
    return null;
  }
  const hostname = new URL(url).hostname;
  console.log('hostname', hostname);
  const parts = hostname.split('.');
  return parts.length > 3 ? parts[1] : parts[0];
}
