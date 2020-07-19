import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import * as process from 'process';

process.env.CheckWebPageStorageBucket = 'test-bucket';

const mockContent = 'some content';
AWSMock.setSDKInstance(AWS);
const mockGetObject = jest.fn(
  (
    params: GetObjectRequest,
    callback: (err: { code: string } | null, data?: GetObjectOutput) => void
  ) => {
    const { Key: path } = params;
    if (path.startsWith('some-valid-name')) {
      callback(null, {
        Body: mockContent
      });
    } else if (path.startsWith('some-body-less-name')) {
      callback(null, {});
    } else if (path.startsWith('some-erroneous-name')) {
      callback({ code: 'RuntimeError' });
    } else {
      callback({ code: 'NoSuchKey' });
    }
  }
);
const mockPutObject = jest.fn(
  (
    params: PutObjectRequest,
    callback: (err: { code: string } | null, data?: PutObjectOutput) => void
  ) => {
    callback(null);
  }
);
AWSMock.mock('S3', 'getObject', mockGetObject);
AWSMock.mock('S3', 'putObject', mockPutObject);

import * as storageService from '../../../src/services/storage-service';
import {
  GetObjectOutput,
  GetObjectRequest,
  PutObjectOutput,
  PutObjectRequest
} from 'aws-sdk/clients/s3';

describe('storageService', () => {
  describe('load', () => {
    describe('Given the name of the object to load is valid', () => {
      const name = 'some-valid-name';
      it('should load the object and return its contents', async () => {
        const result = await storageService.load(name);
        expect(result).toBe(mockContent);
      });
    });
    describe('Given the name of the object to load is invalid', () => {
      const name = 'some-invalid-name';
      it('should return empty string', async () => {
        const result = await storageService.load(name);
        expect(result).toBe('');
      });
    });
    describe('Given S3 loads an object with no Body', () => {
      const name = 'some-body-less-name';
      it('should return empty string', async () => {
        const result = await storageService.load(name);
        expect(result).toBe('');
      });
    });
    describe('Given S3 fails to load the object', () => {
      const name = 'some-erroneous-name';
      it('should throw error', async () => {
        await expect(storageService.load(name)).rejects.toEqual(expect.anything());
      });
    });
  });
  describe('save', () => {
    beforeEach(() => {
      mockGetObject.mockClear();
    });
    it('should save the object and return nothing', async () => {
      const name = 'some-valid-name';
      const result = await storageService.save(name, mockContent);
      expect(result).not.toBeDefined();
      expect(mockPutObject).toHaveBeenCalledTimes(1);
      expect(mockPutObject).toHaveBeenCalledWith(
        expect.objectContaining({ Key: expect.stringContaining(name) }),
        expect.anything()
      );
    });
    it('should replace non-alpha-numeric characters from object name', async () => {
      const name = 'test://some-%-name/?data=123';
      await storageService.save(name, mockContent);
      expect(mockPutObject).toHaveBeenCalledWith(
        expect.objectContaining({ Key: expect.stringContaining('test-some-name-data-123') }),
        expect.anything()
      );
    });
  });
});
