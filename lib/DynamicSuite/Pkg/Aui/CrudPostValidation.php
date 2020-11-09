<?php
/**
 * CRUD post validation.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
 *
 * @package AUI
 * @author Grant Martin <commgdog@gmail.com>
 * @copyright  2020 Dynamic Suite Team
 * @noinspection PhpUnused
 */

namespace DynamicSuite\Pkg\Aui;
use Exception;

/**
 * Class CrudPostValidation.
 *
 * @package DynamicSuite\Pkg\Aui
 * @property int[] $minimums
 * @property int[] $limits
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
    private array $limits = [];

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
     * Set the limits.
     *
     * @param int[] $limits
     * @return CrudPostValidation
     * @throws Exception
     */
    public function limits(array $limits): CrudPostValidation
    {
        foreach ($limits as $key => $value) {
            if (!is_string($key) || !is_int($value)) {
                throw new Exception('Limits must be an array of integers with string keys');
            }
        }
        $this->limits = $limits;
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
            if (is_numeric($value)) {
                if (array_key_exists($key, $this->limits)) {
                    if ($value > $this->limits[$key]) {
                        $errors[$key] = "$column cannot exceed {$this->limits[$key]}";
                    }
                }
                if (array_key_exists($key, $this->minimums)) {
                    if ($value < $this->minimums[$key]) {
                        $errors[$key] = "$column cannot be less than {$this->minimums[$key]}";
                    }
                }
            } elseif (is_string($value) || $value === null) {
                if (array_key_exists($key, $this->limits)) {
                    if (mb_strlen($value) > $this->limits[$key]) {
                        $errors[$key] = "$column cannot exceed {$this->limits[$key]} characters";
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