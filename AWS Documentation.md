Below is the ABAC shared-role model, modified to use:

✅ Separate DynamoDB table per tenant

✅ Separate S3 bucket per tenant

✅ One shared role

✅ Isolation enforced via principal tags

✅ No role explosion

Using:

Amazon Web Services

AWS Identity and Access Management

AWS Security Token Service

🏗 Architecture

For tenant tenant123:

DynamoDB table:  tenant-tenant123-table
S3 bucket:       tenant-tenant123-bucket

IAM user:        tenant-tenant123-user (tag tenantId=tenant123)
        ↓
Assume SharedTenantAccessRole (with tag)
        ↓
Policy dynamically resolves:
  table → tenant-${tenantId}-table
  bucket → tenant-${tenantId}-bucket


No per-tenant roles required.

🔧 Assumptions
ACCOUNT_ID=123456789012
REGION=us-east-1
TENANT_ID=tenant123


Resource naming convention:

DynamoDB: tenant-<tenantId>-table
S3:       tenant-<tenantId>-bucket

1️⃣ Create the Shared Role
Trust Policy

shared-role-trust.json

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "aws:RequestTag/tenantId": "${aws:PrincipalTag/tenantId}"
        },
        "ForAllValues:StringEquals": {
          "aws:TagKeys": ["tenantId"]
        }
      }
    }
  ]
}


Create role:

aws iam create-role \
  --role-name SharedTenantAccessRole \
  --assume-role-policy-document file://shared-role-trust.json

2️⃣ Attach ABAC Policy to Role

shared-tenant-policy.json

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "TenantDynamoAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/tenant-${aws:PrincipalTag/tenantId}-table"
    },
    {
      "Sid": "TenantS3Access",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::tenant-${aws:PrincipalTag/tenantId}-bucket",
        "arn:aws:s3:::tenant-${aws:PrincipalTag/tenantId}-bucket/*"
      ]
    }
  ]
}


Attach:

aws iam put-role-policy \
  --role-name SharedTenantAccessRole \
  --policy-name SharedTenantPolicy \
  --policy-document file://shared-tenant-policy.json


Now the role dynamically resolves:

tenant-tenant123-table
tenant-tenant123-bucket


based solely on the session tag.

3️⃣ Create Tenant Resources
DynamoDB Table
aws dynamodb create-table \
  --table-name tenant-${TENANT_ID}-table \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ${REGION}

S3 Bucket
aws s3api create-bucket \
  --bucket tenant-${TENANT_ID}-bucket \
  --region ${REGION}


(Region-specific configuration may require --create-bucket-configuration outside us-east-1.)

4️⃣ Create Tenant IAM User
aws iam create-user \
  --user-name tenant-${TENANT_ID}-user

Tag the User
aws iam tag-user \
  --user-name tenant-${TENANT_ID}-user \
  --tags Key=tenantId,Value=${TENANT_ID}


This is critical for isolation.

5️⃣ Allow User to Assume Shared Role

tenant-assume-role.json

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::123456789012:role/SharedTenantAccessRole"
    }
  ]
}


Attach:

aws iam put-user-policy \
  --user-name tenant-${TENANT_ID}-user \
  --policy-name AllowAssumeSharedRole \
  --policy-document file://tenant-assume-role.json

6️⃣ Tenant Assumes Role
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/SharedTenantAccessRole \
  --role-session-name tenant-session \
  --tags Key=tenantId,Value=${TENANT_ID}


Returned credentials can now access only:

tenant-tenant123-table
tenant-tenant123-bucket

🔐 Why This Is Strong Isolation

IAM policy evaluates:

${aws:PrincipalTag/tenantId}


If a tenant attempts to access:

tenant-otherTenant-table


The ARN won’t match → Access denied.

Even if application code has a bug, cross-tenant access is blocked at IAM.

🚀 Scaling Characteristics

This model gives you:

1 shared role

1 shared policy

N tables

N buckets

N IAM users

No IAM role explosion.




# Multi-Tenant AWS Setup  
## One Shared Role + Separate DynamoDB Tables and S3 Buckets per Tenant

This document describes a **scalable multi-tenant model** using AWS, where each tenant has separate DynamoDB tables and S3 buckets, but all tenants share **one IAM role**. Isolation is enforced using **principal tags** (ABAC – Attribute-Based Access Control), which allows strong tenant isolation without creating a separate role per tenant.

We use:

- **Amazon Web Services (AWS)**  
- **AWS Identity and Access Management (IAM)**  
- **AWS Security Token Service (STS)**  

---

# Architecture Overview

For a single tenant (`tenant123`):

