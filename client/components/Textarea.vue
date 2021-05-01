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
        <textarea
            :value="value"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :disabled="disabled"
            :rows="rows"
            @focus="$emit('focus', $event.target)"
            @blur="$emit('blur', $event.target)"
            @input="$emit('input', $event.target.value)"
            @keydown="$emit('keydown', $event)"
        />
    </aui-form-control>
</template>

<script>
// noinspection JSValidateTypes
export default {
    props: {

        /**
         * Textarea label.
         *
         * This is an alias for the slot content when using plaintext. Slot should be used if custom HTML is
         * required.
         */
        label: {
            type: String | null,
            default: null
        },

        /**
         * Content to display in the leading textarea cap.
         *
         * Free-form HTML.
         */
        leading_cap: {
            type: String | null,
            default: null
        },

        /**
         * Content to display in the trailing textarea cap.
         *
         * Free-form HTML.
         */
        trailing_cap: {
            type: String | null,
            default: null
        },

        /**
         * The model binding value of the textarea.
         */
        value: {
            type: String | Number | Boolean | null,
            default: null
        },

        /**
         * Textarea autocomplete value.
         */
        autocomplete: {
            type: String | null,
            default: null
        },

        /**
         * Textarea placeholder text.
         */
        placeholder: {
            type: String | null,
            default: null
        },

        /**
         * If the textarea is disabled and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * The rows (height) of the textarea.
         */
        rows: {
            type: String | Number | null,
            default: null
        },

        /**
         * Success subtext to display under the textarea.
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
         * Failure subtext to display under the textarea.
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
         * Subtext to display under the textarea.
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
         *     {leading_cap: string},
         *     {trailing_cap: string},
         *     {success: string},
         *     {failure: string},
         *     {subtext: string},
         *     {no_feedback_icon: boolean}
         * }
         */
        properties() {
            return {
                parent: 'textarea',
                label: this.$slots.default ? this.$slots.default : this.label,
                leading_cap: this.leading_cap,
                trailing_cap: this.trailing_cap,
                success: this.success,
                failure: this.failure,
                subtext: this.subtext,
                no_feedback_icon: !!this.no_feedback_icon
            };
        }

    }
}
</script>

<style lang="sass">

/* Textarea structure */
.aui.textarea

    /* Only allow vertical textarea resize */
    textarea
        resize: vertical
        min-height: calc(2rem + 2px)

        /* Do not allow resize when disabled */
        &:disabled
            resize: none

</style>