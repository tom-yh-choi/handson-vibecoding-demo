import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface MonitoringStackProps extends cdk.StackProps {
  readonly todoLambda: lambda.IFunction;
  readonly userLambda: lambda.IFunction;
  readonly api: apigateway.IRestApi;
  readonly todoTable: dynamodb.ITable;
  readonly userTable: dynamodb.ITable;
}

export class MonitoringStack extends cdk.Stack {
  public readonly dashboard: cloudwatch.Dashboard;

  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    const { todoLambda, userLambda, api, todoTable, userTable } = props;

    // CloudWatch Dashboard 생성
    this.dashboard = new cloudwatch.Dashboard(this, 'TodoAppDashboard', {
      dashboardName: 'TodoApp-Operational-Dashboard',
    });

    // Lambda 메트릭 위젯
    const lambdaInvocationsWidget = new cloudwatch.GraphWidget({
      title: 'Lambda Invocations',
      left: [
        todoLambda.metricInvocations({ statistic: 'Sum', period: cdk.Duration.minutes(5) }),
        userLambda.metricInvocations({ statistic: 'Sum', period: cdk.Duration.minutes(5) }),
      ],
      width: 12,
      height: 6,
    });

    const lambdaDurationWidget = new cloudwatch.GraphWidget({
      title: 'Lambda Duration (ms)',
      left: [
        todoLambda.metricDuration({ statistic: 'Average', period: cdk.Duration.minutes(5) }),
        userLambda.metricDuration({ statistic: 'Average', period: cdk.Duration.minutes(5) }),
      ],
      width: 12,
      height: 6,
    });

    const lambdaErrorsWidget = new cloudwatch.GraphWidget({
      title: 'Lambda Errors',
      left: [
        todoLambda.metricErrors({ statistic: 'Sum', period: cdk.Duration.minutes(5) }),
        userLambda.metricErrors({ statistic: 'Sum', period: cdk.Duration.minutes(5) }),
      ],
      width: 12,
      height: 6,
    });

    const lambdaThrottlesWidget = new cloudwatch.GraphWidget({
      title: 'Lambda Throttles',
      left: [
        todoLambda.metricThrottles({ statistic: 'Sum', period: cdk.Duration.minutes(5) }),
        userLambda.metricThrottles({ statistic: 'Sum', period: cdk.Duration.minutes(5) }),
      ],
      width: 12,
      height: 6,
    });

    // API Gateway 메트릭 위젯 - restApiName을 동적으로 참조
    const apiName = api.restApiName;

    const apiLatencyWidget = new cloudwatch.GraphWidget({
      title: 'API Gateway Latency (ms)',
      left: [
        new cloudwatch.Metric({
          namespace: 'AWS/ApiGateway',
          metricName: 'Latency',
          dimensionsMap: {
            ApiName: apiName,
          },
          statistic: 'Average',
          period: cdk.Duration.minutes(5),
        }),
      ],
      width: 12,
      height: 6,
    });

    const api4xxErrorsWidget = new cloudwatch.GraphWidget({
      title: 'API Gateway 4XX Errors',
      left: [
        new cloudwatch.Metric({
          namespace: 'AWS/ApiGateway',
          metricName: '4XXError',
          dimensionsMap: {
            ApiName: apiName,
          },
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }),
      ],
      width: 12,
      height: 6,
    });

    const api5xxErrorsWidget = new cloudwatch.GraphWidget({
      title: 'API Gateway 5XX Errors',
      left: [
        new cloudwatch.Metric({
          namespace: 'AWS/ApiGateway',
          metricName: '5XXError',
          dimensionsMap: {
            ApiName: apiName,
          },
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }),
      ],
      width: 12,
      height: 6,
    });

    const apiRequestCountWidget = new cloudwatch.GraphWidget({
      title: 'API Gateway Request Count',
      left: [
        new cloudwatch.Metric({
          namespace: 'AWS/ApiGateway',
          metricName: 'Count',
          dimensionsMap: {
            ApiName: apiName,
          },
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }),
      ],
      width: 12,
      height: 6,
    });

