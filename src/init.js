import * as yup from 'yup';
import i18next from 'i18next';
import watch, { renderElementsText } from './view.js';
import resources from '../locales/index.js';

export default () => {
  const defaultLang = 'ru';
  const state = {
    proccesState: 'initialized',
    lng: defaultLang,
    rssForm: {
      link: null,
      proccesState: 'filling',
    },
    uiState: {
      feedback: null,
    },
    validLinks: [],
  };

  const i18nextNewInstance = i18next.createInstance();

  i18nextNewInstance.init({
    lng: defaultLang,
    debug: true,
    resources,
  });

  const getSchema = (inputUrl) => yup.string().required().url().notOneOf([inputUrl]);
  yup.setLocale({
    mixed: {
      notOneOf: 'errors.dublicate',
    },
    string: {
      url: 'errors.invalidUrl',
      required: 'errors.emptyInput',
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

  const watcher = watch(elements, state);

  input.addEventListener('change', (event) => {
    const { target } = event;
    watcher.rssForm.link = target.value;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    watcher.rssForm.proccesState = 'validating';
    const schema = getSchema(watcher.validLinks);
    schema.validate(watcher.rssForm.link)
      .then(() => {
        watcher.rssForm.proccesState = 'validated';
        watcher.validLinks.push(watcher.rssForm.link);
      })
      .catch((error) => {
        switch (error.name) {
          case 'ValidationError': {
            const [customError] = error.errors;
            watcher.rssForm.proccesState = 'invalidated';
            watcher.uiState.feedback = customError; // PROBLEM !!!

            break;
          }
          default: {
            throw new Error(`Unexpected error ${error.name}`);
          }
        }
      });
  });
};
