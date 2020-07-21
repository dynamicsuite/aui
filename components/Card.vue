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
    <div class="aui card" :class="'card-' + type">
        <h1>{{header}}</h1>
        <div class="body">
            <h2 v-if="title">{{title}}</h2>
            <p class="card-text">
                <slot></slot>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['neutral', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
                }
            },
            header: {
                type: String,
                required: true
            },
            title: {
                type: String
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

// Card styling
.aui.card
    margin: 1rem 0

    /* Card header text area */
    h1
        font-size: 1.125rem
        padding: 1rem
        border-radius: 0.25rem 0.25rem 0 0
        margin: 0

    /* Card body area */
    .body
        padding: 1rem
        border-radius: 0 0 0.25rem 0.25rem
        border-left: 1px solid #ced4da
        border-bottom: 1px solid #ced4da
        border-right: 1px solid #ced4da

        h2
            font-size: 1rem

        p
            margin-bottom: 0

    /* Neutral card style */
    &.card-neutral
        h1
            background: lighten(#ced4da, 10%)
            border: 1px solid darken(#ced4da, 10%)
        .body
            background: white

    /* Primary card style */
    &.card-primary
        h1
            color: white
            background: $primary
            border-bottom: 1px solid darken($primary, 10%)
        .body
            background: white

    /* Secondary card style */
    &.card-secondary
        h1
            color: white
            background: $secondary
            border-bottom: 1px solid darken($secondary, 10%)
        .body
            background: white

    /* Success card style */
    &.card-success
        h1
            color: white
            background: $success
            border-bottom: 1px solid darken($success, 10%)
        .body
            background: white

    /* Warning card style */
    &.card-warning
        h1
            background: $warning
            border-bottom: 1px solid darken($warning, 10%)
        .body
            background: white

    /* Failure card style */
    &.card-failure
        h1
            color: white
            background: $failure
            border-bottom: 1px solid darken($failure, 10%)
        .body
            background: white

</style>