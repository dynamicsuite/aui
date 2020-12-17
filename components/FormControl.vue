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
    <div class="aui form-control" :class="container_classes">

        <!-- Standard form control -->
        <label v-if="can_have_caps" class="standard-container">

            <!-- The label text -->
            <span v-if="label" class="label" v-html="label" />

            <!-- Components that can have leading/trailing caps -->
            <span class="cap-container">

                <!-- Leading cap -->
                <span v-if="leading_cap" class="leading-cap" v-html="leading_cap" />

                <!-- Trailing cap -->
                <span v-if="trailing_cap" class="trailing-cap" v-html="trailing_cap" />

                <!-- Parent content -->
                <slot />

            </span>

        </label>

        <!-- Pseudo form control -->
        <label v-if="has_pseudo" class="pseudo-container">

            <!-- Parent content -->
            <slot />

            <!-- The pseudo element -->
            <span v-if="has_pseudo" class="pseudo" />

            <!-- The label text -->
            <span v-if="label" class="label" v-html="label" />

        </label>

        <!-- WYSIWYG form control -->
        <label v-if="is_wysiwyg && label" class="label" v-html="label" />
        <slot v-if="is_wysiwyg" />

        <!-- Input subtext -->
        <span v-if="subtext_value" class="subtext">{{subtext_value}}</span>

    </div>
</template>

