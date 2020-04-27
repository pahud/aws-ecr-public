# Deploy with AWS CDK

You may deploy this service with AWS CDK to any AWS commercial regions including AWS China regions(`cn-north-1` and `cn-northwest-1`).

Cross-account Amazon ECR registry access is supported as well.


To deploy it with Amaozn ECR of the same account as the origin

```bash
$ cdk deploy
```

To deploy it with Amaozn ECR of another AWS account as the origin

```bash
$ cdk deploy -c registry_id=ECR_REGISTRY_ID
```

To deploy it with [nwcdlabs/container-mirror](https://github.com/nwcdlabs/container-mirror) as the ECR upstream origin

```bash
$ cdk deploy --profile zhy registry_id=048912060910      
```
Outputs
```
Outputs:
CdkStack.DomainName = c2rbvtozqf.execute-api.cn-northwest-1.amazonaws.com.cn
CdkStack.RestApiEndpoint0551178A = https://c2rbvtozqf.execute-api.cn-northwest-1.amazonaws.com.cn/v2/
```
* please note you will get a different unique `DomainName`

After deployment is completed, you will be able to `docker pull` images anonymously simply like this

```bash
# docker pull nginx images provided by NWCD
$ docker pull c2rbvtozqf.execute-api.cn-northwest-1.amazonaws.com.cn/dockerhub/nginx
```

![](images/01.png)

### Destroy the Stack

```bash
$ cdk destroy
```