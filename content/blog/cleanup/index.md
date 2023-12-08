---
author: "Serhii Polishchuk"
title: "Cleanup"
date: 2013-03-08
tags: []
draft: true
---
<!--more-->
[![](http://kotoblog.pp.ua/wp-content/uploads/2013/03/5171840-vacuum-cleaner-with-clipping-path-150x150.jpg)](http://kotoblog.pp.ua/wp-content/uploads/2013/03/5171840-vacuum-cleaner-with-clipping-path.jpg) В одном из скриптов нашел интерессную реализацию удаление файлов срок хранения которых подошел к концу. И дабы не искать его где либо в следующий раз выкладываю здесь.

```
 /**
     * Deletes all file parts in the chunks folder for files uploaded
     * more than chunksExpireIn seconds ago
     */
    protected function cleanupChunks($folder, $expireIn)
    {
        foreach (scandir($folder) as $item) {
            if ($item == "." || $item == "..")
                continue;

            $path = $folder . DIRECTORY_SEPARATOR . $item;

            if (!is_dir($path))
                continue;

            if (time() - filemtime($path) > $expireIn) {
                $this->removeDir($path);
            }
        }
    }

    /**
     * Removes a directory and all files contained inside
     * @param string $dir
     */
    protected function removeDir($dir)
    {
        foreach (scandir($dir) as $item) {
            if ($item == "." || $item == "..")
                continue;

            unlink($dir . DIRECTORY_SEPARATOR . $item);
        }
        rmdir($dir);
    }

```
