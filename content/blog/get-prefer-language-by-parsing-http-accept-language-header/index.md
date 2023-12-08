---
author: "Serhii Polishchuk"
title: "Get prefer language by parsing HTTP_ACCEPT_LANGUAGE header"
date: 2015-11-17
tags: ["PHP", "Silex"]
draft: false
---
<!--more-->
This is very common and simple task for web development.
However I can't find any pretty solution. So I spend some time to write one PHP 5.4 sample.
Don't ask me how it works, just trust that it's works like a charm :)
    
```php
<?php
$prefLocales = array_reduce(
  explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']), 
  function ($res, $el) { 
    list($l, $q) = array_merge(explode(';q=', $el), [1]); 
    $res[$l] = (float) $q; 
    return $res; 
  }, []);
arsort($prefLocales);
/*
This get you from headers like this
string 'en-US,en;q=0.8,uk;q=0.6,ru;q=0.4' (length=32)
array like this
array (size=4)
  'en-US' => float 1
  'en' => float 0.8
  'uk' => float 0.6
  'ru' => float 0.4
*/
```

For Silex I have grate solution:
    
```php
<?php
$app->register(new Silex\Provider\TranslationServiceProvider(), [
    'locale_fallbacks' => ['en', 'uk', 'ru'],
]);
$app->before(function() use ($app) {
    $locales = $app['translator']->getFallbackLocales();
    $prefLocales = array_reduce(explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']), function ($res, $el) { list($l, $q) = array_merge(explode(';q=', $el), [1]); $res[$l] = (float) $q; return $res; }, []);
    asort($prefLocales);
    $locale = array_reduce(array_keys($prefLocales), function ($default, $prefLocale) use ($locales) { return in_array($prefLocale, $locales) ? $prefLocale : $default; }, $app['translator']->getLocale());
    $app['translator']->setLocale($locale);
});
$app->get('/', function (\Symfony\Component\HttpFoundation\Request $request) use ($app) {
    return $app->redirect('/'.$app['translator']->getLocale());
});
$app->get('/{_locale}', function () use ($app) {
    return $app['twig']->render('index.html.twig');
});
```
