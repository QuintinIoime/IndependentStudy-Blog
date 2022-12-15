---
layout: post.njk
tags: post
title: All About EC2
date: 2022-09-17 09:00:00 -4
description: This week I discuss what I have learned about one of AWS's core services, EC2.
---
![Daddy, what are clouds made of? Linux servers, mostly](/images/week2/Week2-Clouds.jpg)

## Week 2
This week I learned a lot about one of AWS's original services when it was launched in 2006, EC2 or Elastic Compute Cloud.

## What is EC2
EC2 offers the ability for customers to have instantaneous, on demand compute power. Companies can rent servers from EC2 with no upfront costs. They may request as much or as little processing power as they need, and when they are done, they can turn it off. EC2 only charges you with what you used, and has per second billing.

## The power of EC2
EC2 has revolutionized the industry. Almost all of AWS's 300+ services are built on top of EC2. EC2's launch was the start of the Infrastructure as a Service (IaaS) model that gives businesses more flexibility and control over their IT systems. Never before could companies spin up an entire datacenter with no capital investment. Companies no longer needed to build in extra capacity to their servers in case they were under heavy load. Instead companies can scale their infrastructure up and down as they need it in seconds. It eliminates the need of multiple SysAdmins to keep everything running, and can simply be done by a programmer with the click of a button. It is truly a revolutionary service and hard to wrap my head around how much it has changed everything. EC2 has decreased the time that companies like Netflix, who has 100% of their infrastructure on AWS, needed to come to market. EC2 has been so successful that companies like Microsoft, Google, and Oracle now offer their own competing compute services. 

## Flexibility 
Not only is EC2 flexible from a pricing standpoint, but also a configuration standpoint. EC2 can be configured to have different amounts of memory, processors, and network bandwidth. Each different configuration of these variables is called an instance type. AWS offers over 400+ different instance types that users can choose from. They offer Memory Optimized instances to process large datasets, Compute Optimized for high performance applications and Storage Optimized for applications that need to write to disk frequently. AWS also offers thousands of AMIs (Amazon Machine Images) to choose from. An AMI is the operating system for your EC2. You can choose from one of the preconfigured OSes like Amazon Linux, Ubuntu, Debian, Windows or MacOS, choose from the thousands of flavors offered by Amazon Partners or roll your own AMI to plug into your EC2. 

## Downsides
While EC2 is pretty close to perfect, it does have some downsides. For one, it is not a managed service, meaning that you, the user, are responsible for software updates and patching security vulnerabilities in the operating system. Another downside to EC2 is the distance between yourself and the server. With an On-Premise infrastructure setup, there is very little latency between the client computer and the server, however with AWS, depending on your distance to a datacenter, latency could become an issue. There could also be issues with EC2 if your company has regulatory requirements that could frown upon using hardware that may be shared by other users. It would also be a concern if you needed to use a software license that is on a per-server basis.

However, I do believe that the upsides to using EC2 heavily outweigh the downsides and can't wait to build something with EC2 in the future!