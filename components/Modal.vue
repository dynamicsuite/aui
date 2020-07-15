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
    <div class="aui modal-container" v-if="state" @click.self="toggleEmit()">
        <div class="modal">
            <div v-if="title" class="modal-header" :class="title_classes">
                <h4>{{title}}</h4>
                <i class="fa fa-times" @click.self="toggleEmit()" v-if="close"></i>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            state: {
                type: Boolean,
                required: true
            },
            title: {
                type: String
            },
            html: {
                type: String
            },
            close: {
                type: Boolean,
                default: true
            },
            title_classes: {
                type: String
            }
        },
        methods: {
            escEmit(event) {
                if (event.keyCode === 27) {
                    this.$emit('modal-close');
                }
            },
            toggleEmit() {
                if (this.close) {
                    this.$emit('modal-toggle');
                }
            }
        },
        watch: {
            state() {
                if (this.state && document.getElementById('ds-nav-container') && document.getElementById('ds-view-header')) {
                    document.getElementById('ds-nav-container').style.zIndex = '0';
                    document.getElementById('ds-view-header').style.zIndex = '-1';
                    document.getElementById('ds-nav-container').classList.remove("ds-nav-show-mobile")
                } else if (!this.state  && document.getElementById('ds-nav-container') && document.getElementById('ds-view-header')) {
                    document.getElementById('ds-nav-container').style.zIndex = '1';
                    document.getElementById('ds-view-header').style.zIndex = '0';
                }
            }
        },
        created: function() {
            if (this.close) document.addEventListener('keyup', this.escEmit);
        },
        destroyed: function() {
            if (this.close) document.removeEventListener('keyup', this.escEmit);
        }
    }
</script>