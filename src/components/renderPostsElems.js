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

  values.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    li.addEventListener('click', (event) => {
      const { target } = event;
      const { id } = target.dataset;
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
      const modalCloseBtn = document.querySelector('.modal-footer button');

      modalTitle.textContent = post.title;
      const { description } = post;
      modalBody.textContent = parseDescription(description);
      console.log(post);
      modalFullArticleBtn.setAttribute('href', post.link);
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

export default renderPostsElems;
