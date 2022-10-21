#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { YoutubeSilkStack } = require('../lib/cdk-stack');

const app = new cdk.App();
new YoutubeSilkStack(app,
             'YoutubeSilkStack',
             //{ env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION } },
             { env: { account: '179454298130', region: 'eu-west-1' } },
             { environmentName: 'test' } // TODO:
 );
