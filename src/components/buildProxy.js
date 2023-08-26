const constructProxyURL = (proxy, link) => {
  const url = new URL('/get', proxy);
  url.searchParams.append('disableCache', true);
  url.searchParams.append('url', link);
  return url;
};
export default constructProxyURL;
