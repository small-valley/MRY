import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { BucketConstruct } from "./bucket.constract";

export class CdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new BucketConstruct(this, "BucketConstruct", props);
    }
}
