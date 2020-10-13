<!--
Aui Package
Copyright (C) 2020 Dynamic Suite Team

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation version 3.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software Foundation,
Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
-->

<template>
    <div class="aui crud">

        <!-- Fatal error notice -->
        <aui-notice
            v-if="show_error"
            type="failure"
            icon="fas fa-exclamation-triangle"
            text="A server error has occurred"
            subtext="Please reload the page"
        />

        <!-- Created confirmation notice -->
        <aui-notice
            v-if="show_created_confirmation"
            type="success"
            icon="fas fa-check-circle"
            :text="form_created_confirmation_text"
        />

        <!-- List view (default)  -->
        <div v-if="show_list" class="list">

            <!-- List header area -->
            <div class="header">

                <!-- List title area -->
                <div class="title">
                    <h2><slot name="list-title">CRUD List</slot></h2>
                </div>

                <!-- List action area -->
                <div class="action">
                    <slot name="list-buttons"></slot>
                    <aui-button
                        v-if="list_show_create_button"
                        :disabled="state.overlay"
                        @click="setupCreate"
                    >
                        <i class="fas fa-plus"></i>
                    </aui-button>
                    <aui-input
                        v-if="list_show_search"
                        placeholder="Search"
                        :disabled="state.overlay"
                        v-model="list.search"
                        @input="runSearch"
                    />
                </div>

            </div>

            <!-- The actual data display area for the list -->
            <div class="data">

                <!-- No data in list -->
                <aui-notice
                    v-if="!has_list_data && !state.calling"
                    :icon="list_empty_icon"
                    :text="list_empty_text"
                    :subtext="list_empty_subtext"
                />

                <!-- The overlay to display when the list is loading -->
                <div v-if="state.overlay" :class="list_overlay_classes">
                    <aui-notice
                        :icon="list_overlay_icon"
                        :text="list_overlay_text"
                        :subtext="list_overlay_subtext"
                    />
                </div>

                <!-- Group mode -->
                <aui-list-group v-if="list_is_group" :rows="list_group_data" />

                <!-- Table mode -->
                <table v-if="list_is_table" :class="list_table_classes">
                    <thead>
                        <tr>
                            <th
                                v-for="(column, key) in list_table_columns"
                                :key="key + '-header'"
                                @click="sortList(key)"
                            >
                                {{column}}
                                <i v-if="isSortedAsc(key)" class="fas fa-sort-amount-down-alt"></i>
                                <i v-else-if="isSortedDesc(key)" class="fas fa-sort-amount-down"></i>
                                <i v-else class="fas fa-sort"></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, key) in list_table_data" :key="key + '-row'" @click="emitListClick(row.id)">
                            <td v-for="(column, col_key) in row.data" :key="col_key + '-column'">{{column}}</td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <!-- Pagination range and buttons -->
            <div v-if="has_list_data" class="pagination">

                <!-- Display range text -->
                <div class="range">
                    <span>Showing</span>
                    <label>
                        <select v-model="list.limit" :disabled="state.overlay" @change="readList">
                            <option
                                v-for="limit in list_range_limit"
                                :key="limit + '-page-limit'"
                                :value="limit"
                            >{{limit}}</option>
                        </select>
                    </label>
                    <span>
                        from
                        {{list.from.toLocaleString()}} to
                        {{list.to.toLocaleString()}} of
                        {{list.total.toLocaleString()}}
                    </span>
                </div>

                <!-- Pagination buttons  -->
                <div class="buttons">

                    <!-- Left Chevrons -->
                    <aui-button
                        type="secondary"
                        class="chevron"
                        :disabled="state.overlay"
                        @click="stepPageFirst"
                    >
                        &laquo;
                    </aui-button>
                    <aui-button
                        type="secondary"
                        class="chevron"
                        :disabled="state.overlay"
                        @click="stepPagePrevious"
                    >
                        &lsaquo;
                    </aui-button>

                    <!-- Page buttons -->
                    <aui-button
                        v-for="(page, key) in list.range"
                        :key="key + '-pagination'"
                        :type="paginateButtonType(page)"
                        :text="page"
                        :disabled="state.overlay"
                        class="page-button"
                        @click="paginate(page)"
                    />

                    <!-- Right Chevrons -->
                    <aui-button
                        type="secondary"
                        class="chevron"
                        :disabled="state.overlay"
                        @click="stepPageNext"
                    >
                        &rsaquo;
                    </aui-button>
                    <aui-button
                        type="secondary"
                        class="chevron"
                        :disabled="state.overlay"
                        @click="stepPageLast"
                    >
                        &raquo;
                    </aui-button>

                </div>

            </div>

        </div>

        <!-- Form view -->
        <div v-if="show_form" class="form">

            <!-- Form tabs if multiple views -->
            <aui-tabs v-if="view_show_tabs" :tabs="view_tabs" :initial_tab="tab_id" @change="changeTab" />

            <!-- Build form slots -->
            <div class="body" v-for="(view, key) in form_views" :key="'view-' + key">
                <slot
                    v-if="isActiveTab(view.name)"
                    :name="view.name"
                    :tab="tab"
                    :form="form"
                    :error="error.form"
                    :calling="state.calling"
                    :overlay="state.overlay"
                    :showForm="showForm"
                    :runCreate="runCreate"
                    :runUpdate="runUpdate"
                    :runDelete="runDelete"
                    :closeModals="closeModals"
                ></slot>
            </div>

            <!-- Form bottom action bar -->
            <div v-if="view_show_action_bar" class="action">

                <!-- Back button -->
                <aui-button
                    type="secondary"
                    :disabled="state.overlay"
                    text="Back"
                    @click="showForm(false, true)"
                />

                <!-- Primary action area -->
                <div class="primary">
                    <i v-if="state.show_failure_tick" class="tic fas fa-times"></i>
                    <i v-if="state.show_success_tick" class="tic fas fa-check"></i>
                    <aui-button
                        v-if="!created"
                        :loading="state.overlay"
                        loading_text="Creating..."
                        text="Create"
                        @click="runCreate"
                    />
                    <div v-else class="btn-group">
                        <aui-button
                            :loading="form_update_is_running"
                            loading_text="Updating..."
                            text="Update"
                            @click="runUpdate"
                        />
                        <aui-button-drop
                            :dropdown="form_delete_dropdown"
                            :disabled="state.overlay"
                        />
                    </div>
                </div>

            </div>

            <!-- Delete confirm modal -->
            <aui-modal
                type="failure"
                title="Confirm Delete"
                :show="state.show_delete_modal"
                @close="closeModals"
            >
                <slot
                    name="confirm-delete"
                    :tab="tab"
                    :form="form"
                    :error="error.form"
                    :calling="state.calling"
                    :overlay="state.overlay"
                    :showForm="showForm"
                    :runCreate="runCreate"
                    :runUpdate="runUpdate"
                    :runDelete="runDelete"
                    :closeModals="closeModals"
                >
                    <p>{{form_delete_text}}</p>
                    <div class="action">
                        <aui-button
                            type="secondary"
                            :disabled="state.overlay"
                            text="Cancel"
                            @click="closeModals"
                        />
                        <div class="primary">
                            <aui-button
                                type="failure"
                                :loading="state.overlay"
                                loading_text="Deleting..."
                                text="Confirm Delete"
                                @click="runDelete(true)"
                            />
                        </div>
                    </div>
                </slot>
            </aui-modal>

        </div>

    </div>
