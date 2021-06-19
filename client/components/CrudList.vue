<!--
This file is part of the Dynamic Suite AUI package.

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.

@package DynamicSuite\AUI
@author Grant Martin <commgdog@gmail.com>
@author Michael Ryan <hatduck@gmail.com>
@copyright 2021 Dynamic Suite Team
-->

<template>
  <div class="aui crud-list">

    <!-- List header -->
    <div class="header">

      <!-- List title -->
      <h2>
        <template>{{title}}</template>
        <i v-if="!initial_read && overlay" :class="loading_icon"/>
      </h2>

      <!-- List actions -->
      <div class="actions">
        <slot name="actions" />
        <aui-button
          v-if="show_create"
          :disabled="overlay"
          @click="$emit('show-create')"
        >
          <i :class="create_icon" />
        </aui-button>
        <aui-input
          v-if="show_filter"
          :placeholder="filter_placeholder"
          :disabled="overlay"
          v-model="filter"
          @input="runFilter"
        />
      </div>

    </div>

    <!-- No data in list -->
    <aui-notice
      v-if="show_no_data_notice"
      :icon="no_data_icon"
      :text="no_data_text"
    />

    <!-- Initial list read -->
    <aui-notice
      v-else-if="initial_read && overlay"
      :icon="loading_icon"
      :text="loading_text"
    />

    <!-- Group mode -->
    <aui-list-group
      v-else-if="type === 'group' && !initial_read && list_group_data.length"
      :list="list_group_data"
      @click="$emit('list-interaction', $event)"
    />

    <!-- Table mode -->
    <aui-table
      v-else-if="type === 'table' && !initial_read && data.length"
      interactive
      sortable
      :table="data"
      :interactive_column="storable_key"
      :default_columns="table_default_columns"
      :column_names="table_column_names"
      :column_format="table_column_format"
      :sort.sync="sort"
      :storage_key="table_storage_key"
      :calling="calling"
      :page.sync="page"
      :total="total"
      :limit.sync="limit"
      :list_range_limit="range_limit"
      :disabled="overlay"
      @row-interaction="$emit('list-interaction', $event)"
      @paginate="handlePaginate"
    />

  </div>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * Title of the list.
     *
     * @type {string}
     */
    title: {
      type: String,
      default: 'CRUD List'
    },

    /**
     * If the create button should be shown.
     *
     * @type {boolean}
     */
    show_create: {
      type: Boolean,
      default: true
    },

    /**
     * The FontAwesome icon class to show on the create button (if visible).
     *
     * @type {string}
     */
    create_icon: {
      type: String,
      default: 'fas fa-plus'
    },

    /**
     * If the filter should be shown.
     *
     * @type {boolean}
     */
    show_filter: {
      type: Boolean,
      default: true
    },

    /**
     * Placeholder for the filter input (if visible).
     *
     * @type {string}
     */
    filter_placeholder: {
      type: String,
      default: 'Filter'
    },

    /**
     * The FontAwesome icon class to show when there is no data.
     *
     * @type {string}
     */
    no_data_icon: {
      type: String,
      default: 'fas fa-ban'
    },

    /**
     * The text to display under the icon when there is no data.
     *
     * @type {string}
     */
    no_data_text: {
      type: String,
      default: 'No data'
    },

    /**
     * The FontAwesome icon class to show when the list is loading.
     *
     * @type {string}
     */
    loading_icon: {
      type: String,
      default: 'fas fa-circle-notch fa-spin'
    },

    /**
     * The text to display under the icon when the list is loading.
     *
     * @type {string|null}
     */
    loading_text: {
      type: String | null,
      default: 'Loading...'
    },

    /**
     * Calling state of any APIs.
     *
     * Must be synced to parent.
     *
     * @type {boolean}
     */
    calling: {
      type: Boolean,
      default: false
    },

    /**
     * Overlay state for disabling elements.
     *
     * Must be synced to parent.
     *
     * @type {boolean}
     */
    overlay: {
      type: Boolean,
      default: false
    },

    /**
     * The type of the list.
     *
     * Supports "group" or "table".
     *
     * @type {string}
     */
    type: {
      type: String,
      default: 'table',
      validator: value => {
        return ['group', 'table'].indexOf(value) !== -1;
      }
    },

    /**
     * Storable key for entries.
     *
     * @type {string}
     */
    storable_key: {
      type: String,
      default: 'id'
    },

    /**
     * Icon column to use in the data when in group mode.
     *
     * @type {string}
     */
    group_icon_key: {
      type: String,
      default: 'icon'
    },

    /**
     * Title column to use in the data when in group mode.
     *
     * @type {string}
     */
    group_title_key: {
      type: String,
      default: 'title'
    },

    /**
     * Subtext column to use in the data when in group mode.
     *
     * @type {string}
     */
    group_subtext_key: {
      type: String,
      default: 'subtext'
    },

    /**
     * The default columns to show on the table when in table mode.
     *
     * @type {string[]}
     */
    table_default_columns: {
      type: Array,
      default: () => []
    },

    /**
     * Column name map when in table mode.
     *
     * This is an object where each key is the true column name and the value is the displayed value.
     *
     * @type {object}
     */
    table_column_names: {
      type: Object,
      default: () => ({})
    },

    /**
     * Column value format map when in table mode.
     *
     * This is an object where each key is the true column name and the value is a function.
     *
     * The function may take one "value" where this is the true value, and returns the displayed value.
     *
     * Example:
     *
     * {
     *   column_1: value => {
     *     return 'formatted-${value}';
     *   }
     * }
     *
     * @type {object}
     */
    table_column_format: {
      type: Object,
      default: () => ({})
    },

    /**
     * Storage key for when saving the table layout for the client.
     *
     * Saving the layout will be set on in local storage and then broadcast to the root instance for
     * handling saving via external source.
     *
     * Layouts saved on the server may go in window.dynamicsuite['custom']['aui_table'][storage_key].
     *
     * If not set or NULL, the layout will not be saved across refreshes.
     *
     * @type {string | null}
     */
    table_storage_key: {
      type: String | null,
      default: null
    },

    /**
     * Read API for reading the list data.
     *
     * @type {string}
     */
    read_api: {
      type: String,
      required: true
    },

    /**
     * Optional data to send along with the read API.
     *
     * @type {object}
     */
    read_optional_data: {
      type: Object,
      default: () => ({})
    },

    /**
     * Number of records to limit the list to.
     *
     * Defaults to the first value.
     *
     * @type {number[]}
     */
    range_limit: {
      type: Array,
      default: () => [20, 50, 100]
    },

    /**
     * The delay from inactivity in the filter box until the list refreshes (in milliseconds).
     *
     * @type {number}
     */
    filter_delay: {
      type: Number,
      default: 300
    },

    /**
     * Refresh interval for refreshing the list automatically (re-runs the read API).
     *
     * Given in seconds, a value of NULL will never refresh.
     *
     * @type {number|null}
     */
    refresh_interval: {
      type: Number | null,
      default: null
    },

    /**
     * URL GET key for list limit.
     *
     * @type {string}
     */
    get_key_limit: {
      type: String,
      default: 'limit'
    },

    /**
     * URL GET key for list page.
     *
     * @type {string}
     */
    get_key_page: {
      type: String,
      default: 'page'
    },

    /**
     * URL GET key for list filter.
     *
     * @type {string}
     */
    get_key_filter: {
      type: String,
      default: 'filter'
    },

    /**
     * URL GET key for list sort.
     *
     * @type {string}
     */
    get_key_sort: {
      type: String,
      default: 'sort'
    }

  },
  data() {
    return {
      initial_read: true,
      limit: 0,
      total: 0,
      page: 1,
      filter: null,
      filter_timer: null,
      sort: {},
      data: []
    };
  },
  computed: {

    /**
     * If the notice for no data should be shown.
     *
     * @returns {boolean}
     */
    show_no_data_notice() {
      return (
        !this.calling && (
          (this.type === 'group' && !this.list_group_data.length) ||
          (this.type === 'table' && !this.data.length)
      ));
    },

    /**
     * List data if using "group" mode.
     *
     * @returns [{
     *   {icon: string},
     *   {title: string},
     *   {subtext: string},
     *   {value: number}
     * }]
     */
    list_group_data() {
      const list = [];
      for (const entry of this.data) {
        if (!entry.hasOwnProperty(this.group_title_key)) {
          console.error('AUI CRUD list group data missing group title key');
          continue;
        }
        list.push({
          icon: entry.hasOwnProperty(this.group_icon_key) ? entry[this.group_icon_key] : '',
          title: entry[this.group_title_key],
          subtext: entry.hasOwnProperty(this.group_subtext_key) ? entry[this.group_subtext_key] : '',
          value: entry.hasOwnProperty(this.storable_key) ? entry[this.storable_key] : null,
        });
      }
      return list;
    }

  },
  watch: {

    /**
     * Re-read the list when the sort changes.
     */
    sort() {
      let url_string = '';
      if (Object.keys(this.sort).length) {
        for (const column in this.sort) {
          url_string += `${column}.${this.sort[column]}~`
        }
        url_string = url_string.slice(0, -1);
      }
      const url = new URLSearchParams(window.location.search);
      if (url.has(this.get_key_sort) && url.get(this.get_key_sort) === url_string) {
        return;
      }
      if (url.has(this.get_key_sort) && !url_string) {
        DynamicSuite.deleteURLSavedData(this.get_key_sort, false);
      } else if (url_string) {
        DynamicSuite.setURLSavedData(this.get_key_sort, url_string, false);
      }
      this.readList();
    },

    /**
     * URL data changes for page.
     */
    limit() {
      const url = new URLSearchParams(window.location.search);
      if (url.has(this.get_key_limit) && parseInt(url.get(this.get_key_limit)) === this.limit) {
        return;
      }
      if (url.has(this.get_key_limit) && this.limit === this.range_limit[0]) {
        DynamicSuite.deleteURLSavedData(this.get_key_limit, false);
      } else if (this.limit !== this.range_limit[0]) {
        DynamicSuite.setURLSavedData(this.get_key_limit, this.limit, false);
      }
    }

  },
  methods: {

    /**
     * Handle list pagination and URL state.
     *
     * @returns {undefined}
     */
    handlePaginate() {
      const url = new URLSearchParams(window.location.search);
      if (url.has(this.get_key_page) && parseInt(url.get(this.get_key_page)) === this.page) {
        return;
      }
      if (url.has(this.get_key_page) && this.page <= 1) {
        DynamicSuite.deleteURLSavedData(this.get_key_page);
      } else if (this.page > 1) {
        DynamicSuite.setURLSavedData(this.get_key_page, this.page);
      }
      this.readList();
    },

    /**
     * Read the list using the current criteria.
     *
     * @returns {undefined}
     */
    readList() {
      if (this.calling) {
        return;
      }
      if (!this.data.length) {
        this.initial_read = true;
      }
      const data = Object.assign({
        page: this.page,
        limit: this.limit,
        filter: this.filter,
        sort: this.sort
      }, this.read_optional_data);
      this.$emit('update:calling', true);
      DynamicSuite.call(this.read_api, data, response => {
        switch (response.status) {
          case 'OK':
            this.data = response.data.list;
            this.total = response.data.total;
            this.initial_read = false;
            this.$emit('update:calling', false);
            break;
          default:
            DynamicSuite.clearURLSavedData([
              this.get_key_limit,
              this.get_key_page,
              this.get_key_filter,
              this.get_key_sort
            ]);
            this.$emit('error');
        }
      });
    },

    /**
     * Run the filter for the list.
     *
     * @returns {undefined}
     */
    runFilter() {
      clearTimeout(this.filter_timer);
      this.filter_timer = setTimeout(() => {
        this.page = 1;
        if (this.filter) {
          DynamicSuite.setURLSavedData(this.get_key_filter, this.filter, false);
        } else {
          DynamicSuite.deleteURLSavedData(this.get_key_filter);
        }
        this.readList();
      }, this.filter_delay);
    },

    /**
     * Set any saved URL data.
     *
     * @returns {undefined}
     */
    setURLSavedData() {

      // URL parameters
      const url = new URLSearchParams(window.location.search);

      // Parse numeric values
      const limit = parseInt(url.get(this.get_key_limit));
      const page = parseInt(url.get(this.get_key_page));

      // Parse sort. Groups split via ~ and columns split via .
      const saved_sort = url.get(this.get_key_sort);
      const sort = {};
      if (saved_sort) {
        for (const group of saved_sort.split('~')) {
          const column = group.split('.')
          if (column.length !== 2) {
            continue;
          }
          if (['ASC', 'DESC'].indexOf(column[1]) === -1) {
            continue;
          }
        sort[column[0]] = column[1];
        }
      }

      // Set values
      this.limit = limit > 0 ? limit : this.range_limit[0];
      this.page = page > 0 ? page : 1;
      this.filter = url.get(this.get_key_filter);
      this.$set(this, 'sort', sort);

    }

  },
  mounted() {

    // Set saved data
    this.setURLSavedData();

    // Read the list
    this.readList();

    // Auto-refreshing
    if (this.refresh_interval) {
      setInterval(() => {
          this.readList();
      }, this.refresh_interval * 1000);
    }

    // List re-render
    window.addEventListener('popstate', () => {
      this.setURLSavedData();
      this.readList();
    });

  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* CRUD list container */
.aui.crud-list

  /* Header row */
  & > .header
    display: flex
    align-items: center
    border-bottom: 1px solid $color-border
    padding-bottom: 0.5rem
    margin-bottom: 0.5rem

    @include on-ipad-view
      flex-direction: column
      gap: 0.5rem

    /* Header HTML reset */
    & > h2:first-of-type
      display: inline-flex
      align-items: center
      margin: 0

      /* Loading icon */
      i
        margin-left: 0.5rem
        font-size: 1rem
        color: $color-secondary

    /* Header actions (Filter, etc) */
    .actions
      display: flex
      margin-left: auto

      @include on-ipad-view
        flex-direction: row-reverse
        min-width: 100%

        .input
          width: 100%

      /* Space actions */
      & > *:not(:last-child)
        margin-right: 0.5rem

        @include on-ipad-view
          margin: 0 0 0 0.5rem

</style>