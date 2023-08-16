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
export default mainProccesState;
