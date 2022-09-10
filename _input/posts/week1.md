---
layout: post.njk
tags: post
title: The Beginning
date: 2022-09-10 09:00:00 -4
description: This week I introduce the independent study with a tutorial on how to setup the very website you are reading.
---

## Welcome
Hello! Welcome to my blog. I will be using this website to document my independent study, Cloud Computing & AWS. It's pretty basic for now, but will be improved throughout the semester. The goal of this independent study is to prepare of the [AWS Certified Developer Associate Exam](https://aws.amazon.com/certification/certified-developer-associate/), an exam designed to "validate the ability to write and deploy cloud-based applications."
## Getting Started
This week I will talk about how to set up the very blog you are reading right now. As you can imagine, this blog utilizes AWS services to send this page to your browser. This tutorial assumes that you have a basic understanding of GitHub and AWS.
## Website
As for the website frontend, I am currently using [11ty](https://www.11ty.dev/), which is a popular static site generator and [Tailwind CSS](https://tailwindcss.com/), a css library to make the website responsive. I am not going to go in-depth about creating the actual website simply because it is outside the scope of this post.
### Setup
1. Fork the [Blog Template](https://github.com/QuintinIoime/BlogTemplate/fork) into your own GitHub account.
> That's it! You can test to see what the site looks like locally by running the `npm install & npm run build` command. Your website will appear in the _output folder!
## Pipeline
![GitHub -> AWS CodePipeline -> AWS S3](/images/Week1-Pipeline.svg)
For this website to work, it needs to somehow get into the cloud. For this we will be using AWS CodePipeline, a continuous integration and deployment tool that will connect with GitHub to automate our deployments. Any change that is detected in GitHub will trigger the CodePipeline and subsequent building and deployment of our application.
### Setup
1. ![S3 Landing Page](/images/Week1-BucketManagement.png) Go to [Amazon S3](https://s3.console.aws.amazon.com/s3/buckets?region=us-east-1) and click "Create Bucket"
2. ![S3 Create Bucket](/images/Week1-CreateBucket.png) Under "Bucket name" give the bucket a name. Make sure the region is "us-east-1". Then click "Create bucket"
3. ![CodePipeline Landing Page](/images/Week1-Codepipeline-landing.png) Go to the [AWS CodePipeline Page](https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/start?region=us-east-1) and click the Create Pipeline button.
4. ![CodePipeline Step 1](/images/Week1-Codepipeline-step1.png) Fill in a pipeline name and select "New service role". Click the next button.
5. ![CodePipeline Step 2](/images/Week1-Codepipeline-step2.png) Make sure to select "Github (Version 2)" as your source provider. More settings should now pop up. Under "Connection", click the "Connect to GitHub" button and sign in to your GitHub account. Under "Repository name" put the repository that you forked and under "Branch name" put the main branch. Make sure "Start the pipeline on source code change" is checked. Click the next button.
6. ![CodePipeline Step 3](/images/Week1-Codepipeline-step3.png) Under "Build provider" select AWS CodeBuild. Under "Project name" click the "Create project" button.
7. ![CodePipeline Build Project](/images/Week1-Codepipeline-buildproject.png) A new window should pop up. Under "Project name" name it `11ty_Build` since we are compiling an 11ty project.
8. ![CodePipeline Build Project](/images/Week1-Codepipeline-buildspec.png) Scroll down to Enviornment and for Operating System click "Amazon Linux 2" then under Runtime select "Standard" and under Image select "aws/codebuild/amazonlinux2-x86_64-standard:4.0". Scrolldown to buildspec and click the "Insert build commands" button. Click the "Switch to editor" button. Paste the following code and click "Continue to CodePipeline"
```yaml
version: 0.2

phases:
  install:
    runtime-versions:
        nodejs: 16
    commands:
        - echo Installing source NPM dependencies...
        - npm install
  build:
    commands:
        - echo Production Build started 
        - npm run build
artifacts:
    files:
        - '**/*'
    base-directory: '_output'
```
9. ![CodePipeline Next](/images/Week1-Codepipeline-next.png) Click next
10. ![CodePipeline Deploy](/images/Week1-Codepipeline-deploy.png) Under Deploy Provider select "Amazon S3". Under Bucket, select the bucket that we created earlier. Make sure to check "Extract file before deploy" and click Next.
11. Review your pipeline and click "Create pipeline"
> That's it! Once the pipeline completes its intial runthrough, the completed build files will appear in your S3 bucket, if it was setup correctly. In the next section we will talk about how to deploy your website to the internet.
## Hosting
![GitHub -> AWS CodePipeline -> AWS S3](/images/Week1-Hosting.svg)
We will be using AWS Cloudfront in order to host this website. AWS Cloudfront is a CDN service that provides cheap, fast file delivery to users around the world.
### Cloudfront Functions
Cloudfront Functions provide a way for us to transform the request that a user sends. This allows us to have a user access example.com/posts.html by going to example.com/posts/. This allows our URLs to look cleaner, without file extensions than they would before. We need to setup the cloudfront function before creating the distribution.
1. ![Cloudfront Functions](/images/Week1-Cloudfront-functions.png) Go to the [Cloudfront Functions](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/functions) page. Click "Create function"
2. ![Cloudfront Createfunction](/images/Week1-Cloudfront-Createfunction.png) Enter a name and click "Create function"
3. ![Cloudfront Function code](/images/Week1-Cloudfront-functioncode.png) Under "Function code" paste the following code in. Then click "Save changes"
```js
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Check whether the URI is missing a file name.
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // Check whether the URI is missing a file extension.
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
```
4. ![Cloudfront Public function](/images/Week1-Cloudfront-publishfunction.png) Then click the publish tab and click the "Publish function" button.
### Cloudfront
1. ![Cloudfront Create distribution](/images/Week1-Cloudfront-Createdistribution.png) Go to the CloudFront distribution page and click the "Create Distribution" button
2. For "Origin domain" choose the S3 bucket that we created as part of the Codepipeline. Under "Origin access" select "Legacy access identities", and click "Yes, update the bucket policy". Then click the "Create new OAI" button, and create. Under the "Default cache behavior" section select "Redirect HTTP to HTTPS". Under "Function associations" under Viewer request click "Cloudfront Functions" and select the function we created before. Then under "Settings" click "Use only North America and Europe" to reduce costs. Then click "Create distribution"
> That's it! Now just wait until the distribution is deployed. Then you can click the distribution domain name to view your website content!