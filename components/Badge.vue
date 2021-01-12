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
    <span class="aui badge" :class="style_class">
        <slot>{{text}}</slot>
    </span>
</template>

<script>
export default {
    props: {

        /**
         * The badge type.
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
         * Badge text.
         *
         * This is an alias for the slot content when using plaintext. Slot should be used if custom HTML is
         * required.
         */
        text: {
            type: String | Number
        }

    },
    computed: {

        /**
         * Style class for the badge.
         *
         * @returns {object}
         */
        style_class() {
            return {
                [`badge-${this.type}`]: this.type !== 'none'
            };
        }

    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Badge Styling */
.aui.badge
    display: inline-flex
    font-size: 0.75rem
    font-weight: bold
    padding: 0.125rem 0.4rem
    border-radius: 1rem
    text-align: center
    white-space: nowrap

    /* Primary Badge Styling */
    &.badge-primary
        background: $primary
        color: white

    /* Secondary Badge Styling */
    &.badge-secondary
        background: $secondary
        color: white

    /* Success Badge Styling */
    &.badge-success
        background: $success
        color: white

    /* Warning Badge Styling */
    &.badge-warning
        background: $warning
        border: 1px solid lighten($warning, 30%)

    /* Failure Badge Styling */
    &.badge-failure
        background: $failure
        color: white

</style>