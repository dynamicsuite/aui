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
    <li class="aui list-item" :class="activeClass" @click="runCallback()">
            <span class="text">
                <div class="title"><slot></slot></div>
                <div class="aui subtext" v-if="subtext">{{subtext}}</div>
            </span>
        <span class="icon" v-if="isActive()"></span>
    </li>
</template>

<script>
    export default {
        props: {
            callback: {
                type: Function
            },
            subtext: {
                type: String
            }
        },
        methods: {
            isActive() {
                return !!this.callback;
            },
            runCallback() {
                if (this.callback) this.callback();
            }
        },
        computed: {
            activeClass() {
                return (this.callback) ? ' active' : '';
            }
        }
    }
</script>

<style lang="sass" scoped>
    .list-item
        padding: 1rem 3rem 1rem 1rem
        list-style: none
        display: flex
        justify-content: space-between

        .title
            font-weight: bold
            color: lighten(black, 10%)

        .subtext
            margin-top: .25rem
            font-size: .9rem
            color: #777

        &.active
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%23a2aeb9' d='M6.0848 3.9152l-3.3125 3.3125q-0.0848 0.0848-0.2009 0.0848t-0.2009-0.0848l-0.7411-0.7411q-0.0848-0.0848-0.0848-0.2009t0.0848-0.2009l2.3705-2.3705-2.3705-2.3705q-0.0848-0.0848-0.0848-0.2009t0.0848-0.2009l0.7411-0.7411q0.0848-0.0848 0.2009-0.0848t0.2009 0.0848l3.3125 3.3125q0.0848 0.0848 0.0848 0.2009t-0.0848 0.2009z'/%3e%3c/svg%3e")
            background-repeat: no-repeat
            background-position: right .5rem center
            background-size: 1.25rem

        &.active:hover
            cursor: pointer
            user-select: none
            background: rgba(0, 0, 0, .1) url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%238595a3' d='M6.0848 3.9152l-3.3125 3.3125q-0.0848 0.0848-0.2009 0.0848t-0.2009-0.0848l-0.7411-0.7411q-0.0848-0.0848-0.0848-0.2009t0.0848-0.2009l2.3705-2.3705-2.3705-2.3705q-0.0848-0.0848-0.0848-0.2009t0.0848-0.2009l0.7411-0.7411q0.0848-0.0848 0.2009-0.0848t0.2009 0.0848l3.3125 3.3125q0.0848 0.0848 0.0848 0.2009t-0.0848 0.2009z'/%3e%3c/svg%3e") no-repeat right .5rem center
            background-size: 1.25rem

        &:not(:last-child)
            border-bottom: 1px solid #ced4da
</style>