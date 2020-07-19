import * as process from 'process';
process.env.AWS_REGION = 'ap-southeast-2';

import * as checkWebPage from '../handlers/check-web-page';
import * as event from '../events/check-web-page-event.json';
(async () => {
  try {
    await checkWebPage.handler(event);
    console.info('Checked web page');
  } catch (error) {
    console.error('Error occurred while executing checkWebPage.handler', error);
  }
})();
