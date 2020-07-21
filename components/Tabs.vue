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
        <aui-tab
            v-for="(option, index) in options"
            :key="index" :active="option.active"
            :label="option.label"
            :action="option.action"
            :disabled="option.disabled"
            @click="setActive(option)"
            v-if="showTabs"
        >
        </aui-tab>
        <aui-button-drop :options="options" v-if="!showTabs" menu_align="right">{{getActive()}}</aui-button-drop>
    </div>
</template>

<script>
    export default {
        props: {
            options: {
                type: Array
            },
        },
        data: function() {
            return {
                width: null,
                hideWidth: null,
                showTabs: true
            }
        },
        methods: {
            setActive(new_active) {
                if (new_active.disabled) {
                    return;
                }
                this.options.forEach((option) => {
                    option.active = false;
                });

                new_active.active = true;
            },
            getActive() {
                let active = this.options.filter((option) => {
                    if (option.active) return true;
                });

                return active[0].label;
            },
            manageOverflow() {

                window.requestAnimationFrame(() => {
                    this.showTabs = this.$el.clientWidth >= this.width;
                });

            }
        },
        created: function() {
            window.addEventListener('resize', this.manageOverflow);
        },
        mounted: function() {
            this.width = 0;

            this.$children.forEach((component) => {
                this.width = this.width + component.$el.offsetWidth + 16;
            });

            this.width = this.width + 32;
            this.showTabs = this.$el.clientWidth >= this.width;
        },
        destroyed: function() {
            window.removeEventListener('resize', this.manageOverflow);
        }
    }
</script>

<style lang="sass">

    @import "../../../client/css/colors"

    // Tab styling
    .aui.tabs
        border-bottom: 1px solid #ced4da
        padding: calc(.5rem - 1px) 1rem
        display: flex

        &>*
            margin-bottom: -.5rem

        .btn
            background: whitesmoke
            border-bottom: 1px solid whitesmoke
            border-left: 1px solid #ced4da
            border-top: 1px solid #ced4da
            border-right: 1px solid #ced4da
            border-radius: .25rem .25rem 0 0
            z-index: 2
            height: 40px

            .dropdown-menu
                border-radius: 0 0 .25rem .25rem
</style>