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
      <div ref="editor" />
  </aui-form-control>
</template>

<script>
export default {
    props: {

        /**
         * WYSIWYG label.
         *
         * This is an alias for the slot content when using plaintext. Slot should be used if custom HTML is
         * required.
         */
        label: {
          type: String | null,
          default: null
        },

        /**
         * Pell action bar actions.
         */
        actions: {
            type: Array,
            default: () => ['bold', 'italic', 'underline', 'heading1', 'ulist', 'olist']
        },

        /**
         * Default HTML tag separator for paragraphs.
         */
        default_paragraph_separator: {
            type: String,
            default: 'p'
        },

        /**
         * If the content should be styled with CSS vs tags.
         */
        style_with_css: {
            type: Boolean,
            default: true
        },

        /**
         * Custom Pell widget classes.
         */
        classes: {
            type: Object,
            default: () => {
                return {
                    actionbar: 'pell-actionbar',
                    button: 'pell-btn',
                    content: 'pell-content',
                    selected: 'pell-button-selected'
                }
            }
        },

        /**
         * The model binding value of the WYSIWYG.
         */
        value: {
            type: String | Number | Boolean | null,
            default: null
        },

        /**
         * WYSIWYG placeholder text.
         */
        placeholder: {
            type: String | null,
            default: null
        },

        /**
         * If the WYSIWYG is disabled and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * Success subtext to display under the WYSIWYG.
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
         * Failure subtext to display under the WYSIWYG.
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
         * Subtext to display under the WYSIWYG.
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
    data() {
        return {
            editor: null
        };
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
                parent: 'wysiwyg',
                label: this.$slots.default ? this.$slots.default : this.label,
                success: this.success,
                failure: this.failure,
                subtext: this.subtext
            };
        }

    },
    watch: {

        /**
         * Update the value on model changes.
         *
         * @param {string} value - The new value.
         * @returns {undefined}
         */
        value: function (value) {
            if (this.editor.content.innerHTML !== value) {
                this.editor.content.innerHTML = value;
            }
        },

        /**
         * Adjust the disabled state.
         *
         * @param {string} value - The new disabled state.
         * @returns {undefined}
         */
        disabled: function (value) {
            this.$refs.editor
                .querySelector('.pell-content')
                .setAttribute('contenteditable', value ? 'false' : 'true');
        }

    },
    mounted() {
        this.editor = pell.init({
            element: this.$refs.editor,
            actions: this.actions,
            defaultParagraphSeparator: this.default_paragraph_separator,
            styleWithCSS: this.style_with_css,
            classes: this.classes,
            onChange: html => {
                this.$emit('input', html);
            }
        });
        this.$refs.editor
            .querySelector('.pell-content')
            .setAttribute('contenteditable', this.disabled ? 'false' : 'true');
        if (this.value) {
            this.editor.content.innerHTML = this.value;
        }
    }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* WYSIWYG structure */
.aui.wysiwyg

    /* Success feedback */
    &.success .pell-actionbar, &.failure .pell-actionbar
        border-bottom: none !important

    /* Editor action bar area */
    .pell-actionbar
        display: flex
        background: #f9f9f9
        border-top-left-radius: 0.25rem
        border-top-right-radius: 0.25rem
        border: 1px solid #ced4da

        /* Action bar buttons */
        .pell-btn
            display: flex
            justify-content: center
            align-content: center
            font-size: 1.2rem
            height: 2.5rem
            line-height: 2.5rem
            width: 2.5rem
            background: none
            border: none
            outline: none

            /* Selection overrides */
            &:hover, &.pell-button-selected
                cursor: pointer
                background: darken(#f9f9f9, 10%)

    /* Editor content */
    .pell-content
        padding: 0.75rem
        min-height: 4rem
        border-left: 1px solid #ced4da
        border-right: 1px solid #ced4da
        border-bottom: 1px solid #ced4da
        border-radius: 0 0 0.25rem 0.25rem
        background: white
        overflow-y: scroll

        /* Disabled editor */
        &[contenteditable="false"]
            cursor: not-allowed !important
            background: darken(#e9ecef, 15%) !important

        /* Editor focus */
        &:focus
            outline: none
            box-shadow: 0 2px 5px 0 #ccc inset

        /* Resets */
        p
            margin: 0
            padding: 0

</style>