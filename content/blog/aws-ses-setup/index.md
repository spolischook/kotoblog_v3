---
author: "Serhii Polishchuk"
title: "AWS SES setup"
date: 2021-02-15
tags: []
draft: false
---
<!--more-->
## Simple Email Service (SES)
- Login to AWS console as root user
- Go to the Simple Email Service (SES) -> Domains
- Verify a New Domain. Check Generate DKIM Settings checkbox.
- Download CSV and carefully store DNS settings. Add your DNS records

## Simple Notification Service (SNS)
### Create Topic
- Login to AWS console as root user
- Go to the Simple Notification Service (SES) -> Topics
- Create a topic
- Choose Standard type, and put meaningful Name
- In the Access policy make sure that only the owner of the topic can publish and subscribe to the topic

### Create Subscription
- Go to the Simple Notification Service (SES) -> Subscriptions
- Create subscription
- Choose Topic ARN that you created before, https protocol and endpoint with /ses/callback Uri
- Make sure that Enable raw message delivery is disabled
- In Delivery retry policy choose the optimal strategy

### Confirm Subscription
- On the list of Subscriptions choose one that was created and Request confirmation
- The Endpoint that was chosen was hit
- In server logs (Sentry?) find the request json
- In message field you will find the instruction, e.g. To confirm the subscription, visit the SubscribeURL included in this message.
- Follow url from SubscribeURL request field
- The status of the subscription should be changed to confirmed imedeantly

## Setup Notifications
- Go to Amazon SES -> Domains -> YouDomain
- In section Notifications press Edit Configuration
- Choose a created SNS topic for all type of events (Bounces, Complaints etc.)

## Get credentials
- Go to Amazon IAM -> Users -> Add User
- Set meaningful username and Programmatic access type
- Attach AmazonSESFullAccess policy
- Download credentials
- Set up credentials by adding MAILER_DSN envirorment variable with next value  ses+api://ACCESS_KEY_ID:SECRET_ACCESS_KEY@default?region=AWS_REGION
- Be aware that keys must be url encoded (php -r "echo urlencode('KEY').PHP_EOL;")

## Go out sendbox
New account placed in the Amazon SES sandbox. To move out follow the doc - https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html
