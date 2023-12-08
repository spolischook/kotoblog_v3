---
author: "Serhii Polishchuk"
title: "Behat + Mink + Symfony 2.1"
date: 2013-01-06
tags: []
draft: false
---
<!--more-->
composer.json:

    https://gist.github.com/0d733a9af41426c3deae
Update dependencies: 
    composer update --dev 

Edit your behat.yml:

    https://gist.github.com/339cc6c45c87300b1885

Инициализация:
    vendor/bin/behat --init @AcmeDemoBundle
В версии Symfony 2.2, инициализация:
    vendor/behat/behat/bin/behat --init @AcmeDemoBundle
Запуск тестов:
    vendor/bin/behat @AcmeDemoBundle
Подсказка по существующим командам Behat:
    vendor/bin/behat -dl
А вот так по русски:
    vendor/bin/behat -dl --lang="ru"
