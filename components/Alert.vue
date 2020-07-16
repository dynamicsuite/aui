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
    <div class="aui alert" v-if="visible">
        <span class="title-bar" v-if="title" >
            <h4 class="alert-title">{{title}}</h4>
            <i class="fa fa-times" v-if="close" @click="$emit('click')"></i>
        </span>
        <p v-if="title">
            <slot></slot>
        </p>
        <p v-else>
            <slot></slot>
            <i class="fa fa-times" v-if="close" @click="$emit('click')"></i>
        </p>
    </div>
</template>

<script>
    export default {
        props: {
            visible: {
                type: Boolean,
                default: true
            },
            title: {
                type: String
            },
            close: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['primary', 'secondary', 'warning', 'failure', 'success'].indexOf(value) !== -1;
                }
            }
        }
    }
</script>

<style lang="sass">

@import "../../../client/css/colors"
.aui

    &.alert
        padding: 1rem
        border-radius: .25rem
        margin: 1rem 0

        i
            padding: 0
            cursor: pointer
            margin-left: auto

        p
            margin: 0
            display: flex
            justify-content: center
            align-items: center

        h4
            margin: 0 0 1rem 0

        .title-bar
            display: flex
            justify-content: center

            .alert-title
                font-size: 1.5rem

    /* Primary alert theme */
    &.alert-primary
        background: lighten($primary, 55%)
        color: $primary
        border: 1px solid lighten($primary, 45%)

    /* Secondary alert theme */
    &.alert-secondary
        background: lighten($secondary, 55%)
        color: $secondary
        border: 1px solid lighten($secondary, 45%)

    /* Warning alert theme */
    &.alert-warning
        background: lighten($warning, 35%)
        color: darken($warning, 25%)
        border: 1px solid lighten($warning, 30%)

    /* Failure alert theme */
    &.alert-failure
        background: lighten($failure, 35%)
        color: darken($failure, 15%)
        border: 1px solid lighten($failure, 30%)

    /* Success alert theme */
    &.alert-success
        background: lighten($success, 50%)
        color: darken($success, 15%)
        border: 1px solid lighten($success, 40%)

</style>