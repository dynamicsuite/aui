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
    <div class="aui aui-toggle flex">
        <span class="switch-container" :class="label_location">
            <label>{{label}}</label>
            <label class="switch">
                <input type="checkbox" :checked="checked" @change="$emit('input', $event.target.checked)">
                <span class="slider round"></span>
            </label>
        </span>
    </div>
</template>

<script>
    export default {
        props: {
            checked: {
                type: Boolean
            },
            label: {
                type: String,
            },
            label_location: {
                type: String,
                default: 'top',
                validator: prop => {
                    if (prop === 'left' || prop === 'right' || prop === 'top' || prop === 'bottom') return true;
                    else {
                        console.log('AUI-TOGGLE: Label location can only be left, right, top, or bottom.');
                        return false;
                    }
                }
            }
        }
    }
</script>