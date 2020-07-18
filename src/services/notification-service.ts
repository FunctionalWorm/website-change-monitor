import { WebPageChange } from '../types/web-page-change';

const notifyChange = async ({
  webPageUrl,
  change,
  email
}: {
  webPageUrl: string;
  change: WebPageChange;
  email: string;
}): Promise<void> => {
  console.log(`Notifying email: ${email} about changes in web page: ${webPageUrl}`);
};

export { notifyChange };
