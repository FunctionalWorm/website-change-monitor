import { WebPageChange } from '../types/web-page-change';
import * as https from 'https';
import * as storageService from './storage-service';

const loadWebPage = async (webPageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(webPageUrl, (response) => {
      response.setEncoding('utf8');
      let body = '';
      response.on('data', (data) => {
        body += data;
      });
      response.on('end', () => {
        resolve(body);
      });
      response.on('error', (error) => {
        reject(error);
      });
    });
  });
};

const getPageChange = async (webPageUrl: string): Promise<WebPageChange> => {
  const before = await storageService.load(webPageUrl);
  const after = await loadWebPage(webPageUrl);
  await storageService.save(webPageUrl, after);
  return { before, after };
};

const isChangeSignificant = (change: WebPageChange): boolean => {
  return change.before !== change.after;
};

export { getPageChange, isChangeSignificant };
