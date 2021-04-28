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
    <div class="aui tabs">
        <span
            v-if="!collapsed"
            v-for="(name, tab) in tabs"
            v-html="name"
            class="tab"
            :class="tabClass(tab)"
            @click="handleClick(tab)"
        />
        <aui-button-drop v-if="collapsed" :dropdown="tabs" :text="tabs[tab]" @menu-click="handleClick" />
    </div>
</template>

<script>
export default {
    props: {

        /**
         * The tabs to render. This must be a simple <string, string> key-value object where the key is the tab
         * name and the value is the name to display.
         */
        tabs: {
            type: Object,
            required: true
        },

        /**
         * The current tab (key).
         */
        tab: {
            type: String | Number,
            required: true
        },

        /**
         * If the tabs are disabled and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        }

    },
    data() {
        return {
            width: 0,
            collapsed: false
        }
    },
    methods: {

        /**
         * Handle the clicking of tabs and update the current tab.
         *
         * @param {string} tab - The clicked tab.
         * @returns {undefined}
         */
        handleClick(tab) {
            if (!this.disabled) {
                this.$emit('update:tab', tab);
                this.$emit('change', tab);
            }
        },

        /**
         * Calculate which classes to use for the given tab.
         *
         * @param {string} tab - The given tab to calculate.
         * @returns {
         *     {disabled: boolean},
         *     {active: boolean}
         * }
         */
        tabClass(tab) {
            return {
                disabled: this.disabled,
                active: tab === this.tab
            };
        },

        /**
         * Check and set the collapsed state.
         *
         * @returns {undefined}
         */
        checkIfCollapsed() {
            window.requestAnimationFrame(() => {
                this.collapsed =
                    this.$el.clientWidth <= this.width ||
                    this.width + 40 >= this.$el.parentElement.clientWidth;
            });
        }

    },
    mounted() {

        // Listen for window resizes
        window.addEventListener('resize', this.checkIfCollapsed);

        // Check to see how wide the tabs are (in pixels) and then checks if it exceeds the window width
        for (let i = 0; i < this.$el.childNodes.length; i++) {
            if (typeof this.$el.childNodes[i].offsetWidth !== 'number') {
                continue;
            }
            this.width += this.$el.childNodes[i].offsetWidth + 1;
        }
        this.width = this.width + 32;
        this.checkIfCollapsed();

    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkIfCollapsed);
    }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* Tabs container */
.aui.tabs
    display: flex
    padding: calc(0.5rem - 1px) 1rem
    border-bottom: 1px solid #ced4da

    /* Collapsed tabs dropdown */
    .btn-drop

        /* Match tabs */
        .btn
            padding: calc(0.5rem + 2px) 1rem

            /* Match tabs */
            span
                margin-top: 1px

    /* Global margin adjustment */
    & > *
        margin-bottom: -0.5rem

    /* Individual tabs */
    .tab
        padding: calc(0.5rem + 2px) 1rem
        margin-right: 1rem
        font-size: 1rem
        cursor: pointer
        white-space: nowrap
        user-select: none
        -webkit-touch-callout: none
        -webkit-user-select: none

        /* Non-active tabs */
        &:not(.active)
            border-left: 1px solid rgba(255, 255, 255, 0)
            border-top: 1px solid rgba(255, 255, 255, 0)
            border-right: 1px solid rgba(255, 255, 255, 0)

        /* Active tabs */
        &.active
            border-bottom: 1px solid whitesmoke
            border-left: 1px solid #ced4da
            border-top: 1px solid #ced4da
            border-right: 1px solid #ced4da
            border-radius: 0.25rem 0.25rem 0 0

        /* Disabled tabs */
        &.disabled
            color: #777

            /* Block the cursor when hovering disabled tabs */
            &:hover
                cursor: not-allowed

    /* Button dropdown styling for when the tabs are collapsed */
    .btn
        background: none
        color: black
        border-bottom: 1px solid whitesmoke
        border-left: 1px solid #ced4da
        border-top: 1px solid #ced4da
        border-right: 1px solid #ced4da
        border-radius: 0.25rem 0.25rem 0 0
        z-index: 2
        height: 40px

        /* Color overrides */
        &:hover, &:focus, &.active
            background: none
            color: black

    /* Dropdown overrides */
    .dropdown
        border-top: none !important
        border-top-left-radius: 0 !important
        border-top-right-radius: 0 !important
        margin-top: 3px !important
        width: 100%

</style>