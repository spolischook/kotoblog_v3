---
title: "Golang Services"
date: 2023-05-09T11:09:38+02:00
draft: true
---

There is no easy to use conceptions of services in GoLang.
I found some implementation of [Dependency Injection from Uber](https://github.com/uber-go/dig) but it's huge and
I don't believe it's well fit into the overall GoLang philosophy.

<!--more-->

Instead of that GoLang has a concept of [singleton](https://refactoring.guru/design-patterns/singleton)
that I found into [GLG logger](https://github.com/kpango/glg). [type Once](https://pkg.go.dev/sync#Once)
can help create instance only once. In this case creation of the service would rely on the configuration.  
Another good approach, allocate new object with `New*()` function
that is explained in [Effective Go](https://go.dev/doc/effective_go#composite_literals).
Constructor function should return interface that can be easily mocked by [moq](https://github.com/matryer/moq)
