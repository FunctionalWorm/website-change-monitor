import * as AWS from 'aws-sdk';
const storageBucketName = 'CheckWebPageStorage';

const getStoragePath = (name: string): string => {
  return name.replace(/\W+/g, '-') + '.dump';
};

const load = async (name: string): Promise<string> => {
  const s3 = new AWS.S3();
  try {
    const { Body: data } = await s3
      .getObject({
        Bucket: storageBucketName,
        Key: getStoragePath(name)
      })
      .promise();
    return data ? data.toString() : '';
  } catch (error) {
    if (error.code === 'NotFound') {
      return '';
    }
    throw error;
  }
};

const save = async (name: string, content: string): Promise<void> => {
  const s3 = new AWS.S3();
  await s3
    .putObject({
      Bucket: storageBucketName,
      Key: getStoragePath(name),
      Body: content
    })
    .promise();
};

export { load, save };
