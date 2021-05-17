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
 * @noinspection PhpUnused PhpUnusedPrivateFieldInspection
 */

namespace DynamicSuite\AUI;
use DynamicSuite\Database\Query;
use Exception;
use PDOException;

/**
 * Class CrudRead.
 *
 * @package DynamicSuite\AUI
 * @property Query $query
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
     * The key is the column and the value is the sort direction (ASC/DESC).
     *
     * @var array
     */
    public array $sort = [];

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
            if (in_array($key, ['page', 'limit', 'search', 'sort'])) {
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
        if ($this->sort) {
            $query->clearOrderBy();
        }
        foreach ($this->sort as $column => $direction) {
            $query->orderBy($column, $direction);
        }
        if ($this->search && $this->search_columns) {
            $query->where(function ($query) {
                foreach ($this->search_columns as $column) {
                    $query->orWhere($column, 'LIKE', "%$this->search%");
                }
            });
        }

        /**
         * Get the total of all possible records for the list
         */
        $total_query = unserialize(serialize($query));
        $total_query->clearOrderBy();
        $total = $total_query->select(['COUNT(*)'])->execute(true);

        /**
         * Read and verify the list
         */
        $list_query = unserialize(serialize($query));
        if ($offset > $total) {
            $offset = $total - $this->limit;
        }
        $list = $list_query->limit($this->limit, $offset)->execute();

        /**
         * Return the list with the total
         */
        return [
            'list' => $list,
            'total' => $total
        ];

    }

}