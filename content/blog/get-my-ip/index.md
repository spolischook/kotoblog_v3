---
author: "Serhii Polishchuk"
title: "Get my IP"
date: 2017-06-03
tags: ["bash"]
draft: false
---
<!--more-->
Simplest approach:

```bash
#!/bin/bash
curl -s http://whatismijnip.nl | cut -d " " -f 5
```
