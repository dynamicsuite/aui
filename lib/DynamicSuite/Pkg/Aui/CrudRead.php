<?php
/**
 * CRUD read list formatter.
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
use DynamicSuite\Database\Query;
use Exception;
use PDOException;

/**
 * Class CrudRead.
 *
 * @package DynamicSuite\Pkg\Aui
 * @property Query $query
 * @property string $type
 * @property int $page
 * @property int $limit
 * @property string|null $search
 * @property array $sort
 * @property string|null $table
 * @property string|null $index
 * @property array $filters
 * @property array $search_columns
 */
final class CrudRead
{

    /**
     * List read query.
     *
     * @var Query
     */
    public Query $query;

    /**
     * Set the CRUD return type.
     *
     * Currently supports "group" or "table"
     *
     * @var string
     */
    public string $type = 'group';

    /**
     * The page offset.
     *
     * @var int
     */
    public int $page = 1;

    /**
     * The page data limit.
     *
     * @var int
     */
    public int $limit = 10;

    /**
     * Optional search parameters.
     *
     * @var string|null
     */
    public ?string $search = null;

    /**
     * Array of columns and orders for sorting the dataset.
     *
     * The key is the column, and the value is the sort direction (ASC/DESC).
     *
     * @var array
     */
    public array $sort = [];

    /**
     * The order (column names) that the sort columns will be added to the read.
     *
     * @var string[]
     */
    public array $sort_order = [];

    /**
     * Search columns for the given search (if any).
     *
     * @var array
     */
    private array $search_columns = [];

    /**
     * CrudRead constructor.
     *
     * @param Query $query
     * @return void
     */
    public function __construct(Query $query)
    {
        $this->query = $query;
        foreach ($_POST as $key => $value) {
            if (in_array($key, ['type', 'page', 'limit', 'search', 'sort', 'sort_order'])) {
                $this->$key = $value;
            }
        }
    }

    /**
     * Add search columns to the read.
     *
     * @param string[] $columns
     * @return CrudRead
     * @throws Exception
     */
    public function searchColumns(array $columns): CrudRead
    {
        foreach ($columns as $column) {
            if (!is_string($column)) {
                throw new Exception('Search columns must be strings');
            }
            $this->search_columns[] = $column;
        }
        return $this;
    }

    /**
     * Map sort columns to their actual column names.
     *
     * $columns is an array of strings for mapping the columns.
     *
     * The key of each entry, should be the actual column name, and the value is given sort column ID from the client.
     *
     * @param array $columns
     * @return CrudRead
     * @throws Exception
     */
    public function sortMap(array $columns): CrudRead
    {
        $sort = [];
        foreach ($columns as $column => $given) {
            if (isset($this->sort[$given])) {
                $sort[$column] = $this->sort[$given];
                if (in_array($given, $this->sort_order)) {
                    $this->sort_order[array_search($given, $this->sort_order)] = $column;
                }
            }
        }
        $this->sort = $sort;
        return $this;
    }

    /**
     * Execute the CRUD read.
     *
     * @return array
     * @throws PDOException|Exception
     */
    public function execute(): array
    {

        /**
         * Calculate the page offset for the query
         */
        $offset = ($this->page - 1) * $this->limit;
        if ($offset < 0) {
            return [
                'list' => [],
                'total' => 0
            ];
        }

        /**
         * Add the search clause to the query
         */
        $query = clone $this->query;
        if ($this->sort_order) {
            $query->clearOrderBy();
        }
        foreach ($this->sort_order as $column) {
            if (!isset($this->sort[$column])) {
                throw new Exception('Sort column not found in sort order');
            }
            $query->orderBy($column, $this->sort[$column]);
        }
        if ($this->search && $this->search_columns) {
            $query->where(function ($query) {
                foreach ($this->search_columns as $column) {
                    $query->orWhere($column, 'LIKE', "%{$this->search}%");
                }
            });
        }

        /**
         * Get the total of all possible records for the list
         */
        $total_query = clone $query;
        $total = $total_query->select(['COUNT(*)'])->execute(true);

        /**
         * Read and verify the list
         */
        $list_query = clone $query;
        if ($offset > $total) {
            $offset = $total - $this->limit;
        }
        $list = $list_query->limit($this->limit, $offset)->execute();
        foreach ($list as $row) {
            if (!isset($row['id'])) {
                throw new Exception('CRUD read must contain an "ID" column');
            }
            if ($this->type === 'group') {
                if (!array_key_exists('title', $row)) {
                    throw new Exception('CRUD read of the "group" type must contain a "title"');
                }
            }
        }

        /**
         * Return the list with the total
         */
        return [
            'list' => $list,
            'total' => $total
        ];

    }

}