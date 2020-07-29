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
    <div class="aui table">
        <table>
            <thead v-if="show_headers">
                <tr>
                    <th v-for="header in columns">{{header}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows">
                    <td v-if="columns[column]" v-for="(value, column) in row">
                        {{value}}
                    </td>
                </tr>
                <tr v-if="no_data">
                    <td class="no-data" :colspan="column_count">No rows in dataset</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        props: {
            // Columns to render on the table
            columns: {
                type: Object,
                required: true
            },
            // If the header of the table should show
            show_headers: {
                type: Boolean,
                default: true
            },
            // Rows to render on the table
            rows: {
                type: Array,
                required: true
            }
        },
        computed: {
            // If there are no rows in the table
            no_data() {
                return this.rows.length === 0;
            },
            // How many columns are in the table
            column_count() {
                return Object.keys(this.columns).length;
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

// Table styling
.aui.table
    margin: 1rem 0

    /* When there are no rows a message is displayed */
    .no-data
        text-align: center
        font-style: italic

    /* Root table styling */
    table
        border-collapse: collapse
        width: 100%
        background: white
        border: 1px solid $primary

        /* Header styling */
        th
            color: white
            background: $primary

        /* Cell styling */
        td, th
            text-align: left
            padding: 0.5rem 1rem

        /* Zebra striping */
        tbody tr:nth-of-type(odd)
            background: whitesmoke

</style>