import _ from 'lodash';
import axios from 'axios';
import parse from './parser.js';
import constructProxyURL from './components/buildProxy.js';

const update = (watcher) => {
  const proxyServiceUrl = 'https://allorigins.hexlet.app';
  const { feeds } = watcher.data;
  const promises = feeds.map((feed) => {
    const { url } = feed;
    const proxy = constructProxyURL(proxyServiceUrl, url);
    return axios.get(proxy);
  });

  Promise.all(promises)
    .then((responses) => {
      responses.forEach((resp, index) => {
        const { posts } = parse(resp.data.contents);

        if (!posts) {
          throw new Error('Parser Error');
        }

        const feedId = watcher.data.feeds[index].id;

        posts.forEach((post) => {
          post.feedId = feedId;
          post.id = _.uniqueId();
        });

        const existingPostIds = watcher.data.posts.map((post) => post.id);
        const newPosts = posts.filter((post) => !existingPostIds.includes(post.id));

        watcher.data.posts.push(...newPosts);
        watcher.uiState.feedback = 'feedback.success';
      });
    })
    .catch((e) => {
      console.error(`Error updating feed: ${e}`);
      watcher.uiState.feedback = 'feedback.errors.update';
    })
    .finally(() => {
      setTimeout(() => update(watcher), 5000);
    });
};

export default update;
