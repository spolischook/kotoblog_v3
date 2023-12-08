---
author: "Serhii Polishchuk"
title: "Angular Data Binding"
date: 2018-02-07
tags: ["Javascript", "Angular"]
draft: false
---
<!--more-->
### Class binding
```html
<!--funny-button.component.html-->
<button (click)="toggle()" [class.great]="isGreat" [class.isnt-great]="!isGreat">Is it Great?</button>
```
```css
/*funny-button.component.css*/
.great {
    background-color: red;
}
.isnt-great {
    background-color: green;
}
```
```ts
// funny-button.component.ts
  public isGreat: boolean;
  public toggle() {
    this.isGreat = !this.isGreat;
  }
```


### Style binding

```html
<!-- funny-button.component.html -->
<button (click)="toggle()" [style.background-color]="color">Is it Great?</button>
```
```js
// funny-button.component.ts
  public color = 'red';
  toggle() {
      this.color = this.color === 'green' ? 'red' : 'green';
  }
```
Button will toggle 'background-color' property after each click on button

### Event binding

This example log the current (before change) background color of the button

```html
<!--funny-button.component.html-->
<button (click)="toggle($event)" [style.background-color]="color">Is it Great?</button>
```
```ts
// funny-button.component.ts
    public color = 'red';
    toggle($event: MouseEvent) {
        console.dir($event.target.style.backgroundColor);
        this.color = this.color === 'green' ? 'red' : 'green';
    }
```
**$event** argument, has a special meaning, could be either DOM or Angular event - depends on event name.
**$event** argument can be used in template expression:
```html
<!--funny-button.component.html-->
<input [value]="color" (input)="color = $event.target.value">
<button [style.background-color]="color">Is it Great?</button>
```
```ts
      public color = 'red';
```
Put in input whatever color you like, it immediately change background color of button. Easy, isn't it?

### Custom Events
This is common practice in any backend framework, like Symfony, to emit a custom events. In Angular there is an **EventEmitter** for that purposes. It's plays well with parent-child components that stay on the same page. You can emit event on one component and subscribe on it in another.

So get create another one component:
```bash
ng g component funny-button-child
```
Now we can add some template:
```html
<!--funny-button-child.component.html-->
<input (input)="obj.text = $event.target.value; emitCustomEvent()">
```
And implement emitting event in child component
```ts
// funny-button-child.component.ts
export class FunnyButtonChildComponent {
  public obj = {};
  @Output() myEvent: EventEmitter<any> = new EventEmitter();

  emitCustomEvent() {
    this.myEvent.emit(this.obj);
  }
}
```
In parent component now we can catch the **myEvent** event:
```html
<!--funny-button.component.html-->
<app-funny-button-child (myEvent)="checkEvent($event)"></app-funny-button-child>
```
And let just log our **$event** (there is object with text property):
```ts
// funny-button.component.ts
export class FunnyButtonComponent {
    checkEvent($event) {
        console.log($event);
    }
}
```
More in EventEmitter documentation https://angular.io/api/core/EventEmitter

### Two way binging

The simplest way to get two way data binding in **Angular** is "banana in the box" **[()]**
Lets make simple example:
```ts
// funny-button.component.ts
import {Component} from '@angular/core';

@Component({
  selector: 'app-funny-button',
  template: `
    <label>{{data}}</label>
    <input [(ngModel)]="data">
  `
})
export class FunnyButtonComponent {
    public data: string;
}
```
Label will appear while you input text

### Complex example

Here is a detection changes in child component
```ts
// child.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <label for="data">Child component</label>
    <input id="data" [(ngModel)]="data">
  `
})
export class ChildComponent {

  public data = 'Data Template';
}
```
```javascript
// parent.component.ts
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ChildComponent} from '../child/child.component';
import {AfterViewChecked, AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-parent',
  template: `
    <p>Parent component</p>
    <app-child></app-child>
    <p [hidden]="!error.throw" [ngStyle]="{color: error.color}">{{error.msg}}</p>
  `,
  styles: []
})
export class ParentComponent implements AfterViewInit, AfterViewChecked, OnInit {

  @ViewChild(ChildComponent) child: ChildComponent;

  public error: { msg: string, color: string, throw: boolean };
  readonly maxInputLength = 25;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.error = {
      msg: 'The value is too loooooong!',
      color: 'red',
      throw: false
    };
  }

  ngAfterViewChecked(): void {
    this.error.throw = this.child.data.length > this.maxInputLength;
    this.changeDetector.detectChanges(); // prevent ExpressionChangedAfterItHasBeenCheckedError
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }
}
```
