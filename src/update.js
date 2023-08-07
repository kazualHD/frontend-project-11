import axios from 'axios';
import parse from './parser.js';

const postUpdater = (link, watcher, id, createId) => axios.get(link)
  .then((resp) => resp.data.contents)
  .then((cont) => {
    const { posts } = parse(cont);
    if (!posts) {
      throw new Error('Parse errror');
    }
    return posts;
  })
  .then((posts) => {
    const uploadedPosts = watcher.data.posts.filter((post) => post.feedId === id);
    const guids = uploadedPosts.map((post) => post.guid);
    const coll = new Set(guids);
    const newPosts = posts.filter(({ guid }) => !coll.has(guid));

    if (newPosts.length === 0) {
      return;
    }
    newPosts.forEach((post) => {
      post.feedId = id; // eslint-disable-line no-param-reassign
      post.id = createId(); // eslint-disable-line no-param-reassign
    });
    watcher.data.posts.push(...newPosts);
    return newPosts; // eslint-disable-line consistent-return
  })
  .catch((e) => console.error(e.message))
  .finally(() => setTimeout(() => postUpdater(link, watcher, id, createId), 5000));

export default postUpdater;
