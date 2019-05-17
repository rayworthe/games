<?php

namespace eben\website;

header("Content-Type:text/html; charset=UTF-8");

require(__DIR__ . "/../vendor/autoload.php");

use duncan3dc\Laravel\Blade;

$whoops = new \Whoops\Run;
$whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler);
$whoops->register();
