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