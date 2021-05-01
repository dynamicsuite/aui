<!--
This file is part of the Dynamic Suite AUI package.

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.

@package DynamicSuite\AUI
@author Grant Martin <commgdog@gmail.com>
@author Michael Ryan <hatduck@gmail.com>
@copyright 2021 Dynamic Suite Team
-->

<template>
    <aui-form-control v-bind="properties">
        <!-- Regular slider -->
        <input
            type="range"
            :min="min"
            :max="max"
            ref="input"
            :value="value"
            :tabindex="tabindex"
            :disabled="disabled"
            @focus="$emit('focus', $event.target)"
            @blur="$emit('blur', $event.target)"
            @change="$emit('change', $event.target.value)"
            @input="$emit('input', $event.target.value)"
            @keydown="$emit('keydown', $event)"
        >
    </aui-form-control>
</template>

<script>
// noinspection JSValidateTypes
export default {
    props: {

        /**
         * Minimum value
         */
        min: {
            type: Number,
            required: true
        },

        /**
         * Maximum value
         */
        max: {
            type: Number,
            required: true
        },

        /**
         * String to prefix values with
         */
        prefix: {
            type: String | null,
            default: null
        },

        /**
         * Input label.
         *
         * This is an alias for the slot content when using plaintext. Slot should be used if custom HTML is
         * required.
         */
        label: {
            type: String | null,
            default: null
        },

        /**
         * The model binding value of the input.
         */
        value: {
            type: Number | null,
            default: null
        },

        /**
         * If the input is disabled and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * Input tab index.
         */
        tabindex: {
            type: String | Number | null,
            default: null
        },

        /**
         * Success subtext to display under the input.
         *
         * Subtext values override each other in the following order, only one may be present at a time:
         *
         * success > failure > subtext
         */
        success: {
            type: String | null,
            default: null
        },

        /**
         * Failure subtext to display under the input.
         *
         * Subtext values override each other in the following order, only one may be present at a time:
         *
         * success > failure > subtext
         */
        failure: {
            type: String | null,
            default: null
        },

        /**
         * Subtext to display under the input.
         *
         * Subtext values override each other in the following order, only one may be present at a time:
         *
         * success > failure > subtext
         */
        subtext: {
            type: String | null,
            default: null
        }

    },
    computed: {

        /**
         * Properties to pass down to the form control component.
         *
         * @returns {
         *     {parent: string},
         *     {label: string},
         *     {success: string},
         *     {failure: string},
         *     {subtext: string}
         * }
         */
        properties() {
            return {
                parent: 'slider',
                label: this.$slots.default ? this.$slots.default : this.label,
                success: this.success,
                failure: this.failure,
                subtext: this.subtext
            };
        }
    }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

@mixin slider-theme
    -webkit-appearance: none
    appearance: none
    width: 18px
    height: 18px
    border-radius: 50%
    background: $color-primary
    cursor: pointer


.aui.slider

    input
        -webkit-appearance: none
        appearance: none
        width: 100%
        height: 8px
        background: #d3d3d3
        outline: none

        &::-webkit-slider-thumb
            @include slider-theme

        &::-moz-range-thumb
            @include slider-theme

        &::-moz-range-progress
            background: lighten($color-primary, 10%)
            height: 8px

</style>