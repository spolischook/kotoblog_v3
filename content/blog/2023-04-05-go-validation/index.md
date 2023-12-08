---
title: "GoLang Gin HTTP Request Handle"
slug: golang-gin-request-handle
date: 2023-04-05T09:31:52+02:00
draft: true
tags: ["golang", "gin"]
featured: true
---
Previously in Symfony I have no such a question "How to validate HTTP Request".
[The documentation](https://symfony.com/doc/current/validation.html) 
has been clearly explain this topic.
In [gin framework](https://gin-gonic.com/docs/examples/binding-and-validation/) 
it's recommended to use go validator with tags.
Honestly I don't think that is a good solution, and also it's not recommended
[by GoLang contributors](https://github.com/golang/go/issues/38641#issuecomment-634834028).
<!--more-->

- [Requirements](#requirements)
- [Tests](#tests)
  - [Unit tests](#unit-tests)
  - [UI tests](#ui-tests)
- [Choosing validation library](#choosing-validation-library)
  - [Ozzo-validation](#ozzo-validation)
  - [Jio](#jio)
- [Conclusion](#conclusion)

So I start looking for a validation approach that would be convenient in Go.
I like how validation rules in Symfony described by [YAML](https://g.co/kgs/YRKu47).
This kind declarative style of
validation rules, that separated from the code, helps to keep it simple and demonstrative.
Unfortunately there is no out of the box solution for YAML validation rules in Go, and
create such solution would require a
[metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming#:~:text=Metaprogramming%20is%20a%20programming%20technique,even%20modify%20itself%20while%20running.).
skills.

## Requirements

In daily work we faced with issue of validation the request from the customer, 3-d party
integration services and other internal services as well.
We deal with **HTTP requests** with **path parameters** in URL, **query params** and **json body** - 
so that is what we should validate.  
Gin Framework used for routing so the main function will look like this:
```go
r := gin.Default()
r.GET("/booking", handler.BookingList)
r.POST("/booking", handler.BookingCreate)
r.POST("/booking/:id", handler.BookingUpdate)
r.Run(Port)
```

First endpoint `BookingList` can have a different _query params_:
- `from`, `to` - should be in format `YYYY-MM-DD`. In case of any other format should return an error
- `bookingSource` - should be in enum [`b2b`, `retail`]. In case of any other value should be ignored

Second `BookingCreate` is for creating a new Booking with json body.
Go structs for body will look like:
```go
type Booking struct {
  Type     booking.Type `json:"booking_type"`
  Customer Customer     `json:"customer"`
  Source   string       `json:"source"`
  Pax      int          `json:"pax"`
  TourDate time.Time    `json:"tourDate"`
}
type Customer struct {
  Id    int    `json:"id"`
  Email string `json:"email"`
}
```

that should be validated like that:
```yaml
BookingRequest:
  properties:
    orderSource:
      - Choice: [b2b, retail]
    tourDate:
      - type: date
    pax:
      - type: integer
    customer:
      - Valid: ~
```

Field `customer` could be two types:
- `existing_customer`: `id` must not be 0, 
  we should check that _customer_ with that `id` is exists, 
  `email` field will be ignored
- `new_customer`: `email` filed must be valid Email, 
  new customer will be created

This conditional validation with param converter functionality already make more then just a validation.
```yaml
Customer:
  properties:
    - id:
      - type: integer
      - NotEqualTo: 
          value: 0
          groups: [existing_customer]
      - CustomerExists: { groups: [existing_customer] }
    - email:
        - Email: { groups: [new_customer] }
```

> read more about 
> [validation groups in Symfony](https://symfony.com/doc/current/validation/groups.html)

The third `BookingUpdate` request very similar to previous one with few differences:
- `:id` in URL must be an integer - otherwise `400` error must be returned
- Booking with `:id` must exist, otherwise `404` must be returned

This simplified app example covers most validation cases in our services.

## Types of validation

From the [Requirements](#requirements) we can segregate 3 different test cases:
1. Query parameters validation, e.g. `?from=2020-01-01&to=2023-12-31&bookingSource=b2b`
2. Path parameters validation, e.g. `bookings/123` where `123` is a booking id, that
   could be converted into booking object
3. Request body validation

As I'm usually preach TDD approach I'll create test cases for each types of validation first

## Query Parameters validation

The test case for query parameters that can be maped from json file:
```go
type QueryTestCase struct {
	Url   string          `json:"url"`
	Valid bool            `json:"valid"`
	Query json.RawMessage `json:"query"`
	Error json.RawMessage `json:"error"`
}
```
Assert function for the tests will take a `gin.HandlerFunc` that will be used as a middleware,
to validate and convert http query into object.
```go
func AssertQueryCases(t *testing.T, fn gin.HandlerFunc, f *os.File) {
```
By convention the query object will be set into the context by `query` key.
So in controller we can access it by `q := c.Get("query").(BookingFilterQuery)`.
The first route will look like:
```go
r.GET("/booking", handler.BookingList).Use(paramConvertor.BookingFilter)
```

### Unit tests

For unit tests we would like to have stateless environment.
Basically, unit tests possible to run in parallel safely.
The test case for this:
```go
type TestCase struct {
  // Request string representation of validated object (usually json)
  Request json.RawMessage `json:"request"`
  Valid   bool            `json:"valid"`
  Error   json.RawMessage `json:"error"`
}
```

There are validation interfaces inside **ozzo** library, that I would to have in app:
```go
type ValidatableWithContext interface {
  ValidateWithContext(ctx context.Context) error
}
type Validatable interface {
  Validate() error
}
```
I've merged them into `ValidatableRequest` interface. 
Follow that interface any `ValidatableRequest` can be easily testable.  
Next `AssertTestCase` function from the app will go through `map[string]TestCase{}`
and report if any of test cases will fail:
```go
func AssertTestCase(t assert.TestingT, fn ValidatableUnmarshaler, f *os.File) {
```
where `f` is a json object with testCase name as a string and `TestCase` struct as value.  
and `fn` is a function that could unmarshal slice of bytes into `Validatable`:
```go
type ValidatableUnmarshaler func([]byte) (Validatable, error)
```

### CRUD tests

The test data will be a json file with different labeled test cases.
```json
{
  "invalid request": {
    "request": {
      "method": "POST",
      "url": "/booking/123",
      "body": {
        ...
      }
    },
    "response": {
      "status_code": 400,
      "body": {
        ...
      }
    }
  }
}
```


## Choosing validation library

In the [awesome Go]() I found several validation libraries. Few of them are relies on struct tags,
so they automatically were rejected by the requirements. There are few that I found quite interesting:
- [ozzo-validation](https://github.com/go-ozzo/ozzo-validation)
- [jio](https://github.com/faceair/jio)

### Ozzo-validation

Ozzo is good enough to make a validation.

### Jio

But [**jio**](https://github.com/faceair/jio) used string for naming the fields,
that could be a good for validation through yaml files.
Also, it's validate raw json, so it can validate even nullable
properties, e.g. first value of IOTA will be 0 by default, 
and default value for int will be 0 as well - so there is
no easy way to say if value was just skipped in json request
or it's really first value of IOTA. As workaround will
be use first value for something like NA or NULL and validate
that value is not 0.

## Parameter convertor

[In Symfony](https://symfony.com/bundles/SensioFrameworkExtraBundle/current/annotations/converters.html) 
there is a Param Convertor strategy that helps keep the controller clean.
For example controller action for generating an email will look like this:
```php
/**
 * @Route(
 *     "{emailAction}/booking/{booking}/{receiverType}",
 *     methods={"GET"},
 *     name="generate.booking_email",
 * )
 */
public function generate(
    EmailAction  $emailAction,
    Booking      $booking,
    ReceiverType $receiverType,
    ?ShareEmail  $shareEmail = null,
): Response
{
    // do something with request
    // ...
    return new JsonResponse($email);
}
```
Each argument has a strict type which is get by reflection,
and passed to the `apply` method every convertor.
Applicable param convertor will convert Request into an object of the given type.
This magic allows make early validation, so we got a clean state objects into the controller.

In the Gin framework, there is a possibility to apply middleware for every route
and even group of routes.
We can do the same trick with the `gin.Context`:
```go
func main() {
	r := gin.New()
	r.Use(request.SendBookingEmailConvertor).
		Use(renderer.RenderEmail).
		Use(request.DenyDuplication).
		POST("/booking-emails", handlers.BookingSendEmail)

	r.Run(":8000")
}
```
Where `request.SendBookingEmailConvertor` func will make an object from `gin.Context` and set it back
by `request` key:
```go
func SendBookingEmailConvertor(c *gin.Context) {
	r := SendBookingEmail{}

	// read and convert c.Request.Body json into the object
	// read any other params from the gin.Context
	err = r.Validate()
	// return 400 if err found

	c.Set("request", &r)
}
```
Then `renderer.RenderEmail` will take this valid and stateful request to make an email object for set it back:
```go
func RenderEmail(c *gin.Context) {
	r := c.MustGet("request").(*request.SendBookingEmail)

	// set email by handling the request
	// in any error - make c.AbortWithStatusJSON and return

	c.Set("email", email)
}
```
And finally in a handler (controller) we could do anything we need with email:
```go
func BookingSendEmail(c *gin.Context) {
	e := c.MustGet("email").(*model.Email)

	// send an email, save in database, etc...

	c.Status(http.StatusCreated)
}
```
This approach produce a strict dependencies between middlewares and the handler. 
Only integration test can validate that the dependencies are satisfied correctly.

## Conclusion
