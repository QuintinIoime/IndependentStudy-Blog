---
layout: post.njk
tags: post
title: Changes
date: 2022-10-10 09:00:00 -4
description: This week I discuss the changes being made to the course and what is coming next.
---
![API Guide](/images/week3/api_xkcd.png)
## A Fresh Start
Welcome back. You may have noticed that there has been a 2 week gap in posts. During this time I did some reflecting on what I want to get out of the course and realized that the previous week's style of post was uninspired, boring, and unsustainable. So for the future, starting with today's post, I will be moving away from just summarizing what I have learned each week, and instead work on applying what I have learned into a project that will be worked on throughout the semester.

## The Program
For the project I wanted to pick a problem that I have experienced. Over the years I have made lots of websites. Some of these websites required a way for readers to be able to contact the owners of the website. However, putting an email address on the website leads to spam, and it's expensive to run an entire email server solely to forward info from a webform. There are some solutions out there that solve this problem already, such as [Formspree](https://formspree.io/) which use an API to forward form information to the user. This solution is also expensive as well with their cheapest plan being $8 per month, which is too much for websites that are only expecting a few submissions a month. 

## The Project
Therefore, for this project I am going to build a similar solution on AWS. My goal will be minimizing costs while still providing a fast experience for users. The original MVP will be as follows: 
> Create an API that allows users to submit formdata to a specific email address without revealing said email address to the user.

This will be a challenging project but I believe I can have it completed by the end of the semester. Another goal that I have for this project is to make it completely serverless and event driven. That means that there are no servers running, and costing money, waiting for a user to submit a form, but costs are only incurred when a form is actually submitted. 

## The Architecture
The following is my current architecture diagram:
![Architecture](/images/week3/architecture_V1.png)
I am currently using 4 AWS services in conjunction, API Gateway, Lambda, DynamoDB, and SES. I will go through each of these in detail.

### User
First I want to talk a bit about the user. The user is the person who is submitting a form on a website. The user interacts with the form directly. A form should be able to have as many or as few fields as it needs. The API should not care what the frontend of the form looks like, or what is in it, it only cares about the formdata that is sent from the form to it. The API need not know what fields are available, it should be able to handle any kind.
![An Example Form](/images/week3/form.png)
```html
<form action="https://amhkcrh3v7.execute-api.us-east-1.amazonaws.com/prod/abcdef" method="post">
  <label for="email">Your Email</label>
  <input name="Email" id="email" type="email"><br/>
  <label for="name">Your Name</label>
  <input name="Text" id="name" type="text"><br/>
  <button type="submit">Submit</button>
</form>
```
Here is an example form and the html code that generates it. Notice the form action, it is connecting to the API when the user hits submit. No email address is exposed instead the "abcdef" code is the API endpoint that maps to the user's email address.
### Api Gateway
In order to facilitate this submission we need an API. For this I am using the AWS service called API Gateway. An API or an Application Programming Interface allows developers to put their logic behind a "wall" so end users can only access it in certain ways. This API Gateway specifically only allows users to submit formdata using the POST endpoint. It then passes the form data that it received to the AWS Lambda function.
### Lambda
AWS Lambda is a serverless compute framework that allows you to run event driven functions. In this case when a new form is submitted through the API Gateway, it triggers a lambda function to run. Here is the code for my specific lambda function that runs every time a new form is submitted: 
```python
import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.client('dynamodb')
    ses = boto3.client('ses')

    data = dynamodb.get_item(
        TableName='letterAddressLookup',
        Key={
            'id': {
                'S': event["pathParameters"]["form"]
            }
        }
    )
    
    try:
        email = data["Item"]["email"]["S"]
    except KeyError:
        return {'statusCode': 404}
    else:
        # use the email to trigger SES and send a message
        print(event)
        # print event
        letterContent = json.loads(event["body"])
        message = ""
        
        for field in letterContent:
            message += "<p><b>" + field + ": </b>"
            message += letterContent[field] + "</p>"
        
        response = ses.send_email(
            Source='testing@leetform.com',
            Destination={
                'ToAddresses': [
                    email,
                ]
            },
            Message={
                'Subject': {
                    'Data': 'New submission from XXXXXXXXXX',
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Html': {
                        'Data': '<p>Someone just submitted your form, here is what they had to say:</p>' + message,
                        'Charset': 'UTF-8'
                    },
                    'Text': {
                        'Data': 'This is the message body in text format.',
                        'Charset': 'UTF-8',
                    },
                }
            }
        )
        return {'statusCode': 200, 'body': json.dumps(event)}
```
Lambda allows you to write functions in multiple different languages but I chose Python since it is the one that I am the most comfortable with and is the easiest to iterate. This lambda function checks with DynamoDB to grab the email, and sends the email with the formdata if it exists. Eventually all of the formID will be unique UUIDs making them impossible to guess. This is how we are able to hide the email from the user submitting the form.
### DynamoDB
DynamoDB is AWS's offering for a NoSQL database and it is the main database that I will be using for this project. It offers serverless functionality and costs no money when it is not being used. It also has no schema needed, meaning I can change what columns I use for every single input, which is helpful for rapid development. Here is a picture of what the database currently looks like.
![An Example Form](/images/week3/dynamoDB_scan.png)
The database currently has 2 columns, an id and an email. The id is found in the POST url for the form. The email is what connects itself to the id. This allows us to send an email to a specific person without having to reveal the email to the wider internet. It is similar to how a url shortener works.
### SES
The final piece of the puzzle is AWS SES or Simple Email Service. This service allows you to send emails without having to manage an entire email server yourself.
![An Example Email](/images/week3/email.png)
Here is an example email that could be sent with the form that was previously shown. It sends all the form data that was given in the form of an email to its intended recipient. All of this was done through the lambda function code.
## Next Steps
Since the MVP of this project has been completed, the next step is to give it frontend system. This would be a way for users to sign in, view their current forms, and generate a new form. That way users wouldn't need to access the API directly. Amazon also requires, as part of their SES service, to give a way for users to unsubscribe to emails. This is done to prevent spam, and is something that I will need to do in the future.