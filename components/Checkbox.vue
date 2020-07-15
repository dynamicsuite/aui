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
    <label class="aui check-container">
        <slot></slot>
        <input type="checkbox" :checked="checked" :disabled="disabled" @change="$emit('input', $event.target.checked)">
        <span class="checkmark"></span>
    </label>
</template>

<script>
    export default {
        props: {
            checked: {
                type: Boolean
            },
            disabled: {
                type: Boolean,
                default: false
            }
        }
    }
</script>