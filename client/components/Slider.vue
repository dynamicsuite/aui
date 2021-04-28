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