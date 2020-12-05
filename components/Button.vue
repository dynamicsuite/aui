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
    <button class="aui btn" :class="style_class" :disabled="is_disabled" @click="$emit('click')">

        <!-- Show loading if the button is delayed -->
        <span v-if="loading">
            <i class="fa fa-spin fa-circle-notch"></i>
            <span v-if="loading_text" class="loading-text">{{loading_text}}</span>
            <slot v-else>{{text}}</slot>
        </span>

        <!-- Show button text  -->
        <slot v-else>{{text}}</slot>

        <!-- Attached badge -->
        <aui-badge v-if="badge" :type="badge" :text="badge_text" />

    </button>
</template>

<script>
export default {
    props: {

        /**
         * The button type.
         *
         * This determines the style class applied.
         */
        type: {
            type: String,
            default: 'primary',
            validator(value) {
                return ['none', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
            }
        },

        /**
         * Button text.
         *
         * This is an alias for the slot content when using plaintext. Slot should be used if custom HTML is
         * required.
         */
        text: {
            type: String | null,
            default: null
        },

        /**
         * If the button is disabled and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * If the button is in its loading state.
         */
        loading: {
            type: Boolean,
            default: false
        },

        /**
         * Text to display on the button when in the loading state (optional).
         */
        loading_text: {
            type: String,
            default: null
        },

        /**
         * The badge type.
         *
         * If this is NULL, no badge will be displayed.
         *
         * This determines the style class applied for the badge.
         */
        badge: {
            type: String,
            default: null,
            validator(value) {
                return [null, 'none', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
            }
        },

        /**
         * Text to display in the attached badge.
         */
        badge_text: {
            type: String,
            default: '!'
        }

    },
    computed: {

        /**
         * Style class for the button.
         *
         * @returns {object}
         */
        style_class() {
            return {
                [`btn-${this.type}`]: this.type !== 'none'
            };
        },

        /**
         * If the button is in a disabled state.
         *
         * @returns {boolean}
         */
        is_disabled() {
            return this.loading || this.disabled;
        }

    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Default button styling */
.aui.btn
    display: inline-flex
    padding: 0.5rem 1rem
    border: 0
    border-radius: 0.25rem
    font-size: 1rem
    line-height: 1rem
    user-select: none
    cursor: pointer
    position: relative

    /* Remove browser focus */
    &:focus
        outline: none !important

    &:disabled
        cursor: not-allowed

    /* Spinner when the button loading */
    .fa.fa-spin
        text-align: center
        margin-right: 0.25rem

    /* Loading text displayed when a button is in the loading state */
    .loading-text
        margin: 0

    /* Attached badge if present */
    .aui.badge
        position: absolute
        display: flex
        justify-content: center
        align-items: center
        min-width: 0.5rem
        top: -0.5rem
        right: -0.7rem
        z-index: 1
        border: 1px solid white

    /* Primary button theme */
    &.btn-primary
        background: $primary
        color: white

        &:hover, &.active
            background: lighten($primary, 10%)

        &:disabled
            background: lighten($primary, 30%)

    /* Secondary button theme */
    &.btn-secondary
        background: $secondary
        color: white

        &:hover, &.active
            background: lighten($secondary, 10%)

        &:disabled
            background: lighten($secondary, 30%)

    /* Success button theme */
    &.btn-success
        background: $success
        color: white

        &:hover, &.active
            background: lighten($success, 10%)

        &:disabled
            background: lighten($success, 20%)

    /* Warning button theme */
    &.btn-warning
        background: $warning
        border: 1px solid lighten($warning, 30%)

        &:hover, &.active
            background: lighten($warning, 10%)

        &:disabled
            background: lighten($warning, 20%)

    /* Failure button theme */
    &.btn-failure
        background: $failure
        color: white

        &:hover, &.active
            background: lighten($failure, 10%)

        &:disabled
            background: lighten($failure, 20%)

</style>