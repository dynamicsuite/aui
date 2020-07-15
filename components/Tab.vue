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