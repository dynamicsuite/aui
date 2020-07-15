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
    <button class="aui btn btn-dropdown" @click="menu_active = !menu_active" @focusout="menu_active = false" @touchleave="menu_active = false">
        <span v-if="$slots.default"><slot></slot></span>
        <i :class="icon_classes"></i>
        <ul class="dropdown-menu" :class="menu_align" v-if="menu_active">
            <li v-for="option in options" @click="doAction(option.action)">{{option.label}}</li>
        </ul>
    </button>
</template>

<script>
    export default {
        props: {
            classes: {
                type: String
            },
            options: {
                type: Array,
                required: true
            },
            label: {
                type: String
            },
            icon_classes: {
                type: String,
                default: 'fa fa-bars'
            },
            menu_align: {
                style: String,
                default: 'left',
                validator: prop => {
                    if (prop === 'left' || prop === 'right') return true;
                    else {
                        console.log('AUI-BUTTON: Menu alignment can only be left or right.');
                        return false;
                    }
                }
            }
        },
        data: function() {
            return {
                menu_active: false
            }
        },
        methods: {
            doAction(action) {
                if (typeof(action) === 'string') {
                    window.open(action);
                } else if (typeof(action) === 'function') {
                    action();
                } else {
                    console.log('AUI-BTN-DROPDOWN: Action passed to button click is not string or function; type: ' + typeof(action));
                }
            },
            hide(event) {
                this.menu_active = false;
            },
            setActive(tab) {
                this.options.forEach((option) => {
                    option.active = false;
                });

                tab.active = true;
            }
        }
    }
</script>