
import { i18n } from '@kbn/i18n';

export const defaultFeedbackMessage = i18n.translate('common.ui.vis.defaultFeedbackMessage', {
  defaultMessage: 'Have feedback? Please create an issue in {link}.',
  values: {
    link:
      '<a href="https://github.com/GregBoero/kbn_vis_sql/issues/new" rel="noopener noreferrer" target="_blank">GitHub</a>',
  },
});
