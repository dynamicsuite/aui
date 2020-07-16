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

<style lang="sass" scoped>

    @import "../../../client/css/colors"

    .aui.modal-container
        position: fixed
        top: 0
        left: 0
        height: 100%
        width: 100%
        background: rgba(0,0,0,.8)
        z-index: 99
        display: flex
        justify-content: center
        align-items: center

        .modal
            display: flex
            flex-direction: column
            z-index: 100
            max-width: 600px
            max-height: 80%
            margin: 0 .5rem

            &>*
                padding: 1.5rem

            .modal-header
                display: flex
                padding: .75rem 1.5rem
                justify-content: space-between
                border-bottom: 1px solid #ced4da
                border-radius: .25rem .25rem 0 0

                &.primary
                    color: white
                    background: $primary
                &.secondary
                    color: white
                    background: $secondary
                &.warning
                    background: $warning
                &.success
                    color: white
                    background: $success
                &.failure
                    color: white
                    background: $failure

                h4
                    margin: 0
                    display: flex
                    justify-content: center
                    align-items: center

                .fa.fa-times
                    padding: .5rem .7rem
                    cursor: pointer
                    border-radius: 50%

                    &:hover
                        background: rgba(0,0,0,.2)


            .modal-body
                background: #fff
                border-radius: 0 0 .25rem .25rem
                overflow-y: auto

</style>