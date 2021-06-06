import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as lambda_node from "@aws-cdk/aws-lambda-nodejs";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as path from "path";
import * as defaults from "../extras/defaults";
import * as logs from "@aws-cdk/aws-logs";
import { newGolangFunction } from "../extras/golang_lambda";

interface MultiStackProps extends cdk.StackProps {}

export class MyStack extends cdk.Stack {
  api: apigw.RestApi;

  constructor(scope: cdk.Construct, id: string, props: MultiStackProps) {
    super(scope, id, props);

    this.api = new apigw.RestApi(this, "rest-api");

    this.createResources();
  }

  private createResources() {
    const nodeResource = this.api.root.addResource("nodejs");
    nodeResource.addMethod(
      "OPTIONS",
      defaults.mockIntegration,
      defaults.options
    );
    this.createNodejsFunction(nodeResource);

    const golangResource = this.api.root.addResource("golang");
    golangResource.addMethod(
      "OPTIONS",
      defaults.mockIntegration,
      defaults.options
    );
    this.createGolangFunction(golangResource);
  }

  private createNodejsFunction(resource: apigw.Resource) {
    const fn = new lambda_node.NodejsFunction(this, "test-node", {
      functionName: "test-node",
      runtime: lambda.Runtime.NODEJS_12_X,
      logRetention: logs.RetentionDays.ONE_MONTH,
      entry: path.join(__dirname, "../lambdas/nodejs/index.js"),
      environment: {
        PROD: "PROD",
      },
    });

    resource.addMethod("GET", defaults.lambdaIntegration(fn, {}), {
      ...defaults.options,
    });
  }

  private createGolangFunction(resource: apigw.Resource) {
    const fn = newGolangFunction(this, "test-go", {
      functionName: "test-go",
      dir_path: "../lambdas/golang",
      timeout: cdk.Duration.seconds(10),
      environment: {},
    });

    resource.addMethod("GET", defaults.lambdaIntegration(fn, {}), {
      ...defaults.options,
    });
  }
}
