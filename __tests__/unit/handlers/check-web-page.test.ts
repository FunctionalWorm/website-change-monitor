import { handler } from '../../../src/handlers/check-web-page';
import { ScheduledEvent } from 'aws-lambda';

describe('handler', () => {
  it('should return nothing', async () => {
    const scheduledEvent: ScheduledEvent = {
      version: '0',
      id: '53dc4d37-cffa-4f76-80c9-8b7d4a4d2eaa',
      'detail-type': 'Scheduled Event',
      source: 'aws.events',
      account: '123456789012',
      time: '2020-03-08T16:53:06Z',
      region: 'ap-southeast-2',
      resources: [
        'arn:aws:events:ap-southeast-2:123456789012:rule/my-scheduled-rule'
      ],
      detail: {}
    };
    const result = await handler(scheduledEvent);
    expect(result).not.toBeDefined();
  });
});
