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
    <label class="aui checkbox">
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

<style lang="sass">

    @import "../../../client/css/colors"

    // Checkboxes
    .aui.check-container, .radio-container
        display: flex
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

    .aui.check-container input
        position: absolute
        opacity: 0
        cursor: pointer
        height: 0
        width: 0

    .aui.checkmark
        position: absolute
        top: 0
        left: 0
        height: 25px
        width: 25px
        background-color: darken(#eee, 10%)

    .aui.checkmark:disabled
        background: $secondary !important

    .aui.check-container:hover input ~ .checkmark
        background-color: #ccc
        
    .aui.check-container input:checked:not(disabled) ~ .checkmark
        background-color: $primary

    .aui.check-container input:checked:disabled ~ .checkmark
        background-color: $secondary

    .aui.checkmark:after
        content: ""
        position: absolute
        display: none

    .aui.check-container input:checked ~ .checkmark:after
        display: block

    .aui.check-container .checkmark:after
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