---
title: "Handling High Traffic Loads"
date: 2024-01-18T11:09:38+02:00
draft: false
tags: []
---

I failed my first interview with a company. The reason for my failure was not revealed, but I suspect it was because I was caught off guard by one of the questions. The interviewer asked me to describe an example of handling high traffic loads from my professional experience. While "high load" is a relative concept, I have never faced the issue of insufficient resources. All the issues I have faced with a lack of resources were easily resolved. That's why I thought I had never worked with "high load" before.

However, I now understand why this happened. I researched the topic and found out that all I had done before in my programming experience was building an architecture that could handle high load easily. I am very enthusiastic about **functional programming**, where the code consists of simple (pure) functions that depend only on their arguments. This not only makes the code very robust and simple but also multithread friendly.

In addition, I have experience with **microservice architecture**. We used it in the last three years while rewriting Baja Bikes monolith with loosely coupled **microservices in Go**. In our case, it was lambda functions, but the Kubernetes shift can be done easily, and voila, we have a scalable system from the bottom.

For some applications, we used **CQRS**, a practice that helps separate read and write operations by different threads. This, along with the **master-slave approach for SQL databases**, can be a deal when an application heavily uses SQL databases. When it comes to databases, it's worth mentioning that both **MongoDb and DynamoDb**, which are document-oriented databases, have a huge possibility to scale horizontally. To finish with databases, I should mention **Cassandra**, which has almost unlimited opportunities to scale.

Another approach would include a different type of caching proxy (**Nginx, Varnish**) - it was so obvious that I forget to mention it. However, one thing that I definitely missed is performance monitoring. While I almost never had an issue with performance, I never had a chance to use it.

Overall, after learning my lesson and reviewing my experience, I feel more confident in case someone asks me that question again.  
Am I missing something? Please, let me know in the comments.

{{< comments >}}
