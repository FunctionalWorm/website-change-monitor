import * as process from 'process';
import * as AWS from 'aws-sdk';
import { WebPageChange } from '../types/web-page-change';

const notificationTopicArn = <string>process.env.NotificationTopicArn;

const notifyChange = async ({
  webPageUrl,
  change
}: {
  webPageUrl: string;
  change: WebPageChange;
}): Promise<void> => {
  console.log(`Notifying topic ${notificationTopicArn} about changes in web page: ${webPageUrl}`);
  const sns = new AWS.SNS();
  sns.publish({
    Subject: 'Web Page Change',
    Message: createChangeMessage({ webPageUrl, change }),
    TopicArn: notificationTopicArn
  });
};

const createChangeMessage = ({
  webPageUrl,
  change
}: {
  webPageUrl: string;
  change: WebPageChange;
}) => `Change detected in: ${webPageUrl}, ${change.before.length}->${change.after.length}`;

export { notifyChange };
