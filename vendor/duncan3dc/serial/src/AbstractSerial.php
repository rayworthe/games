<?php

namespace duncan3dc\Serial;

use duncan3dc\Serial\Exceptions\FileException;

abstract class AbstractSerial implements SerialInterface
{


    /**
     * Ensure the passed data is a basic array.
     *
     * @param mixed $data The array-like structure to convert
     *
     * @return array
     */
    protected static function asArray($data)
    {
        if ($data instanceof ArrayObject) {
            return $data->asArray();
        }

        if ($data === null) {
            return [];
        }

        return $data;
    }



    /**
     * Convert an array to a serial string, and then write it to a file.
     *
     * {@inheritDoc}
     */
    public static function encodeToFile($path, $array)
    {
        $string = static::encode($array);

        # Ensure the directory exists
        $directory = pathinfo($path, PATHINFO_DIRNAME);
        if (!is_dir($directory)) {
            mkdir($directory, 0775, true);
        }

        if (file_put_contents($path, $string) === false) {
            throw new FileException("Failed to write the file: {$path}");
        }
    }


    /**
     * Read a serial string from a file and convert it to an array.
     *
     * {@inheritDoc}
     */
    public static function decodeFromFile($path)
    {
        if (!is_file($path)) {
            throw new FileException("File does not exist: {$path}");
        }

        $string = file_get_contents($path);

        if ($string === false) {
            throw new FileException("Failed to read the file: {$path}");
        }

        return static::decode($string);
    }
}
