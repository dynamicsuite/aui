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
    <div class="aui crud aui-container primary">

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
                    <slot name="list-buttons" :readList="readList" />
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
                    v-if="!has_list_data && !calling"
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
                <aui-list-group v-if="list_is_group" :list="list_group_data" @click="emitListClick" />

                <!-- Table mode -->
                <table v-if="list_is_table" :class="list_table_classes">
                    <thead>
                        <tr>
                            <th
                                v-for="(column, key, index) in list_table_columns"
                                :key="'header-' + key"
                                :class="listTableColumnClasses(key)"
                                ref="table_headers"
                                @mousedown.self="sortList(key)"
                            >
                                {{listTableColumnName(column)}}
                                <i
                                    v-if="isSortedAsc(key)"
                                    class="fas fa-sort-amount-down-alt"
                                    @mousedown.self="sortList(key)"
                                />
                                <i
                                    v-else-if="isSortedDesc(key)"
                                    class="fas fa-sort-amount-down"
                                    @mousedown.self="sortList(key)"
                                />
                                <i
                                    v-else class="fas fa-sort"
                                    @mousedown.self="sortList(key)"
                                />
                                <div
                                    v-if="displayDraggable(index)"
                                    class="resize-element"
                                    @dblclick="doubleResetHeader(index)"
                                    @mousedown="dragToResize($event, index)"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, key) in list_table_data" :key="'row-' + key" @click="emitListClick(row.id)">
                            <td
                                v-for="(value, column) in row.data"
                                :key="'column-' + column"
                                :class="listTableColumnClasses(column)"
                                v-html="listTableColumnFormat(column, value)"
                            />
                        </tr>
                    </tbody>
                </table>

            </div>

            <!-- Pagination range and buttons -->
            <aui-pagination
                v-if="has_list_data"
                :disabled="state.overlay"
                :page.sync="list.page"
                :total="list.total"
                :limit.sync="list.limit"
                :list_range_limit="list_range_limit"
                @paginate="readList"
            />

        </div>

        <!-- Form view -->
        <div v-if="show_form" class="form">

            <!-- Form tabs if multiple views -->
            <aui-tabs v-if="view_show_tabs" :tabs="view_tabs" :tab.sync="tab" @change="handleTabChange" />

            <!-- Build form slots -->
            <div class="body" v-for="(form, key) in form_views" :key="'view-' + key">
                <slot
                    v-if="isActiveTab(key)"
                    :form="form"
                    :name="key"
                    :overlay="state.overlay"
                    :showForm="showForm"
                    :runCreate="runCreate"
                    :runUpdate="runUpdate"
                    :runDelete="runDelete"
                    :closeModals="closeModals"
                />
            </div>

            <!-- Form bottom action bar -->
            <div v-if="view_show_action_bar" class="action">

                <!-- Back button -->
                <aui-button
                    type="secondary"
                    :disabled="state.overlay"
                    text="Back"
                    @click="showForm(false)"
                />

                <!-- Primary action area -->
                <div class="primary">
                    <i v-if="state.show_failure_tick" class="tic fas fa-times" />
                    <i v-if="state.show_success_tick" class="tic fas fa-check" />
                    <aui-button
                        v-if="!is_valid"
                        :loading="state.overlay"
                        loading_text="Creating..."
                        text="Create"
                        @click="runCreate"
                    />
                    <aui-button
                        v-else-if="!list_show_delete_button"
                        :loading="form_update_is_running"
                        loading_text="Updating..."
                        text="Update"
                        @click="runUpdate"
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
                            @delete="runDelete"
                        />
                    </div>
                </div>

            </div>

            <!-- Delete confirm modal -->
            <aui-modal type="failure" title="Confirm Delete" :show.sync="state.show_delete_modal">
                <template #content>
                    <p>{{form_delete_text}}</p>
                    <aui-input label="Type DELETE to confirm" v-model="delete_confirm" />
                    <aui-alert v-if="error.delete_protect" type="failure" :text="error.delete_protect" />
                </template>
                <template #left>
                    <aui-button
                        type="secondary"
                        :disabled="state.overlay"
                        text="Cancel"
                        @click="closeModals"
                    />
                </template>
                <template #right>
                    <aui-button
                        type="failure"
                        :disabled="form_delete_disabled"
                        :loading="state.overlay"
                        loading_text="Deleting..."
                        text="Delete"
                        @click="runDelete(true)"
                    />
                </template>
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
         * Columns to display when using table mode. The key must be the column name and the value is a sub-object
         * with a label key which will display as the label on the column, and an optional format key to define a
         * value formatter.
         */
        list_table_columns: {
            type: Object,
            default: () => {},
            validator: value => {
                for (const key in value) {
                    if (typeof value[key] === 'object') {
                        if (typeof value[key]['label'] !== 'string') {
                            return false;
                        }
                        if (typeof value[key]['format'] !== 'undefined' && typeof value[key]['format'] !== 'function') {
                            return false;
                        }
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
         * If the delete button should be shown in the list view.
         */
        list_show_delete_button: {
            type: Boolean,
            default: true
        },

        /**
         * If the search should be shown in the list view.
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
         * Form data container.
         */
        form: {
            type: Object,
            default: () => {}
        },

        /**
         * Input feedback container.
         */
        feedback: {
            type: Object,
            default: () => {}
        },

        /**
         * If a calling state is preset.
         */
        calling: {
            type: Boolean,
            required: true
        },

        /**
         * The API called to read the form for the interacted row ID.
         */
        form_api_read: {
            type: String
        },

        /**
         * Optional data to send to the read form API when called.
         */
        form_api_read_optional_data: {
            type: Object,
            default: () => {}
        },

        /**
         * The API called to setup the create form.
         */
        form_api_create_setup: {
            type: String
        },

        /**
         * Optional data to send to the create setup API when called.
         */
        form_api_create_setup_optional_data: {
            type: Object,
            default: () => {}
        },

        /**
         * The API called to create the storable.
         */
        form_api_create: {
            type: String
        },

        /**
         * Optional data to send to the create API when called.
         */
        form_api_create_optional_data: {
            type: Object,
            default: () => {}
        },

        /**
         * The API called to update the form for the interacted row ID.
         */
        form_api_update: {
            type: String
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
            type: String
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
         */
        form_delete_text: {
            type: String,
            default: 'Are you sure you want to delete?'
        },

        /**
         * Secure fields such as passwords that are reset after create/update/delete actions.
         */
        secure_fields: {
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
         *
         * The key of each entry is the view ID that is used for the slot name and tab name. If the value is a string,
         * the string will be the name of the view that is rendered. If the value is an object, you can define extra
         * parameters such as show_action_bar. This sub-object MUST contain a name property as well to define the
         * rendered name.
         */
        views: {
            type: Object,
            default: () => {},
            validator: value => {
                for (const view in value) {
                    if (typeof value[view] !== 'object' && typeof value[view] !== 'string') {
                        return false;
                    }
                    if (typeof value[view] === 'object') {
                        if (typeof value[view].name !== 'string') {
                            return false;
                        }
                        if (
                            typeof value[view].show_action_bar !== 'undefined' &&
                            typeof value[view].show_action_bar !== 'boolean'
                        ) {
                            return false;
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
                total: 0,
                page: 1,
                search_timer: null,
                search: null,
                sort: {},
                sort_order: []
            },
            tab: null,
            form_delete_dropdown: {
                delete: 'Delete'
            },
            delete_confirm: null,
            state: {
                overlay: false,
                show_form: false,
                show_delete_modal: false,
                show_failure_tick: false,
                show_success_tick: false,
                show_created_confirmation: false
            },
            error: {
                server: false,
                delete_protect: null
            },
            page_state: {
                show_create: 0,
                show_storable: 0,
                tab_index: 0
            }
        }
    },
    computed: {

        /**
         * If the error notice should be shown (fatal error).
         *
         * @returns {boolean}
         */
        show_error() {
            return this.error.server;
        },

        /**
         * If the list should be shown.
         *
         * @returns {boolean}
         */
        show_list() {
            return !this.error.server && !this.state.show_form && !this.state.show_created_confirmation;
        },

        /**
         * If the form should be shown.
         *
         * @returns {boolean}
         */
        show_form() {
            return !this.error.server && this.state.show_form && !this.state.show_created_confirmation;
        },

        /**
         * If the created confirmation notice should be shown.
         *
         * @returns {boolean}
         */
        show_created_confirmation() {
            return !this.error.server && this.state.show_created_confirmation;
        },

        /**
         * If there is data in the list.
         *
         * @returns {boolean}
         */
        has_list_data() {
            return this.list.data.length > 0;
        },

        /**
         * If the list is in group mode.
         *
         * @returns {boolean}
         */
        list_is_group() {
            return this.has_list_data && this.list_type === 'group';
        },

        /**
         * If the list is in table mode.
         *
         * @returns {boolean}
         */
        list_is_table() {
            return this.has_list_data && this.list_type === 'table';
        },

        /**
         * List data if using "group" mode.
         *
         * @returns [{
         *     {icon: string},
         *     {title: string},
         *     {subtext: string},
         *     {value: number}
         * }]
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
                    value: entry[this.form_storable_key]
                });
            }
            return list;
        },

        /**
         * List data if using "table" mode.
         *
         * @returns [
         *     {id: number},
         *     {data: object}
         * ]
         */
        list_table_data() {
            const list = [];
            if (this.list_type !== 'table') {
                return list;
            }
            for (const entry of this.list.data) {
                const row = {
                    id: entry[this.form_storable_key],
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
         *
         * @returns {
         *     {overlay: boolean},
         *     {empty: boolean}
         * }
         */
        list_overlay_classes() {
            return {
                overlay: true,
                empty: this.list.data.length <= 0
            };
        },

        /**
         * Classes for the table.
         *
         * @returns {
         *     {interactive: boolean}
         * }
         */
        list_table_classes() {
            return {
                interactive: this.list_interactive || this.list_can_go_to_form
            };
        },

        /**
         * If the update call is running into an overlay state and not the delete running.
         *
         * @returns {boolean}
         */
        form_update_is_running() {
            return this.state.overlay && !this.state.show_delete_modal;
        },

        /**
         * Formatted views for use in rendering.
         *
         * @returns {
         *     {name: string},
         *     {show_action_bar: boolean}
         * }
         */
        form_views() {
            const views = {};
            for (const view in this.views) {
                views[view] = {
                    name: typeof this.views[view] === 'string' ? this.views[view] : this.views[view].name,
                    show_action_bar: typeof this.views[view].show_action_bar === 'boolean'
                        ? this.views[view].show_action_bar
                        : true
                };
            }
            return views;
        },

        /**
         * If the actual delete button is disabled due to not matching the confirm input.
         *
         * @returns {boolean}
         */
        form_delete_disabled() {
            return this.delete_confirm !== 'DELETE';
        },

        /**
         * If the tabs should be shown.
         *
         * @returns {boolean}
         */
        view_show_tabs() {
            return Object.keys(this.views).length > 1 && this.is_valid;
        },

        /**
         * Get the AUI tab options object for when tabs are present.
         *
         * @returns {object}
         */
        view_tabs() {
            const tabs = {};
            for (const view in this.form_views) {
                tabs[view] = this.form_views[view].name;
            }
            return tabs;
        },

        /**
         * If the action bar should be shown.
         *
         * @returns {boolean}
         */
        view_show_action_bar() {
            return this.form_views[this.tab].show_action_bar;
        },

        /**
         * If the storable is valid (has ID).
         *
         * @returns {boolean}
         */
        is_valid() {
            return !!this.form[this.form_storable_key];
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
                        this.state.overlay = true;
                    }
                }, 100);
            } else {
                this.state.overlay = false;
            }
        }

    },
    methods: {

        /**
         * Event handler for when a user tries to resize a header column in table view.
         *
         * @param {object} down_event - The mousedown event handler.
         * @param {number} index - The column index.
         * @returns {undefined}
         */
        dragToResize(down_event, index) {
            let dragging = true;
            let start_x = down_event.pageX;
            let start_width = this.$refs.table_headers[index].offsetWidth;
            let table_width = this.$refs.table_headers[0].closest('table').offsetWidth;
            document.addEventListener('mousemove', event => {
                let header_width = this.$refs.table_headers[0].closest('thead').offsetWidth;
                if (dragging && (table_width >= header_width)) {
                    let new_width = start_width + (event.pageX - start_x);
                    this.$refs.table_headers[index].style.minWidth = `${new_width}px`;
                }
            });
            document.addEventListener('mouseup', () => {
                dragging = false;
            });
        },

        /**
         * Handler to reset the header column width on double click.
         *
         * @param {number} index - The column index.
         * @returns {undefined}
         */
        doubleResetHeader(index) {
            this.$refs.table_headers[index].style.minWidth = '';
        },

        /**
         * Display handler for the draggable anchors in table view.
         *
         * @param {number} index - The column index.
         * @returns {boolean}
         */
        displayDraggable(index) {
            return index < Object.keys(this.list_table_columns).length - 1;
        },

        /**
         * Read the list using the given list read API.
         *
         * @returns {undefined}
         */
        readList() {
            if (this.calling) {
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
            this.$emit('update:calling', true);
            DynamicSuite.call(this.package, this.list_api_read, data, response => {
                switch (response.status) {
                    case 'OK':
                        this.list.data = response.data.list;
                        this.list.total = response.data.total;
                        this.$emit('update:calling', false);
                        break;
                    default:
                        this.error.server = true;
                }
            });
        },

        /**
         * Run the search for the list.
         *
         * @returns {undefined}
         */
        runSearch() {
            clearTimeout(this.list.search_timer);
            this.list.search_timer = setTimeout(() => {
                this.list.page = 1;
                this.readList();
            }, 300);
        },

        /**
         * Get the value of the given table column name when in table list mode.
         *
         * @param {string} column - The column name.
         * @returns {string}
         */
        listTableColumnName(column) {
            if (typeof column === 'object') {
                return column.label;
            } else {
                return column;
            }
        },

        /**
         * Format the value of the column using the format callback (if present).
         *
         * @param {string} column - The column name.
         * @param {string} value - The column value.
         * @returns {string}
         */
        listTableColumnFormat(column, value) {
            if (typeof this.list_table_columns[column] === 'string') {
                return value;
            } else {
                return this.list_table_columns[column].format(value);
            }
        },

        /**
         * Classes for the columns when in the table view, specifically for hiding on different screen types.
         *
         * @param {string} column - The column name.
         * @returns {
         *     {hide_on_ipad: boolean},
         *     {hide_on_mobile: boolean}
         * }
         */
        listTableColumnClasses(column) {
            return {
                hide_on_ipad: (
                    typeof this.list_table_columns[column] === 'object' &&
                    this.list_table_columns[column].hide_on_ipad === true
                ),
                hide_on_mobile: (
                    typeof this.list_table_columns[column] === 'object' &&
                    this.list_table_columns[column].hide_on_mobile === true
                )
            };
        },

        /**
         * Sort the list by the clicked on header.
         *
         * The column will first be sorted ascending, on second click, descending, and on third click, removed.
         *
         * @param {string} column - The column name.
         * @returns {undefined}
         */
        sortList(column) {
            if (typeof this.list.sort[column] === 'undefined') {
                this.list.sort_order.push(column);
                this.$set(this.list.sort, column, 'ASC');
            } else if (this.list.sort[column] === 'ASC') {
                this.$set(this.list.sort, column, 'DESC');
            } else {
                this.list.sort_order.splice(this.list.sort_order.indexOf(column), 1);
                this.$delete(this.list.sort, column);
            }
            this.list.page = 1;
            this.readList();
        },

        /**
         * If the given column is in the sorted columns list as ascending.
         *
         * @param {string} column - The column name.
         * @returns {boolean}
         */
        isSortedAsc(column) {
            return typeof this.list.sort[column] !== 'undefined' && this.list.sort[column] === 'ASC';
        },

        /**
         * If the given column is in the sorted columns list as descending.
         *
         * @param {string} column - The column name.
         * @returns {boolean}
         */
        isSortedDesc(column) {
            return typeof this.list.sort[column] !== 'undefined' && this.list.sort[column] === 'DESC';
        },

        /**
         * Emit a list click event and associated row ID.
         *
         * @param {number} id - The row ID.
         * @returns {undefined}
         */
        emitListClick(id) {
            this.$emit('list-click', id);
        },

        /**
         * Clear any secured fields from the model.
         *
         * Useful for things such as passwords.
         *
         * @returns {undefined}
         */
        secureFields() {
            const form = this.form;
            for (const field of this.secure_fields) {
                form[field] = null;
            }
            this.$emit('update:form', form);
        },

        /**
         * If the form(s) should be shown.
         *
         * If show is true, the form will be shown and the list will be hidden.
         *
         * @param {boolean} show - If the form should be shown.
         * @param {number} tab - The tab to update.
         * @returns {undefined}
         */
        showForm(show, tab = 0) {
            this.tab = Object.keys(this.views)[tab];
            if (!show) {
                this.page_state.show_create = 0;
                this.page_state.show_storable = 0;
                this.page_state.tab_index = 0;
                this.readList();
            } else {
                this.page_state.show_create = this.is_valid ? 0 : 1;
                this.page_state.show_storable = this.is_valid ? this.form[this.form_storable_key] : 0;
                this.page_state.tab_index = Object.keys(this.views).indexOf(this.tab);
            }
            this.$emit('page-state-change');
            this.state.show_form = show;
        },

        /**
         * Reset the form.
         *
         * @returns {undefined}
         */
        resetForm() {
            const form = this.form;
            for (const key in form) {
                form[key] = null;
            }
            this.$emit('update:form', form);
        },

        /**
         * Merge the given data with the form.
         *
         * @param {object} data - The data to merge.
         * @returns {undefined}
         */
        setForm(data) {
            this.resetFormFeedback();
            this.$emit('update:form', Object.assign(this.form, data));
        },

        /**
         * Setup the form for create.
         *
         * @returns {undefined}
         */
        setupCreate() {
            this.resetForm();
            this.resetFormFeedback();
            if (this.form_api_create_setup) {
                const data = Object.assign({}, this.form_api_create_setup_optional_data);
                this.$emit('update:calling', true);
                DynamicSuite.call(this.package, this.form_api_create_setup, data, response => {
                    switch (response.status) {
                        case 'OK':
                            this.setForm(response.data);
                            this.$emit('update:calling', false);
                            this.showForm(true);
                            break;
                        default:
                            this.clearURIState();
                            this.error.server = true;
                    }
                });
            } else {
                this.showForm(true);
            }
        },

        /**
         * Check if the given tab is the active tab when using form views.
         *
         * @param {string} tab - The tab to compare the set against.
         * @returns {boolean}
         */
        isActiveTab(tab) {
            return tab === this.tab;
        },

        /**
         * Read the storable for the given ID.
         *
         * Note: This will also set the view to the first view on the form.
         *
         * @param {number} id - The storable ID.
         * @param {number} tab - Set to a specific tab.
         * @returns {undefined}
         */
        readStorable(id, tab = 0) {
            if (this.calling) {
                return;
            }
            const data = Object.assign({[this.form_storable_key]: id}, this.form_api_read_optional_data);
            this.$emit('update:calling', true);
            DynamicSuite.call(this.package, this.form_api_read, data, response => {
                switch (response.status) {
                    case 'OK':
                        this.setForm(response.data);
                        this.showForm(true, tab);
                        this.$emit('update:calling', false);
                        break;
                    case 'NOT_FOUND':
                        this.showForm(false);
                        this.$emit('update:calling', false);
                        break;
                    default:
                        this.error.server = true;
                }
            });
        },

        /**
         * Merge the given feedback with the current feedback.
         *
         * @param {object} data - The feedback object to merge.
         * @returns {undefined}
         */
        setFeedback(data) {
            const feedback = Object.assign({}, this.feedback);
            for (const key in data) {
                feedback[key] = data[key];
            }
            this.$emit('update:feedback', feedback);
        },

        /**
         * Reset any feedback on the form
         *
         * @returns {undefined}
         */
        resetFormFeedback() {
            this.state.show_failure_tick = false;
            this.state.show_success_tick = false;
            this.error.delete_protect = null;
            const feedback = Object.assign({}, this.feedback);
            for (const field in this.feedback) {
                feedback[field] = null;
            }
            this.$emit('update:feedback', feedback);
        },

        /**
         * Create the storable for the given form data.
         *
         * @returns {undefined}
         */
        runCreate() {
            if (this.calling) {
                return;
            }
            this.resetFormFeedback();
            const data = Object.assign({}, this.form, this.form_api_create_optional_data);
            this.$emit('update:calling', true);
            DynamicSuite.call(this.package, this.form_api_create, data, response => {
                switch (response.status) {
                    case 'OK':
                        this.state.show_created_confirmation = true;
                        this.setForm({
                            [this.form_storable_key]: parseInt(response.data)
                        });
                        this.$emit('update:calling', false);
                        this.secureFields();
                        this.readList();
                        this.showForm(true);
                        setTimeout(() => {
                            this.state.show_created_confirmation = false;
                        }, 1000);
                        break;
                    case 'INPUT_ERROR':
                        this.state.show_failure_tick = true;
                        this.setFeedback(response.data);
                        this.$emit('update:calling', false);
                        break;
                    default:
                        this.error.server = true;
                }
            });
        },

        /**
         * Update the storable for the given form data.
         *
         * @returns {undefined}
         */
        runUpdate() {
            if (this.calling) {
                return;
            }
            this.resetFormFeedback();
            const data = Object.assign({}, this.form, this.form_api_update_optional_data);
            this.$emit('update:calling', true);
            DynamicSuite.call(this.package, this.form_api_update, data, response => {
                switch (response.status) {
                    case 'OK':
                        this.state.show_success_tick = true;
                        this.$emit('update:calling', false);
                        this.secureFields();
                        break;
                    case 'INPUT_ERROR':
                        this.state.show_failure_tick = true;
                        this.setFeedback(response.data);
                        this.$emit('update:calling', false);
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
         * @param {boolean} confirm - If the delete is confirmed.
         * @returns {undefined}
         */
        runDelete(confirm = false) {
            this.resetFormFeedback();
            if (!confirm) {
                this.delete_confirm = null;
                this.state.show_delete_modal = true;
            } else {
                const data = Object.assign({}, this.form, this.form_api_delete_optional_data);
                this.$emit('update:calling', true);
                DynamicSuite.call(this.package, this.form_api_delete, data, response => {
                    switch (response.status) {
                        case 'OK':
                            this.$emit('update:calling', false);
                            this.$nextTick(() => {
                                this.closeModals();
                                this.showForm(false);
                                this.secureFields();
                            });
                            break;
                        case 'DELETE_PROTECT':
                            this.error.delete_protect = response.message;
                            this.$emit('update:calling', false);
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
         * @returns {undefined}
         */
        closeModals() {
            if (!this.calling) {
                this.state.show_delete_modal = false;
            }
        },

        /**
         * Handle tab changing on the form.
         *
         * @param {string} tab - the new tab.
         * @returns {undefined}
         */
        handleTabChange(tab) {
            this.page_state.tab_index = Object.keys(this.views).indexOf(tab);
            this.$emit('page-state-change');
        }

    },
    mounted() {

        // Set initial tab
        this.tab = Object.keys(this.views)[0];

        // Set the initial limit
        this.list.limit = this.list_range_limit[0];

        // Handle list interactions
        this.$on('list-click', id => {
            if (this.list_can_go_to_form) {
                this.readStorable(id);
            }
        });

        // Resolve the current state
        const resolveState = () => {
            if (this.page_state.show_create) {
                this.setupCreate();
            } else if (this.page_state.show_storable) {
                this.readStorable(
                    this.page_state.show_storable,
                    this.page_state.tab_index
                );
            } else {
                this.showForm(false);
            }
        }

        // Set up from URL state
        const params = new URLSearchParams(window.location.search), key = `_${this._uid}`;
        if (params.get(key)) {
            const hashids = new Hashids.default();
            const decoded = hashids.decode(params.get(key));
            this.page_state.show_create = decoded[0];
            this.page_state.show_storable = decoded[1];
            this.page_state.tab_index = decoded[2];
            resolveState();
        } else {
            this.readList();
        }

        // Listen for page state changes
        this.$on('page-state-change', () => {

            // The page state is saved in 3 different parts, each part is an integer. Booleans are stored as 1 or 0
            // show_create    - If the create form should be shown
            // show_storable  - If the update form should be shown. This saves the storable ID
            // tab_index      - Get the tab index if editing a storable

            // Initialize hashIDs
            const hashids = new Hashids.default();

            // Set up the URL parameters
            const params = new URLSearchParams(window.location.search);

            // The UID will serve as the GET key
            const key = `_${this._uid}`;

            // The actual state is an array of integers for encoding, but they are saved on the instance in
            // an object. Just the state must be extracted
            const state = Object.values(this.page_state);

            // Encode the state for use in the URL
            const encoded = hashids.encode(state);

            // Push the encoded state
            const pushState = (params, state) => {
                const url = params.toString().length ? `?${params.toString()}` : window.location.href.split('?')[0];
                history.pushState(state, '', url);
            }

            // If the sum of the state is positive, it is assumed valid (create/update view)
            // The comparison against the encoded is so that hard reloads do not duplicate state
            if (!!state.reduce((a, b) => a + b) && params.get(key) !== encoded) {
                params.set(key, encoded);
                pushState(params, encoded);
            }

            // If the sum of the state is 0 (list view) but an old key exists, remove it
            else if (!state.reduce((a, b) => a + b) && params.has(key)) {
                params.delete(key);
                pushState(params, null);
            }

        });

        // Popstate listener for page state changes
        window.onpopstate = event => {
            if (event.state) {
                const hashids = new Hashids.default();
                const decoded = hashids.decode(event.state);
                this.page_state.show_create = decoded[0];
                this.page_state.show_storable = decoded[1];
                this.page_state.tab_index = decoded[2];
                resolveState();
            } else {
                this.showForm(false);
            }
        }

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
    display: flex
    flex-direction: column

    /* List view */
    .list

        /* List header */
        & > .header
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
                margin: 2rem 0 1rem 0

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
                    white-space: nowrap
                    text-overflow: ellipsis

                    /* Hidden columns */
                    &.hide_on_ipad
                        @include on-ipad-view
                            display: none

                    /* Hidden columns */
                    &.hide_on_mobile
                        @include on-mobile-view
                            display: none

                /* Header styling */
                th
                    user-select: none
                    border-bottom: 2px solid lighten($secondary, 40%)
                    position: relative
                    box-sizing: border-box

                    /* Grow last column */
                    &:last-of-type
                        width: 100%

                    /* Header hovering */
                    &:hover
                        cursor: pointer
                        background: darken(whitesmoke, 5%)

                    /* Sort icon */
                    i
                        margin-left: 0.5rem

                    .resize-element
                        position: absolute
                        right: 0
                        top: 0
                        bottom: 0
                        cursor: col-resize
                        width: .325rem

                        &:hover
                            background: darken(whitesmoke, 15%)


                /* Table body */
                tbody

                    /* Special last column styling */
                    tr td:last-of-type
                        max-width: 0
                        overflow: hidden
                        text-overflow: ellipsis

                    /* Add border to all but last cells */
                    tr:not(:last-of-type) td
                        border-bottom: 1px solid lighten($secondary, 40%)

                    /* Zebra striping */
                    tr:nth-child(odd)
                        background: #fff

    /* Pad delete confirm input */
    .modal .aui.input
        margin-bottom: 1rem

    /* Form view */
    .form

        /* Add tab padding */
        & > .aui.tabs
            margin-bottom: 1rem

        /* Form headers */
        h2
            padding-bottom: 0.25rem
            border-bottom: 1px solid #ced4da

            /* Section separators */
            &:not(:first-child)
                margin-top: 1rem

        /* Pad tabs */
        .body > .aui
            margin-bottom: 1rem

        /* 2 Column grid */
        .col-2
            display: grid
            grid-template-columns: 1fr 1fr
            grid-gap: 1rem
            margin-bottom: 1rem

            @include on-mobile-view
                grid-template-columns: 1fr

        /* 3 Column grid */
        .col-3
            display: grid
            grid-template-columns: 1fr 1fr 1fr
            grid-gap: 1rem
            margin-bottom: 1rem

            @include on-mobile-view
                grid-template-columns: 1fr

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