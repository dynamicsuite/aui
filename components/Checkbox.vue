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
            :checked="checked"
            :disabled="disabled"
            @input="$emit('input', $event.target.checked)"
        />
    </aui-form-control>
</template>

<script>
export default {
    props: {

        /**
         * Checkbox label.
         *
         * This is an alias for the slot content when using plaintext. Slot should be used if custom HTML is
         * required.
         */
        label: {
            type: String | null,
            default: null
        },

        /**
         * The model binding value of the checkbox.
         */
        value: {
            type: String | Number | Boolean | null,
            default: null
        },

        /**
         * If the checkbox is checked by default.
         */
        checked: {
            type: Boolean | Number,
            default: false
        },

        /**
         * If the checkbox is disabled and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * Success subtext to display under the checkbox.
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
         * Failure subtext to display under the checkbox.
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
         * Subtext to display under the checkbox.
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
                parent: 'checkbox',
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

/* Checkbox structure */
.aui.checkbox

    /* Pseudo element styling */
    .pseudo:after
        left: 8px
        top: 4px
        width: 5px
        height: 10px
        border: solid white
        border-width: 0 3px 3px 0
        -webkit-transform: rotate(45deg)
        -ms-transform: rotate(45deg)
        transform: rotate(45deg)

    /* Offset subtext */
    .subtext
        margin-left: 2rem

</style>