<script>
export default {
    props: {

        /**
         * Parent type of the form control component.
         */
        parent: {
            type: String,
            required: true,
            validator(value) {
                return ['checkbox', 'input', 'radio', 'select', 'textarea', 'toggle', 'wysiwyg'].indexOf(value) !== -1;
            }
        },

        /**
         * Label text to display above the form control input.
         */
        label: {
            type: String | null,
            required: false,
            default: null
        },

        /**
         * Content to display in the leading form control input cap.
         *
         * Free-form HTML.
         */
        leading_cap: {
            type: String | null,
            default: null
        },

        /**
         * Content to display in the trailing form control input cap.
         *
         * Free-form HTML.
         */
        trailing_cap: {
            type: String | null,
            default: null
        },

        /**
         * Success subtext to display under the form control input.
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
         * Failure subtext to display under the form control input.
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
         * Subtext to display under the form control input.
         *
         * Subtext values override each other in the following order, only one may be present at a time:
         *
         * success > failure > subtext
         */
        subtext: {
            type: String | null,
            default: null
        },

        /**
         * If no icon should trail the form control input on feedback, for use in short length form control inputs.
         */
        no_feedback_icon: {
            type: Boolean,
            default: false
        }

    },
    computed: {

        /**
         * Some parent components rely on a pseudo element.
         *
         * @returns {boolean}
         */
        has_pseudo() {
            return this.parent === 'checkbox' || this.parent === 'radio' || this.parent === 'toggle';
        },

        /**
         * If the form control component type can have leading/trailing caps.
         *
         * @returns {boolean}
         */
        can_have_caps() {
            return this.parent === 'input' || this.parent === 'select' || this.parent === 'textarea';
        },

        /**
         * If the form control is a container for a "what you see is what you get" editor.
         *
         * @returns {boolean}
         */
        is_wysiwyg() {
            return this.parent === 'wysiwyg';
        },

        /**
         * Class states for the form control component.
         *
         * @returns {object}
         */
        container_classes() {
            return {
                [this.parent]: true,
                'success': !!this.success,
                'failure': !!this.failure,
                'no-feedback-icon': this.no_feedback_icon
            };
        },

        /**
         * The value of the subtext text.
         *
         * @returns {string}
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
         * Watch the failure state and scroll the view to the highest failed form control component.
         */
        failure() {
            const scroll_callback = () => {
                let view = document.getElementById('ds-view');
                if (!view) {
                    view = document.body;
                }
                const el = document.querySelectorAll('.aui.form-control.failure')[0]
                if (el) {
                    const box = el.getBoundingClientRect();
                    view.scrollBy({
                        top: box.top - box.height - 100,
                        behavior: 'smooth'
                    });
                }
            }
            clearTimeout(window.aui_form_control_failure_timeout);
            window.aui_form_control_failure_timeout = setTimeout(scroll_callback, 99);
        }

    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/*
 * Feedback styling.
 * Requires a color ($type) and a feedback icon SVG string ($feedback-icon).
 */
@mixin feedback($type, $feedback-icon)

    /* Background icon when not blocked */
    &:not(.no-feedback-icon) input, &:not(.no-feedback-icon) select
        background-image: url($feedback-icon)

    /* Pseudo element feedback */
    .pseudo-container

        /* Unchecked background */
        &:hover input:not(:checked) ~ .pseudo
            background: lighten($type, 20%)

        /* Checked background */
        input:checked ~ .pseudo
            background: $type

        /* Checked background */
        input:not(:checked) ~ .pseudo
            background: lighten($type, 30%)

    /* Border inputs */
    input, select, textarea, .pell-actionbar, .pell-content
        border: 1px solid $type !important

    /* Leading cap overrides */
    .leading-cap
        border-left: 1px solid $type !important
        border-top: 1px solid $type !important
        border-bottom: 1px solid $type !important

    /* Trailing cap overrides */
    .trailing-cap
        border-right: 1px solid $type !important
        border-top: 1px solid $type !important
        border-bottom: 1px solid $type !important

    /* Set subtext color */
    .subtext
        color: $type

/* Form control container */
.aui.form-control
    display: flex
    flex-direction: column

    /* Add margin to the label text if present */
    &.input, &.select, &.textarea, &.wysiwyg
        .label
            margin-bottom: 0.25rem

    /* Standard form control */
    .standard-container
        display: flex
        flex-direction: column
        margin-bottom: 0

        /* Form control components that can have caps */
        .cap-container
            display: grid
            grid-template-columns: auto 1fr auto
            grid-auto-flow: dense

            /* Form control input caps */
            .leading-cap, .trailing-cap
                display: flex
                justify-content: center
                align-items: center
                font-size: 0.9rem
                padding: 0.5rem
                color: #495057
                background: #e9ecef
                border: 1px solid #ced4da
                white-space: nowrap

            /* Leading form control input cap */
            .leading-cap
                grid-column: 1
                justify-self: flex-start
                border-radius: 0.25rem 0 0 0.25rem
                margin-right: -2px

                /* Clear border radius against inputs */
                & ~ input, & ~ select, & ~ textarea
                    border-top-left-radius: 0
                    border-bottom-left-radius: 0
                    padding-left: calc(0.5rem + 1px)

            /* Trailing form control input cap */
            .trailing-cap
                grid-column: 3
                justify-self: flex-end
                border-radius: 0 0.25rem 0.25rem 0
                margin-left: -2px

                /* Clear border radius against inputs */
                & ~ input, & ~ select, & ~ textarea
                    border-top-right-radius: 0
                    border-bottom-right-radius: 0
                    padding-right: calc(0.5rem + 1px)

            /* The actual form control inputs */
            input, select, textarea
                grid-column: 2
                display: flex
                flex: 1
                font-size: 1rem
                padding: 0.5rem
                border-radius: 0.25rem
                border: 1px solid #ced4da
                width: 100%
                -webkit-box-sizing: border-box
                -moz-box-sizing: border-box
                -webkit-appearance: none
                -moz-appearance: none
                box-sizing: border-box
                background: #fff
                margin: 0
                text-overflow: ellipsis

                /* Clear chrome outline */
                &:focus
                    outline: none
                    box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.8)

                /* Darken background when disabled */
                &:disabled
                    cursor: not-allowed
                    background: darken(#e9ecef, 15%)

    /* Form control components that use a pseudo element */
    .pseudo-container
        display: flex
        flex-direction: row
        position: relative
        align-items: center
        cursor: pointer
        user-select: none

        /* Darken on hover */
        &:hover .pseudo
            background: darken(#eee, 20%)

        /* Checkmark/circle */
        & > .pseudo:after
            content: ""
            position: absolute
            display: none

        /* Pseudo element overrides */
        & > input:checked ~ .pseudo:after
            display: flex

        /* Input overrides */
        input
            position: absolute
            opacity: 0
            cursor: pointer
            height: 0
            width: 0

            /* Disabled overrides */
            &:disabled ~ .pseudo, &:disabled ~ .label
                cursor: not-allowed

            /* Disabled overrides */
            &:disabled ~ .pseudo
                background: darken(#e9ecef, 20%)

            /* Background when checked and not disabled */
            &:checked:not(:disabled) ~ .pseudo
                background: $primary

            /* Background when checked and disabled */
            &:checked:disabled ~ .pseudo
                background: $secondary

        /* Checkmark styling */
        .pseudo
            height: 1.5rem
            width: 1.5rem
            margin-right: 0.5rem
            background: darken(#eee, 10%)

    /* Subtext styling */
    .subtext
        font-size: 0.8rem
        margin-top: 0.25rem
        color: #6c757d
        text-align: left

    /* Background icon when not blocked */
    &.success:not(.no-feedback-icon) input,
    &.success:not(.no-feedback-icon) select,
    &.failure:not(.no-feedback-icon) input,
    &.failure:not(.no-feedback-icon) select
        padding-right: 2.5rem
        background-repeat: no-repeat
        background-position: right 0.5rem center
        background-size: 1.5rem

    /* Success feedback overrides */
    &.success
        @include feedback($success, "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")

    /* Failure feedback overrides */
    &.failure
        @include feedback($failure, "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")

</style>