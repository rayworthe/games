Changelog
=========

## 1.2.0 - 2019-04-14

### Added

* [Exceptions] Added a `SerialException` interface that all library exceptions implement.

### Changed

* [Support] Added support for Symfony 4
* [Support] Added support for PHP 7.3
* [Support] Dropped support for PHP 7.1
* [Support] Dropped support for PHP 7.0
* [Support] Dropped support for PHP 5.6

--------

## 1.1.0 - 2018-04-09

### Changed

* [Support] Added support for PHP 7.1.
* [Support] Added support for PHP 7.2.
* [Support] Dropped support for HHVM.

--------

## 1.0.0 - 2016-08-17

### Added

* [Support] Added support for symfony/yaml:3.*

### Changed

* [Serializers] The decode() method now returns a custom ArrayObject instance.

### Removed

* [Helper] Removed the helper class.
* [Serializers] Removed the convert() method. Use encode() or decode() instead.
* [Support] Dropped support for PHP 5.5

--------

## 0.4.0 - 2015-02-07

### Added

* [Serializer] Created a PHP serializer.

--------

## 0.3.0 - 2014-10-15

### Added

* [Helper] Create a helper class.

--------

## 0.2.0 - 2014-10-14

### Added

* [Serializer] Created a YAML serializer.

--------

## 0.1.0 - 2014-10-13

### Added

* [Serializer] Created a JSON serializer.

--------