    // DynamoDB 메트릭 위젯
    const dynamoDbReadCapacityWidget = new cloudwatch.GraphWidget({
      title: 'DynamoDB Consumed Read Capacity',
      left: [
        todoTable.metricConsumedReadCapacityUnits({
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }),
        userTable.metricConsumedReadCapacityUnits({
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }),
      ],
      width: 12,
      height: 6,
    });

    const dynamoDbWriteCapacityWidget = new cloudwatch.GraphWidget({
      title: 'DynamoDB Consumed Write Capacity',
      left: [
        todoTable.metricConsumedWriteCapacityUnits({
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }),
        userTable.metricConsumedWriteCapacityUnits({
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }),
      ],
      width: 12,
      height: 6,
    });

    const dynamoDbThrottledRequestsWidget = new cloudwatch.GraphWidget({
      title: 'DynamoDB Throttled Requests',
      left: [
        new cloudwatch.Metric({
          namespace: 'AWS/DynamoDB',
          metricName: 'ThrottledRequests',
          dimensionsMap: {
            TableName: todoTable.tableName,
          },
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }),
        new cloudwatch.Metric({
          namespace: 'AWS/DynamoDB',
          metricName: 'ThrottledRequests',
          dimensionsMap: {
            TableName: userTable.tableName,
          },
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }),
      ],
      width: 12,
      height: 6,
    });

    // DynamoDB 작업 타입별 레이턴시 - 모든 주요 작업 모니터링
    const dynamoDbOperations = ['GetItem', 'PutItem', 'UpdateItem', 'DeleteItem', 'Query', 'Scan'];

    const dynamoDbLatencyWidget = new cloudwatch.GraphWidget({
      title: 'DynamoDB Latency (ms)',
      left: dynamoDbOperations.flatMap((operation) => [
        new cloudwatch.Metric({
          namespace: 'AWS/DynamoDB',
          metricName: 'SuccessfulRequestLatency',
          dimensionsMap: {
            TableName: todoTable.tableName,
            Operation: operation,
          },
          statistic: 'Average',
          period: cdk.Duration.minutes(5),
          label: `Todo-${operation}`,
        }),
        new cloudwatch.Metric({
          namespace: 'AWS/DynamoDB',
          metricName: 'SuccessfulRequestLatency',
          dimensionsMap: {
            TableName: userTable.tableName,
            Operation: operation,
          },
          statistic: 'Average',
          period: cdk.Duration.minutes(5),
          label: `User-${operation}`,
        }),
      ]),
      width: 12,
      height: 6,
    });

    // 대시보드에 위젯 추가
    this.dashboard.addWidgets(
      new cloudwatch.TextWidget({
        markdown: '# Lambda Metrics',
        width: 24,
        height: 1,
      }),
    );
    this.dashboard.addWidgets(lambdaInvocationsWidget, lambdaDurationWidget);
    this.dashboard.addWidgets(lambdaErrorsWidget, lambdaThrottlesWidget);

    this.dashboard.addWidgets(
      new cloudwatch.TextWidget({
        markdown: '# API Gateway Metrics',
        width: 24,
        height: 1,
      }),
    );
    this.dashboard.addWidgets(apiLatencyWidget, apiRequestCountWidget);
    this.dashboard.addWidgets(api4xxErrorsWidget, api5xxErrorsWidget);

    this.dashboard.addWidgets(
      new cloudwatch.TextWidget({
        markdown: '# DynamoDB Metrics',
        width: 24,
        height: 1,
      }),
    );
    this.dashboard.addWidgets(dynamoDbReadCapacityWidget, dynamoDbWriteCapacityWidget);
    this.dashboard.addWidgets(dynamoDbThrottledRequestsWidget, dynamoDbLatencyWidget);

    // 스택 출력값 설정
    new cdk.CfnOutput(this, 'DashboardUrl', {
      value: `https://${this.region}.console.aws.amazon.com/cloudwatch/home?region=${this.region}#dashboards:name=${this.dashboard.dashboardName}`,
      description: 'CloudWatch Dashboard URL',
    });
  }
}
