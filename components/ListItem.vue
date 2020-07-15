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