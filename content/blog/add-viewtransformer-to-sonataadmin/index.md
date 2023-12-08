---
author: "Serhii Polishchuk"
title: "Add ViewTransformer to SonataAdmin"
date: 2014-09-23
tags: ["Symfony2"]
draft: false
---
<!--more-->
Some time I can't find how to add **data transformer to SonataAdmin field**. After some investigating I find answer. In *configureFormFields* method we have *FormMapper* instance from what we need to get **FormBuilder**. Add **DataTransformer to FormBilder** is simple:
    $formMapper->getFormBuilder()->get('field')->addViewTransformer(new FieldTransformer());
