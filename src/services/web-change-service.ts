import { WebPageChange } from '../types/web-page-change';
import * as https from 'https';
import * as storageService from './storage-service';
import { parse } from 'node-html-parser';

const loadWebPage = async (webPageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const request = https.get(webPageUrl, (response) => {
      response.setEncoding('utf8');
      let body = '';
      response.on('data', (data) => {
        body += data;
      });
      response.on('end', () => {
        resolve(body);
      });
      response.on('error', reject);
    });
    request.on('error', reject);
  });
};

const getTextFromHtml = (html: string, querySelector?: string) => {
  const root = parse(html);
  const targetElement = querySelector ? root.querySelector(querySelector) : root;
  const text = targetElement.text;
  return text.replace(/\s+/g, ' ');
};

const getPageChange = async (
  webPageUrl: string,
  querySelector?: string
): Promise<WebPageChange> => {
  const before = await storageService.load(webPageUrl);
  const html = await loadWebPage(webPageUrl);
  const after = getTextFromHtml(html, querySelector);
  await storageService.save(webPageUrl, after);
  return { before, after };
};

const isChangeSignificant = (change: WebPageChange): boolean => {
  const isSignificant = change.before !== change.after;
  if (isSignificant) {
    console.log('Changed from:\n%s \n\nto:\n%s', change.before, change.after);
  }
  return isSignificant;
};

export { getPageChange, isChangeSignificant };
