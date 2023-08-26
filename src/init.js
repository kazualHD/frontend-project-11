import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import constructProxyURL from './components/buildProxy.js';
import parse from './parser.js';
import watch from './view.js';
import renderElementsText from './components/renderElText.js';
import updater from './update.js';
import resources from './locales/index.js';

export default () => {
  const defaultLang = 'ru';
  const proxyServiceUrl = 'https://allorigins.hexlet.app';

  const state = {
    proccesState: 'initialized',
    lng: defaultLang,
    rssForm: {
      link: null,
      proccesState: 'filling',
    },
    uiState: {
      readPostsId: [],
      feedback: null,
    },
    data: {
      posts: [],
      feeds: [],
    },
    validLinks: [],
  };
  const i18nextNewInstance = i18next.createInstance();

  i18nextNewInstance.init({
    lng: defaultLang,
    debug: true,
    resources,
  });

  const getSchema = (inputUrl) => yup.string().required().url().notOneOf(inputUrl);
  yup.setLocale({
    mixed: {
      notOneOf: 'feedback.errors.duplicate',
    },
    string: {
      required: 'feedback.errors.empty_field',
      url: 'feedback.errors.invalid_url',
    },
  });

  const elements = {
    mainTitle: document.getElementById('main-title'),
    slogan: document.querySelector('main .lead'),
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    label: document.querySelector('.rss-form label'),
    button: document.querySelector('.rss-form button[type="submit"]'),
    sample: document.getElementById('sample'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  renderElementsText(elements, i18nextNewInstance); // rendering text for elements with i18next

  const {
    form,
    input,
  } = elements;

  const watcher = watch(elements, state, i18nextNewInstance);
  updater(watcher);

  input.addEventListener('change', (event) => {
    const { target } = event;
    watcher.rssForm.link = target.value;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let proxy;
    watcher.rssForm.proccesState = 'validating';
    const schema = getSchema(watcher.validLinks);
    schema.validate(watcher.rssForm.link)
      .then((url) => {
        watcher.rssForm.proccesState = 'validated';
        watcher.proccesState = 'loading';
        watcher.validLinks.push(watcher.rssForm.link);
        proxy = constructProxyURL(proxyServiceUrl, url);
        return axios.get(proxy);
      })
      .then((response) => response.data.contents)
      .then((contents) => {
        const parser = parse(contents);
        const { feeds, posts } = parser;
        if (!feeds || !posts) {
          throw new Error('Parser Error');
        }
        feeds.id = _.uniqueId();
        posts.forEach((post) => {
          post.feedId = feeds.id;
          post.id = _.uniqueId();
        });
        watcher.data.feeds.push(feeds);
        watcher.data.posts.push(...posts);
        watcher.proccesState = 'loaded';
        watcher.rssForm.proccesState = 'filling';
        watcher.uiState.feedback = 'feedback.success';
      })
      .catch((e) => {
        switch (e.name) {
          case 'ValidationError': {
            const [customError] = e.errors;
            watcher.rssForm.proccesState = 'invalidated';
            watcher.uiState.feedback = customError;
            break;
          }
          case 'AxiosError':
            if (e.message === 'Network Error') {
              watcher.rssForm.proccesState = 'invalidated';
              watcher.uiState.feedback = 'feedback.errors.network';
            }
            break;

          case 'Error':
            if (e.message === 'Parser Error') {
              watcher.rssForm.proccesState = 'invalidated';
              watcher.uiState.feedback = 'feedback.errors.parser';
            }
            break;
          default: {
            throw new Error(`Unexpected error ${e.name}`);
          }
        }
      });
  });
};
