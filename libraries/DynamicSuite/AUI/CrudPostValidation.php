<?php
/**
 * This file is part of the Dynamic Suite AUI package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @package DynamicSuite\AUI
 * @author Grant Martin <commgdog@gmail.com>
 * @copyright 2021 Dynamic Suite Team
 * @noinspection ALL
 */

namespace DynamicSuite\AUI;
use Exception;

/**
 * Class CrudPostValidation.
 *
 * @package DynamicSuite\AUI
 * @property int[] $minimums
 * @property int[] $maximums
 * @property string[] $cast
 * @property string[] $prefix_map
 */
final class CrudPostValidation
{

    /**
     * Minimum post value lengths.
     *
     * @var int[]
     */
    private array $minimums = [];

    /**
     * Maximum post value lengths.
     *
     * @var int[]
     */
    private array $maximums = [];

    /**
     * Type casting overrides.
     *
     * @var array
     */
    private array $cast = [];

    /**
     * Column prefix map.
     *
     * @var string[]
     */
    private array $prefix_map = [];

    /**
     * Set the minimums.
     *
     * @param int[] $minimums
     * @return CrudPostValidation
     * @throws Exception
     */
    public function minimums(array $minimums): CrudPostValidation
    {
        foreach ($minimums as $key => $value) {
            if (!is_string($key) || !is_numeric($value)) {
                throw new Exception('Minimums must be an array of integers with string keys');
            }
        }
        $this->minimums = $minimums;
        return $this;
    }

    /**
     * Cast types.
     *
     * @param string[] $cast
     * @return CrudPostValidation
     * @throws Exception
     */
    public function cast(array $cast): CrudPostValidation
    {
        foreach ($cast as $key => $value) {
            if (!is_string($key) || !is_string($value)) {
                throw new Exception('Casting must be an array of strings with string keys');
            }
        }
        $this->cast = $cast;
        return $this;
    }

    /**
     * Set the maximums.
     *
     * @param int[] $maximums
     * @return CrudPostValidation
     * @throws Exception
     */
    public function maximums(array $maximums): CrudPostValidation
    {
        foreach ($maximums as $key => $value) {
            if (!is_string($key) || !is_int($value)) {
                throw new Exception('Limits must be an array of integers with string keys');
            }
        }
        $this->maximums = $maximums;
        return $this;
    }

    /**
     * Set the prefix map.
     *
     * @param string[] $prefix_map
     * @return CrudPostValidation
     * @throws Exception
     */
    public function prefixMap(array $prefix_map): CrudPostValidation
    {
        foreach ($prefix_map as $key => $value) {
            if (!is_string($key) || !is_string($value)) {
                throw new Exception('Prefix map must be an array of strings with string keys');
            }
        }
        $this->prefix_map = $prefix_map;
        return $this;
    }

    /**
     * Run the validation.
     *
     * Returns an array of strings where each key is a string representing the POST key that has an error and the
     * value is the message for that error to send back to the client.
     *
     * @return array
     */
    public function validate(): array
    {
        $errors = [];
        global $_POST;
        foreach ($_POST as $key => $value) {
            $column = array_key_exists($key, $this->prefix_map)
                ? $this->prefix_map[$key]
                : ucfirst(str_replace('_', ' ', $key));
            if ((isset($this->cast[$key]) && $this->cast[$key] === 'number') || (is_float($value) || is_int($value))) {
                if (array_key_exists($key, $this->maximums)) {
                    if ($value > $this->maximums[$key]) {
                        $errors[$key] = "$column cannot exceed {$this->maximums[$key]}";
                    }
                }
                if (array_key_exists($key, $this->minimums)) {
                    if ($value < $this->minimums[$key]) {
                        $errors[$key] = "$column cannot be less than {$this->minimums[$key]}";
                    }
                }
            } elseif (
                $value === null ||
                (is_string($value) && !isset($this->cast[$key])) ||
                (isset($this->cast[$key]) && $this->cast[$key] === 'string')
            ) {
                if (array_key_exists($key, $this->maximums)) {
                    if (mb_strlen($value) > $this->maximums[$key]) {
                        $errors[$key] = "$column cannot exceed {$this->maximums[$key]} characters";
                    }
                }
                if (array_key_exists($key, $this->minimums)) {
                    if (mb_strlen($value) < $this->minimums[$key]) {
                        if (empty($value)) {
                            $errors[$key] = "$column missing";
                        } else {
                            $errors[$key] = "$column cannot be less than {$this->minimums[$key]} characters";
                        }
                    }
                }
            }
        }
        return $errors;
    }

}