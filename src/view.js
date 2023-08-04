import onChange from 'on-change';

export const renderElementsText = (elements, i18nextNewInstance) => {
  const {
    mainTitle, slogan, label, button, sample,
  } = elements;
  mainTitle.textContent = i18nextNewInstance.t('main_title');
  slogan.textContent = i18nextNewInstance.t('slogan');
  button.textContent = i18nextNewInstance.t('rssForm.rssSubmit');
  label.textContent = i18nextNewInstance.t('rssForm.rssLabel');
  sample.textContent = i18nextNewInstance.t('example');
};

const mainProccesState = (elements, proccesState) => {
  const { button, form, input } = elements;
  switch (proccesState) {
    case 'initialized':
    case 'spying':
      break;

    case 'network_error':
    case 'parse_error': {
      button.disabled = true;
      break;
    }

    case 'loading': {
      button.disabled = true;
      break;
    }

    case 'loaded': {
      form.reset();
      input.focus();
      button.disabled = false;
      break;
    }

    default: {
      throw new Error(`Unexpected procces state ${proccesState}`);
    }
  }
};

const rssFormStateProcces = (elements, processState) => {
  const { button } = elements;

  switch (processState) {
    case 'filling': {
      button.disabled = false;
      break;
    }

    case 'validating': {
      button.disabled = true;
      break;
    }

    case 'validated': {
      button.disabled = false;
      button.classList.remove('is-invalid');
      break;
    }

    case 'invalidated': {
      button.disabled = false;
      button.classList.add('is-invalid');
      break;
    }
    default: {
      throw new Error(`Unexpected Formprocces state  ${processState} `);
    }
  }
};

export default (elements, state) => {
  const watch = onChange(state, (path, value) => {
    switch (path) {
      case 'proccesState': {
        mainProccesState(elements, value);
        break;
      }
      case 'rssForm.proccesState': {
        rssFormStateProcces(elements, value);
        break;
      }
      case 'validLinks':
      case 'rssForm.link':
        break;
      default: {
        throw new Error('Unexpected Format');
      }
    }
  });
  return watch;
};
