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
    <button class="aui btn" :class="button_class" :disabled="is_disabled" @click="$emit('click')">
        <span v-if="isDelayed()">
            <i class="fa fa-spin fa-circle-notch"></i>
            <span v-if="has_loading_text" class="loading-text">{{loading_text}}</span>
            <slot v-else></slot>
        </span>
        <slot v-else></slot>
    </button>
</template>

<script>
    export default {
        props: {
            // The button type, which determines style classes
            type: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['none', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
                }
            },
            // If the button is disabled and un-clickable
            disabled: {
                type: Boolean,
                default: false
            },
            // If the button is in its loading state, also disables
            loading: {
                type: Boolean,
                default: false
            },
            // Text to display on the button when in the loading state, uses old text if null
            loading_text: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                show_spinner: false,
                default_class: false
            }
        },
        computed: {
            // If custom loading text was given
            has_loading_text() {
                return typeof this.loading_text === 'string';
            },
            // If the button should be disabled
            is_disabled() {
                return this.loading || this.disabled;
            },
            // Class for the button
            button_class() {
                return this.type === 'none' ? '' : 'btn-' + this.type;
            }
        },
        methods: {
            // Set a delay to display the loading spinner so that there is not weird flickering on low latency loads
            isDelayed() {
                if (this.loading) {
                    setTimeout(() => {
                        if (this.loading) {
                            this.show_spinner = true;
                        }
                    }, 100);
                } else {
                    this.show_spinner = false;
                }
                return this.show_spinner;
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Default button styling */
.aui.btn
    padding: 0.5rem 1rem
    border: 0
    border-radius: 0.25rem
    font-size: 1rem
    user-select: none
    cursor: pointer

    /* Remove browser focus */
    &:focus
        outline: none !important

    &:disabled
        cursor: not-allowed

    /* Spinner when the button is on a long load */
    .fa.fa-spin
        text-align: center
        margin-right: 0.25rem

    /* Loading text displayed when a button is in the loading state */
    .loading-text
        margin: 0

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