const {Stack, RemovalPolicy, CfnOutput} = require('aws-cdk-lib');
const {Certificate} = require('aws-cdk-lib/aws-certificatemanager');
const {HttpApi, HttpMethod, DomainName} = require('@aws-cdk/aws-apigatewayv2-alpha');
const {HttpLambdaIntegration} = require('@aws-cdk/aws-apigatewayv2-integrations-alpha');
const {Function, Runtime, Code, LayerVersion} = require('aws-cdk-lib/aws-lambda');
const { AttributeType, Table } = require('aws-cdk-lib/aws-dynamodb');
const {Bucket} = require('aws-cdk-lib/aws-s3');
const {BucketDeployment, Source} = require('aws-cdk-lib/aws-s3-deployment');
const {Distribution} = require('aws-cdk-lib/aws-cloudfront');
const cloudfrontOrigins = require('aws-cdk-lib/aws-cloudfront-origins');
const path = require('path');

class YoutubeSilkStack extends Stack {

    constructor(scope, id, props, context) {
        super(scope, id, props);

        // ----------------
        // TODO: Grants
        // ----------------


        // DynamoDB
        const videosDynamoTable = new Table(this, 'Videos', {
            partitionKey: {
                name: 'videoId',
                type: AttributeType.STRING
            },
            tableName: `Videos-${context.environmentName}`,
        });

        const usageDynamoTable = new Table(this, 'UsageTimers', {
            partitionKey: {
                name: 'ipAddress',
                type: AttributeType.STRING
            },
            tableName: `UsageTimers-${context.environmentName}`,
        });

        // S3
        const websiteBucket = new Bucket(this, 'youtubesilk', {
            bucketName: `youtubesilk-${context.environmentName}-${this.account}`,
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // This is okay because data is generated
            websiteIndexDocument: "index.html"
        });

        const deployment = new BucketDeployment(this, "deployStaticWebsite", {
            sources: [ Source.asset(`${path.resolve(__dirname)}/../../build`) ],
            destinationBucket: websiteBucket
        });

        // CloudFront
        /*
        const cf = new Distribution(this, 'cdnDistribution', {
            defaultBehavior: { origin: new cloudfrontOrigins.S3Origin(websiteBucket) }
        });
        */
        
        // Lambda
        const axiosLayer = new LayerVersion(this, 'axios-layer', {
            compatibleRuntimes: [ Runtime.NODEJS_16_X ],
            code: Code.fromAsset(path.join(__dirname, '/../../lambda/layers/axios')),
            description: '3rd party library Axios',
        });

        const apiDefaultHandler = new Function(this, "apiDefaultHandler", {
            runtime: Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: Code.fromAsset(path.join(__dirname, '/../../lambda')),
            memorySize: 128
        });

        const apiSearchHandler = new Function(this, "apiSearchHandler", {
            runtime: Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: Code.fromAsset(path.join(__dirname, '/../../lambda/search')),
            memorySize: 128,
            layers: [axiosLayer]
        });

        const apiUsageHandler = new Function(this, "apiUsageHandler", {
            runtime: Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: Code.fromAsset(path.join(__dirname, '/../../lambda/usage')),
            memorySize: 128
        });

        const apiBlacklistHandler = new Function(this, "apiBlacklistHandler", {
            runtime: Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: Code.fromAsset(path.join(__dirname, '/../../lambda/blacklist')),
            memorySize: 128
        });

        // API Gateway

        // *.syscall.dk
        const certificate = Certificate.fromCertificateArn(this,
                "apiCertificate",
                "arn:aws:acm:eu-west-1:179454298130:certificate/3b26415a-df91-41db-9d06-89242e5e8977"
        );

        let domainName = `api-${context.environmentName}.syscall.dk`;
        if (context.environmentName === 'production') {
            domainName = 'api.syscall.dk';
        }
        const dn = new DomainName(this, 'DN', {
            domainName,
            certificate: certificate,
        });
        

        const httpApi = new HttpApi(this, "apiGateway", {
            defaultIntegration: new HttpLambdaIntegration('DefaultIntegration', apiDefaultHandler),
            defaultDomainMapping: {
                domainName: dn
            },
        });

        httpApi.addRoutes({
            path: '/youtube/v1/videos',
            methods: [ HttpMethod.GET ],
            integration: new HttpLambdaIntegration('search', apiSearchHandler),
        });

        httpApi.addRoutes({
            path: '/youtube/v1/videos/{videoId}',
            methods: [ HttpMethod.ANY ],
            integration: new HttpLambdaIntegration('search', apiSearchHandler),
        });

        httpApi.addRoutes({
            path: '/youtube/v1/blacklists',
            methods: [ HttpMethod.DELETE, HttpMethod.POST ],
            integration: new HttpLambdaIntegration('blacklist', apiBlacklistHandler),
        });

        httpApi.addRoutes({
            path: '/youtube/v1/usage',
            methods: [ HttpMethod.PUT, HttpMethod.GET ],
            integration: new HttpLambdaIntegration('usage', apiUsageHandler),
        });

        // Output
        new CfnOutput(this, 'apiUrl', {value: httpApi.url});
        new CfnOutput(this, 'websiteUrl', { value: websiteBucket.bucketWebsiteUrl});
    }
}

module.exports = {YoutubeSilkStack}
