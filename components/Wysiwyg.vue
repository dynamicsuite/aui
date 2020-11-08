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
    <div class="aui wysiwyg">
        <label>{{label}}</label>
        <div ref="editor" :class="editor_classes"></div>
        <div v-if="subtext_value" :class="subtext_classes">{{subtext_value}}</div>
    </div>
</template>

<script>
export default {
    props: {

        /**
         * Editor value.
         */
        value: {
            type: String
        },

        /**
         * Editor form label.
         */
        label: {
            type: String
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
         * Success feedback state.
         */
        success: {
            type: String | Boolean,
            default: false
        },

        /**
         * Failure feedback state.
         */
        failure: {
            type: String | Boolean,
            default: false
        },

        /**
         * Editor subtext
         */
        subtext: {
            type: String
        }

    },
    data() {
        return {
            editor: null
        }
    },
    computed: {

        /**
         * Style classes for the editor.
         */
        editor_classes() {
            return {
                'border-success': this.success,
                'border-failure': this.failure
            }
        },

        /**
         * Style classes for the subtext.
         */
        subtext_classes() {
            return {
                'subtext': true,
                'text-success': this.success,
                'text-failure': this.failure
            }
        },

        /**
         * Value of the subtext text.
         */
        subtext_value() {
            if (typeof this.success === 'string') {
                return this.success;
            } else if (typeof this.failure === 'string') {
                return this.failure;
            } else {
                return this.subtext;
            }
        }

    },
    watch: {

        /**
         * Update the value on model changes.
         *
         * @param value
         */
        value: function (value) {
            if (this.editor.content.innerHTML !== value) {
                this.editor.content.innerHTML = value;
            }
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
        this.editor.content.innerHTML = this.value;
    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

// Input container
.aui.wysiwyg
    margin: 1rem 0

    /* Editor label */
    label
        display: block
        margin-bottom: 0.5rem

    /* Editor subtext */
    .subtext
        font-size: 0.8rem
        margin-top: 0.25rem
        color: #6c757d
        text-align: left

        /* Success feedback */
        &.text-success
            color: $success

        /* Failure feedback */
        &.text-failure
            color: $failure

    /* Success feedback */
    & > .border-success
        .pell-actionbar, .pell-content
            border: 1px solid $success
        .pell-actionbar
            border-bottom: none

    /* Failure feedback */
    & > .border-failure
        .pell-actionbar, .pell-content
            border: 1px solid $failure
        .pell-actionbar
            border-bottom: none

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

        /* Editor focus */
        &:focus
            outline: none
            box-shadow: 0 2px 5px 0 #ccc inset

        /* Resets */
        p
            margin: 0
            padding: 0

</style>