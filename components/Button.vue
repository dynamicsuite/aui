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
    <button :class="classes" :disabled="is_disabled" @click="$emit('click')">
        <span v-if="isDelayed">
            <i class="fa fa-spin fa-circle-notch loading-icon"></i>
            <span v-if="has_loading_text" class="loading-text">{{loading_text}}</span>
            <slot v-else></slot>
        </span>
        <slot v-else></slot>
    </button>
</template>

<script>
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            loading_text: {
                type: String,
                default: null
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
                }
                else {
                    this.show_spinner = false;
                }

                return this.show_spinner;
            }
        },
        computed: {
            has_loading_text() {
                return typeof this.loading_text === 'string';
            },
            is_disabled() {
                return this.loading || this.disabled;
            },
            classes() {
                return {
                    aui: true,
                    btn: true,
                    'btn-primary': this.default_class
                }
            }
        },
        data: function() {
            return {
                show_spinner: false,
                default_class: false
            }
        },
        mounted() {
            if (this.$el.classList.value === 'aui btn') {
                this.default_class = true;
            }
        }
    }
</script>

<style lang="sass" scoped>
    /* Default button styling */
    .aui.btn
        padding: 0.5rem 1rem
        border: 0
        border-radius: .25rem
        font-size: 1rem
        user-select: none

        &:hover
            cursor: pointer

        &:disabled:hover
            cursor: not-allowed

        .loading-icon
            margin-right: .25rem

        .loading-text
            margin: 0

    /* Primary button theme */
    .aui.btn-primary
        background: $primary
        color: white

        &:hover
            background: lighten($primary, 10%)

        &:disabled
            background: lighten($primary, 30%)

    /* Secondary button theme */
    .aui.btn-secondary
        background: $secondary
        color: white

        &:hover
            background: lighten($secondary, 10%)

        &:disabled
            background: lighten($secondary, 30%)

    /* Warning button theme */
    .aui.btn-warning
        background: $warning
        border: 1px solid lighten($warning, 30%)

    /* Success button theme */
    .aui.btn-success
        background: $success
        color: white

        &:hover
            background: lighten($success, 10%)

        &:disabled
            background: lighten($success, 20%)

    /* Failure button theme */
    .aui.btn-failure, .aui.btn-danger
        background: $failure
        color: white

        &:hover
            background: lighten($failure, 10%)

        &:disabled
            background: lighten($failure, 20%)

</style>