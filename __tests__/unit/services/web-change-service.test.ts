import { mocked } from 'ts-jest/utils';
import { getPageChange, isChangeSignificant } from '../../../src/services/web-change-service';
import * as storageService from '../../../src/services/storage-service';
import * as nock from 'nock';

jest.mock('../../../src/services/storage-service');

const mockedStorageService = mocked(storageService);

describe('webChangeService', () => {
  describe('getPageChange', () => {
    describe('Given the fresh page and page history exist', () => {
      const root = 'https://example.com';
      const path = '/valid';
      const webPageUrl = root + path;
      const before = 'before content';
      const afterHtml = '<body>after content <div class="target">child content</div></body>';
      const afterText = 'after content child content';
      const afterChildText = 'child content';
      beforeEach(async () => {
        nock(root).get(path).reply(200, afterHtml);
        mockedStorageService.load.mockResolvedValue(before);
      });
      describe('When called without query selector', () => {
        it('should return fresh page and page history, and update page history', async () => {
          const result = await getPageChange(webPageUrl);
          expect(result).toEqual({ before, after: afterText });
          expect(mockedStorageService.load).toHaveBeenCalledTimes(1);
          expect(mockedStorageService.load).toHaveBeenCalledWith(webPageUrl);
          expect(mockedStorageService.save).toHaveBeenCalledTimes(1);
          expect(mockedStorageService.save).toHaveBeenCalledWith(webPageUrl, afterText);
        });
      });
      describe('When called with query selector', () => {
        it('should return fresh page content under query selector', async () => {
          const result = await getPageChange(webPageUrl, '.target');
          expect(result).toEqual({ before, after: afterChildText });
        });
      });
    });

    describe('Given fresh page cannot be loaded', () => {
      const root = 'https://example.com';
      const path = '/in-error';
      const webPageUrl = root + path;
      beforeAll(async () => {
        nock(root).get(path).replyWithError('Failed to connect');
      });
      it('should return throw an error', async () => {
        await expect(getPageChange(webPageUrl)).rejects.toEqual(expect.anything());
      });
    });
  });

  describe('isChangeSignificant', () => {
    describe('When called with different before and after states', () => {
      it('should report significant change', () => {
        const result = isChangeSignificant({
          before: 'before',
          after: 'after'
        });
        expect(result).toBe(true);
      });
    });
    describe('When called with the same before and after states', () => {
      it('should report no significant change', () => {
        const content = 'content';
        const result = isChangeSignificant({
          before: content,
          after: content
        });
        expect(result).toBe(false);
      });
    });
  });
});
