---
title: "Golang Iota"
date: 2023-04-29T10:52:31+02:00
draft: true
tags: [golang]
featured: true
---

Predeclared identifier IOTA in GoLang used to declare untyped integer constants.
It could be widely used to operate enum values with minimum memory consumption.
There are a lot of examples of how to use IOTA in a GoLang besides 
[original documentation](https://go.dev/ref/spec#Iota).  
I used one from [yourbasic.org](https://yourbasic.org/golang/iota/).  
Here I would like to deep into advanced practices of using IOTA.

<!--more-->

## `String` method

After more than two years of working with Go, I found really handy tool 
for working with IOTA - [stringer](https://pkg.go.dev/golang.org/x/tools/cmd/stringer)
This tool allows to generate `String()` method, e.g.:
```go
package email

type Type int

//go:generate go run golang.org/x/tools/cmd/stringer -type=Type -linecomment
const (
	Nil             Type = iota // nil
	BookingCreated              // booking.created
	BookingUpdated              // booking.updated
	BookingCanceled             // booking.canceled
)
```
Run command in console:
```shell
go generate ./...
```

will generate a `originalfilename_string.go` file, that will contain `String()` method.
Actually `go:generate` could be used in many cases, e.g. [vektra/mockery](https://github.com/vektra/mockery)

Let's write a test for `String` method:
```go
package email

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

var stringTypes = map[int]string{
	-1: "Type(-1)",
	0: "nil",
	1: "booking.created",
	2: "booking.updated",
	3: "booking.canceled",
	4: "Type(4)",
}

func TestType_String(t *testing.T) {
	for i, s := range stringTypes {
		assert.Equal(t, s, Type(i).String())
	}
}
```

As you can see there is no panic or error on not existed types. 
It's esential to make special `nil` value for first iota.
The GoLang has [zero values](https://go.dev/ref/spec#The_zero_value) 
for variables and properties. And every time when value was not set it
will be 0, and you always can check for validity.

## `New` method

While convertation to string is one task, the inverse issue would be
convert type from `string` to new type. Let's name this method `New`
by convention for all types. And this method will depend on `String`
in its implementation:
```go
package action

import "strings"

func New(s string) Type {
	var (
		names = _Type_name
		indexes = _Type_index
		new = func(i int) Type {return Type(i)}
		nilV = NA
		startFrom = 0
	)

	ind := strings.Index(names, s)
	if -1 == ind {
		return nilV
	}
	for i, x := range indexes {
		if int(x) == ind {
			i += startFrom
			return new(i)
		}
	}
	return nilV
}
```

Var in the start of the `New` function, and its return type
must be adjasted according to the type, 
better, even generated with values from reflection.
But generate code task is out of scope of this article.

Test for a `New` method as simple as previous one:
```go
package email

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

var TypeNewCases = map[string]Type{
	"": 0,
	"nil": 0,
	"not_exists": 0,
	"booking.created": 1,
	"booking.updated": 2,
	"booking.canceled": 3,
}

func TestType_New(t *testing.T) {
	for k, v := range TypeNewCases {
		r := New(k)
		assert.Equal(t, v, r)
	}
}
```

## `Validate` method

For [validation](../2023-04-05-go-validation) I used simple Ozzo interface:
```go
type Validatable interface {
  Validate() error
}
```
Implementation will be complicated:
```go
package email

import (
	"fmt"
	"strings"
)

func (t Type) Validate() error {
	var startFrom Type = 0 // set the first iota value

	t -= startFrom
	if t > 0 && t < Type(len(_Type_index)-1) {
		return nil
	}

	availableValues := make([]string, len(_Type_index)-2)
	for i := 1; i < len(_Type_index)-1; i++ {
		v := _Type_name[_Type_index[i]:_Type_index[i+1]]
		availableValues[i-1] = fmt.Sprintf(`"%s"`, v)
	}
	return fmt.Errorf(`type "%s" is not valid, available string values: %s`,
		t.String(),
		strings.Join(availableValues, ", "))
}
```
and test:
```go
package email

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

var TypeValidateCases = map[Type]bool{
	-1: false,
	0: false,
	1: true,
	2: true,
	3: true,
	4: false,
}

func TestType_Validate(t *testing.T) {
	for v, isValid := range TypeValidateCases {
		if nil == v.Validate() {
			assert.True(t, isValid, fmt.Sprintf(`type "%s" not expect to be valid`, v.String()))
		}
		assert.Equal(t, isValid, v.Validate() == nil)
	}
}

var TypeValidateErrorCases = map[Type]string{
	-1: `type "Type(-1)" is not valid, available string values: "booking.created", "booking.updated", "booking.canceled"`,
	0: `type "nil" is not valid, available string values: "booking.created", "booking.updated", "booking.canceled"`,
}

func TestType_ValidateError(t *testing.T) {
	for v, e := range TypeValidateErrorCases {
		err := v.Validate()
		assert.NotNilf(t, err, `expected "%d" type to be validated with error`, v)
		assert.Equal(t, e, err.Error())
	}
}
```
