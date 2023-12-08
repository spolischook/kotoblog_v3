---
author: "Serhii Polishchuk"
title: "Программа распознавания текста (OCR) для Ubuntu"
date: 2011-04-05
tags: ["Ubuntu"]
draft: true
---
<!--more-->
<p>Вобщем то все просто.</p>

<pre>
<code class="bash">sudo apt-get install cmake imagemagick libmagick++-dev
wget http://launchpadlibrarian.net/38612701/cuneiform-linux-0.9.0.tar.bz2
tar xvjf cuneiform-linux-0.9.0.tar.bz2
cd cuneiform-linux-0.9.0/ 
mkdir builddir
cd builddir
cmake -DCMAKE_BUILD_TYPE=debug ..
make
sudo make install
sudo ldconfig</code></pre>

<p><span style="line-height: 1.6em;">Затем </span><a href="http://insdom.narod.ru/001/yagf_0.8.1-1_i386.deb" style="line-height: 1.6em;">станаливаем <strong>YAGF</strong></a><span style="line-height: 1.6em;"> Спасибо dmitry_k за столь простое решение. Все! :)</span></p>
