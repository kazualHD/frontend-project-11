export default (elements, i18nextNewInstance) => {
  const {
    mainTitle, slogan, label, button, sample,
  } = elements;
  mainTitle.textContent = i18nextNewInstance.t('main_title');
  slogan.textContent = i18nextNewInstance.t('slogan');
  button.textContent = i18nextNewInstance.t('rssForm.rssSubmit');
  label.textContent = i18nextNewInstance.t('rssForm.rssLabel');
  sample.textContent = i18nextNewInstance.t('example');
};
