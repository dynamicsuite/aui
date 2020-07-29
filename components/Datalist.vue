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
    <div :id="id + '-container'" class="aui datalist">
        <label>
            {{label}}
            <input
                :id="id"
                :class="input_classes"
                :name="name"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :value="value"
                :list="id + '-datalist'"
                @keydown="$emit('keydown')"
                @focus="$emit('focus')"
                @blur="$emit('blur')"
                @input="$emit('input', $event.target.value)"
            >
            <datalist :id="id + '-datalist'">
                <option v-for="option in options" :value="option"></option>
            </datalist>
        </label>
        <div v-if="subtext_value" class="subtext" :class="subtext_classes">{{subtext_value}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            // Unique HTML ID for the datalist
            id: {
                type: String,
                required: true
            },
            // Label to display before the datalist
            label: {
                type: String
            },
            // Datalist HTML input name
            name: {
                type: String
            },
            // Datalist input type
            type: {
                type: String,
                default: 'text',
                validator(value) {
                    return ['text', 'number'].indexOf(value) !== -1;
                }
            },
            // Placeholder text for input
            placeholder: {
                type: String
            },
            // If the input id disabled
            disabled: {
                type: Boolean,
                default: false
            },
            // Initial value of the input
            value: {
                type: String | Number| Boolean
            },
            // List options for the datalist
            options: {
                type: Array | Object,
                default: []
            },
            // Success feedback state
            success: {
                type: String | Boolean,
                default: false
            },
            // Failure feedback state
            failure: {
                type: String | Boolean,
                default: false
            },
            // Input subtext
            subtext: {
                type: String
            }
        },
        computed: {
            // Style classes for the input
            input_classes() {
                return {
                    'border-success': this.success,
                    'border-failure': this.failure
                }
            },
            // Style classes for the subtext
            subtext_classes() {
                return {
                    'text-success': this.success,
                    'text-failure': this.failure
                }
            },
            // Value of the subtext text
            subtext_value() {
                if (this.success) {
                    return this.success;
                } else if (this.failure) {
                    return this.failure;
                } else {
                    return this.subtext;
                }
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

// Datalist container
.aui.datalist
    display: flex
    flex-direction: column
    margin-bottom: 1rem

    /* List label */
    label
        display: flex
        flex-direction: column
        margin-bottom: 0
        width: 100%

        /* List input root styling */
        input
            display: flex
            flex: 1
            margin-top: 0.25rem
            font-size: 1rem
            padding: 0.5rem
            border-radius: 0.25rem
            border: 1px solid #ced4da

            /* Clear focus */
            &:focus
                outline: none
                box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.8)

            /* Disabled flag */
            &:disabled
                background: darken(#e9ecef, 15%)

        /* Success styling */
        input.border-success
            padding-right: 2.5rem !important
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")
            background-repeat: no-repeat
            background-position: right 0.5rem center
            background-size: 1.5rem
            border: 1px solid $success

        /* Failure styling */
        input.border-failure
            padding-right: 2.5rem !important
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")
            background-repeat: no-repeat
            background-position: right 0.5rem center
            background-size: 1.5rem
            border: 1px solid $failure

    /* Input subtext */
    .subtext
        font-size: 0.8rem
        margin-top: 0.25rem
        color: #6c757d
        width: 100%

</style>