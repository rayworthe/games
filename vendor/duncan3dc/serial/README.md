serial
======

A collection of PHP serialization helpers with a consistent interface for each.

[![release](https://poser.pugx.org/duncan3dc/serial/version.svg)](https://packagist.org/packages/duncan3dc/serial)
[![build](https://travis-ci.org/duncan3dc/serial.svg?branch=master)](https://travis-ci.org/duncan3dc/serial)
[![coverage](https://codecov.io/gh/duncan3dc/serial/graph/badge.svg)](https://codecov.io/gh/duncan3dc/serial)


Available Classes
=================

* Json (using the native json_* functions)
* Yaml (using the Symfony Yaml component)
* Php (using the native serialize/unserialize functions)


Interface
=========

All serialization classes implement the interface [duncan3dc\Serial\SerialInterface](src/SerialInterface.php)


Examples
========

Convert array data to string format
```php
use duncan3dc\Serial\Json;
$data = BusinessLogic::getDataAsArray();
$json = Json::encode($data);
```

Convert string formatted data to an array
```php
use duncan3dc\Serial\Yaml;
$yaml = Api::getYamlResponse($request);
$response = Yaml::decode($yaml);
```

Convient methods to serialize and store data on disk
```php
use duncan3dc\Serial\Json;
$filename = "/tmp/file.json";
$data = BusinessLogic::getDataAsArray();
Json::encodeToFile($filename, $data);
```

Retrieve previously stored data from disk
```php
use duncan3dc\Serial\Json;
$filename = "/tmp/file.json";
$data = Json::decodeFromFile($filename);
```


ArrayObject
===========

The `decode()` and `decodeFromFile()` methods return a custom [ArrayObject](http://php.net/manual/en/class.arrayobject.php).

If you need a plain array you can get one like so:
```php
$array = Json::decode($jsonString)->asArray();
```

There are also helper methods to convert to any of the available serialization formats.
```php
$data = Json::decode($jsonString);
$yaml = $data->asYaml();
$json = $data->asJson();
$php = $data->asPhp();
```
