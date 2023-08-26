const takePosts = (dom) => {
  const items = dom.querySelectorAll('channel > item');
  if (!items) {
    return null;
  }
  const posts = Array.from(items).map((item) => {
    const titleEl = item.querySelector('title');
    const descriptionEl = item.querySelector('description');
    const linkEl = item.querySelector('link');
    const guidEl = item.querySelector('guid');

    const title = titleEl.textContent;
    const description = descriptionEl.textContent;
    const link = linkEl.textContent;
    const guid = guidEl.textContent;

    return {
      title, description, link, guid,
    };
  });

  return posts;
};
const takeFeeds = (dom) => {
  const titleElem = dom.querySelector('channel > title');
  const descriptionElem = dom.querySelector('channel > description');
  if (!titleElem || !descriptionElem) {
    return null;
  }
  const title = titleElem.textContent;
  const description = descriptionElem.textContent;
  return { title, description };
};
export const parseDescription = (desc) => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(desc, 'text/html');
  const text = htmlDoc.body.textContent;
  return text;
};

export default (domTree) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(domTree, 'text/xml');
    const posts = takePosts(xmlDoc);
    const feeds = takeFeeds(xmlDoc);
    return { feeds, posts };
  } catch (error) {
    console.error('Parsing error:', error);
    return { feeds: [], posts: [] };
  }
};
