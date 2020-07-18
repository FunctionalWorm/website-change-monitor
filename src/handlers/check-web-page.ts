import { ScheduledEvent } from 'aws-lambda';
export const handler = async (event: ScheduledEvent): Promise<void> => {
  console.log('Received event', JSON.stringify(event, null, 2));
};
