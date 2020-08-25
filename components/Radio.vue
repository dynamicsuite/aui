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
    <label class="aui radio">
        <slot></slot>
        <input type="radio" :name="group" :value="data" @change="$emit('input', $event.target.value)">
        <span class="bubble"></span>
    </label>
</template>

<script>
    export default {
        props: {
            // HTML name attribute to group the radio to
            group: {
                type: String,
                required: true
            },
            // HTML value attribute binding
            data: {
                type: String | Number | Boolean
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Checkbox styling */
.aui.radio
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

    /* The actual input styling */
    input
        position: absolute
        opacity: 0
        cursor: pointer

        /* When the radio button is checked, add a blue background */
        &:checked ~ .bubble
            background-color: $primary

        /* Show the indicator (dot/circle) when checked */
        &:checked ~ .bubble:after
            display: block

    /* Create a custom radio bubble */
    .bubble
        position: absolute
        top: 0
        left: 0
        height: 25px
        width: 25px
        background-color: darken(#eee, 10%)
        border-radius: 50%

        /* Create the indicator (the dot/circle - hidden when not checked) */
        &:after
            content: ""
            position: absolute
            display: none
            top: 9px
            left: 9px
            width: 8px
            height: 8px
            border-radius: 50%
            background: white

    /* On mouse-over, add a grey background color */
    &:hover input ~ .radio
        background-color: #ccc

</style>