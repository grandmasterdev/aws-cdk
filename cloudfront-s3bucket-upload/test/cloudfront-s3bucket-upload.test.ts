import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CloudfrontS3BucketUpload from '../lib/cloudfront-s3bucket-upload-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CloudfrontS3BucketUpload.CloudfrontS3BucketUploadStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
