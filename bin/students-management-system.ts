import * as cdk from "@aws-cdk/core";
import { MyStack } from "../lib/stacks/my-stack";
import { environment } from "../environment";

const app = new cdk.App();

new MyStack(app, "MyStack", {
  env: {
    account: environment.ACCOUNT_ID,
    region: environment.REGION,
  },
});
