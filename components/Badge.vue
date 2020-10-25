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
    <span class="aui badge" :class="badge_class" v-html="content"></span>
</template>

<script>
    export default {
        props: {
            // The badge type, which determines style classes
            type: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['none', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
                }
            },
            // Text content of the badge
            content: {
                type: String | Number,
                required: true
            }
        },
        computed: {
            // Class for the badge
            badge_class() {
                return this.type === 'none' ? '' : 'badge-' + this.type;
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

// Badge Styling
.aui.badge
    font-size: .75rem
    font-weight: bold
    padding: .125rem .4rem
    border-radius: 1rem
    text-align: center

    // Primary Badge Styling
    &.badge-primary
        background: $primary
        color: white

    // Secondary Badge Styling
    &.badge-secondary
        background: $secondary
        color: white

    // Success Badge Styling
    &.badge-success
        background: $success
        color: white

    // Warning Badge Styling
    &.badge-warning
        background: $warning
        border: 1px solid lighten($warning, 30%)

    // Failure/Danger Badge Styling
    &.badge-failure
        background: $failure
        color: white

</style>