---
author: "Serhii Polishchuk"
title: "Goto declaration of class|methods|functions in Vim"
date: 2015-09-20
tags: ["Vim"]
draft: false
---
<!--more-->
- First, you need the ctags tool. The most common today is Exuberant Ctags, found at ctags.sourceforge.net:
```
    sudo apt-get install exuberant-ctags
```
- Next, you need to create a tags database (a file names tags) for all the files in your project(s). This is usually done by running :
````
    ctags -R
```
from your project root (also from within Vim via :!ctags ...). Exuberant Ctags support 41 languages, and you can even extend it via regular expressions.
- Finally, Vim needs to be configured to pick up the tags database. With :set tags=./tags;, it will search in the file's directory upwards to the root directory. If you have certain global include directories, you can add those.
- With that, you can start using Vim's tag functionality like <C-]> and :tag

This answer was founded at http://stackoverflow.com/questions/19934060/vim-how-to-go-to-the-declaration-of-a-class-method-function-variable-etc
