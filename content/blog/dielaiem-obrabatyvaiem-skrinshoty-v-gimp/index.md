---
author: "Serhii Polishchuk"
title: "Делаем, обрабатываем скриншоты в Gimp"
date: 2012-02-20
tags: []
draft: true
---
<!--more-->
В этой статье я в вкратце расскажу о том каким образом я делаю скриншоты на сайт. Это будет полезно тем кто **пишет техническую документацию**. Для этого мы напишем пару скриптов для **Gimp** которые упростят нам жизнь. Итак начнем. В этой статье я не буду ходить вокруг да около, тем более что я мало что в этом понимаю, поэтому я дам готовое решение в очень сжатом виде. Для начала создадим скрипт простой урезки углов. Открываем свой любимый редактор, для меня это GEdit, и вставляем туда следующий код:

```
(define (script-fu-cut-corners 	image
				drawable
				radius
				only-top)
	(gimp-context-push)
	(gimp-image-set-active-layer image drawable)
	(gimp-image-undo-group-start image)

	; Добавляем альфа-канал (прозрачность)
	(gimp-layer-add-alpha drawable)
	; Выделяем все изображение, cкругляем уголки выделения
	(gimp-round-rect-select image 0 0 (car (gimp-image-width image))
		        (car (gimp-image-height image))
			radius radius CHANNEL-OP-REPLACE TRUE FALSE 0 0)
	; Инвертируем выделение
	(gimp-selection-invert image)
	; Если требуется подрезать только верхние уголки...
	(if (= only-top TRUE)
		; ...то вычитаем из выделения область изображения
		; охватывающую оба нижних уголка
		(gimp-rect-select image
				0
				(- (car (gimp-image-height image)) radius)
				(car (gimp-image-width image))
				radius
				CHANNEL-OP-SUBTRACT
				FALSE
				0))
	; Удаляем выделенные области
	(gimp-edit-clear drawable)
	; Снимаем выделение
	(gimp-selection-none image)

	(gimp-image-undo-group-end image)
	(gimp-displays-flush)
	(gimp-context-pop)
)

(script-fu-register "script-fu-cut-corners"
	"Подрезать уголки"
	"Подрезать скругленные уголки скриншота окна."
	"Василий Пупкин
"
	"ООО Рога и Копыта"
	"2010/10/6"
	"RGB*"
	SF-IMAGE      	"Image"                   	0
	SF-DRAWABLE   	"Drawable"                	0
	SF-ADJUSTMENT 	"Радиус (0 - 20 пикселей)"	'(8 0 20 1 10 0 0)
	SF-TOGGLE	  	"Только верхние"		FALSE

)

(script-fu-menu-register "script-fu-cut-corners"
                         "
```

```
/Filters/Мои скрипты")
```

Называйте как хотите :), расширение указвыаем .scm (Например. obrezka-uglov.scm). Сохраняем это добро в папку

```
/home/<Имя_пользователя>/.gimp-2.6/scripts
```

Или же делаем Переход->Домашний каталог, если там не находим папку с именем .gimp-2.6 нажимаем Ctrl+H (Вид->Показывать скрытые файлы), по умолчанию эта папка скрыта. По аналогии делаем следующий скрипт для быстрого создания тени:

```
(define (script-fu-quick-shadow image drawable)
	(gimp-context-push)
	(gimp-image-set-active-layer image drawable)
	(gimp-image-undo-group-start image)

	; Вызов стандартной процедуры script-fu-drop-shadow
	(script-fu-drop-shadow image drawable 3 4 10 '(0 0 0) 40 TRUE)

	(gimp-image-undo-group-end image)
	(gimp-displays-flush)
	(gimp-context-pop)
)

(script-fu-register "script-fu-quick-shadow"
	"Быстрая тень"
	"Отбросить тень со стандартными параметрами:
	 смещение по X = 3, по Y = 4, радиус размытия = 10,
	 цвет черный, прозрачность 40%."
	"Василий Пупкин
"
	"ООО Рога и Копыта"
	"2010/10/6"
	"RGB*"
	SF-IMAGE      "Image"      0
	SF-DRAWABLE   "Drawable"   0
)

(script-fu-menu-register "script-fu-quick-shadow"
                         "
```

```
/Filters/Мои скрипты"
)
```

Теперь можем открыть Gimp (или перезапустить, если он у Вас был запущен до этого) и увидеть свои программки в Фильтры -> Мои скрипты Оригинал статьи [здесь.](http://habrahabr.ru/company/devexpress/blog/106611/)
