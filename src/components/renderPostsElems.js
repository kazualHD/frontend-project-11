import { parseDescription } from '../parser.js';

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

  ul.addEventListener('click', (event) => {
    const { target } = event;

    if (target.closest('li.list-group-item')) {
      const { id } = target.dataset;
      watcher.uiState.readPostsId.push(id);
    }

    if (target.closest('.btn')) {
      const { id } = target.dataset;
      const modal = document.querySelector(target.dataset.bsTarget);
      const modalTitle = modal.querySelector('.modal-title');
      const modalBody = modal.querySelector('.modal-body');
      const modalFullArticleBtn = modal.querySelector('.modal-footer a.full-article');
      const modalCloseBtn = modal.querySelector('.modal-footer button');

      const post = values.find((p) => p.id === id);

      modalTitle.textContent = post.title;
      modalBody.textContent = parseDescription(post.description);
      modalFullArticleBtn.setAttribute('href', post.link);
      modalFullArticleBtn.textContent = i18nextNewInstance.t('modal_position.article');
      modalCloseBtn.textContent = i18nextNewInstance.t('modal_position.close');
    }
  });

  values.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

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

    li.append(a, btn);
    ul.prepend(li);
  });

  div2.append(h2);
  div.append(div2, ul);
  posts.innerHTML = '';
  posts.append(div);
};

export default renderPostsElems;
