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
    <label class="aui checkbox" :class="true ? 'disabled' : 'not-disabled'">
        <slot></slot>
        <input type="checkbox" :checked="checked" :disabled="disabled" @change="$emit('input', $event.target.checked)">
        <span class="checkmark"></span>
    </label>
</template>

<script>
    export default {
        props: {
            // If the checkbox is checked
            checked: {
                type: Boolean | Number,
                default: false
            },
            // If the checkbox is disabled
            disabled: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Checkbox styling */
.aui.checkbox
    display: inline-flex
    align-items: center
    justify-content: center
    position: relative
    padding-left: 35px
    margin-bottom: 12px
    height: 26px
    cursor: pointer
    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

    &.disabled
        cursor: not-allowed !important

    /* Input overrides */
    & > input
        position: absolute
        opacity: 0
        cursor: pointer
        height: 0
        width: 0

    /* Checkmark styling */
    & > .checkmark
        position: absolute
        top: 0
        left: 0
        height: 25px
        width: 25px
        background-color: darken(#eee, 10%)

    /* Swap colors when disabled */
    &:disabled
        background: $secondary !important

    /* Checkbox hovering */
    &:hover input ~ .checkmark
        background: #ccc

    /* Checked box colors when not disabled */
    & > input:checked:not(disabled) ~ .checkmark
        background: $primary

    /* Checked box colors when disabled */
    & > input:checked:disabled ~ .checkmark
        background: $secondary
        cursor: not-allowed

    /* Pseudo element overrides */
    & > .checkmark:after
        content: ""
        position: absolute
        display: none

    /* Pseudo element overrides */
    & > input:checked ~ .checkmark:after
        display: block

    /* Pseudo element styling */
    & > .checkmark:after
        left: 9px
        top: 5px
        width: 5px
        height: 10px
        border: solid white
        border-width: 0 3px 3px 0
        -webkit-transform: rotate(45deg)
        -ms-transform: rotate(45deg)
        transform: rotate(45deg)

</style>