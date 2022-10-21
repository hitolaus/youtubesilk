const cdk = require('aws-cdk-lib');
const {Template} = require('aws-cdk-lib/assertions');
const Cdk = require('../lib/cdk-stack');

test('App Stack Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Cdk.YoutubeSilkStack(app, 'MyTestStack', { account: '123', region: 'my-machine'}, {environmentName: 'unittest'});
    // THEN
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
        ProtocolType: "HTTP"
    });

    // TODO
    /*
    template.hasResourceProperties('AWS::S3::Bucket', {
        bucketName: "youtubesilk-unittest-123"
    });
    */
});
