import { mocked } from 'ts-jest/utils';

import { handler } from '../../../src/handlers/check-web-page';
import { CheckWebPageInput } from '../../../src/types/check-web-page-input';
import * as notificationService from '../../../src/services/notification-service';
import * as webChangeService from '../../../src/services/web-change-service';

jest.mock('../../../src/services/notification-service');
jest.mock('../../../src/services/web-change-service');

const mockedWebChangeService = mocked(webChangeService);
const mockWebPageChange = {
  before: 'mock data before',
  after: 'mock data after'
};
mockedWebChangeService.getPageChange.mockResolvedValue(mockWebPageChange);

describe('handler', () => {
  const event: CheckWebPageInput = {
    webPageUrl: 'https://www.google.com',
    notificationEmail: 'test@example.com'
  };

  it('should check for web page changes', async () => {
    await handler(event);
    expect(webChangeService.getPageChange).toHaveBeenCalledTimes(1);
    expect(webChangeService.getPageChange).toHaveBeenCalledWith(event.webPageUrl);
  });

  it('should check whether changes are significant', async () => {
    await handler(event);
    expect(webChangeService.isChangeSignificant).toHaveBeenCalledTimes(1);
    expect(webChangeService.isChangeSignificant).toHaveBeenCalledWith(mockWebPageChange);
  });

  it('should return nothing', async () => {
    const result = await handler(event);
    expect(result).not.toBeDefined();
  });

  describe('Given the web page has significantly changed', () => {
    beforeAll(async () => {
      mockedWebChangeService.isChangeSignificant.mockReturnValue(true);
    });
    it('should notify changes via email', async () => {
      await handler(event);
      expect(notificationService.notifyChange).toHaveBeenCalledTimes(1);
      expect(notificationService.notifyChange).toHaveBeenCalledWith({
        webPageUrl: event.webPageUrl,
        change: mockWebPageChange,
        email: event.notificationEmail
      });
    });
  });

  describe('Given the web page has NOT significantly changed', () => {
    beforeAll(async () => {
      mockedWebChangeService.isChangeSignificant.mockReturnValue(false);
    });
    it('should NOT notify changes via email', async () => {
      await handler(event);
      expect(notificationService.notifyChange).toHaveBeenCalledTimes(0);
    });
  });
});
