import { WebPageChange } from '../types/web-page-change';
import * as https from 'https';
import * as storageService from './storage-service';
import { parse } from 'node-html-parser';

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

const getTextFromHtml = (html: string) => {
  const root = parse(html);
  const body = root.querySelector('body');
  return body.text.replace(/\s+/g, ' ');
};

const getPageChange = async (webPageUrl: string): Promise<WebPageChange> => {
  const before = await storageService.load(webPageUrl);
  const html = await loadWebPage(webPageUrl);
  const after = getTextFromHtml(html);
  await storageService.save(webPageUrl, after);
  return { before, after };
};

const isChangeSignificant = (change: WebPageChange): boolean => {
  return change.before !== change.after;
};

export { getPageChange, isChangeSignificant };
