---
author: "Serhii Polishchuk"
title: "Великолепный JavaScript"
date: 2018-01-27
tags: ["Javascript"]
draft: false
---
<!--more-->
Здесь постараюсь описать странности JavaScript, со многими из которых я уже успел смирится, а некоторые понять и простить.
Например самое любимое это:
```js
a = null;
typeof a;	// "object"
```
это довольно популярная "шутка" является банальным багом языка, который закопан в нем видимо навсегда для сохранения обратной совместимости.

#### Приведение массива к строке
Здесь будет просто христоматийный пример из книги "You don't know JavaScript":
```js
var a = [1,2,3];
var b = [1,2,3];
var c = "1,2,3";

a == c;		// true
b == c;		// true
a == b;		// false
```
При сравнении массива и строки в динамически типизированном JavaScript массив будет преобразован в строку путем конкатенации всех значений через запятую, т.о. массивы _a_ и _b_ после приведения к строке будут иметь значение эквивалентное переменной _c_. Проверяем:
```js
> [1,2,3].toString()
'1,2,3'
```
Массивы в JavaScript это объекты, помните? 
```js
> typeof [1,2,3]
'object'
```
Объекты хранятся и сравниваются по ссылке, т.е. переменные _a_ и _b_ это два разных объекта. 

Смотрим [11.9.3 The Abstract Equality Comparison Algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3) спеки EcmaScript5:

> Return __true__ if x and y refer to the same object. Otherwise, return __false__.

#### Function declaration vs Function expression

Есть два способа обьявить ф-цию в JavaScript
- Function expression ```let foo = function() {}```
- Function declaration ```function foo() {}```

Что важно помнить так то что Function declaration hoisted - что значит что функция будет поднята вверх своей
области видимости в отличии от function expression.

Пример:

    foo();
    
    function foo() {
        console.log('Func "foo" called');
    } // no need for semicolon
    
    try {
        bar(); // TypeError: bar is not a function
    } catch (e) {
        console.log(e.name+': '+e.message);
    }
    
    var bar = function() {
        console.log('Func "bar" called');
    }; // semicolon is needed here
    
    bar();

На выходе получим следующее:

    Func "foo" called
    TypeError: bar is not a function
    Func "bar" called

#### Scoping

В JavaScript можно выделить такие виды области видимости:
- Global Scope
- Block Scope
- Function Scope
- Lexical Scope

С первым надеюсь все понятно - использовать его нужнотолько в крайнем случае (читай НЕ нужно)  четко понимая зачем и почему, 
к-во переменных и функций здесь напрямую влияет на производительность, ну и name collision тут чаще всего может произойти.
К тому же полагатся на **Global Scope** во времена dependency injection считается bad practice.

**Block Scope** появился сравнительно недавно, с вводом в ES-2015 блочных директив ```let``` и ```const```.

**Function Scope** можно обьяснить довольно просто - все что пришло в ф-ю или создано внутри нее в ней останется навсегда и снаружи не видно.

**Lexical Scope** более сложный для понимания и тесно связан со всеми остальными видами области видимости.
Фактически это о вложенности областей видимости. Например переменные из parent function будут доступны во вложенной функции.
Для того чтобы совсем всех запутать, пример ниже:

    let adder = function parent(total) {
        return function child(number) {
            total += number;
            console.log(total); // debug
            return total;
        };
    }(0); // set initial total value

    adder(2); // 2
    adder(3); // 5
    adder(5); // 10

<div class="alert alert-warning" role="alert">
<svg class="octicon octicon-info" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"></path></svg>
Имена ф-й здесь приведены для удобства и могут быть опущены.
</div>
В переменную ```adder``` будет записана child function которая использует переменную ```total``` из parent.
При том что child была возвращенна и записана в переменную, она продолжает использовать scope родительской ф-ции изменяя total.
Вот этот доступ к переменной ```total``` и есть **Lexical Scope** в его эталонном виде.
