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
  <div class="aui table">

    <!-- Icon for showing the modal for selecting which columns to view -->
    <div class="options">
      <i
        class="fas fa-columns"
        title="Select Columns To View"
        @click="showColumnsModal"
      />
    </div>

    <!-- Modal for selecting which columns to view -->
    <aui-modal :show.sync="show_columns_modal" title="Select Columns To View">
      <template #content>
        <aui-checkbox
          v-for="(selected, column) in columns_modal_model"
          :key="'column' + column"
          :label="columnName(column)"
          :checked="selected"
          v-model="columns_modal_model[column]"
        />
        <aui-alert
          v-if="columns_modal_feedback"
          type="failure"
          :text="columns_modal_feedback"
        />
      </template>
      <template #left>
        <aui-button
          type="secondary"
          text="Cancel"
          @click="hideColumnsModal"
        />
      </template>
      <template #right>
        <div class="btn-group">
          <aui-button
            text="Apply"
            @click="applyColumns"
          />
          <aui-button-drop
            :dropdown="{reset: 'Reset to Default'}"
            relative_to=".modal"
            @reset="resetColumns"
          />
        </div>
      </template>
    </aui-modal>

    <!-- The actual table -->
    <table :class="table_classes">
      <thead>
        <tr>
          <th
            v-for="(column, id) in columns"
            :key="'header' + id"
            ref="header"
            @mousedown.self="runSort(column)"
          >
            <template>{{columnName(column)}}</template>
            <i v-if="sortable" :class="sortIcon(column)" />
            <div
              @mousedown="handleResizeColumn($event, id)"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, id) in filtered_table" :key="'row' + id" @click="rowInteraction(id)">
          <td v-for="(column_value, column) in row" :key="'column' + column + id">
            {{columnValue(column, column_value)}}
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * Data for the table.
     *
     * @type {array}
     */
    table: {
      type: Array,
      default: () => []
    },

    /**
     * If the table is interactive and should emit something on row click.
     *
     * @type {boolean}
     */
    interactive: {
      type: Boolean,
      default: true
    },

    /**
     * The column to emit the value of on row interaction.
     *
     * @type {string}
     */
    interactive_column: {
      type: String | null,
      default: null
    },

    /**
     * The default columns that are visible on the table.
     *
     * @type {string[]}
     */
    default_columns: {
      type: Array,
      default: () => []
    },

    /**
     * Column name map.
     *
     * This is an object where each key is the true column name and the value is the displayed value.
     *
     * @type {string[]}
     */
    column_names: {
      type: Object,
      default: () => ({})
    },

    /**
     * Column value format map.
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
     * @type {function[]}
     */
    column_format: {
      type: Object,
      default: () => ({})
    },

    /**
     * If the table is sortable.
     *
     * If sortable, icons will be added to the table header and clicking on the header will sort by that column.
     *
     * This component does not handle any of the sorting itself, but emits out a @sort event with which columns
     * to sort by. Actual sorting functionality must be handled by the parent.
     *
     * @type {boolean}
     */
    sortable: {
      type: Boolean,
      default: false
    },

    /**
     * Key, value pair for sorting.
     *
     * The key is the column to sort and the value is the sorting direction (ascending or descending).
     *
     * Must be synced back to the parent.
     *
     * @type {string[]}
     */
    sort: {
      type: Object,
      default: () => ({})
    },

    /**
     * Column sorting icon (FontAwesome class): no sort on column.
     *
     * @type {string}
     */
    sort_icon_none: {
      type: String,
      default: 'fas fa-sort'
    },

    /**
     * Column sorting icon (FontAwesome class): ascending.
     *
     * @type {string}
     */
    sort_icon_asc: {
      type: String,
      default: 'fas fa-sort-amount-down-alt'
    },

    /**
     * Column sorting icon (FontAwesome class): descending.
     *
     * @type {string}
     */
    sort_icon_desc: {
      type: String,
      default: 'fas fa-sort-amount-down'
    },

    /**
     * Local storage key for when saving the table layout on the client.
     *
     * If not set or NULL, the layout will not be saved across refreshes.
     *
     * @type {string | null}
     */
    local_storage_key: {
      type: String | null,
      default: null
    },

    /**
     * If an API calling state is present for blocking interaction.
     *
     * @type {boolean}
     */
    calling: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      columns: [],
      show_columns_modal: false,
      columns_modal_model: {},
      columns_modal_feedback: null
    };
  },
  computed: {

    /**
     * Classes for the table.
     *
     * @returns {
     *   {interactive: boolean}
     * }
     */
    table_classes() {
      return {
        interactive: this.interactive,
        sortable: this.sortable
      };
    },

    /**
     * Get all of the available columns in the dataset.
     *
     * @returns {string[]}
     */
    available_columns() {
      if (typeof this.table[0] !== 'object') {
        return [];
      }
      return Object.keys(this.table[0]);
    },

    /**
     * Get the filtered table, only showing values in visible columns.
     *
     * @returns {object[]}
     */
    filtered_table() {
      const columns = [];
      for (const row of this.table) {
        columns.push(Object.keys(row)
          .filter(key => this.columns.includes(key))
          .reduce((obj, key) => {
            obj[key] = row[key];
            return obj;
          }, {})
        )
      }
      return columns;
    }

  },
  methods: {

    /**
     * Get the mapped column name.
     *
     * @param {string} column - The name of the column to lookup in the map.
     * @returns {string}
     */
    columnName(column) {
      return this.column_names.hasOwnProperty(column) ? this.column_names[column] : column;
    },

    /**
     * Get the mapped column formatted value.
     *
     * @param {string} column - The name of the column to lookup in the map.
     * @param {string} value - The value of the column to validate.
     * @returns {string}
     */
    columnValue(column, value) {
      if (!this.column_format.hasOwnProperty(column)) {
        return value;
      } else {
        return this.column_format[column](value);
      }
    },

    /**
     * The icon to display on each column header indicating column sort.
     *
     * @param {string} column - The column name.
     * @returns {object}
     */
    sortIcon(column) {
      return {
        [this.sort_icon_none]: !this.sort.hasOwnProperty(column),
        [this.sort_icon_asc]: this.sort.hasOwnProperty(column) && this.sort[column] === 'ASC',
        [this.sort_icon_desc]: this.sort.hasOwnProperty(column) && this.sort[column] === 'DESC'
      }
    },

    /**
     * Run the sort for the given column.
     *
     * Sort is in the following order: ASC -> DESC -> NONE.
     *
     * This just emits the sort back to the parent for handling the actual sort.
     *
     * @param {string} column - The column to sort
     * @returns {undefined}
     */
    runSort(column) {
      if (!this.sortable || this.calling) {
        return;
      }
      let sort = JSON.parse(JSON.stringify(this.sort));
      if (typeof sort !== 'object') {
        sort = {};
      }
      if (!sort.hasOwnProperty(column)) {
        sort[column] = 'ASC';
      } else if (sort[column] === 'ASC') {
        sort[column] = 'DESC';
      } else {
        delete sort[column];
      }
      this.$emit('update:sort', sort);
    },

    /**
     * Handle row interaction.
     *
     * @param {number} id - The interacted row data reference key.
     * @returns {undefined}
     */
    rowInteraction(id) {
      if (!this.interactive || this.calling || !this.interactive_column) {
        return;
      }
      if (this.filtered_table[id].hasOwnProperty(this.interactive_column)) {
        this.$emit('row-interaction', this.filtered_table[id][this.interactive_column]);
      }
    },

    /**
     * Event handler for when a user tries to resize a header column.
     *
     * @param {object} parent_event - The parent event handler.
     * @param {number} index - The column index.
     * @returns {undefined}
     */
    handleResizeColumn(parent_event, index) {
      let dragging = true;
      const start_x = parent_event.pageX;
      const start_width = parseInt(window.getComputedStyle(this.$refs['header'][index]).width);
      document.addEventListener('mousemove', event => {
        if (dragging) {
          const new_width = start_width + (event.pageX - start_x);
          this.$refs['header'][index].style.width = `${new_width}px`;
        }
      });
      document.addEventListener('mouseup', () => {
        dragging = false;
      });
    },

    /**
     * Reset the visible columns to the default.
     *
     * @returns {undefined}
     */
    resetColumns() {
      if (!this.default_columns.length) {
        this.columns = JSON.parse(JSON.stringify(this.available_columns));
      } else {
        this.columns = this.default_columns;
      }
      this.show_columns_modal = false;
      if (this.local_storage_key) {
        localStorage.removeItem(this.local_storage_key);
      }
    },

    /**
     * Show the column selection modal.
     *
     * @returns {undefined}
     */
    showColumnsModal() {
      if (this.calling) {
        return;
      }
      const model = {};
      for (const column of this.available_columns) {
        model[column] = this.columns.indexOf(column) !== -1;
      }
      this.$set(this, 'columns_modal_model', model);
      this.columns_modal_feedback = false;
      this.show_columns_modal = true;
    },

    /**
     * Hide the column selection modal.
     *
     * @returns {undefined}
     */
    hideColumnsModal() {
      this.show_columns_modal = false;
    },

    /**
     * Apply the filtered selection to the live columns.
     *
     * @returns {undefined}
     */
    applyColumns() {
      const columns = [];
      for (const column in this.columns_modal_model) {
        if (this.columns_modal_model[column]) {
          columns.push(column);
        }
      }
      if (!columns.length) {
        this.columns_modal_feedback = 'Must select at least 1 column';
        return;
      }
      this.$set(this, 'columns', columns);
      this.saveToLocalStorage();
      this.hideColumnsModal();
    },

    /**
     * Save the column layout to local storage.
     *
     * @returns {undefined}
     */
    saveToLocalStorage() {
      if (!this.local_storage_key) {
        return;
      }
      localStorage.setItem(this.local_storage_key, JSON.stringify(this.columns));
    },

    /**
     * Get the saved layout from local storage.
     *
     * @returns {array|boolean}
     */
    getFromLocalStorage() {
      if (!this.local_storage_key) {
        return false;
      }
      const columns = localStorage.getItem(this.local_storage_key);
      if (columns) {
        return JSON.parse(columns);
      } else {
        return false;
      }
    }

  },
  mounted() {

    // Set the columns to view on load
    const columns = this.getFromLocalStorage();
    if (!columns) {
      this.resetColumns();
    } else {

      // Check to make sure the saved columns are still valid
      let validity = true;
      for (const column of columns) {
        if (this.available_columns.indexOf(column) === -1) {
          validity = false;
        }
      }

      // Set from local storage or reset if no longer valid
      if (validity) {
        this.$set(this, 'columns', columns);
      } else {
        this.resetColumns();
      }

    }

  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* Table container */
.aui.table
  position: relative

  /* Table options */
  .options
    display: flex
    justify-content: center
    align-items: center
    position: absolute
    right: 0
    width: 2rem
    height: 2rem
    z-index: 1
    background: $color-container

    /* Options icon */
    i
      color: $color-secondary
      cursor: pointer

      &:hover
        color: $color-primary

  /* Column filtering modal */
  .modal .aui.checkbox:not(:last-of-type)
    margin-bottom: 1rem

  /* The actual table */
  table
    width: 100%
    text-align: left
    border-collapse: collapse
    background: $color-container

    /* Table cells */
    td, th
      position: relative
      padding: 0.5rem

    /* Header border */
    thead
      border-bottom: 2px solid $color-border

      /* Header cells */
      th
        white-space: nowrap

        /* Sortable icons */
        i
          width: 1rem
          margin-left: 0.25rem
          color: $color-secondary

        /* Resize anchor */
        div
          position: absolute
          right: 0
          top: 0
          bottom: 0
          cursor: col-resize
          width: 0.35rem

          &:hover
            background: darken($color-border, 15%)

    td
      white-space: nowrap
      text-overflow: ellipsis

    /* Zebra striping */
    tbody tr:nth-of-type(odd)
      background: $color-text-inverted

    /* Sortable tables */
    &.sortable th
      user-select: none
      cursor: pointer

      &:hover
        background: darken($color-container, 5%)

    /* Interactive tables */
    &.interactive tbody
      user-select: none

      tr:hover
        cursor: pointer
        background: lighten($color-warning, 35%)

</style>