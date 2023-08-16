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
export default setUninId;
