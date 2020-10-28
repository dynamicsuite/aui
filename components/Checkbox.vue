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

    <div class="aui checkbox">
        <label :class="classes">
            <slot></slot>
            <input type="checkbox" :checked="checked" :disabled="disabled" @change="$emit('input', $event.target.checked)">
            <span class="checkmark"></span>
        </label>
        <div class="subtext" :class="classes">{{subtext}}</div>
    </div>

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
            },
            // Success feedback state
            success: {
                type: String | Boolean,
                default: false
            },
            // Failure feedback state
            failure: {
                type: String | Boolean,
                default: false
            },
            subtext: {
                type: String
            }
        },
        computed: {
            classes() {
                return {
                    disabled: this.disabled,
                    failure: this.failure,
                    success: this.success
                }
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Checkbox styling */
.aui.checkbox

    label
        display: inline-flex
        align-items: center
        justify-content: center
        position: relative
        padding-left: 35px
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

        /* Checkmark failure styling */
        &.failure > .checkmark
            background-color: lighten($failure, 20%)

        /* Checkmark success styling */
        &.success > .checkmark
            background-color: lighten($success, 30%)

        /* Swap colors when disabled */
        &:disabled
            background: $secondary !important

        /* Checkbox hovering */
        &:hover input ~ .checkmark
            background: #ccc

        /* Checkbox success hovering */
        &.success:hover input ~ .checkmark
            background-color: lighten($success, 40%)

        /* Checkbox failure hovering */
        &.failure:hover input ~ .checkmark
            background-color: lighten($failure, 30%)

        /* Swap colors when disabled */
        &:disabled
            background: $secondary !important

        /* Checked box colors when not disabled */
        & > input:checked:not(disabled) ~ .checkmark
            background: $primary

        /* Checked box colors when not disabled */
        &.failure > input:checked:not(disabled) ~ .checkmark
            background: $failure

        /* Checked box colors when not disabled */
        &.success > input:checked:not(disabled) ~ .checkmark
            background: $success

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

    .subtext
        margin-left: 35px
        font-size: 0.8rem
        color: #6c757d
        width: 100%
        text-align: left

        &.failure
            color: $failure

        &.success
            color: $success



</style>