</template>

<script>
export default {
    props: {

        /**
         * The package that the CRUD component is used for.
         *
         * This is using when calling any of the APIs associated with the component.
         */
        package: {
            type: String,
            required: true
        },

        /**
         * The type of the list (group or table supported currently).
         */
        list_type: {
            type: String,
            default: 'group',
            validator: value => {
                return ['group', 'table'].indexOf(value) !== -1;
            }
        },

        /**
         * If the related data presented in the list is editable.
         *
         * If the list is editable, clicking on rows will change the view to the edit view.
         */
        list_can_go_to_form: {
            type: Boolean,
            default: true
        },

        /**
         * If the list is interactive.
         *
         * If TRUE, hover and cursor effects will be added to the table.
         */
        list_interactive: {
            type: Boolean,
            default: true
        },

        /**
         * Columns to display when using table mode.
         */
        list_table_columns: {
            type: Object,
            default: () => {
                return { id: 'ID' };
            },
            validator: value => {
                for (const key in value) {
                    if (typeof value[key] !== 'string') {
                        return false;
                    }
                }
                return true;
            }
        },

        /**
         * The FontAwesome icon class to display with the notice when no data is in the list in the list view.
         */
        list_empty_icon: {
            type: String,
            default: 'fas fa-ban'
        },

        /**
         * The text to display with the notice when no data is in the list in the list view.
         */
        list_empty_text: {
            type: String | null,
            default: 'No data found'
        },

        /**
         * The subtext to display with the notice when no data is in the list in the list view.
         */
        list_empty_subtext: {
            type: String | null,
            default: null
        },

        /**
         * The FontAwesome icon class to display with the notice when the loading overlay is present in the list view.
         */
        list_overlay_icon: {
            type: String,
            default: 'fas fa-circle-notch fa-spin'
        },

        /**
         * The text to display with the notice when the loading overlay is present in the list view.
         */
        list_overlay_text: {
            type: String | null,
            default: null
        },

        /**
         * The subtext to display with the notice when the loading overlay is present in the list view.
         */
        list_overlay_subtext: {
            type: String | null,
            default: null
        },

        /**
         * If the create button should be shown in the list view.
         */
        list_show_create_button: {
            type: Boolean,
            default: true
        },

        /**
         * If the search should be shown in the list view
         */
        list_show_search: {
            type: Boolean,
            default: true
        },

        /**
         * Number of records to limit the list to.
         *
         * Defaults to the first value.
         */
        list_range_limit: {
            type: Array,
            default: () => [15, 25, 50, 100]
        },

        /**
         * The API called to read the list.
         *
         * The API must return data in the standard CRUD format.
         */
        list_api_read: {
            type: String,
            required: true
        },

        /**
         * Optional data to send to the read list API when called.
         */
        list_api_read_optional_data: {
            type: Object,
            default: () => {}
        },

        /**
         * The API called to read the form for the interacted row ID.
         */
        form_api_read: {
            type: String,
            required: true
        },

        /**
         * Optional data to send to the read form API when called.
         */
        form_api_read_optional_data: {
            type: Object,
            default: () => {}
        },

        /**
         * The API called to create the form for the interacted row ID.
         */
        form_api_create: {
            type: String,
            required: true
        },

        /**
         * Optional data to send to the create form API when called.
         */
        form_api_create_optional_data: {
            type: Object,
            default: () => {}
        },

        /**
         * The API called to update the form for the interacted row ID.
         */
        form_api_update: {
            type: String,
            required: true
        },

        /**
         * Optional data to send to the update form API when called.
         */
        form_api_update_optional_data: {
            type: Object,
            default: () => {}
        },

        /**
         * The API called to delete the form for the interacted row ID.
         */
        form_api_delete: {
            type: String,
            required: true
        },

        /**
         * Optional data to send to the delete form API when called.
         */
        form_api_delete_optional_data: {
            type: Object,
            default: () => {}
        },

        /**
         * Confirmation text when a new storable is created.
         */
        form_created_confirmation_text: {
            type: String,
            default: 'Created'
        },

        /**
         * Storable key for mapping the create return ID to the form ID.
         */
        form_storable_key: {
            type: String,
            default: 'id'
        },

        /**
         * Text to display when deleting a storable (shows in the modal).
         *
         * This is ignored when a slot override is present for the modal.
         */
        form_delete_text: {
            type: String,
            default: 'Are you sure you want to delete?'
        },

        /**
         * Fields to preload the form and form errors with.
         */
        fields: {
            type: Array,
            default: () => [],
            validator: value => {
                for (const field of value) {
                    if (typeof field !== 'string') {
                        return false;
                    }
                }
                return true;
            }
        },

        /**
         * Views for the form view.
         */
        views: {
            type: Array,
            default: () => [],
            validator: value => {
                for (const view of value) {
                    if (typeof view !== 'string' && typeof view !== 'object') {
                        return false;
                    }
                    if (typeof view === 'object') {
                        for (const key in view) {
                            if (key === 'name' && typeof view[key] !== 'string') {
                                return false;
                            }
                            if (key === 'tab_name' && typeof view[key] !== 'string') {
                                return false;
                            }
                            if (key === 'show_action_bar' && typeof view[key] !== 'boolean') {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
        }

    },
    data() {
        return {
            list: {
                data: [],
                limit: 0,
                from: 0,
                to: 0,
                total: 0,
                pages: 0,
                page: 1,
                search_timer: null,
                search: null,
                range: [],
                sort: {},
                sort_order: []
            },
            created: false,
            tab: null,
            tab_id: null,
            form: {},
            form_delete_dropdown: [{
                label: 'Delete',
                action: () => {
                    this.runDelete();
                }
            }],
            state: {
                calling: false,
                overlay: false,
                show_form: false,
                show_delete_modal: false,
                show_failure_tick: false,
                show_success_tick: false,
                show_created_confirmation: false
            },
            error: {
                server: false,
                form: {}
            }
        }
    },
    computed: {

        /**
         * If the error notice should be shown (fatal error).
         */
        show_error() {
            return this.error.server;
        },

        /**
         * If the list should be shown.
         */
        show_list() {
            return !this.error.server && !this.state.show_form && !this.state.show_created_confirmation;
        },

        /**
         * If the form should be shown.
         */
        show_form() {
            return !this.error.server && this.state.show_form && !this.state.show_created_confirmation;
        },

        /**
         * If the created confirmation notice should be shown.
         */
        show_created_confirmation() {
            return !this.error.server && this.state.show_created_confirmation;
        },

        /**
         * If there is data in the list.
         */
        has_list_data() {
            return this.list.data.length > 0;
        },

        /**
         * If the list is in group mode.
         */
        list_is_group() {
            return this.has_list_data && this.list_type === 'group';
        },

        /**
         * If the list is in table mode.
         */
        list_is_table() {
            return this.has_list_data && this.list_type === 'table';
        },

        /**
         * List data if using "group" mode.
         */
        list_group_data() {
            const list = [];
            if (this.list_type !== 'group') {
                return list;
            }
            for (const entry of this.list.data) {
                list.push({
                    icon: entry.icon ? entry.icon : '',
                    title: entry.title,
                    subtext: entry.subtext,
                    action: () => this.emitListClick(entry.id)
                });
            }
            return list;
        },

        /**
         * List data if using "table" mode.
         */
        list_table_data() {
            const list = [];
            if (this.list_type !== 'table') {
                return list;
            }
            for (const entry of this.list.data) {
                const row = {
                    id: entry.id,
                    data: {}
                };
                for (const column in this.list_table_columns) {
                    if (typeof entry[column] !== 'undefined') {
                        row.data[column] = entry[column];
                    }
                }
                list.push(row);
            }
            return list;
        },

        /**
         * Classes for the loader/overlay when in the list view.
         */
        list_overlay_classes() {
            return {
                overlay: true,
                empty: this.list.data.length <= 0
            };
        },

        /**
         * Classes for the table.
         */
        list_table_classes() {
            return {
                interactive: this.list_interactive || this.list_can_go_to_form
            };
        },

        /**
         * Wrapper for the given views to make sure they all have the proper keys.
         */
        form_views() {
            const views = [];
            for (const key in this.views) {
                let entry = {
                    name: null,
                    tab_name: null,
                    show_action_bar: true
                };
                if (typeof this.views[key] === 'string') {
                    entry.name = this.views[key];
                    entry.tab_name = this.views[key];
                } else {
                    for (const prop in this.views[key]) {
                        entry[prop] = this.views[key][prop];
                    }
                }
                views.push(entry);
            }
            return views;
        },

        /**
         * If the update call is running into an overlay state and not the delete running.
         */
        form_update_is_running() {
            return this.state.overlay && !this.state.show_delete_modal;
        },

        /**
         * If the tabs should be shown.
         *
         * @return boolean
         */
        view_show_tabs() {
            return this.form_views.length > 1 && this.created;
        },

        /**
         * Get the AUI tab options object for when tabs are present.
         *
         * @return Object
         */
        view_tabs() {
            const tabs = {};
            for (const view in this.form_views) {
                tabs[view] = this.form_views[view].tab_name;
            }
            return tabs;
        },

        /**
         * If the action bar should be shown.
         *
         * @return boolean
         */
        view_show_action_bar() {
            return this.form_views[this.tab_id].show_action_bar;
        }

    },
    watch: {

        /**
         * Calling watcher for the overlay.
         */
        'state.calling': {
            handler: function (new_value) {
                if (new_value) {
                    setTimeout(() => {
                        if (this.state.calling) {
                            this.state.overlay = true;
                        }
                    }, 100);
                } else {
                    this.state.overlay = false;
                }
            }
        }

    },
    methods: {

        /**
         * Read the list using the given list read API.
         *
         * @return void
         */
        readList() {
            if (this.state.calling) {
                return;
            }
            const data = Object.assign({
                type: this.list_type,
                page: this.list.page,
                limit: this.list.limit,
                search: this.list.search,
                sort: this.list.sort,
                sort_order: this.list.sort_order
            }, this.list_api_read_optional_data);
            this.state.calling = true;
            DynamicSuite.call(this.package, this.list_api_read, data, response => {
                switch (response.status) {
                    case 'OK':
                        this.list.data = response.data.list;
                        this.list.total = response.data.total;
                        this.list.pages = Math.ceil(this.list.total / this.list.limit);
                        let offset = (this.list.page - 1) * this.list.limit;
                        if (offset > this.list.total) {
                            offset = this.list.total - this.list.limit
                            this.list.page = this.list.pages;
                        }
                        this.list.from = offset + 1;
                        this.list.to = this.list.from + this.list.limit - 1;
                        if (this.list.to > this.list.total) {
                            this.list.to = this.list.total;
                        }
                        this.updatePaginationRange();
                        this.state.calling = false;
                        this.$emit('read-list');
                        break;
                    default:
                        this.error.server = true;
                }
            });
        },

        /**
         * Run the search for the list.
         *
         * @return void
         */
        runSearch() {
            clearTimeout(this.list.search_timer);
            this.list.search_timer = setTimeout(() => {
                this.paginate(1, true);
                this.$emit('search', this.list.search);
            }, 300);
        },

        /**
         * Sort the list by the clicked on header.
         *
         * The column will first be sorted ascending, on second click, descending, and on third click, removed.
         *
         * @param column
         * @return void
         */
        sortList(column) {
            if (typeof this.list.sort[column] === 'undefined') {
                this.list.sort_order.push(column);
                this.$set(this.list.sort, column, 'ASC');
                this.$emit('sort-asc', column);
            } else if (this.list.sort[column] === 'ASC') {
                this.$set(this.list.sort, column, 'DESC');
                this.$emit('sort-desc', column);
            } else {
                this.list.sort_order.splice(this.list.sort_order.indexOf(column), 1);
                this.$delete(this.list.sort, column);
                this.$emit('sort-clear', column);
            }
            this.paginate(1);
        },

        /**
         * If the given column is in the sorted columns list as ascending.
         *
         * @param column
         * @return boolean
         */
        isSortedAsc(column) {
            return typeof this.list.sort[column] !== 'undefined' && this.list.sort[column] === 'ASC';
        },

        /**
         * If the given column is in the sorted columns list as descending.
         *
         * @param column
         * @return boolean
         */
        isSortedDesc(column) {
            return typeof this.list.sort[column] !== 'undefined' && this.list.sort[column] === 'DESC';
        },

        /**
         * Emit a list click event and associated row ID.
         *
         * @param id
         * @return void
         */
        emitListClick(id) {
            this.$emit('list-click', id);
        },

        /**
         * Update the pagination range (page numbers) for rendering pagination buttons.
         *
         * @return void
         */
        updatePaginationRange() {
            const range = [];
            if (this.list.pages < 5) {
                for (let i = 1; i <= this.list.pages; i++) {
                    range.push(i);
                }
            } else if (this.list.page < 3) {
                for (let i = 1; i <= 5; i++) {
                    range.push(i);
                }
            } else {
                const at_end = this.list.page + 2 > this.list.pages
                const offset = !at_end ? this.list.page + 2 : this.list.pages;
                for (let i = at_end ? this.list.pages - 4 : this.list.page - 2; i <= offset; i++) {
                    range.push(i);
                }
            }
            this.list.range = range;
        },

        /**
         * Get the button type for the given pagination button page.
         *
         * The button for the current page should be primary, all others should be secondary.
         *
         * @param page
         * @return string
         */
        paginateButtonType(page) {
            return this.list.page === parseInt(page) ? 'primary' : 'secondary';
        },

        /**
         * Pagination: Paginate the list to a specific page and re-read the list.
         *
         * @param from_search
         * @param page
         * @return void
         */
        paginate(page, from_search = false) {
            if (parseInt(page) === this.list.page && !from_search) {
                return;
            }
            this.list.page = parseInt(page);
            this.readList();
            this.$emit('paginate', page);
        },

        /**
         * Pagination: Step to the first page and re-read.
         *
         * @return void
         */
        stepPageFirst() {
            if (this.list.page === 1) {
                return;
            }
            this.paginate(1);
            this.$emit('paginate-first');
        },

        /**
         * Pagination: Step to the previous page and re-read.
         *
         * @return void
         */
        stepPagePrevious() {
            if (this.list.page === 1) {
                return;
            }
            const previous = this.list.page - 1;
            if (previous > 0) {
                this.paginate(previous);
                this.$emit('paginate-previous');
            }
        },

        /**
         * Pagination: Step to the next page and re-read.
         *
         * @return void
         */
        stepPageNext() {
            if (this.list.page === this.list.pages) {
                return;
            }
            const next = this.list.page + 1;
            if (next <= this.list.pages) {
                this.paginate(next);
                this.$emit('paginate-next');
            }
        },

        /**
         * Pagination: step to the last page and re-read.
         *
         * @return void
         */
        stepPageLast() {
            if (this.list.page === this.list.pages) {
                return;
            }
            this.paginate(this.list.pages);
            this.$emit('paginate-last');
        },

        /**
         * Load the fields into the component if using the form can be shown.
         *
         * @return void
         */
        loadFields() {
            this.form = {};
            this.error.form = {};
            for (const field of this.fields) {
                this.$set(this.form, field, null);
                this.$set(this.error.form, field, null);
            }
        },

        /**
         * If the form(s) should be shown.
         *
         * If show is true, the form will be shown and the list will be hidden.
         *
         * @param show
         * @param update_state
         * @return void
         */
        showForm(show, update_state = false) {
            if (!show) {
                this.loadFields();
                this.tab = this.form_views[0].name;
                this.tab_id = 0;
                this.readList();
                this.$emit('show-list');
            } else {
                this.$emit('show-form');
            }
            this.state.show_form = show;
            if (update_state) {
                this.setURIState();
            }
        },

        /**
         * Setup the form for create.
         *
         * @return void
         */
        setupCreate() {
            this.created = false;
            this.loadFields();
            this.resetFormFeedback();
            this.showForm(true, true);
            this.$emit('setup-create');
        },

        /**
         * Check if the given tab is the active tab when using form views.
         *
         * This also initializes the default tab on first run.
         *
         * @param tab
         * @return boolean
         */
        isActiveTab(tab) {
            if (this.tab === null) {
                this.tab = this.form_views[0].name;
                this.tab_id = 0;
            }
            return tab === this.tab;
        },

        /**
         * Change the tab to the given tab.
         *
         * @param tab
         * @return void
         */
        changeTab(tab) {
            this.tab = this.form_views[tab].name;
            this.tab_id = tab;
            this.setURIState();
            this.$emit('tab-changed', {tab: this.form_views[tab].name, tab_id: tab});
        },

        /**
         * Read the storable for the given ID.
         *
         * Note: This will also set the view to the first view in viewing the form.
         *
         * @param id
         * @param set_state
         * @return void
         */
        readStorable(id, set_state = true) {
            if (this.state.calling) {
                return;
            }
            this.loadFields();
            const data = Object.assign({id: id}, this.form_api_read_optional_data);
            this.state.calling = true;
            DynamicSuite.call(this.package, this.form_api_read, data, response => {
                switch (response.status) {
                    case 'OK':
                        for (const key in response.data) {
                            this.$set(this.form, key, response.data[key]);
                        }
                        this.resetFormFeedback();
                        this.showForm(true, false);
                        this.created = true;
                        this.state.calling = false;
                        if (set_state) {
                            this.setURIState();
                        }
                        this.$emit('read-form', id);
                        break;
                    default:
                        this.clearURIState();
                        this.error.server = true;
                }
            });
        },

        /**
         * Reset any feedback on the form
         *
         * @return void
         */
        resetFormFeedback() {
            this.state.show_failure_tick = false;
            this.state.show_success_tick = false;
            for (const field in this.error.form) {
                this.error.form[field] = null;
            }
        },

        /**
         * Create the storable for the given form data.
         *
         * @return void
         */
        runCreate() {
            if (this.state.calling) {
                return;
            }
            this.resetFormFeedback();
            const data = Object.assign({}, this.form, this.form_api_create_optional_data);
            this.state.calling = true;
            DynamicSuite.call(this.package, this.form_api_create, data, response => {
                switch (response.status) {
                    case 'OK':
                        this.state.show_created_confirmation = true;
                        this.form[this.form_storable_key] = parseInt(response.data);
                        this.created = true;
                        this.state.calling = false;
                        this.setURIState();
                        this.readList();
                        setTimeout(() => {
                            this.state.show_created_confirmation = false;
                        }, 1000);
                        this.$emit('create', response.data);
                        break;
                    case 'INPUT_ERROR':
                        this.state.show_failure_tick = true;
                        for (const key in response.data) {
                            this.error.form[key] = response.data[key];
                        }
                        this.state.calling = false;
                        break;
                    default:
                        this.error.server = true;
                }
            });
        },

        /**
         * Update the storable for the given form data.
         *
         * @return void
         */
        runUpdate() {
            if (this.state.calling) {
                return;
            }
            this.resetFormFeedback();
            const data = Object.assign({}, this.form, this.form_api_update_optional_data);
            this.state.calling = true;
            DynamicSuite.call(this.package, this.form_api_update, data, response => {
                switch (response.status) {
                    case 'OK':
                        this.state.show_success_tick = true;
                        this.state.calling = false;
                        this.$emit('update');
                        break;
                    case 'INPUT_ERROR':
                        this.state.show_failure_tick = true;
                        for (const key in response.data) {
                            this.error.form[key] = response.data[key];
                        }
                        this.state.calling = false;
                        break;
                    default:
                        this.error.server = true;
                }
            });
        },

        /**
         * Attempt to run the delete.
         *
         * If this is not confirmed, the modal will display to confirm deletion.
         *
         * @param confirm
         * @return void
         */
        runDelete(confirm = false) {
            if (!confirm) {
                this.resetFormFeedback();
                this.state.show_delete_modal = true;
                this.$emit('delete-confirm');
            } else {
                const data = Object.assign({}, this.form, this.form_api_delete_optional_data);
                this.state.calling = true;
                DynamicSuite.call(this.package, this.form_api_delete, data, response => {
                    switch (response.status) {
                        case 'OK':
                            this.state.calling = false;
                            this.closeModals();
                            this.showForm(false);
                            this.clearURIState();
                            this.$emit('delete');
                            break;
                        default:
                            this.error.server = true;
                    }
                });
            }
        },

        /**
         * Close any open CRUD modal.
         *
         * @return void
         */
        closeModals() {
            if (!this.state.calling) {
                this.state.show_delete_modal = false;
            }
            this.$emit('modals-closed');
        },

        /**
         * Set the URI state for saves across reloads and linking.
         *
         * @return void
         */
        setURIState() {
            const hashids = new Hashids.default(),
                state = [
                    this.state.show_form ? 1 : 0,
                    !this.tab_id ? 0 : this.tab_id,
                    !this.form[this.form_storable_key] ? 0 : this.form[this.form_storable_key]
                ],
                params = new URLSearchParams(window.location.search),
                key = `_${this._uid}`,
                value = hashids.encode(state);
            if (!this.state.show_form) {
                params.delete(`_${this._uid}`);
            } else {
                params.set(key, value);
            }
            const url = params.toString().length ? `?${params.toString()}` : window.location.href.split('?')[0];
            history.pushState(value, '', url);
        },


        /**
         * Clear the saved URI state.
         *
         * @return void
         */
        clearURIState() {
            const params = new URLSearchParams(window.location.search);
            params.delete(`_${this._uid}`);
            const url = params.toString().length ? `?${params.toString()}` : window.location.href.split('?')[0];
            history.replaceState(null, '', url);
        }

    },
    mounted() {

        /**
         * Update range limit.
         */
        this.list.limit = this.list_range_limit[0];

        /**
         * Handle list interactions.
         */
        this.$on('list-click', id => {
            if (this.list_can_go_to_form) {
                this.readStorable(id);
            }
        });

        /**
         * Page state management.
         */
        const params = new URLSearchParams(window.location.search);
        if (params.has(`_${this._uid}`)) {
            const hashids = new Hashids.default();
            const state = hashids.decode(params.get(`_${this._uid}`));
            if (state.length === 3) {
                this.showForm(!!state[0]);
                this.tab_id = state[1];
                if (state[2]) {
                    this.tab = this.form_views[state[1]].name;
                    this.tab_id = state[1];
                    this.readStorable(state[2], false);
                    this.created = true;
                }
            } else {
                this.clearURIState();
                this.readList();
            }
        } else {
            this.readList();
        }
        window.onpopstate = event => {
            if (event.state) {
                const hashids = new Hashids.default();
                const state = hashids.decode(event.state);
                this.showForm(!!state[0]);
                this.tab = this.form_views[state[1]].name;
                this.tab_id = state[1];
            } else {
                this.showForm(false);
                this.clearURIState();
            }
        };

    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Media query mixin for mobile view breakpoint */
@mixin on-mobile-view
    @media (max-width: 500px)
        @content

/* Media query mixin for ipad view breakpoint */
@mixin on-ipad-view
    @media (max-width: 768px)
        @content

/* CRUD container */
.aui.crud

    /* List view */
    .list

        /* List header */
        .header
            display: flex
            align-items: center
            padding-bottom: 0.5rem
            border-bottom: 1px solid lighten($secondary, 40%)
            margin-bottom: 0.5rem

            @include on-mobile-view
                flex-direction: column

            /* List title */
            .title
                display: flex
                align-items: center

                @include on-mobile-view
                    margin-bottom: 0.75rem

                /* Margin reset */
                h2
                    color: #111
                    margin: 0

            /* List actions */
            .action
                display: flex
                align-items: center
                margin-left: auto

                @include on-mobile-view
                    width: 100%

                    /* Fill space with input */
                    .aui.input
                        flex-grow: 1

                /* Action buttons */
                .btn
                    display: flex
                    justify-content: center
                    align-items: center
                    font-size: 0.8rem
                    margin-right: 0.5rem
                    height: 2rem
                    width: 1.9rem

        /* Data container */
        .data
            position: relative
            min-height: 5rem

            /* The loading overlay */
            .overlay
                position: absolute
                width: 100%
                height: 100%
                display: flex
                justify-content: center
                align-items: center

                /* Non-empty backdrop */
                &:not(.empty)
                    background: rgba(0 ,0, 0, 0.3)
                    border-radius: 0.25rem

                /* Loading notice override */
                .aui.notice
                    display: flex
                    justify-content: center
                    align-items: center

                    /* Loading icon */
                    i
                        margin-bottom: 0

            /* Add margin to the notices */
            & > .notice
                margin: 2rem 0

            /* Margin reset */
            .aui.list-group
                margin-top: 0

            /* Table mode styling */
            table
                width: 100%
                border-collapse: collapse
                margin-bottom: 1rem

                /* Interactive tables */
                &.interactive
                    user-select: none

                    /* Interactive hover */
                    tbody tr:hover
                        cursor: pointer
                        background: darken(whitesmoke, 10%)

                /* Cell global styling */
                th, td
                    text-align: left
                    padding: 0.75rem
                    color: #111

                /* Header styling */
                th
                    user-select: none
                    border-bottom: 2px solid lighten($secondary, 40%)

                    /* Sort icon */
                    i
                        margin-left: 0.5rem

                    /* Header hovering */
                    &:hover
                        cursor: pointer
                        background: darken(whitesmoke, 5%)

                /* Table body */
                tbody

                    /* Add border to all but last cells */
                    tr:not(:last-of-type) td
                        border-bottom: 1px solid lighten($secondary, 40%)

                    /* Zebra striping */
                    tr:nth-child(odd)
                        background: #fff

        /* Pagination area bar */
        .pagination
            display: flex
            align-items: center

            /* Split range and buttons on mobile view */
            @include on-mobile-view
                flex-direction: column

            /* Range display */
            .range
                color: #111

                /* Lower font size for ipads and lower */
                @include on-ipad-view
                    font-size: 0.9rem

                /* Separate from buttons on mobile view */
                @include on-mobile-view
                    display: flex
                    flex-direction: column

                    /* Align rows */
                    & > *
                        text-align: center
                        margin-bottom: 0.5rem

                /* Select for limit */
                select
                    height: 2rem
                    padding: 0 0.25rem
                    margin: 0 0.35rem
                    border-radius: 0.25rem
                    border: 1px solid #ced4da
                    text-align-last: center

                    /* Remove chrome outline */
                    &:focus
                        outline: none

            /* Pagination buttons */
            .buttons
                display: flex
                margin-left: auto

                /* Mobile buttons */
                @include on-mobile-view
                    margin-left: 0

                    /* Buttons on mobile */
                    .page-button:not(.btn-primary)
                        display: none

                /* Pagination buttons */
                .btn
                    display: flex
                    justify-content: center
                    align-items: center
                    margin: 0
                    padding: 0.5rem
                    font-size: 0.8rem
                    height: 2rem
                    min-width: 1.9rem

                    /* Chevron buttons */
                    &.chevron
                        font-size: 1rem

                    /* Remove radius for inner buttons and add separating border */
                    &:not(:last-of-type)
                        border-top-right-radius: 0
                        border-bottom-right-radius: 0
                        border-right: 1px solid rgba(0, 0, 0, 0.15)

                    /* Remove radius for inner buttons */
                    &:not(:first-of-type)
                        border-top-left-radius: 0
                        border-bottom-left-radius: 0

    /* Form view */
    .form

        /* Action bar on the bottom, if visible */
        .action
            display: flex

            /* Primary action */
            .primary
                margin-left: auto

                /* Feedback tic styling */
                .tic
                    margin-right: 0.5rem

                    /* Failure */
                    &.fa-times
                        color: $failure

                    /* Success */
                    &.fa-check
                        color: $success

</style>