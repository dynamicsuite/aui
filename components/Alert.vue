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
    <div v-if="visible" class="aui alert" :class="container_class">
        <div>
            <h3 v-if="title">{{title}}</h3>
            <p><slot></slot></p>
        </div>
        <i v-if="closeable" class="fa fa-times close" @click="$emit('close')"></i>
    </div>
</template>

<script>
    export default {
        props: {
            // The alert type, which determines style classes
            type: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['none', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
                }
            },
            // Alert title, optional
            title: {
                type: String,
            },
            // If the alert is currently visible, bindable to the parent instance
            visible: {
                type: Boolean | String,
                default: true
            },
            // If the alert is user-closeable
            closeable: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            // Class for the container
            container_class() {
                return this.type === 'none' ? '' : 'alert-' + this.type;
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Alert container */
.aui.alert
    display: flex
    padding: 1rem
    border-radius: 0.25rem
    margin: 1rem 0

    /* Alert title (if any) */
    h3
        display: flex
        width: 100%

    /* Alert body */
    p
        margin: 0
        flex-grow: 1

    /* Alert close button */
    .close
        outline: none !important
        margin-left: auto
        font-size: 1rem
        cursor: pointer

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

    /* Success alert theme */
    &.alert-success
        background: lighten($success, 50%)
        color: darken($success, 15%)
        border: 1px solid lighten($success, 40%)

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

</style>