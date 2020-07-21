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
    <div class="aui table-container">
        <div class="input-aligner" :class="search_align">
            <aui-input v-if="search" id="table-search" v-model="search_term" :value="search_term" placeholder="Search..."></aui-input>
        </div>
        <table class="table">
            <thead>
            <tr v-if="headers">
                <th v-for="header in headers">
                    {{header}}
                </th>
            </tr>
            <tr v-else>
                <th v-for="(value, key) in current_data[0].values" v-if="subsetAllowed(key)">
                    {{key}}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="element in current_data" v-if="element.action" @click="element.action">
                <td v-for="(value, key) in element.values" v-if="subsetAllowed(key)">
                    {{value}}
                </td>
            </tr>
            <tr v-for="element in current_data" v-if="!element.action">
                <td v-for="(value, key) in element.values" v-if="subsetAllowed(key)">
                    {{value}}
                </td>
            </tr>
            </tbody>
        </table>
        <div class="no-data" if="current_data.length === 0">No Data</div>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: Array,
                required: true
            },
            subset: {
                type: Array,
                default: null
            },
            headers: {
                type: Array
            },
            search: {
                type: Boolean
            },
            search_value: {
                type: String
            },
            search_align: {
                type: String,
                default: 'right',
                validator: prop => {
                    if (prop === 'left' || prop === 'right') return true;
                    else {
                        console.log('AUI-TOGGLE: Label location can only be left, right, top, or bottom.');
                        return false;
                    }
                }
            }
        },
        data: function() {
            return {
                current_data: this.data,
                search_term: this.search_value
            }
        },
        watch: {
            search_term() {
                let term = this.search_term.toLowerCase();

                this.current_data = this.data.filter((element) => {

                    let found = false;

                    element.forEach((value) => {

                        let val = value.toString().toLowerCase();

                        if (val.includes(term)) {
                            found = true;
                        }

                    });

                    return found;
                });

                if (term === '') this.current_data = this.data;
            }
        },
        methods: {
            subsetAllowed(key) {
                if (this.subset === null) {
                    return true;
                } else {
                    return this.subset.includes(key);
                }
            }
        }
    }
</script>

<style lang="sass">

    @import "../../../client/css/colors"
    @import "../client/css/core"

    // Table theming
    .aui.table-container
        @include som-container
        display: flex
        flex-direction: column

        .input-aligner
            align-self: flex-start
            display: flex

            &.right
                margin-left: auto

            &.left
                margin-right: auto

        .input-container
            align-self: flex-start

        .no-data
            text-align: center
            margin: .5rem 0 0 0
            background-color: rgba(255,255,255,.6)
            padding: .5rem 0

        .table
            border-collapse: collapse
            width: 100%

            td, th
                text-align: left
                padding: .5rem 1rem

            tbody tr:nth-child(odd)
                background-color: rgba(255,255,255,.6)

            &.interactive
                tbody tr
                    cursor: pointer

                    &:hover
                        background-color: lighten($primary, 55%)

</style>