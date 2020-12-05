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
    <div class="aui btn-drop" ref="dropdown">

        <!-- The button to toggle the dropdown -->
        <button class="aui btn" :class="style_class" :disabled="is_disabled" @click="toggle">
            <span v-if="text || $slots.default"><slot>{{text}}</slot></span>
            <i :class="icon_class"></i>
        </button>

        <!-- The dropdown list -->
        <ul v-show="show_dropdown" class="dropdown" ref="menu" :class="list_classes">
            <li v-for="(text, event) in dropdown" :key="'entry-' + event" @click="handleClick(event)">{{text}}</li>
        </ul>

    </div>
</template>

<script>
export default {
    props: {

        /**
         * The button type.
         *
         * This determines the style class applied.
         */
        type: {
            type: String,
            default: 'primary',
            validator(value) {
                return ['none', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
            }
        },

        /**
         * Button text.
         *
         * This is an alias for the slot content when using plaintext. Slot should be used if custom HTML is
         * required.
         */
        text: {
            type: String | null,
            default: null
        },

        /**
         * The dropdown menu entries.
         *
         * The key of each entry is the event name that is emitted back to the parent.
         *
         * The value of each entry is the name (text) that is displayed for the menu row.
         */
        dropdown: {
            type: Object,
            required: true,
            validator(value) {
                for (const key in value) {
                    if (typeof value[key] !== 'string') {
                        return false;
                    }
                }
                return true;
            }
        },

        /**
         * If the button is disabled and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * The icon classes to apply when the dropdown is inactive.
         */
        icon_inactive: {
            type: String,
            default: 'fas fa-caret-down'
        },

        /**
         * The icon classes to apply when the dropdown is active.
         */
        icon_active: {
            type: String,
            default: 'fas fa-caret-up'
        },

        /**
         * Where to align the dropdown relative to the button.
         *
         * Accepts: left, right
         */
        menu_align: {
            type: String,
            default: 'left',
            validator(value) {
                return ['left', 'right'].indexOf(value) !== -1;
            }
        },

        /**
         * Relative container for the dropdown placement.
         *
         * Used to avoid clipping out of parent element.
         */
        relative_to: {
            type: String | null,
            default: null
        }

    },
    computed: {

        /**
         * Style class for the button.
         *
         * @returns {Object} The active style class object.
         */
        style_class() {
            return {
                [`btn-${this.type}`]: this.type !== 'none'
            };
        },

        /**
         * If the button is in a disabled state.
         *
         * @returns {boolean} The disabled state.
         */
        is_disabled() {
            return this.loading || this.disabled;
        },

        /**
         * The icon class for the dropdown.
         *
         * @returns {String}
         */
        icon_class() {
            return this.show_dropdown ? this.icon_active : this.icon_inactive;
        },

        /**
         * Style classes to apply to the dropdown menu.
         *
         * @returns {Object} The dropdown style class object.
         */
        list_classes() {
            return {
                top: !!this.anchor_top,
                [this.menu_align_master]: !!this.menu_align_master,
                [this.menu_align]: !this.menu_align_master
            };
        }

    },
    data() {
        return {
            show_dropdown: false,
            anchor_top: false,
            menu_align_master: null
        }
    },
    methods: {

        /**
         * Handle the dropdown menu click event.
         *
         * @param {string} key - The event name (key).
         * @returns {undefined}
         */
        handleClick(key) {
            this.$emit(key);
            this.$emit('menu-click', key);
            this.show_dropdown = false;
        },

        /**
         * Toggle the dropdown menu.
         *
         * @returns {undefined}
         */
        toggle() {

            this.show_dropdown = !this.show_dropdown;
            this.menu_align_master = null;
            this.anchor_top = false;

            this.$nextTick(() => {

                // Hide the element
                this.$refs['menu'].style.opacity = '0';

                // Get element dimensions
                const rect = this.$refs['menu'].getBoundingClientRect();
                let space_below = window.innerHeight - rect.bottom;
                let space_right = window.innerWidth - rect.right;
                if (this.relative_to) {
                    const element = this.$refs['menu'].closest(this.relative_to);
                    if (element) {
                        space_below = element.offsetHeight - rect.bottom;
                        space_right = element.offsetWidth - rect.right;
                    }
                }

                // If the element is too close to the right edge, assign a left anchor
                if (space_right < 0) {
                    this.menu_align_master = 'right';
                }

                // If the element is too close to the bottom edge, assign it a top anchor
                if (space_below < 0) {
                    this.anchor_top = true;
                }

                // Un-hide the element
                this.$refs['menu'].style.opacity = '1';

            });
        },

        /**
         * Reset the visibility state when clicking outside the component.
         *
         * @param {object} event - The click event.
         * @returns {undefined}
         */
        blurDropdownMenu(event) {
            if (!this.$refs.dropdown.contains(event.target)) {
                this.show_dropdown = false;
            }
        }

    },
    created() {
        window.addEventListener('click', this.blurDropdownMenu);
    },
    beforeDestroy() {
        window.removeEventListener('click', this.blurDropdownMenu);
    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Button group container */
.aui.btn-drop
    display: inline-flex
    position: relative
    align-self: flex-start

    /* Disable browser outline */
    &:focus
        outline: none !important

    /* Slot text for the dropdown*/
    .btn > span
        margin-right: 0.5rem

    /* FontAwesome icon class on the dropdown button */
    .btn > i
        margin: 0 !important

    /* Dropdown menu when the button is pressed */
    .dropdown
        position: absolute
        top: 2.35rem
        margin: 0
        padding: 0.5rem 1rem
        background: white
        border: 1px solid #ced4da
        border-radius: 0.25rem
        color: black
        list-style: none
        z-index: 1

        /* Disable browser outline */
        &:focus
            outline: none !important

        /* Left aligned list */
        &.left
            left: 0

        /* Right aligned list */
        &.right
            right: 0

        /* Top attached list */
        &.top
            top: auto
            bottom: 2.45rem

        /* Dropdown entries */
        li
            padding: 0.25rem 0
            white-space: nowrap
            text-align: left
            word-break: break-all
            cursor: pointer

            /* List selection styling */
            &:hover
                text-decoration: underline
                color: $primary

</style>