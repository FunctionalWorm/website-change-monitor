import { CheckWebPageInput } from '../types/check-web-page-input';
import { getPageChange, isChangeSignificant } from '../services/web-change-service';
import { notifyChange } from '../services/notification-service';

export const handler = async (event: CheckWebPageInput): Promise<void> => {
  console.log('Received event', JSON.stringify(event, null, 2));
  const { webPageUrl, notificationEmail } = event;
  const change = await getPageChange(webPageUrl);
  const shouldNotify = isChangeSignificant(change);
  if (shouldNotify) {
    await notifyChange({
      webPageUrl,
      change,
      email: notificationEmail
    });
  }
};
