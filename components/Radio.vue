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
    <div class="aui">
        <label class="radio-container">
            <slot></slot>
            <input type="radio" :name="name" :checked="checked"  @change="$emit('input', $event.target.checked)">
            <span class="radio"></span>
        </label>
    </div>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                required: true
            },
            checked: {
                type: Boolean
            }
        }
    }
</script>

<style lang="sass" scoped>
    /* Create a custom radio button */
    /* Hide the browser's default radio button */
    .radio-container input
        position: absolute
        opacity: 0
        cursor: pointer

    /* Create a custom radio button */
    .radio
        position: absolute
        top: 0
        left: 0
        height: 25px
        width: 25px
        background-color: darken(#eee, 10%)
        border-radius: 50%

    /* On mouse-over, add a grey background color */
    .radio-container:hover input ~ .radio
        background-color: #ccc

    /* When the radio button is checked, add a blue background */
    .radio-container input:checked ~ .radio
        background-color: $primary

    /* Create the indicator (the dot/circle - hidden when not checked) */
    .radio:after
        content: ""
        position: absolute
        display: none

    /* Show the indicator (dot/circle) when checked */
    .radio-container input:checked ~ .radio:after
        display: block

    /* Style the indicator (dot/circle) */
    .radio-container .radio:after
        top: 9px
        left: 9px
        width: 8px
        height: 8px
        border-radius: 50%
        background: white
</style>