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

const mainProccesState = (elements, processState) => {
  const { button, form, input } = elements;
  switch (processState) {
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
      throw new Error(`Unexpected procces state ${processState}`);
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
const generate = (elements, value, i18nextNewInstance) => {
  const { feedback } = elements;
  feedback.textContent = i18nextNewInstance.t(value);
  switch (value) {
    case 'feedback.success': {
      feedback.classList.replace('text-danger', 'text-success');
      break;
    }
    case 'feedback.errors.invalid_url':
    case 'feedback.errors.empty_field':
    case 'feedback.errors.duplicate':
    case 'feedback.errors.network':
    case 'feedback.errors.parser':
      feedback.classList.replace('text-success', 'text-danger');
      break;
    default:
      throw new Error(`Unexpected feedback ${value}`);
  }
};

const renderPostsElems = (elements, values, i18nextNewInstance, watcher) => {
  const { posts } = elements;

  const div = document.createElement('div');
  div.classList.add('card', 'border-0');

  const div2 = document.createElement('div');
  div2.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nextNewInstance.t('posts');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  values.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    li.addEventListener('click', (event) => {
      const { target } = event;
      const { id } = target;
      watcher.uiState.readPostsId.push(id);
    });

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', post.link);
    a.setAttribute('target', 'blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.dataset.id = post.id;
    a.textContent = post.title;

    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.dataset.id = post.id;
    btn.dataset.bsToggle = 'modal';
    btn.dataset.bsTarget = '#modal';
    btn.textContent = i18nextNewInstance.t('modal_position.view');

    btn.addEventListener('click', (event) => {
      const { target } = event;
      const { bsTarget } = target.dataset;
      const modal = document.querySelector(bsTarget);
      const modalTitle = modal.querySelector('.modal-title');
      const modalBody = modal.querySelector('.modal-body');
      const modalFullArticleBtn = document.querySelector('.modal-footer a.full-article');
      modalFullArticleBtn.setAttribute('href', post.link);
      const modalCloseBtn = document.querySelector('.modal-footer button');

      modalTitle.textContent = post.title;
      modalBody.textContent = post.description;
      modalFullArticleBtn.textContent = i18nextNewInstance.t('modal_position.article');
      modalCloseBtn.textContent = i18nextNewInstance.t('modal_position.close');
    });

    li.append(a, btn);
    ul.prepend(li);
  });
  div2.append(h2);
  div.append(div2, ul);
  posts.innerHTML = '';
  posts.append(div);
};
const renderFeedsElems = (elements, values, i18nextNewInstance) => {
  const { feeds } = elements;
  const div = document.createElement('div');
  div.classList.add('card', 'border-0');

  const div2 = document.createElement('div');
  div2.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nextNewInstance.t('feeds');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  values.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add = ('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;

    li.append(h3, p);
    ul.prepend(li);
  });
  div2.append(h2);
  div.append(div2, ul);
  feeds.innerHTML = '';
  feeds.append(div);
};
const setUninId = (readPostsId) => {
  const linkNodes = document.querySelectorAll('.posts ul .list-group-item a');
  const readPosts = new Set(readPostsId);
  linkNodes.forEach((a) => {
    if (readPosts.has(a.dataset.id)) {
      a.classList.replace('fw-bold', 'fw-normal');
      a.classList.add('link-secondary');
    }
  });
};

export default (elements, state, i18nextNewInstance) => {
  const watcher = onChange(state, (path, value) => {
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
      case 'uiState.feedback': {
        generate(elements, value, i18nextNewInstance);
        break;
      }
      case 'data.posts': {
        renderPostsElems(elements, value, i18nextNewInstance, watcher);
        setUninId(watcher.uiState.readPostsId);
        break;
      }
      case 'data.feeds': {
        renderFeedsElems(elements, value, i18nextNewInstance);
        break;
      }
      case 'uiState.readPostsId':
        setUninId(value);
        break;
      default: {
        throw new Error('Unexpected Format');
      }
    }
  });
  return watcher;
};
