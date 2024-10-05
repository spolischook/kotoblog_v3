---
title: "Rethinking Logging: Why Logging Shouldn't Depend on Dependency Injection"
date: 2024-06-29T10:52:31+02:00
draft: false
tags: [golang,symfony,di]
featured: true
---


As a developer with experience spanning Symfony and Golang, 
I’ve worked with different methods of handling dependencies in applications. 
One issue that keeps resurfacing, especially with frameworks like Symfony and libraries such as UberFX, 
is how logging is tightly coupled with dependency injection. 
While dependency injection (DI) is a powerful tool for managing objects in a flexible and testable way, 
it’s not always the best fit—particularly when it comes to logging.

### The Problem with Logging and Dependency Injection
When I first encountered DI, I was excited. 
It allowed me to inject an object once and reuse it throughout the codebase. 
In many cases, this works beautifully, but I soon ran into problems when dealing with logging.

In most applications, logging is a ubiquitous task. 
We need it in almost every class and in almost every function. 
However, with DI, every time I needed a logger, 
I had to inject it into the constructor or pass it as an argument to other functions. 
This increased the complexity of the dependency chain, cluttered constructors with arguments, 
and made the code unnecessarily verbose. 
In short, injecting the logger everywhere felt like overkill for something that should be simple.

Take UberFX as an example. It’s a fat library, and while it provides a lot of structure, 
it forces you to explicitly pass the logger everywhere. 
Instead of focusing on the core functionality of the class, 
I found myself repeatedly handling the same boilerplate code to inject the logger, 
which added little value to the overall design.

### A Better Approach: Logging Without DI
So, what’s the alternative? 
In my experience, the simplest solution is often the best one. 
Rather than injecting the logger everywhere, I prefer to use a singleton pattern for logging. 
The first time you need to log something, the singleton logger gets created with the necessary configuration, 
and from that point forward, it’s accessible globally.

Here’s why this approach works:

1. Simpler Code: Instead of injecting the logger into every class, you just call the logger when needed. No more dependency chain, no more cluttered constructors. Your code stays focused on its core task rather than on plumbing.
2. Configuration Centralization: The logger singleton gets its configuration (format, output location, etc.) from environment variables, ensuring consistency throughout the application. There’s no need to worry about different parts of the app using different logger configurations.
3. Global Availability: Since logging is a cross-cutting concern that should be available everywhere, using a singleton ensures that it’s globally accessible without the need for explicit injection. You only configure it once, and you’re done.

### The Trade-offs
Of course, this approach isn’t without its trade-offs. 
Dependency injection is useful for maintaining flexibility and testability. 
With DI, you can easily swap out your logger for a different implementation, 
which is great in cases where you need different loggers for different environments (like development versus production).

However, logging is one of those functions that is generally stable across environments. 
Using a singleton doesn’t drastically limit your flexibility, especially if you make the logger configurable via environment variables.

The key is knowing when to apply different techniques. 
Dependency injection has its place, but for logging, the cost of passing it around everywhere just doesn’t seem justified.

## Conclusion
Logging is essential to almost every application, but it shouldn’t become a burden on your codebase. 
By separating logging from dependency injection, you can keep your code simpler, cleaner, and more maintainable. 
Sometimes, we need to step away from the “one-size-fits-all” mentality and recognize when a straightforward solution 
like the singleton pattern is the better fit.