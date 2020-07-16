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
    <span class="aui tab" :class="getActiveClass()" @click="$emit('click'); doAction(action)">
        {{label}}
    </span>
</template>

<script>
    export default {
        props: {
            active: {
                type: Boolean,
                required: true
            },
            label: {
                type: String,
                required: true
            },
            action: {
                type: String | Function
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            getActiveClass() {
                let classes = this.active ? 'active' : '';
                if (this.disabled) {
                    classes += ' disabled';
                }
                return classes;
            },
            doAction() {
                if (this.disabled) {
                    return;
                }
                if (typeof(this.action) === 'string') {
                    window.open(this.action);
                } else if (typeof(this.action) === 'function') {
                    this.action();
                } else {
                    console.log('AUI-TAB: Action passed to click is not string or function; type: ' + typeof(this.action));
                }
            },
        }
    }
</script>

<style lang="sass" scoped>

    @import "../../../client/css/colors"


    .tab
        padding: calc(0.5rem + 2px) 1rem
        margin-right: 1rem
        font-size: 1rem
        cursor: pointer
        white-space: nowrap
        user-select: none
        -webkit-touch-callout: none
        -webkit-user-select: none

        &:not(.active)
            border-left: 1px solid rgba(255,255,255,0)
            border-top: 1px solid rgba(255,255,255,0)
            border-right: 1px solid rgba(255,255,255,0)

        &.active
            background: whitesmoke
            border-bottom: 1px solid whitesmoke
            border-left: 1px solid #ced4da
            border-top: 1px solid #ced4da
            border-right: 1px solid #ced4da
            border-radius: .25rem .25rem 0 0

        &.disabled
            color: #777

            &:hover
                cursor: not-allowed


</style>