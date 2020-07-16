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

<style lang="sass" scoped>
    // Toggle switches
    .switch-container
        display: grid
        grid-gap: .5rem
        width: 100%

        label
            display: flex

        &.top
            margin-top: .5rem

            label
                grid-row: 1
                grid-column: 1
                justify-content: center

            .switch
                grid-row: 2
                grid-column: 1
                justify-self: center

        &.bottom
            margin-bottom: .5rem

            label
                grid-row: 2
                grid-column: 1
                justify-content: center

            .switch
                grid-row: 1
                grid-column: 1

        &.left
            grid-template-columns: auto 3.75rem
            align-items: center
            margin-left: .5rem

            label
                grid-row: 1
                grid-column: 1
                justify-content: flex-end

            .switch
                grid-row: 1
                grid-column: 2

        &.right
            grid-template-columns: 3.75rem auto
            align-items: center
            margin-right: .5rem

            label
                grid-row: 1
                grid-column: 2

            .switch
                grid-row: 1
                grid-column: 1

    /* The switch - the box around the slider */
    .switch
        position: relative
        display: inline-block
        width: 60px
        height: 28px

    /* Hide default HTML checkbox */
    .switch input
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
        background-color: #ccc
        -webkit-transition: .4s
        transition: .4s

    .slider:before
        position: absolute
        content: ""
        height: 20px
        width: 20px
        left: 4px
        bottom: 4px
        background-color: white
        -webkit-transition: .4s
        transition: .4s

    input:checked + .slider
        background-color: $primary

    input:focus + .slider
        box-shadow: 0 0 1px $primary

    input:checked + .slider:before
        -webkit-transform: translateX(32px)
        -ms-transform: translateX(32px)
        transform: translateX(32px)

    /* Rounded sliders */
    .slider.round
        border-radius: 34px

    .slider.round:before
        border-radius: 50%
</style>