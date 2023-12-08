---
author: "Serhii Polishchuk"
title: "How to shoot your leg with lazy in Haskell"
date: 2015-08-21
tags: ["Haskell"]
draft: false
---
<!--more-->
This code compile and works fine:

    take' :: Int -> [Int] -> [Int]
    take' x [] = []
    take' 0 xs = []
    take' x (xx:xxs) = xx : take' (x-1) xxs

Until we try to run this code with some not expected x (with minus) it will crash by memory limit, and not immediately. 
Run this:

    > take' (-5) [1 .. ]

And get the infinity list on your screen.
However we can obtain this situation by add one guard expression:

    take' :: Int -> [Int] -> [Int]
    take' x [] = []
    take' 0 xs = []
    take' x (xx:xxs)
      | x <= 0 = []
      | otherwise = xx : take' (x-1) xxs
