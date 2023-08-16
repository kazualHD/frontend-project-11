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

export default generate;
