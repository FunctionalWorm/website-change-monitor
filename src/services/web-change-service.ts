import { WebPageChange } from '../types/web-page-change';

const getPageChange = async (webPageUrl: string): Promise<WebPageChange> => {
  return {
    before: webPageUrl + ' contents',
    after: webPageUrl + ' contents'
  };
};

const isChangeSignificant = (change: WebPageChange): boolean => {
  return change.before !== change.after;
};

export { getPageChange, isChangeSignificant };
