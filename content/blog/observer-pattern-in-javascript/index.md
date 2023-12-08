---
author: "Serhii Polishchuk"
title: "Observer pattern"
date: 2018-02-17
tags: ["Javascript"]
draft: false
---
<!--more-->
From [Wikipedia](https://en.wikipedia.org/wiki/Observer_pattern):

> Observer pattern
>
> The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods.

So here is a simple implementation of Observer pattern in pure JavaScript:
```js
function Subject() {
    this.listeners = [];
    this.addListener = listener => this.listeners.push(listener);
    this.removeListener = listener => his.listeners.splice(this.listeners.indexOf(listener), 1);
    this.notify = message => this.listeners.forEach(listener => listener.update(message));
}

let observer1 = {
    update: (message) => console.log('Listener1: ' + message),
};

let observer2 = {
    update: (message) => console.log('Listener2: ' + message),
};

const subject = new Subject();
subject.addListener(observer1);
subject.addListener(observer2);
subject.notify('Hello World!');
```

It will output
```
Listener1: Hello World!
Listener2: Hello World!
```
