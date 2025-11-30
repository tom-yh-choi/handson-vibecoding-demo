import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { MonitoringStack } from '../../../lib/monitoring/monitoring-stack';

function createTestResources() {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const todoLambda = new lambda.Function(stack, 'TodoLambda', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async () => {}'),
  });

  const userLambda = new lambda.Function(stack, 'UserLambda', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async () => {}'),
  });

  const api = new apigateway.RestApi(stack, 'TestApi', {
    restApiName: 'Test API',
  });

  // Add a dummy method to satisfy validation
  api.root.addMethod('GET', new apigateway.MockIntegration());

  const todoTable = new dynamodb.Table(stack, 'TodoTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  });

  const userTable = new dynamodb.Table(stack, 'UserTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  });

  return { app, todoLambda, userLambda, api, todoTable, userTable };
}

describe('MonitoringStack', () => {
  it('should create a CloudWatch Dashboard', () => {
    const { app, todoLambda, userLambda, api, todoTable, userTable } = createTestResources();

    const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
      todoLambda,
      userLambda,
      api,
      todoTable,
      userTable,
    });

    const template = Template.fromStack(monitoringStack);

    template.hasResourceProperties('AWS::CloudWatch::Dashboard', {
      DashboardName: 'TodoApp-Operational-Dashboard',
    });
  });

  it('should have dashboard with correct widgets', () => {
    const { app, todoLambda, userLambda, api, todoTable, userTable } = createTestResources();

    const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
      todoLambda,
      userLambda,
      api,
      todoTable,
      userTable,
    });

    const template = Template.fromStack(monitoringStack);

    // Dashboard should exist
    template.resourceCountIs('AWS::CloudWatch::Dashboard', 1);
  });

  it('should output the dashboard URL', () => {
    const { app, todoLambda, userLambda, api, todoTable, userTable } = createTestResources();

    const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
      todoLambda,
      userLambda,
      api,
      todoTable,
      userTable,
    });

    const template = Template.fromStack(monitoringStack);

    template.hasOutput('DashboardUrl', {});
  });

  it('should include Lambda metrics in dashboard', () => {
    const { app, todoLambda, userLambda, api, todoTable, userTable } = createTestResources();

    const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
      todoLambda,
      userLambda,
      api,
      todoTable,
      userTable,
    });

    const template = Template.fromStack(monitoringStack);
    const dashboards = template.findResources('AWS::CloudWatch::Dashboard');
    const dashboardBody = JSON.stringify(Object.values(dashboards)[0]);

    // Check Lambda metrics are included
    expect(dashboardBody).toContain('Lambda Invocations');
    expect(dashboardBody).toContain('Lambda Duration');
    expect(dashboardBody).toContain('Lambda Errors');
    expect(dashboardBody).toContain('Lambda Throttles');
  });

  it('should include API Gateway metrics in dashboard', () => {
    const { app, todoLambda, userLambda, api, todoTable, userTable } = createTestResources();

    const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
      todoLambda,
      userLambda,
      api,
      todoTable,
      userTable,
    });

    const template = Template.fromStack(monitoringStack);
    const dashboards = template.findResources('AWS::CloudWatch::Dashboard');
    const dashboardBody = JSON.stringify(Object.values(dashboards)[0]);

    // Check API Gateway metrics are included
    expect(dashboardBody).toContain('API Gateway Latency');
    expect(dashboardBody).toContain('API Gateway 4XX Errors');
    expect(dashboardBody).toContain('API Gateway 5XX Errors');
    expect(dashboardBody).toContain('API Gateway Request Count');
  });

  it('should include DynamoDB metrics in dashboard', () => {
    const { app, todoLambda, userLambda, api, todoTable, userTable } = createTestResources();

    const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
      todoLambda,
      userLambda,
      api,
      todoTable,
      userTable,
    });

    const template = Template.fromStack(monitoringStack);
    const dashboards = template.findResources('AWS::CloudWatch::Dashboard');
    const dashboardBody = JSON.stringify(Object.values(dashboards)[0]);

    // Check DynamoDB metrics are included
    expect(dashboardBody).toContain('DynamoDB Consumed Read Capacity');
    expect(dashboardBody).toContain('DynamoDB Consumed Write Capacity');
    expect(dashboardBody).toContain('DynamoDB Throttled Requests');
    expect(dashboardBody).toContain('DynamoDB Latency');
  });

  it('should include all DynamoDB operation types in latency metrics', () => {
    const { app, todoLambda, userLambda, api, todoTable, userTable } = createTestResources();

    const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
      todoLambda,
      userLambda,
      api,
      todoTable,
      userTable,
    });

    const template = Template.fromStack(monitoringStack);
    const dashboards = template.findResources('AWS::CloudWatch::Dashboard');
    const dashboardBody = JSON.stringify(Object.values(dashboards)[0]);

    // Check all DynamoDB operation types are monitored
    const operations = ['GetItem', 'PutItem', 'UpdateItem', 'DeleteItem', 'Query', 'Scan'];
    operations.forEach((operation) => {
      expect(dashboardBody).toContain(operation);
    });
  });

  it('should use dynamic API name reference', () => {
    const { app, todoLambda, userLambda, api, todoTable, userTable } = createTestResources();

    const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
      todoLambda,
      userLambda,
      api,
      todoTable,
      userTable,
    });

    const template = Template.fromStack(monitoringStack);
    const dashboards = template.findResources('AWS::CloudWatch::Dashboard');
    const dashboardBody = JSON.stringify(Object.values(dashboards)[0]);

    // API name should be referenced dynamically (Test API from test resources)
    expect(dashboardBody).toContain('Test API');
  });
});
