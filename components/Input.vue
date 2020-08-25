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
    <div :id="container_id" class="aui input">
        <label>
            <span class="label-text" v-if="label">
                {{label}}
            </span>
            <span class="input-parent">
                <span v-if="leading_cap" class="leading-cap" :class="input_classes" v-html="leading_cap"></span>
                <input
                    :id="id"
                    :class="input_classes"
                    :name="name"
                    :type="type"
                    :placeholder="placeholder"
                    :tabindex="tabindex"
                    :disabled="disabled"
                    :value="value"
                    :step="step"
                    :min="min"
                    :max="max"
                    :autocomplete="autocomplete"
                    ref="input"
                    @keydown="$emit('keydown', $event)"
                    @change="$emit('change', $event.target)"
                    @select="$emit('select', $event.target)"
                    @focus="$emit('focus', $event.target)"
                    @blur="$emit('blur', $event.target)"
                    @input="$emit('input', $event.target.value)"
                />
                <span v-if="trailing_cap" class="trailing-cap" :class="input_classes" v-html="trailing_cap"></span>
            </span>
        </label>
        <div v-if="subtext_value" class="subtext" :class="subtext_classes">{{subtext_value}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            // Unique HTML ID for the input and container
            id: {
                type: String
            },
            // Label to display before the input
            label: {
                type: String
            },
            // Leading cap content, if any
            leading_cap: {
                type: String
            },
            // Trailing cap content, if any
            trailing_cap: {
                type: String
            },
            // Input HTML name
            name: {
                type: String
            },
            // Input HTML type
            type: {
                type: String,
                default: 'text',
                validator(value) {
                    return ['color',
                        'date',
                        'datetime-local',
                        'email',
                        'file',
                        'number',
                        'password',
                        'range',
                        'search',
                        'tel',
                        'text',
                        'time',
                        'url',
                        'week'
                    ].indexOf(value) !== -1;
                }
            },
            // Placeholder text for input
            placeholder: {
                type: String
            },
            // HTML tab index for the input
            tabindex: {
                type: String | Number
            },
            // If the input id disabled
            disabled: {
                type: Boolean,
                default: false
            },
            // Initial value of the input
            value: {
                type: String | Number | Boolean
            },
            // Numeric input step factor
            step: {
                type: String | Number
            },
            // Numeric input minimum value
            min: {
                type: String | Number
            },
            // Numeric input maximum value
            max: {
                type: String | Number
            },
            // HTML autocomplete value
            autocomplete: {
                type: String,
                default: 'on',
                validator(value) {
                    return ['on', 'off'].indexOf(value) !== -1;
                }
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
            },
            // If no icon should trail the input on feedback, for use in short length inputs
            no_feedback_icon: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            // Style classes for the input
            input_classes() {
                return {
                    'border-success': this.success,
                    'border-failure': this.failure,
                    'no-feedback-icon': this.no_feedback_icon
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
                if (typeof this.success === 'string') {
                    return this.success;
                } else if (typeof this.failure === 'string') {
                    return this.failure;
                } else {
                    return this.subtext;
                }
            },
            // Value of the container ID
            container_id() {
                return this.id ? this.id + '-container' : '';
            }
        },
        methods: {
            // Force focus
            focus() {
                this.$refs.input.focus();
            },
            // Force select
            select() {
                this.$refs.input.select();
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

// Input container
.aui.input
    display: flex
    flex-direction: column

    /* Input label */
    label
        display: flex
        flex-direction: column
        margin-bottom: 0
        width: 100%

        /* Input group separators */
        span
            display: flex

        .label-text
            margin-bottom: .25rem

        /* Leading and trailing input group caps (if any) */
        .leading-cap, .trailing-cap
            display: flex
            justify-content: center
            align-items: center
            font-size: 0.9rem
            padding: 0.45rem 0.5rem
            color: #495057
            background: #e9ecef
            border: 1px solid #ced4da
            white-space: nowrap

        /* Leading input group cap (if present) */
        .leading-cap
            flex: 0
            justify-self: flex-start
            border-radius: 0.25rem 0 0 0.25rem

            /* Success feedback */
            &.border-success
                border: 1px solid $success

            /* Failure feedback*/
            &.border-failure
                border: 1px solid $failure

        /* Trailing input group cap (if present) */
        .trailing-cap
            flex: 0
            justify-self: flex-end
            border-radius: 0 0.25rem 0.25rem 0

            /* Success feedback */
            &.border-success
                border: 1px solid $success

            /* Failure feedback */
            &.border-failure
                border: 1px solid $failure

        /* The input itself */
        input
            display: flex
            flex: 1
            font-size: 1rem
            padding: 0.5rem
            border-radius: 0.25rem
            border: 1px solid #ced4da
            width: 100%

            /* Where the input meets the leading cap (if any) */
            &:not(:first-child)
                border-top-left-radius: 0
                border-bottom-left-radius: 0
                margin-left: -1px
                padding-left: calc(0.5rem + 1px)

            /* Where the input meets the trailing cap (if any) */
            &:not(:last-child)
                border-top-right-radius: 0
                border-bottom-right-radius: 0
                margin-right: -1px
                padding-right: calc(0.5rem + 1px)

            /* Clear focus */
            &:focus
                outline: none
                box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.8)

            /* Disabled flag */
            &:disabled
                background: darken(#e9ecef, 15%)

            /* Success feedback */
            &.border-success
                border: 1px solid $success

                /* The leading input group cap (if any) */
                .leading-cap
                    border-left: 1px solid $success
                    border-top: 1px solid $success
                    border-bottom: 1px solid $success

                /* The trailing input group cap (if any) */
                .trailing-cap
                    border-right: 1px solid $success
                    border-top: 1px solid $success
                    border-bottom: 1px solid $success

                /* Feedback icon if not disabled */
                &:not(.no-feedback-icon)
                    padding-right: 2.5rem !important
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")
                    background-repeat: no-repeat
                    background-position: right .5rem center
                    background-size: 1.5rem

            /* Failure feedback */
            &.border-failure
                border: 1px solid $failure

                /* The leading input group cap (if any) */
                .leading-cap
                    border-left: 1px solid $failure
                    border-top: 1px solid $failure
                    border-bottom: 1px solid $failure

                /* The trailing input group cap (if any) */
                .trailing-cap
                    border-right: 1px solid $failure
                    border-top: 1px solid $failure
                    border-bottom: 1px solid $failure

                /* Feedback icon if not disabled */
                &:not(.no-feedback-icon)
                    padding-right: 2.5rem !important
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")
                    background-repeat: no-repeat
                    background-position: right 0.5rem center
                    background-size: 1.5rem

    /* Input subtext */
    .subtext
        font-size: .8rem
        margin-top: .25rem
        color: #6c757d
        width: 100%
        text-align: left

        &.text-success
            color: $success

        &.text-failure
            color: $failure

</style>