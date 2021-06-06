import * as lambda from "@aws-cdk/aws-lambda";
import { Construct, Duration } from "@aws-cdk/core";
import { spawnSync } from "child_process";
import * as path from "path";
import * as logs from "@aws-cdk/aws-logs";
import * as ec2 from "@aws-cdk/aws-ec2";

interface GolangFunctionProps {
  functionName: string;
  dir_path: string;
  timeout: Duration;
  environment?: { [key: string]: string };
  vpc?: ec2.IVpc;
  vpcSubnets?: ec2.SubnetSelection;
  securityGroups?: ec2.ISecurityGroup[];
}

export function newGolangFunction(
  scope: Construct,
  id: string,
  props: GolangFunctionProps
) {
  return new lambda.Function(scope, id, {
    functionName: props.functionName,
    runtime: lambda.Runtime.GO_1_X,
    logRetention: logs.RetentionDays.ONE_MONTH,
    vpc: props.vpc,
    vpcSubnets: props.vpcSubnets,
    securityGroups: props.securityGroups,
    handler: "main",
    code: lambda.Code.fromAsset(path.join(__dirname, props.dir_path), {
      bundling: {
        image: lambda.Runtime.GO_1_X.bundlingDockerImage,
        command: [],
        local: {
          tryBundle(outputDir: string) {
            try {
              spawnSync("go version");
            } catch {
              return false;
            }

            spawnSync(
              `go build -ldflags="-s -w" -o ${path.join(outputDir, "main")}`,
              {
                cwd: path.join(__dirname, props.dir_path),
                shell: true,
                env: { ...process.env, GOOS: "linux" },
              }
            );
            return true;
          },
        },
      },
    }),
    timeout: props.timeout,
    environment: { PROD: "PROD", ...props.environment },
  });
}
