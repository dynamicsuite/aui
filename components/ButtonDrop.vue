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
    <div class="aui btn-drop" ref="dropdown">
        <button class="aui btn" :class="button_classes" @click="toggle">
            <span v-if="$slots.default"><slot></slot></span>
            <i :class="icon_class"></i>
        </button>
        <ul v-if="show_dropdown" class="dropdown" :class="menu_align">
            <li v-for="entry in dropdown" @click="runAction(entry.action)">{{entry.label}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
                }
            },
            dropdown: {
                type: Array,
                required: true,
                validator(value) {
                    if (!Array.isArray(value)) {
                        return false;
                    }
                    for (let i = 0; i < value.length; i++) {
                        if (typeof value[i].label !== 'string') {
                            return false;
                        }
                        if (typeof value[i].action !== 'function' && typeof value[i].action !== 'string') {
                            return false;
                        }
                    }
                    return true;
                }
            },
            icon_inactive: {
                type: String,
                default: 'fas fa-caret-down'
            },
            icon_active: {
                type: String,
                default: 'fas fa-caret-up'
            },
            menu_align: {
                style: String,
                default: 'left',
                validator(value) {
                    return ['left', 'right'].indexOf(value) !== -1;
                }
            }
        },
        computed: {
            button_classes() {
                let classes = {
                    active: this.show_dropdown
                };
                classes['btn-' + this.type] = true;
                return classes;
            },
            icon_class() {
                return this.show_dropdown ? this.icon_active : this.icon_inactive;
            }
        },
        data() {
            return {
                show_dropdown: false
            }
        },
        methods: {
            toggle() {
                this.show_dropdown = !this.show_dropdown;
            },
            reset(event) {
                if (!this.$refs.dropdown.contains(event.target)) {
                    this.show_dropdown = false;
                }
            },
            runAction(action) {
                if (typeof(action) === 'function') {
                    action();
                } else {
                    window.open(action);
                }
                this.show_dropdown = false;
            }
        },
        created() {
            window.addEventListener('click', this.reset);
        },
        beforeDestroy() {
            window.addEventListener('click', this.reset);
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

// Group container
.aui.btn-drop
    display: inline-flex
    position: relative
    align-self: flex-start

    /* Disable browser outline */
    &:focus
        outline: none !important

    /* Slot text for the dropdown*/
    .btn > span
        margin-right: .5rem

    /* FontAwesome icon class on the dropdown button */
    .btn > i
        margin: 0 !important
        font-size: 0.9rem

    /* Dropdown menu when the button is pressed */
    .dropdown
        position: absolute
        top: 2.35rem
        margin: 0
        padding: 0.5rem 1rem
        background: white
        border: 1px solid #ced4da
        border-radius: 0.25rem
        color: black
        list-style: none
        z-index: 1

        /* Disable browser outline */
        &:focus
            outline: none !important

        /* Left attached list */
        &.left
            left: 0

        /* Right attached list */
        &.right
            right: 0

        /* Dropdown entries */
        li
            padding: 0.25rem 0
            white-space: nowrap
            text-align: left
            word-break: break-all
            cursor: pointer

            /* List selection styling */
            &:hover
                text-decoration: underline
                color: $primary

</style>