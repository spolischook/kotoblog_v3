---
author: "Serhii Polishchuk"
title: "PHP version manage"
date: 2016-04-22
tags: ["PHP"]
draft: true
---
<!--more-->
Для управлениями версиями в пхп нужно иметь две тулзы.
Первая https://php-build.github.io/ умеет компилировать нужную версию ПХП и аккуратненько складывать в [куда попросите]. Рекомендую оставить по дефолту здесь ~/local/php.
Первые грабли это отсутствие intl расширения в скомпилированых версиях. Для Symfony это непростительно.
Идем сюда ```/usr/local/share/php-build/default_configure_options``` и добавляем ```--enable-intl```
Теперь можно как в доке:

    php-build -i development 5.4.40 ~/local/php/5.4.40

Вторая печаль это настройки php.ini и включеный xdebug.
Мне к примеру понадобилось добавить памяти для пхп.
А уродливое сообщение о проблемах с производительностью с включенным xdebug просто бесит.
Локальный php.ini можно поправить здесь ```~/local/php/5.4.40/etc/php.ini```
А управлять xdebug здесь ```~/local/php/5.4.40/etc/conf.d/xdebug.ini```

Вторая тулза умеет управлять версиями, называется **php-version**. https://github.com/wilmoore/php-version
Тут все также как везде.
Получить список всех версий:

    php-version

Заюзать конкретную версию

    php-version 5.4.40
