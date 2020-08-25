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
        <span v-if="!collapsed" v-for="tab in tab_structure" class="tab" :class="tabClass(tab.id)" @click="tab.action">
            {{tab.label}}
        </span>
        <aui-button-drop v-if="collapsed" :dropdown="tab_structure">{{tab_name}}</aui-button-drop>
    </div>
</template>

<script>
    export default {
        props: {
            // Tab structure to render
            tabs: {
                type: Object,
                required: true
            },
            // Initial tab to render and set active
            initial_tab: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                width: 0,
                collapsed: false,
                tab: null
            }
        },
        computed: {
            // Format the tab structure
            tab_structure() {
                let structure = [];
                let tab_keys = Object.keys(this.tabs);
                for (let i = 0; i < tab_keys.length; i++) {
                    let tab = tab_keys[i];
                    structure[i] = {
                        id: tab,
                        label: this.tabs[tab],
                        action: () => {
                            this.tab = tab;
                            this.$emit('change', this.tab);
                        }
                    }
                }
                return structure;
            },
            // Dropdown text for collapsed tabs
            tab_name() {
                return this.tabs[this.tab];
            }
        },
        methods: {
            // Check and set collapsed state on resize
            checkIfCollapsed() {
                window.requestAnimationFrame(() => {
                    this.collapsed =
                        this.$el.clientWidth <= this.width ||
                        this.$el.clientWidth + 40 >= window.innerWidth;
                });
            },
            // Style classes to apply to the tab
            tabClass(tab) {
                return {
                    active: this.tab === tab
                }
            }
        },
        created() {
            window.addEventListener('resize', this.checkIfCollapsed);
        },
        mounted() {
            // Check to see how wide the tabs are (in PX) and then checks if it exceeds the window width
            for (let i = 0; i < this.$el.childNodes.length; i++) {
                if (typeof this.$el.childNodes[i].offsetWidth !== 'number') {
                    continue;
                }
                this.width += this.$el.childNodes[i].offsetWidth + 1;
            }
            this.width = this.width + 32;
            this.checkIfCollapsed();
            if (this.initial_tab) {
                this.tab = this.initial_tab;
            } else {
                this.tab = Object.keys(this.tabs)[0];
            }
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.checkIfCollapsed);
        }
    }
</script>

<style lang="sass">

/* Media query mixin for mobile view breakpoint */
@mixin on-mobile-view
    @media (max-width: 500px)
        @content

/* Import the core DS colors */
@import "../../../client/css/colors"

// Tabs container
.aui.tabs
    display: flex
    padding: calc(0.5rem - 1px) 1rem
    border-bottom: 1px solid #ced4da

    @include on-mobile-view
        .btn-drop
            display: flex
            justify-content: center
            width: 100%

    /* Global margin adjustment */
    & > *
        margin-bottom: -.5rem

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