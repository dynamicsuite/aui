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
        <input
            type="checkbox"
            :value="value"
            :checked="toggled"
            :disabled="disabled"
            @input="$emit('input', $event.target.checked)"
        />
    </aui-form-control>
</template>

<script>
export default {
    props: {

        /**
         * Toggle label.
         *
         * This is an alias for the slot content when using plaintext. Slot should be used if custom HTML is
         * required.
         */
        label: {
            type: String | null,
            default: null
        },

        /**
         * The model binding value of the toggle.
         */
        value: {
            type: String | Number | Boolean | null,
            default: null
        },

        /**
         * If the toggle is toggled by default.
         */
        toggled: {
            type: Boolean | Number,
            default: false
        },

        /**
         * If the toggle is disabled and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * Success subtext to display under the toggle.
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
         * Failure subtext to display under the toggle.
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
         * Subtext to display under the toggle.
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
                parent: 'toggle',
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

/* Toggle structure */
.aui.toggle

    /* Pseudo element */
    .pseudo
        width: 56px !important
        height: 28px !important
        cursor: pointer
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: #ccc
        -webkit-transition: 0.4s
        transition: 0.4s
        border-radius: 34px

        /* Slider circle */
        &:before
            position: absolute
            content: ""
            height: 20px
            width: 20px
            left: 4px
            bottom: 4px
            background: white
            -webkit-transition: 0.4s
            transition: 0.4s
            border-radius: 50%

    /* Slider transition */
    input:checked ~ .pseudo:before
        -webkit-transform: translateX(28px)
        -ms-transform: translateX(28px)
        transform: translateX(28px)

    /* Offset subtext */
    .subtext
        margin-left: calc(56px + 0.5rem)

</style>