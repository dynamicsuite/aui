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
    <div class="aui alert" v-if="visible">
        <span class="title-bar" v-if="title" >
            <h4 class="alert-title">{{title}}</h4>
            <i class="fa fa-times" v-if="close" @click="$emit('click')"></i>
        </span>
        <p v-if="title">
            <slot></slot>
        </p>
        <p v-else>
            <slot></slot>
            <i class="fa fa-times" v-if="close" @click="$emit('click')"></i>
        </p>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String
            },
            close: {
                type: Boolean,
                default: false
            },
            visible: {
                default: true
            }
        }
    }
</script>