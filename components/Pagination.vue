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
    <div class="aui pagination">

        <!-- Display range text -->
        <div class="range">
            <label>Showing</label>
            <select :disabled="disabled" @change="updateLimit">
                <option
                    v-for="limit in list_range_limit"
                    :key="'page-limit-' + limit"
                    :value="limit"
                    v-html="limit"
                />
            </select>
            <span>from {{from.toLocaleString()}} to {{to.toLocaleString()}} of {{total.toLocaleString()}}</span>
        </div>

        <!-- Pagination buttons  -->
        <div v-if="pages > 1" class="buttons">

            <!-- Left Chevrons -->
            <aui-button
                type="secondary"
                class="chevron"
                text="«"
                :disabled="disabled"
                @click="paginate(1)"
            />
            <aui-button
                type="secondary"
                class="chevron"
                text="‹"
                :disabled="disabled"
                @click="paginate(page - 1)"
            />

            <!-- Page buttons -->
            <aui-button
                v-for="(page, key) in button_range"
                :key="'pagination-' + key"
                :type="paginateButtonType(page)"
                :text="page"
                :disabled="disabled"
                class="page-button"
                @click="paginate(page)"
            />

            <!-- Right Chevrons -->
            <aui-button
                type="secondary"
                class="chevron"
                text="›"
                :disabled="disabled"
                @click="paginate(page + 1)"
            />
            <aui-button
                type="secondary"
                class="chevron"
                text="»"
                :disabled="disabled"
                @click="paginate(pages)"
            />

        </div>

        <!-- Single page display -->
        <div v-else class="single-page"><strong>1</strong> / <strong>1</strong></div>

    </div>
</template>

<script>
export default {
    props: {

        /**
         * If the buttons are disable and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * The current page.
         */
        page: {
            type: Number,
            required: true
        },

        /**
         * The total number of potential records in the dataset.
         */
        total: {
            type: Number,
            required: true
        },

        /**
         * The record limit per page.
         */
        limit: {
            type: Number,
            required: true
        },

        /**
         * The possible limit options for the dropdown.
         */
        list_range_limit: {
            type: Array,
            required: true
        }

    },
    computed: {

        /**
         * The total number of available pages.
         *
         * @returns {number}
         */
        pages() {
            return Math.ceil(this.total / this.limit);
        },

        /**
         * The offset value of current page.
         *
         * @returns {number}
         */
        offset() {
            let offset = (this.page - 1) * this.limit;
            if (offset > this.total) {
                offset = this.total - this.limit
                this.$emit('update:page', this.pages);
            }
            return offset;
        },

        /**
         * The beginning of the viewable range.
         *
         * @returns {number}
         */
        from() {
            return this.offset + 1;
        },

        /**
         * Ending of the viewable range.
         *
         * @returns {number}
         */
        to() {
            let to = this.from + this.limit - 1;
            if (to > this.total) {
                to = this.total;
            }
            return to;
        },

        /**
         * The range of buttons to render.
         *
         * Each button represents it's respective page that clicking will paginate to.
         *
         * @returns {number[]}
         */
        button_range() {
            const range = [];
            if (this.pages < 5) {
                for (let i = 1; i <= this.pages; i++) {
                    range.push(i);
                }
            } else if (this.page < 3) {
                for (let i = 1; i <= 5; i++) {
                    range.push(i);
                }
            } else {
                const at_end = this.page + 2 > this.pages
                const offset = !at_end ? this.page + 2 : this.pages;
                for (let i = at_end ? this.pages - 4 : this.page - 2; i <= offset; i++) {
                    range.push(i);
                }
            }
            return range;
        }

    },
    methods: {

        /**
         * Update the limit from the range limits.
         *
         * @param {object} event - The change event handler.
         * @returns {undefined}
         */
        updateLimit(event) {
            this.$emit('update:limit', parseInt(event.target.value));
            this.$emit('update:page', 1);
            this.$emit('paginate');
        },

        /**
         * Emit a page back to the parent to be paginated.
         *
         * @param {Number} page - The page to paginate to.
         * @returns {undefined}
         */
        paginate(page) {

            // Do not allow pagination when disabled
            if (this.disabled) {
                return;
            }

            // Ignore current page clicks
            if (page === this.page) {
                return;
            }

            // Do not paginate out of range
            if (page < 1 || page > this.pages) {
                return;
            }

            // Emit the pagination to the given page
            this.$emit('update:page', page);
            this.$emit('paginate');

        },

        /**
         * Get the button type for the given pagination button page.
         *
         * The button for the current page should be primary, all others should be secondary.
         *
         * @param {Number|String} page - The page number.
         * @return {string}
         */
        paginateButtonType(page) {
            return this.page === parseInt(page) ? 'primary' : 'secondary';
        }

    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Media query mixin for mobile view breakpoint */
@mixin on-mobile-view
    @media (max-width: 540px)
        @content

/* Media query mixin for ipad view breakpoint */
@mixin on-ipad-view
    @media (max-width: 768px)
        @content

/* Pagination container */
.aui.pagination
    display: flex
    align-items: center
    justify-content: center
    flex-wrap: wrap

    /* Split range and buttons on mobile view */
    @include on-mobile-view
        flex-direction: column

    /* Range display */
    .range
        color: #111
        white-space: nowrap

        /* Lower font size for ipads and lower */
        @include on-ipad-view
            font-size: 0.9rem

        /* Separate from buttons on mobile view */
        @include on-mobile-view
            display: flex
            flex-direction: column
            margin-bottom: 0.5rem

            /* Align rows */
            label, select
                text-align: center
                margin-bottom: 0.5rem !important

        /* Select for limit */
        select
            height: 2rem
            padding: 0 0.25rem
            margin: 0 0.35rem
            border-radius: 0.25rem
            border: 1px solid #ced4da
            text-align-last: center

            /* When disabled */
            &:disabled
                cursor: not-allowed
                background: darken(#e9ecef, 15%)

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

    /* Single page replacement for buttons */
    .single-page
        display: flex
        margin-left: auto

        @include on-mobile-view
            display: none

</style>