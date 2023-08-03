import * as yup from 'yup';
import i18next from 'i18next';
import renderElementsText from './view.js';
import langs from '../locales/index.js';

export default () => {
  const defaultLang = 'ru';
  const state = {
    proccesState: '',
    lng: defaultLang,
    rssForm: {
      link: null,
      proccesState: '',
    },
    validLinks: [],
    uiState: {},
  };

  const i18nextNewInstance = i18next.createInstance();

  i18nextNewInstance.init({
    lng: defaultLang,
    debug: true,
    langs,
  });

  const getSchema = (inputUrl) => yup.string().required().url().notOneOf(inputUrl);
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

  const { form, input, feedback } = elements;

  input.addEventListener('change', (e) => {
    const { target } = e;
    state.rssForm.link = target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.rssForm.proccesState = 'validating';
    getSchema(state.rssForm.link)
      .then(() => {
        state.validLinks.push(state.rssForm.link);
      })
      .catch((err) => {
        feedback.textContent = i18nextNewInstance.t(err.message);
      });
  });
};
