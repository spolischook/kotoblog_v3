---
title: "Hugo With Netlify"
slug: hugo-with-netlify
date: 2023-04-02T17:45:37+02:00
draft: true
tags: ["hugo", "netlify", "golang"]
---
[HUGO]() is well known static site generator written in Go.
From 2008 I built few pet projects on a different tech.
I would like to move all those websites with HUGO.

<!--more-->

- [Issue(s) with WordPress](#issues-with-wordpress)
- [Hugo make a deal](#hugo-make-a-deal)
  - [Content creation process](#content-creation-process)
  - [Development process](#development-process)
- [Deployment process](#deployment-process)
  - [Use Netlify](#use-netlify)
- [Conclusion](#conclusion)

List of the projects:
- This blog originally written on WP, rewritten on Silex and later on Symfony.
  Also has my study projects with R lang and markdown
- Cherevan.Art - website of my lovely painter (and wife), made with Joomla 1.5
  also had some subproject, e.g. calendar - saling page of calendar, 
  samui - travel blog
- Alfred-Koh.pp.ua - one of the first website, made with Joomla 1.5
- Theatre-Shevchenko.ck.ua - study project that evolve from Angular 1.0 
  to recent version of Angular

# Issue(s) with WordPress

WP made a unique environment with a huge amount of plugins.
Caching plugin make WP as fast as any static website.
A lot of what you can do with WP easily,
would not be possible in such "UI way" in HUGO.

WP needs a complicated and expensive environment.
While 50$/year is not too much, for bigger websites 
the bill could easily reach 1000$/month and more. And this price could be much
bigger, if we include regular maintenance of MySql db, 
PHP, WP and plugins.

Actually any other [LAMP stack](https://en.wikipedia.org/wiki/LAMP_(software_bundle)) 
CMS from the past will have the same issues.  
The new web will be build with [JAM stack](https://jamstack.org/) 
solutions - that is only one sustainable 
web that we can have after 
[Moore low is not work anymore](https://en.wikipedia.org/wiki/Moore%27s_law#Recent_trends)

# Hugo make a deal

[HUGO](https://gohugo.io/) is one of the most popular open-source static site generators 
written on GoLnang. 
With its amazing speed and flexibility, Hugo makes building websites fun again.  
And it really is. I had fun with building websites in 2008 when I start with CMS Joomla.
Now I got the same feelings with HUGO.

The main idea, that all your content stored into git repository, and every change
in the content trigger the build process to convert templates along with content 
into ready to consume HTML, CSS and JS. So visitors got compiled HTML page 
right from the server.

## Content creation process

For write a content with HUGO you need:
- Be familiar with Markdown format. I believe that average internet user can learn MD in 15 min.  
  I used [this tutorial](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
  for a while.
- Be patient to delivery time to production, it can take up to few min.

## Development process
For develop with HUGO you need to have a basic knowledge of:
- CLI. Well, any development nowadays can't be without it, right?
- HTML, CSS and template enginine. While HUGO use its own template engine, 
  the basic principles are the same: variables, loops, conditions etc.

And that's it - you can start building your new website with HUGO.  
I recommend to start from the [article in Decap CMS](https://decapcms.org/docs/hugo/)
where you will be guided from HUGO install to the ready to use website with admin area.
Decap will use Netlify identity to make changes in your GitHub repository.

I found [Page Bundles](https://gohugo.io/content-management/page-bundles/)
are perfect feature of HUGO.
To enable it in Netlify admin additional config should be added:
```yaml
collections:
  - name: 'post'
    slug: '{{year}}-{{month}}-{{day}}-{{slug}}'
    path: "{{slug}}/index"
    media_folder: "images"
    public_folder: "images"
```
Thanks [Matthew Miller](https://blog.millerti.me/2021/12/23/supporting-hugo-page-bundles-in-netlify-cms/) 
for this hint.

# Deployment process

Deployment of hugo is pretty straighforward:
- AWS S3 bucket (any other similar **static files storage** services)
- Domain Name
- CDN on top of the static files

On the top of copies of your draft (`--buildDrafts` flag) versions of HUGO website
could be setuped basic HTTP auth, or any other aout


## Use Netlify

### Story.Cherevan.Art

Written on Joomla 1.5 was a one of the first website of mine. 
Actually this was my web development study project.

![First version of cherevan.art website](./young.cherevan.art.png)

# Conclusion
