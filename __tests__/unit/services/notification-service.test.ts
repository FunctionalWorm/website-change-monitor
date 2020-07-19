import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import * as process from 'process';
import { PublishInput, PublishResponse } from 'aws-sdk/clients/sns';

process.env.NotificationTopicArn = 'test-topic-arn';
import { notifyChange } from '../../../src/services/notification-service';

AWSMock.setSDKInstance(AWS);
const mockPublish = jest.fn(
  (
    params: PublishInput,
    callback: (err: { code: string } | null, data?: PublishResponse) => void
  ) => {
    callback(null, {});
  }
);
AWSMock.mock('SNS', 'publish', mockPublish);

describe('notificationService', () => {
  describe('notifyChange', () => {
    it('should send a notification via SNS', async () => {
      const webPageUrl = 'https://example.com';
      await notifyChange({
        change: {
          before: 'before content',
          after: 'after content'
        },
        webPageUrl
      });
      expect(mockPublish).toHaveBeenCalledTimes(1);
      expect(mockPublish).toHaveBeenCalledWith(
        expect.objectContaining({
          Message: expect.stringContaining(webPageUrl),
          TopicArn: process.env.NotificationTopicArn
        }),
        expect.anything()
      );
    });
  });
});
