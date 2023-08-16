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
export default renderFeedsElems;
