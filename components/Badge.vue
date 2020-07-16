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
    <span class="aui badge"><slot></slot></span>
</template>

<style lang="sass" scoped>

    @import "../../../client/css/colors"

    // Badge Styling
    .aui.badge
        font-size: .75rem
        font-weight: bold
        padding: .1375rem .4rem
        border-radius: 1rem

    // Primary Badge Styling
    .aui.badge-primary
        background: $primary
        color: white

    // Secondary Badge Styling
    .aui.badge-secondary
        background: $secondary
        color: white

    // Warning Badge Styling
    .aui.badge-warning
        background: $warning
        border: 1px solid lighten($warning, 30%)

    // Success Badge Styling
    .aui.badge-success
        background: $success
        color: white

    // Failure/Danger Badge Styling
    .aui.badge-failure, .aui.badge-danger
        background: $failure
        color: white

</style>