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
    <div v-if="show" class="aui modal-container" @mousedown.self="handleClose">
        <div class="modal">
            <div v-if="title" class="header" :class="modal_class">
                <h2>{{title}}</h2>
                <i v-if="closeable" class="fas fa-times" @click.self="handleClose"></i>
            </div>
            <div class="body">
                <slot>
                    <section class="content">
                        <slot name="content" />
                    </section>
                    <footer>
                        <div v-if="$slots.left" class="left">
                            <slot name="left" />
                        </div>
                        <div v-if="$slots.right" class="right">
                            <slot name="right" />
                        </div>
                    </footer>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {

        /**
         * The modal type.
         *
         * This determines the style class applied.
         */
        type: {
            type: String,
            default: 'primary',
            validator(value) {
                return ['none', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
            }
        },

        /**
         * If the modal should be shown.
         */
        show: {
            type: Boolean,
            required: true
        },

        /**
         * The title bar text of the modal.
         */
        title: {
            type: String | Number | null,
            default: null
        },

        /**
         * If the modal is closeable.
         */
        closeable: {
            type: Boolean,
            default: true
        }

    },
    computed: {

        /**
         * The style class of the modal.
         *
         * @returns {string}
         */
        modal_class() {
            return this.type === 'none' ? '' : 'modal-' + this.type;
        }

    },
    methods: {

        /**
         * Run close binding for the escape key press.
         *
         * @param {object} event - The keydown event.
         * @returns {undefined}
         */
        escapeClose(event) {
            if (event.key === 'Escape') {
                this.handleClose();
            }
        },

        /**
         * Actually close the modal (if possible).
         *
         * @returns {undefined}
         */
        handleClose() {
            if (this.closeable) {
                this.$emit('close');
                this.$emit('update:show', false);
            }
        },

        /**
         * Dynamic Suite overrides.
         *
         * @returns {undefined}
         */
        overrides() {
            if (
                this.show && document.getElementById('ds-nav-container') &&
                document.getElementById('ds-view-header')
            ) {
                document.getElementById('ds-nav-container').style.zIndex = '0';
                document.getElementById('ds-view-header').style.zIndex = '-1';
                document.getElementById('ds-nav-container').classList.remove('ds-nav-show-mobile')
                document.getElementById('ds-view').style.overflowY = 'hidden';
            } else if (
                !this.show && document.getElementById('ds-nav-container') &&
                document.getElementById('ds-view-header')
            ) {
                document.getElementById('ds-nav-container').style.zIndex = '1';
                document.getElementById('ds-view-header').style.zIndex = '0';
                document.getElementById('ds-view').style.overflowY = 'auto';
            }
        }

    },
    watch: {

        /**
         * Do some style overrides to make the container escape the Dynamic Suite bounds.
         */
        show() {
            this.overrides();
        }

    },
    mounted() {
        this.overrides();
        if (this.closeable) {
            document.addEventListener('keyup', this.escapeClose);
        }
    },
    beforeDestroy() {
        if (this.closeable) {
            document.removeEventListener('keyup', this.escapeClose);
        }
    }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* The modal container */
.aui.modal-container
    position: fixed
    top: 0
    left: 0
    height: 100%
    width: 100%
    background: rgba(0, 0, 0, 0.8)
    z-index: 99
    display: flex
    justify-content: center
    align-items: center

    /* The modal itself */
    .modal
        display: flex
        flex-direction: column
        z-index: 100
        max-width: 600px
        min-width: 300px
        max-height: 80%
        width: 100%
        margin: 0 0.5rem

        /* Pad out modal contents */
        & > *
            padding: 1rem

        /* Header, if present */
        .header
            display: flex
            padding: 0
            justify-content: space-between
            align-items: center
            border-bottom: 1px solid #ced4da
            border-radius: .25rem .25rem 0 0

            /* Header theme - Primary */
            &.modal-primary
                color: white
                background: $color-primary

            /* Header theme - Secondary */
            &.modal-secondary
                color: white
                background: $color-secondary

            /* Header theme - Success */
            &.modal-success
                color: white
                background: $color-success

            /* Header theme - Warning */
            &.modal-warning
                background: $color-warning

            /* Header theme - Failure */
            &.modal-failure
                color: white
                background: $color-failure

            /* Modal header title */
            h2
                font-size: 1.125rem
                margin: 1rem
                display: flex
                justify-content: center
                align-items: center

            /* Modal close button */
            .fas.fa-times
                padding: 0.5rem 0.6rem
                margin: 0.5rem
                cursor: pointer
                border-radius: 50%

                &:hover
                    background: rgba(0, 0, 0, 0.2)

        /* Modal slot body */
        .body
            background: whitesmoke
            border-radius: 0 0 0.25rem 0.25rem
            overflow-y: auto

            /* Strip common margins */
            .content > *:first-child
                margin-top: 0

            /* Strip common margins */
            .content > *:last-child
                margin-bottom: 0

        /* Borders for when no header is present */
        .body:only-child
            border-radius: 0.25rem

        /* Footer bar*/
        footer
            display: flex
            border-top: 1px solid #ced4da
            padding-top: 1rem
            margin-top: 1rem

            /* Justify right content */
            .right
                margin-left: auto

</style>