import onChange from 'on-change';
import mainProccesState from './components/mainProcessState.js';
import rssFormStateProcces from './components/rssFormStateProcces.js';
import generate from './components/generateFeedback.js';
import renderPostsElems from './components/renderPostsElems.js';
import updateReadPostsStyles from './components/updateStyle.js';
import renderFeedsElems from './components/renderFeedsElems.js';

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
        updateReadPostsStyles(watcher.uiState.readPostsId);
        break;
      }
      case 'data.feeds': {
        renderFeedsElems(elements, value, i18nextNewInstance);
        break;
      }
      case 'uiState.readPostsId':
        updateReadPostsStyles(value);
        break;
      default: {
        throw new Error('Unexpected Format');
      }
    }
  });
  return watcher;
};
