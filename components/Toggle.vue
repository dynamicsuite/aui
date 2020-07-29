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
    <label class="aui toggle">
        <slot></slot>
        <span class="switch">
            <input type="checkbox" :checked="toggled" :disabled="disabled" @change="$emit('input', $event.target.checked)">
            <span class="slider"></span>
        </span>
    </label>
</template>

<script>
    export default {
        props: {
            // If the toggle is toggled on
            toggled: {
                type: Boolean,
                default: false
            },
            // If the toggle is disabled
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

// Toggle styling
.aui.toggle
    display: flex
    align-items: center
    position: relative
    margin: 0.5rem 0
    padding: 0.5rem 0
    cursor: pointer
    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

    /* Flex out the label */
    label
        display: flex

    /* The switch - the box around the slider */
    .switch
        position: relative
        display: inline-block
        width: 60px
        height: 28px
        margin-left: 1rem

        /* Hide default HTML checkbox */
        input
            opacity: 0
            width: 0
            height: 0

        /* The slider */
        .slider
            position: absolute
            cursor: pointer
            top: 0
            left: 0
            right: 0
            bottom: 0
            background: #ccc
            -webkit-transition: 0.4s
            transition: 0.4s
            border-radius: 34px

            /* Slider circle */
            &:before
                position: absolute
                content: ""
                height: 20px
                width: 20px
                left: 4px
                bottom: 4px
                background: white
                -webkit-transition: 0.4s
                transition: 0.4s
                border-radius: 50%

    /* Slider color */
    input:checked + .slider
        background: $primary

    /* Slider shadow effect */
    input:focus + .slider
        box-shadow: 0 0 1px $primary

    /* Transforms */
    input:checked + .slider:before
        -webkit-transform: translateX(32px)
        -ms-transform: translateX(32px)
        transform: translateX(32px)

    /* Disabled slider */
    input:disabled + .slider
        background: $secondary
        cursor: not-allowed

        /* Slider circle */
        &:before
            background: #ccc

</style>