const takePosts = (domTree) => {
  const items = domTree.querySelectorAll('channel > item');
  if (!items) {
    return null;
  }
  return Array.from(items)
    .map((item) => {
      const titleElem = item.querySelector('title');
      const guidElem = item.querySelector('guid');
      const linkElem = item.querySelector('link');
      const descriptionElem = item.querySelector('description');

      const title = titleElem.textContent;
      const guid = guidElem.textContent;
      const link = linkElem.textContent;
      const description = descriptionElem.textContent;
      return {
        title, guid, link, description,
      };
    });
};
const takeFeeds = (domTree) => {
  const titleElem = domTree.querySelector('channel > title');
  const descriptionElem = domTree.querySelector('channel > description');
  if (!titleElem || !descriptionElem) {
    return null;
  }
  const title = titleElem.textContent;
  const description = descriptionElem.textContent;
  return { title, description };
};

export default (domTree) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(domTree, 'text/xml');
  const posts = takePosts(xmlDoc);
  const feeds = takeFeeds(xmlDoc);
  return { posts, feeds };
};
