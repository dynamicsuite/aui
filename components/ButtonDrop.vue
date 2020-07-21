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
        <ul v-show="show_dropdown" class="dropdown" ref="menu" :class="list_classes">
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
            },
            list_classes() {
                if (this.menu_align_master) {
                    return this.menu_align_master + ' ' + this.anchor;
                } else {
                    return this.menu_align + ' ' + this.anchor;
                }

            }
        },
        data() {
            return {
                show_dropdown: false,
                anchor: '',
                menu_align_master: null
            }
        },
        methods: {

            // Toggle visibility state
            toggle() {

                this.show_dropdown = !this.show_dropdown;

                this.menu_align_master = null;

                Vue.nextTick(() => {

                    // Hide the element
                    this.$refs.menu.style.opacity = '0';

                    // Get element dimensions
                    const domRect = this.$refs.menu.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - domRect.bottom;
                    const spaceRight = window.innerWidth - domRect.right;


                    // If the element is too close to the right edge
                    if (spaceRight < 0) {

                        // Assign a left anchor
                        this.menu_align_master = 'right';

                    }

                    // If the element is too close to the bottom edge
                    if (spaceBelow < 0) {

                        // Assign it a top anchor
                        this.anchor = 'top';

                    }

                    // Unide the element
                    this.$refs.menu.style.opacity = '1';


                })
            },

            // Reset the visibility state when clicking outside the element
            outsideReset(event) {

                // If the element isn't the menu, hide menu; aka a faux clickout/blur event
                if (!this.$refs.dropdown.contains(event.target)) {
                    this.show_dropdown = false;
                }

            },

            // Run the action for the selected dropdown option
            runAction(action) {

                // Functions get run, otherwise treat as URL
                if (typeof(action) === 'function') {
                    action();
                } else {
                    window.open(action);
                }

                // Hide the dropdown once the action is completed
                this.show_dropdown = false;
            }

        },
        created() {
            // Add event listener for blur/clickout tracking
            window.addEventListener('click', this.outsideReset);
        },
        beforeDestroy() {
            // Remove the blur/clickout event listener
            window.removeEventListener('click', this.outsideReset);
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

        /* Left aligned list */
        &.left
            left: 0

        /* Right aligned list */
        &.right
            right: 0

        /* Bottom attached list */
        &.top
            top: auto
            bottom: 2.35rem

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