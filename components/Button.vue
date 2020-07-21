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
    <button class="aui btn" :class="'btn-' + type" :disabled="is_disabled" @click="$emit('click')">
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
            type: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: false
            },
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
            has_loading_text() {
                return typeof this.loading_text === 'string';
            },
            is_disabled() {
                return this.loading || this.disabled;
            }
        },
        methods: {
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