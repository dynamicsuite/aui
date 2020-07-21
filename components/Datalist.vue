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
    <div :id="id + '-container'" class="aui datalist-container">
        <label :for="id" v-if="title">{{title}}</label>
        <input
            :id="id"
            :name="name"
            :type="type"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :value="value"
            :class="classes + classFailure() + classSuccess()"
            :list="id + '-datalist'"
            :failure="failure"
            :success="success"
            @keydown="$emit('keydown')"
            @focus="$emit('focus')"
            @blur="$emit('blur')"
            @input="$emit('input', $event.target.value)"
        >
        <div class="aui subtext" :class="subtextColorClass()" v-if="subtext">{{subtext}}</div>

        <datalist :id="id + '-datalist'">
            <option v-for="option in current_options">{{option}}</option>
        </datalist>
    </div>
</template>

<script>
    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            options: {
                type: Array | Object,
                required: true
            },
            validate: {
                type: Boolean,
                default: true
            },
            title: {
                type: String
            },
            classes: {
                type: String,
                default: ''
            },
            name: {
                type: String
            },
            type: {
                type: String,
                default: 'text'
            },
            placeholder: {
                type: String
            },
            disabled: {
                type: Boolean
            },
            readonly: {
                type: Boolean
            },
            success: {
                default: false
            },
            failure: {
                default: false
            },
            subtext: {
                type: String
            },
            value: {
                type: String | Number
            }
        },
        data: function() {
            return {
                show_menu: false,
                current_options: this.options,
                search_term: ''
            }
        },
        watch: {
            search_term() {
                this.searchAndUpdate()
            },
            options() {
                this.searchAndUpdate()
            }
        },
        methods: {
            searchAndUpdate() {
                let term = this.search_term.toLowerCase();

                if (Array.isArray(this.options)) {
                    this.current_options = this.options.filter((element) => {

                        let val = element.toString().toLowerCase();

                        if (val.includes(term)) {
                            return true;
                        }

                    });

                    if (term === '') this.current_options = this.options;

                } else {
                    this.current_options = Object.keys(this.options)
                        .filter((element) => {
                            let val = this.options[element].toString().toLowerCase();

                            if (val.includes(term)) {
                                return true;
                            }
                        })
                        .reduce((obj, key) => {
                            obj[key] = this.options[key];
                            return obj;
                        }, {})
                    ;

                    if (term === '') this.current_options = this.options;
                }

                if (Object.keys(this.current_options).length === 0) this.current_options = ['No options available'];

            },
            classSuccess() {
                return (this.success) ? ' border-success' : '' ;
            },
            classFailure() {
                return (this.failure) ? ' border-failure' : '' ;
            },
            subtextColorClass() {
                if (this.success) return 'text-success';
                if (this.failure) return 'text-failure';
                return '';
            }
        }
    }
</script>

<style lang="sass">

    @import "../../../client/css/colors"

    // Datalist styling
    .aui.datalist-container
        display: flex
        flex-direction: column

        label
            margin-bottom: .5rem
            width: 100%

        input
            font-size: 1rem
            padding: .5rem
            border-radius: 0.25rem
            border: 1px solid #ced4da

            &:focus
                outline: none
                box-shadow: 0 0 0 1px rgba(0, 123, 255, .8)

            &:disabled
                background: darken(#e9ecef, 15%)

        input.border-success
            padding-right: 2.5rem !important
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")
            background-repeat: no-repeat
            background-position: right .5rem center
            background-size: 1.5rem
            border: 1px solid $success

        input.border-failure
            padding-right: 2.5rem !important
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")
            background-repeat: no-repeat
            background-position: right .5rem center
            background-size: 1.5rem
            border: 1px solid $failure

        .subtext
            font-size: .8rem
            margin-top: .25rem
            color: #6c757d
            width: 100%

</style>