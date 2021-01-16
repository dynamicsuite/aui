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
    <div class="aui notice">
        <i :class="icon_classes"></i>
        <h4><slot>{{text}}</slot></h4>
        <span v-if="subtext" v-html="subtext"></span>
    </div>
</template>

<script>
export default {
    props: {

        /**
         * Notice type which defined the color of the notice.
         */
        type: {
            type: String,
            default: 'secondary',
            validator: value => {
                return ['primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
            }
        },

        /**
         * The Font Awesome icon to display for the notice.
         */
        icon: {
            type: String,
            default: 'fas fa-cog',
        },

        /**
         * The text to display under the icon.
         *
         * This can be set with this property or using the default slot.
         */
        text: {
            type: String | Number | null,
            default: null
        },

        /**
         * Subtext to display under the notice text.
         */
        subtext: {
            type: String | Number | null,
            default: null
        }

    },
    computed: {

        /**
         * Classes to apply to the icon.
         *
         * @returns {object}
         */
        icon_classes() {
            return {
                [this.icon]: true,
                [this.type]: true
            };
        }

    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

/* Notice container */
.aui.notice
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

    /* Icon */
    i
        font-size: 3rem
        margin-bottom: 0.5rem

        &.primary
            color: $primary

        &.secondary
            color: lighten($secondary, 20%)

        &.success
            color: $success

        &.warning
            color: $warning

        &.failure
            color: $failure

    /* Text */
    h4
        color: lighten(#000, 35%)

        &:last-child
            margin-bottom: 0

    /* Subtext */
    span
        font-size: 0.9rem
        color: lighten(#000, 45%)

</style>