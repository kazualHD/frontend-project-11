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
export default rssFormStateProcces;
