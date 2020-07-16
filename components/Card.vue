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
    <div class="aui card">
        <div class="card-header">{{header}}</div>
        <div class="card-body">
            <h4>{{title}}</h4>
            <p class="card-text">
                <slot></slot>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
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

<style lang="sass" scoped>

    @import "../../../client/css/colors"

    // Card styling
    .aui.card
        margin: 1rem 0

        h4
            margin: 0

        .card-header
            padding: 1rem
            border-radius: .25rem .25rem 0 0

        .card-body
            padding: 1rem
            border-radius: 0 0 .25rem .25rem
            border-left: 1px solid #ced4da
            border-bottom: 1px solid #ced4da
            border-right: 1px solid #ced4da

    .aui.card-neutral

        .card-header
            background: lighten(#ced4da, 10%)
            border: 1px solid darken(#ced4da, 10%)

        .card-body
            background: white

    .aui.card-primary

        .card-header
            color: white
            background: $primary
            border-bottom: 1px solid darken($primary, 10%)

        .card-body
            background: white

    .aui.card-secondary

        .card-header
            color: white
            background: $secondary
            border-bottom: 1px solid darken($secondary, 10%)

        .card-body
            background: white

    .aui.card-warning

        .card-header
            background: $warning
            border-bottom: 1px solid darken($warning, 10%)

        .card-body
            background: white

    .aui.card-success

        .card-header
            color: white
            background: $success
            border-bottom: 1px solid darken($success, 10%)

        .card-body
            background: white

    .aui.card-failure

        .card-header
            color: white
            background: $failure
            border-bottom: 1px solid darken($failure, 10%)

        .card-body
            background: white

</style>