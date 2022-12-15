---
layout: post.njk
tags: post
title: Final
date: 2022-12-15 09:00:00 -4
description: This week I wrap up the project and reflect on the independent study.
---
![Dilbert](/images/Week4/dilbert.gif)

## Frontend
In the last post I was able to get the AWS Backend of sending the email working. However, this would not be a very usable program unless website owners had a chance to view the responses of their form in something other than an email. This would be helpful incase some of the responses get lost, or the website owner simply does not see them. Therefore, the main goal for this frontend was to show the owner their forms and their associated responses.

### Angular
To create this web frontend I used the Angular framework. Angular allows me to create neat, reusable components and has graphic libraries that allow me to create functional user interfaces really quickly. Angular also comes bundled with functions that allow me to send GET and POST requests to servers like AWS Api Gateway. Here is what my Frontend design ended up looking like: 
![Frontend](/images/Week4/frontend.png)

The section on the left labeled "Forms" allows the user to see all of the available forms they have created. Clicking on one of these forms will make it selected and display all the form responses on the right with the timestamp from when the form was submitted. Clicking on one of these forms will show the user the specific form response that was submitted.

![Popup](/images/Week4/popup.png)

Here is an example from what a form response could look like. It is important to note that the information included in the email will be the exact same information that is included in the form response. 

## New Endpoints
There were 2 new API Gateway endpoints that needed to be added in order to support the Frontend.
### Get Mailboxes
A mailbox refers to a form. When the user creates a new form, a new mailbox is created in the database. Anytime someone submits a response to this form, a new "letter" is deposited in this mailbox. Each user will have a number of mailboxes assigned to their account depending on how many they have created. A new API Gateway endpoint was created that passes in the user's id and returns a list of mailboxes that the user has access to. In the example above, this user has access to the "My Cool Form" mailbox and the "An EVEN COOLER Form" mailbox.
### Get Letters
Another endpoint that needed to be added was the get letters mailbox. This takes in the mailbox id and returns all of the letters that are in that mailbox. When a user selects a form from the "Forms" section on Frontend, the endpoint is called and passes in the mailbox id for that form. The lambda function then queries the DynamoDB database to retrieve all the responses associated with that mailbox id. 

## Lambda code for each
Here is the lambda function to get mailboxes from a user:
```js
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

export const handler = async(event) => {
    const dynamodb = new DynamoDBClient({ region: "us-east-1" });
    
    let getMailboxes = new QueryCommand({
        TableName: 'letterAddressLookup',
        IndexName: 'accountOwner-index',
        KeyConditionExpression: "accountOwner = :a",
      ExpressionAttributeValues: {
        ":a": { S: event["body"] },
      },
    });
    
    let getMailboxesResponse = await dynamodb.send(getMailboxes);
    
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
          },
        body: JSON.stringify(getMailboxesResponse),
    };
    return response;
};
```

And the lambda function that get the form responses from a mailbox:
```python
import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.client('dynamodb')

    response = dynamodb.get_item(
        TableName='letterAddressLookup',
        Key={
            'id': {
                'S': event["body"] # entire body is form id
            }
        }
    )
    
    # grab the submissions
    print(response)
    submissions = response["Item"]["submissions"]
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
        },
        'body': json.dumps(submissions)
    }
```

## Reflection
I would like to take some time to reflect on my experiences with this independent study. Overall, I am proud of the work I did and the knowledge I gained. I was about to complete a Udemy course to prepare for the AWS Certified Developer Associate Exam: [Ultimate AWS Certified Developer Associate 2022](https://www.udemy.com/course/aws-certified-developer-associate-dva-c01) I enjoyed the way the teacher was able to simplify complex concepts as well as the labs meant to get first hand knowledge on these systems. My AWS exam is scheduled and I hope to pass and earn the certification. As for my final project, I was glad that I was about to make a working prototype and work on an application that solved real problems for me. I am also happy about how I was able to get this blog working using only AWS services. One thing I wish I could've done better is updating this blog. My goal at the beginning of this semester was to update this blog once a week. I obviously fell short of that goal. One of the main reasons was that I didn't realize how much work each blog post was. I had to type up an interesting post every week, complete with code and example and pictures and it was a lot more than I expected. I also ended up backloading this class, pushing off a lot of the work to the end of the semester. I believe this is because of the nature of the independent study. Without weekly assignments, I felt like I could fall behind with no consequences, which caught up to me in the end. When other classes and extra curriculars became more busy, this class because the easiest to cut. It is simply the nature of independent studies and certainly is a learning experience. I feel like I work better with a more structured class, and now I know for the future of what to expect for these kinds of courses. Overall, I think it was a great learning experience in all aspects and I have greatly expanded my knowledge of AWS which will definitely help me in the future.