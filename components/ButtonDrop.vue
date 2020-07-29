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
            // The dropdown type, which determines style classes
            type: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
                }
            },
            // The structure of dropdown options to show in the list
            dropdown: {
                type: Array,
                required: true,
                validator(value) {
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
            // The icon to display when the dropdown is inactive
            icon_inactive: {
                type: String,
                default: 'fas fa-caret-down'
            },
            // The icon to display when the dropdown is active
            icon_active: {
                type: String,
                default: 'fas fa-caret-up'
            },
            // Where to align the dropdown relative to the button
            menu_align: {
                style: String,
                default: 'left',
                validator(value) {
                    return ['left', 'right'].indexOf(value) !== -1;
                }
            }
        },
        computed: {
            // Style classes to apply to the button
            button_classes() {
                let classes = {
                    active: this.show_dropdown
                };
                classes['btn-' + this.type] = true;
                return classes;
            },
            // The Font Awesome class to use for the icon
            icon_class() {
                return this.show_dropdown ? this.icon_active : this.icon_inactive;
            },
            // Style classes to apply to the dropdown list
            list_classes() {
                let classes = {
                    top: this.anchor_top,
                };
                classes[this.menu_align_master] = !!this.menu_align_master;
                classes[this.menu_align] = !this.menu_align_master;
            }
        },
        data() {
            return {
                show_dropdown: false,
                anchor_top: false,
                menu_align_master: null
            }
        },
        methods: {
            // Toggle visibility state
            toggle() {
                this.show_dropdown = !this.show_dropdown;
                this.menu_align_master = null;
                this.anchor_top = false;
                Vue.nextTick(() => {

                    // Hide the element
                    this.$refs['menu'].style.opacity = '0';

                    // Get element dimensions
                    const rect = this.$refs['menu'].getBoundingClientRect();
                    const space_below = window.innerHeight - rect.bottom;
                    const space_right = window.innerWidth - rect.right;

                    // If the element is too close to the right edge, assign a left anchor
                    if (space_right < 0) {
                        this.menu_align_master = 'right';
                    }

                    // If the element is too close to the bottom edge, assign it a top anchor
                    if (space_below < 0) {
                        this.anchor_top = true;
                    }

                    // Un-hide the element
                    this.$refs['menu'].style.opacity = '1';

                });
            },

            // Reset the visibility state when clicking outside the element
            outsideReset(event) {
                // If the element isn't the menu, hide menu; aka a faux click-out/blur event
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
            // Add event listener for blur/click-out tracking
            window.addEventListener('click', this.outsideReset);
        },
        beforeDestroy() {
            // Remove the blur/click-out event listener
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