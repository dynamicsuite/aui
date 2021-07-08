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
  <div class="aui crud">

    <!-- Error notice -->
    <aui-notice
      v-if="error"
      type="failure"
      :icon="error_icon"
      :text="error_text"
      :subtext="error_subtext"
    />

    <!-- Created confirmation notice -->
    <aui-notice
      v-else-if="created"
      type="success"
      :icon="form_created_confirmation_icon"
      :text="form_created_confirmation_text"
    />

    <!-- Initial list read -->
    <aui-notice
      v-else-if="form_loading && overlay"
      :icon="form_loading_icon"
      :text="form_loading_text"
    />

    <!-- CRUD list -->
    <aui-crud-list
      v-else-if="!show_form && !setup"
      ref="list"
      :title="list_title"
      :show_create="list_show_create"
      :create_icon="list_create_icon"
      :show_filter="list_show_filter"
      :filter_placeholder="list_filter_placeholder"
      :no_data_icon="list_no_data_icon"
      :no_data_text="list_no_data_text"
      :loading_icon="list_loading_icon"
      :loading_text="list_loading_text"
      :calling="calling"
      :overlay="overlay"
      :type="list_type"
      :storable_key="storable_key"
      :group_icon_key="list_group_icon_key"
      :group_title_key="list_group_title_key"
      :group_subtext_key="list_group_subtext_key"
      :table_default_columns="list_table_default_columns"
      :table_column_names="list_table_column_names"
      :table_column_format="list_table_column_format"
      :table_storage_key="list_table_storage_key"
      :read_api="list_read_api"
      :read_optional_data="list_read_optional_data"
      :range_limit="list_range_limit"
      :filter_delay="list_filter_delay"
      :refresh_interval="list_refresh_interval"
      :get_key_limit="list_get_key_limit"
      :get_key_page="list_get_key_page"
      :get_key_filter="list_get_key_filter"
      :get_key_sort="list_get_key_sort"
      @update:calling="$emit('update:calling', $event)"
      @error="handleError"
      @show-create="handleFormCreate"
      @list-interaction="handleListInteraction"
    >
      <template #actions>
        <slot name="list-actions" :overlay="overlay" />
      </template>
      <template #pre-data>
        <slot name="list-pre-data" :overlay="overlay" />
      </template>
    </aui-crud-list>

    <!-- CRUD form -->
    <div v-else-if="!setup" class="form">
      <slot name="form" :overlay="overlay" />
      <div v-if="!form_loading" class="actions">
        <slot name="form-back-button" :overlay="overlay">
          <aui-button
            v-if="form_show_back_button"
            type="secondary"
            :disabled="overlay"
            :text="form_action_back_text"
            @click="runBack"
          />
        </slot>
        <div v-if="!form_for_create && form_update_api && !form_loading" class="btn-group">
          <i v-if="show_tick" :class="tick_classes" />
          <aui-button
            :text="form_action_update_text"
            :loading="overlay"
            :loading_text="form_action_update_loading_text"
            @click="runUpdate"
          />
          <aui-button-drop
            v-if="form_delete_api"
            relative_to=".form"
            :disabled="overlay"
            :dropdown="{delete: this.form_action_delete_text}"
            @delete="promptDelete"
          />
        </div>
        <aui-button
          v-if="form_for_create && form_create_api && !form_loading"
          :text="form_action_create_text"
          :loading="overlay"
          :loading_text="form_action_create_loading_text"
          @click="runCreate"
        />
      </div>
    </div>

    <!-- Delete confirm modal -->
    <aui-modal type="failure" :title="form_action_delete_title" :show.sync="show_delete_modal">
      <template #content>
        <slot name="delete-prompt"><p>{{form_action_delete_prompt}}</p></slot>
        <aui-input label="Type DELETE to confirm" class="delete-confirm-input" v-model="delete_confirm" />
        <aui-alert v-if="delete_protect" type="failure" :text="delete_protect" />
      </template>
      <template #left>
        <aui-button
          type="secondary"
          :disabled="overlay"
          :text="form_action_delete_cancel_text"
          @click="runCancelDelete"
        />
      </template>
      <template #right>
        <aui-button
          type="failure"
          :disabled="!delete_confirmed"
          :loading="overlay"
          :loading_text="form_action_delete_loading_text"
          :text="form_action_delete_text"
          @click="runDelete"
        />
      </template>
    </aui-modal>

  </div>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * FontAwesome icon class to display for the error notice.
     *
     * @type {string}
     */
    error_icon: {
      type: String,
      default: 'fas fa-exclamation-triangle'
    },

    /**
     * Text to display for the error notice.
     *
     * @type {string}
     */
    error_text: {
      type: String,
      default: 'A server error has occurred'
    },

    /**
     * Subtext to display for the error notice.
     *
     * @type {string}
     */
    error_subtext: {
      type: String,
      default: 'Please reload the page'
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
     * URL GET key for which view CRUD is on.
     *
     * A value of 0 means "show create" where as any other value will read the storable of that value and show the
     * update page.
     *
     * @type {string}
     */
    get_key_id: {
      type: String,
      default: 'crud'
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
     * Title of the list.
     *
     * @type {string}
     */
    list_title: {
      type: String,
      default: 'CRUD List'
    },

    /**
     * If the create button should be shown on the list.
     *
     * @type {boolean}
     */
    list_show_create: {
      type: Boolean,
      default: true
    },

    /**
     * The FontAwesome icon class to show on the list create button (if visible).
     *
     * @type {string}
     */
    list_create_icon: {
      type: String,
      default: 'fas fa-plus'
    },

    /**
     * If the filter should be shown on the list.
     *
     * @type {boolean}
     */
    list_show_filter: {
      type: Boolean,
      default: true
    },

    /**
     * Placeholder for the list filter input (if visible).
     *
     * @type {string}
     */
    list_filter_placeholder: {
      type: String,
      default: 'Filter'
    },

    /**
     * The FontAwesome icon class to show when there is no data in the list.
     *
     * @type {string}
     */
    list_no_data_icon: {
      type: String,
      default: 'fas fa-ban'
    },

    /**
     * The text to display under the icon when there is no data in the list.
     *
     * @type {string}
     */
    list_no_data_text: {
      type: String,
      default: 'No data'
    },

    /**
     * The FontAwesome icon class to show when the list is loading.
     *
     * @type {string}
     */
    list_loading_icon: {
      type: String,
      default: 'fas fa-circle-notch fa-spin'
    },

    /**
     * The text to display under the icon when the list is loading.
     *
     * @type {string|null}
     */
    list_loading_text: {
      type: String | null,
      default: 'Loading...'
    },

    /**
     * The type of the list.
     *
     * Supports "group" or "table".
     *
     * @type {string}
     */
    list_type: {
      type: String,
      default: 'table',
      validator: value => {
        return ['group', 'table'].indexOf(value) !== -1;
      }
    },

    /**
     * Icon column to use in the data when the list in group mode.
     *
     * @type {string}
     */
    list_group_icon_key: {
      type: String,
      default: 'icon'
    },

    /**
     * Title column to use in the data when the list is in group mode.
     *
     * @type {string}
     */
    list_group_title_key: {
      type: String,
      default: 'title'
    },

    /**
     * Subtext column to use in the data when the list is in group mode.
     *
     * @type {string}
     */
    list_group_subtext_key: {
      type: String,
      default: 'subtext'
    },

    /**
     * The default columns to show on the table when the list is in table mode.
     *
     * @type {string[]}
     */
    list_table_default_columns: {
      type: Array,
      default: () => []
    },

    /**
     * Column name map when the list is in table mode.
     *
     * This is an object where each key is the true column name and the value is the displayed value.
     *
     * @type {object}
     */
    list_table_column_names: {
      type: Object,
      default: () => ({})
    },

    /**
     * Column value format map when the list is in table mode.
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
    list_table_column_format: {
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
    list_table_storage_key: {
      type: String | null,
      default: null
    },

    /**
     * Read API for reading the list data.
     *
     * @type {string}
     */
    list_read_api: {
      type: String,
      required: true
    },

    /**
     * Optional data to send along with the list read API.
     *
     * @type {object}
     */
    list_read_optional_data: {
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
    list_range_limit: {
      type: Array,
      default: () => [15, 25, 100]
    },

    /**
     * The delay from inactivity in the filter box until the list refreshes (in milliseconds).
     *
     * @type {number}
     */
    list_filter_delay: {
      type: Number,
      default: 300
    },

    /**
     * List refresh interval for refreshing the list automatically (re-runs the read API).
     *
     * Given in seconds, a value of NULL will never refresh.
     */
    list_refresh_interval: {
      type: Number | null,
      default: null
    },

    /**
     * URL GET key for list limit.
     *
     * @type {string}
     */
    list_get_key_limit: {
      type: String,
      default: 'limit'
    },

    /**
     * URL GET key for list page.
     *
     * @type {string}
     */
    list_get_key_page: {
      type: String,
      default: 'page'
    },

    /**
     * URL GET key for list filter.
     *
     * @type {string}
     */
    list_get_key_filter: {
      type: String,
      default: 'filter'
    },

    /**
     * URL GET key for list sort.
     *
     * @type {string}
     */
    list_get_key_sort: {
      type: String,
      default: 'sort'
    },

    /**
     * The actual form data sent to APIs.
     *
     * @type {object}
     */
    form: {
      type: Object,
      default: () => ({})
    },

    /**
     * Secure fields that are cleared after API calls (such as passwords).
     *
     * This is an array of "field" names.
     *
     * @type {array}
     */
    form_secure_fields: {
      type: Array,
      default: () => []
    },

    /**
     * Form feedback.
     */
    feedback: {
      type: Object,
      default: () => ({})
    },

    /**
     * The FontAwesome icon class to show when the form is loading.
     *
     * @type {string}
     */
    form_loading_icon: {
      type: String,
      default: 'fas fa-circle-notch fa-spin'
    },

    /**
     * The text to display under the icon when the form is loading.
     *
     * @type {string|null}
     */
    form_loading_text: {
      type: String | null,
      default: 'Loading...'
    },

    /**
     * API to call to pre-fill the form when creating a new storable.
     *
     * @type {string|null}
     */
    form_create_setup_api: {
      type: String | null,
      default: null
    },

    /**
     * Additional data to send along with the form create setup API.
     *
     * @type {object}
     */
    form_create_setup_api_data: {
      type: Object,
      default: () => ({})
    },

    /**
     * API to call to create a new storable.
     *
     * @type {string|null}
     */
    form_create_api: {
      type: String | null,
      default: null
    },

    /**
     * Additional data to send along with the form create API.
     *
     * @type {object}
     */
    form_create_api_data: {
      type: Object,
      default: () => ({})
    },

    /**
     * API to call to read a storable to pre-fill the form when editing/viewing.
     *
     * @type {string}
     */
    form_read_api: {
      type: String,
      required: true
    },

    /**
     * Additional data to send along with the form read API.
     *
     * @type {object}
     */
    form_read_api_data: {
      type: Object,
      default: () => ({})
    },

    /**
     * API to call to update the active storable.
     *
     * @type {string|null}
     */
    form_update_api: {
      type: String | null,
      default: null
    },

    /**
     * Additional data to send along with the form update API.
     *
     * @type {object}
     */
    form_update_api_data: {
      type: Object,
      default: () => ({})
    },

    /**
     * API to call to delete the active storable.
     *
     * @type {string|null}
     */
    form_delete_api: {
      type: String | null,
      default: null
    },

    /**
     * Additional data to send along with the form delete API.
     *
     * @type {object}
     */
    form_delete_api_data: {
      type: Object,
      default: () => ({})
    },

    /**
     * Columns to exclude from API calls.
     */
    form_exclude_columns: {
      type: Array,
      default: () => ([])
    },

    /**
     * Format specific columns when sent to API calls.
     *
     * This is an object where the key is the column and the value is a function that returns
     * a formatted value. This function takes 1 argument, the actual form value.
     *
     * @type {object}
     */
    form_format_columns: {
      type: Object,
      default: () => ({})
    },

    /**
     * If the form actions should be shown.
     *
     * @type {boolean}
     */
    form_show_actions: {
      type: Boolean,
      default: true
    },

    /**
     * If the back button should be show on the form actions.
     *
     * @type {boolean}
     */
    form_show_back_button: {
      type: Boolean,
      default: true
    },

    /**
     * Text to display on the form action for "Back".
     *
     * @type {string}
     */
    form_action_back_text: {
      type: String,
      default: 'Back'
    },

    /**
     * Text to display on the form action for "Update".
     *
     * @type {string}
     */
    form_action_update_text: {
      type: String,
      default: 'Update'
    },

    /**
     * Text to display on the form action for "Update" when loading.
     *
     * @type {string}
     */
    form_action_update_loading_text: {
      type: String,
      default: 'Updating...'
    },

    /**
     * Text to display on the form action for "Create".
     *
     * @type {string}
     */
    form_action_create_text: {
      type: String,
      default: 'Create'
    },

    /**
     * Text to display on the form action for "Create" when loading.
     *
     * @type {string}
     */
    form_action_create_loading_text: {
      type: String,
      default: 'Creating...'
    },

    /**
     * FontAwesome icon class to display on the created confirmation splash screen.
     *
     * @type {string}
     */
    form_created_confirmation_icon: {
      type: String,
      default: 'fas fa-check-circle'
    },

    /**
     * Text to display on the created confirmation splash screen.
     *
     * @type {string}
     */
    form_created_confirmation_text: {
      type: String,
      default: 'Created!'
    },

    /**
     * Text to display on the form action for "Delete" when canceling.
     *
     * @type {string}
     */
    form_action_delete_cancel_text: {
      type: String,
      default: 'Cancel'
    },

    /**
     * Text to display on the form action for "Delete".
     *
     * @type {string}
     */
    form_action_delete_text: {
      type: String,
      default: 'Delete'
    },

    /**
     * Text to display on the form action for "Delete" when loading.
     *
     * @type {string}
     */
    form_action_delete_loading_text: {
      type: String,
      default: 'Deleting...'
    },

    /**
     * Text to display on the title of the modal when deleting a storable.
     *
     * @type {string}
     */
    form_action_delete_title: {
      type: String,
      default: 'Confirm Delete'
    },

    /**
     * Text to display on the modal body when deleting a storable.
     *
     * @type {string}
     */
    form_action_delete_prompt: {
      type: String,
      default: 'Are you sure you want to delete?'
    },

    /**
     * FontAwesome icon class to show on the "success" feedback tick.
     *
     * @type {string}
     */
    form_feedback_success_tick_icon: {
      type: String,
      default: 'fas fa-check'
    },

    /**
     * FontAwesome icon class to show on the "failure" feedback tick.
     *
     * @type {string}
     */
    form_feedback_failure_tick_icon: {
      type: String,
      default: 'fas fa-times'
    },

    /**
     * If true, dumps users to list view after creating an element
     *
     * @type {boolean}
     */
    form_created_to_list: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      default_form: {},
      setup: true,
      show_form: false,
      form_loading: false,
      error: false,
      created: false,
      overlay: false,
      show_delete_modal: false,
      delete_confirm: null,
      delete_protect: null,
      show_success_tick: false,
      show_failure_tick: false
    }
  },
  computed: {

    /**
     * If the form is for creating (or updating if false).
     *
     * @returns {boolean}
     */
    form_for_create() {
      return !this.form[this.storable_key];
    },

    /**
     * If the delete is confirmed.
     *
     * @returns {boolean}
     */
    delete_confirmed() {
      return this.delete_confirm === 'DELETE';
    },

    /**
     * If either tick mark should be shown on the form.
     *
     * @returns {boolean}
     */
    show_tick() {
      return this.show_success_tick || this.show_failure_tick;
    },

    /**
     * Classes to apply to the form feedback ticks.
     *
     * @returns {undefined}
     */
    tick_classes() {
      return {
        'feedback-tick': true,
        [this.form_feedback_success_tick_icon]: this.show_success_tick,
        [this.form_feedback_failure_tick_icon]: this.show_failure_tick
      }
    },

    /**
     * The form to send along with API calls.
     *
     * @returns {object}
     */
    api_form() {
      const form = JSON.parse(JSON.stringify(this.form));
      for (const key in form) {
        if (this.form_exclude_columns.indexOf(key) !== -1) {
          delete form[key];
          continue;
        }
        if (this.form_format_columns.hasOwnProperty(key) && typeof this.form_format_columns[key] === 'function') {
          form[key] = this.form_format_columns[key](form[key]);
        }
      }
      return form;
    }

  },
  watch: {

    /**
     * Calling watcher for the overlay.
     */
    calling: function(value) {
      if (value) {
        setTimeout(() => {
          if (this.calling) {
            this.overlay = true;
          }
        }, 100);
      } else {
        this.overlay = false;
      }
    }

  },
  methods: {

    /**
     * Reset the form to NULL values.
     *
     * @returns {undefined}
     */
    resetForm() {
      this.$emit('update:form', this.default_form);
    },

    /**
     * Secure the form, clearing "secured" form fields such as passwords.
     *
     * @returns {undefined}
     */
    secureForm() {
      const form = JSON.parse(JSON.stringify(this.form));
      for (const field of this.form_secure_fields) {
        if (form.hasOwnProperty(field)) {
          form[field] = null;
        }
      }
      this.$emit('update:form', form);
    },

    /**
     * Reset the feedback to NULL values.
     *
     * @returns {undefined}
     */
    resetFeedback() {
      const feedback = JSON.parse(JSON.stringify(this.feedback));
      for (const key in feedback) {
        feedback[key] = null;
      }
      this.show_success_tick = false;
      this.show_failure_tick = false;
      this.$emit('update:feedback', feedback);
    },

    /**
     * Raw storable read.
     *
     * Does not check for duplicate calls, but updates previous calling states.
     *
     * @param {string|number} value - The value of the storable to read with.
     * @returns {undefined}
     */
    readStorable(value) {
      this.$emit('form-pre-read', true);
      const data = Object.assign({
        [this.storable_key]: value
      }, this.form_read_api_data)
      DynamicSuite.call(this.form_read_api, data, response => {
        switch (response.status) {
          case 'OK':
            if (typeof response.data !== 'object') {
              this.error = true;
              break;
            }
            const form = JSON.parse(JSON.stringify(this.form));
            for (const key in response.data) {
              if (form.hasOwnProperty(key)) {
                form[key] = response.data[key];
              }
            }
            this.show_form = true;
            this.form_loading = false;
            this.setup = false;
            this.$emit('update:form', form);
            this.$emit('update:calling', false);
            break;
          case 'NOT_FOUND':
            DynamicSuite.replaceURLHistory(this.get_key_id, null);
            location.reload();
            break;
          default:
            this.error = true;
        }
      });
    },

    /**
     * Handle fatal errors.
     *
     * @returns {undefined}
     */
    handleError() {
      DynamicSuite.replaceURLHistory(this.get_key_id, null);
      this.error = true;
    },

    /**
     * Handle setting up the form for creation.
     *
     * @returns {undefined}
     */
    handleFormCreate() {
      DynamicSuite.pushURLHistory(this.get_key_id, 0);
      this.runCreateSetup();
    },

    /**
     * Handle interactions with the CRUD list.
     *
     * @param {number} value - The interactive value.
     * @returns {undefined}
     */
    handleListInteraction(value) {
      if (!this.setup) {
        DynamicSuite.pushURLHistory(this.get_key_id, value);
      }
      this.handleFormUpdate(value);
    },

    /**
     * Handle setting up the form for updating.
     *
     * @param {number} value - The interactive value.
     * @returns {undefined}
     */
    handleFormUpdate(value) {
      this.form_loading = true;
      this.resetForm();
      this.resetFeedback();
      this.$emit('update:calling', true);
      this.readStorable(value);
    },

    /**
     * Run the back action to hide the form and show the list.
     *
     * @returns {undefined}
     */
    runBack() {
      this.resetForm();
      this.resetFeedback();
      DynamicSuite.replaceURLHistory(this.get_key_id, null);
      this.show_form = false;
    },

    /**
     * Run the create form setup.
     *
     * @returns {undefined}
     */
    runCreateSetup() {
      if (this.calling) {
        return;
      }
      this.form_loading = true;
      this.resetForm();
      this.resetFeedback();
      if (this.form_create_setup_api) {
        this.$emit('update:calling', true);
        DynamicSuite.call(this.form_create_setup_api, this.form_create_setup_api_data, response => {
          switch (response.status) {
            case 'OK':
              this.$emit('update:form', JSON.parse(JSON.stringify(Object.assign(this.form, response.data))));
              this.show_form = true;
              this.form_loading = false;
              this.setup = false;
              this.$emit('update:calling', false);
              break;
            default:
              this.error = true;
          }
        });
      } else {
        this.show_form = true;
        this.form_loading = false;
        this.setup = false;
      }
    },

    /**
     * Run the create of the active storable.
     *
     * @returns {undefined}
     */
    runCreate() {
      if (this.calling) {
        return;
      }
      this.resetFeedback();
      this.$emit('update:calling', true);
      const data = Object.assign({}, this.api_form, this.form_create_api_data)
      DynamicSuite.call(this.form_create_api, data, response => {
        switch (response.status) {
          case 'OK':
            this.created = true;
            this[this.storable_key] = response.data;
            setTimeout(() => {
              this.created = false;
              if (this.form_created_to_list) {
                this.setup = false;
                this.show_form = false;
              }
            }, 1000)
            this.form_loading = true;
            this.readStorable(response.data);
            this.secureForm();
            DynamicSuite.pushURLHistory(this.get_key_id, null);
            this.$emit('update:calling', false);
            break;
          case 'INPUT_ERROR':
            const feedback = JSON.parse(JSON.stringify(this.feedback));
            for (const key in feedback) {
              if (typeof response.data === 'object' && response.data.hasOwnProperty(key)) {
                feedback[key] = response.data[key];
              }
            }
            this.$emit('update:feedback', feedback);
            this.$emit('update:calling', false);
            break;
          default:
            this.error = true;
        }
      });
    },

    /**
     * Run the update of the active storable.
     *
     * @returns {undefined}
     */
    runUpdate() {
      if (this.calling) {
        return;
      }
      this.resetFeedback();
      this.$emit('update:calling', true);
      const data = Object.assign({}, this.api_form, this.form_update_api_data)
      DynamicSuite.call(this.form_update_api, data, response => {
        switch (response.status) {
          case 'OK':
            this.secureForm();
            this.show_success_tick = true;
            this.$emit('update:calling', false);
            break;
          case 'INPUT_ERROR':
            const feedback = JSON.parse(JSON.stringify(this.feedback));
            for (const key in feedback) {
              if (typeof response.data === 'object' && response.data.hasOwnProperty(key)) {
                feedback[key] = response.data[key];
              }
            }
            this.show_failure_tick = true;
            this.$emit('update:feedback', feedback);
            this.$emit('update:calling', false);
            break;
          default:
            this.error = true;
        }
      });
    },

    /**
     * Prompt the delete of the active storable.
     *
     * @returns {undefined}
     */
    promptDelete() {
      this.delete_confirm = null;
      this.delete_protect = null;
      this.show_delete_modal = true;
    },

    /**
     * Cancel the delete, closing and clearing the confirmation modal.
     *
     * @returns {undefined}
     */
    runCancelDelete() {
      this.show_delete_modal = false;
    },

    /**
     * Run the delete of the active storable.
     *
     * @returns {undefined}
     */
    runDelete() {
      if (this.calling) {
        return;
      }
      this.delete_confirm = null;
      this.delete_protect = null;
      this.$emit('update:calling', true);
      const data = Object.assign({
        [this.storable_key]: this.form[this.storable_key]
      }, this.form_delete_api_data)
      DynamicSuite.call(this.form_delete_api, data, response => {
        switch (response.status) {
          case 'OK':
            this.show_delete_modal = false;
            this.show_form = false;
            this.resetForm();
            this.resetFeedback();
            DynamicSuite.replaceURLHistory(this.get_key_id, null);
            window.history.back();
            this.$emit('update:calling', false);
            break;
          case 'DELETE_PROTECT':
            this.delete_protect = response.data;
            this.$emit('update:calling', false);
            break;
          default:
            this.show_delete_modal = false;
            this.error = true;
        }
      });
    },

    /**
     * Set any saved URL data.
     *
     * @returns {undefined}
     */
    setURLSavedData() {

      // URL parameters
      const url = new URLSearchParams(window.location.search);

      // Parse CRUD value
      const crud = parseInt(url.get(this.get_key_id));

      // Route CRUD
      if (!Number.isNaN(crud)) {
        this.$emit('update:calling', false);
        this.form_loading = true;
        this.show_form = true;
        if (crud === 0) {
          this.runCreateSetup();
        } else {
          this.handleFormUpdate(crud);
        }
      } else {
        this.show_form = false;
        this.setup = false;
      }

    }

  },
  mounted() {

    // Set the default form for resets
    this.default_form = JSON.parse(JSON.stringify(this.form));

    // Set saved data
    this.setURLSavedData();

    // Refresh on back
    window.addEventListener('popstate', () => {
      this.setURLSavedData();
      if (this.error) {
        location.reload();
      }
    });

  }
}
</script>

<style lang="sass">

@import "../sass/aui"

/* CRUD container */
.aui.crud

  /* CRUD form */
  .form

    /* Form elements */
    & > *:not(:last-child)
      margin-bottom: 1rem

    /* Form actions */
    & > .actions
      display: flex

      /* Button justification */
      & > .btn-group, & > .btn.primary
        margin-left: auto

        /* Default feedback ticks */
        .feedback-tick
          align-self: center
          margin-right: 1rem

          &.fa-check
            color: $color-success

          &.fa-times
            color: $color-failure

  /* Delete confirmation input */
  .delete-confirm-input
    margin-top: 1rem

    /* Space from alerts when present */
    &:not(:last-of-type)
      margin-bottom: 1rem

</style>