<?php

namespace duncan3dc\Serial;

/**
 * Allow both object/property and array/key access to data.
 */
class ArrayObject extends \ArrayObject
{

    /**
     * Create a new instance from a basic array.
     *
     * @param array $data The array to convert
     *
     * @return self
     */
    public static function make(array $data)
    {
        # Convert values to ArrayObject instances
        foreach ($data as &$value) {
            if (is_array($value)) {
                $value = static::make($value);
            }
        }
        unset($value);

        return new self($data, \ArrayObject::ARRAY_AS_PROPS);
    }


    /**
     * Convert the current instance to a basic array.
     *
     * @return array
     */
    public function asArray()
    {
        $array = [];

        foreach ($this as $key => $val) {
            if ($val instanceof self) {
                $val = $val->asArray();
            }
            $array[$key] = $val;
        }

        return $array;
    }


    /**
     * Serialize this instance as JSON.
     *
     * @return string
     */
    public function asJson()
    {
        return Json::encode($this);
    }


    /**
     * Serialize this instance as PHP.
     *
     * @return string
     */
    public function asPhp()
    {
        return Php::encode($this);
    }


    /**
     * Serialize this instance as YAML.
     *
     * @return string
     */
    public function asYaml()
    {
        return Yaml::encode($this);
    }
}
