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
    <div class="aui select-assignment">
        <div class="aui select-assigned">
            <aui-select
                :label="assigned_label"
                :options="assigned"
                :multiple="true"
                :size="size"
                :disabled="disabled"
                v-model="assigned_selected"
            />
            <aui-button
                :text="'Move to &quot;' + unassigned_label + '&quot; list'"
                type="secondary"
                :disabled="disabled"
                @click="move('assigned')"
            />
        </div>
        <div class="aui select-unassigned">
            <aui-select
                :label="unassigned_label"
                :options="unassigned"
                :multiple="true"
                :size="size"
                :disabled="disabled"
                v-model="unassigned_selected"
            />
            <aui-button
                :text="'Move to &quot;' + assigned_label + '&quot; list'"
                type="secondary"
                :disabled="disabled"
                @click="move('unassigned')"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {

        /**
         * Key-value list of assigned options.
         */
        assigned: {
            type: Object | Array | null,
            required: true
        },

        /**
         * Label for the "assigned" list.
         */
        assigned_label: {
            type: String,
            default: 'Assigned'
        },

        /**
         * Key-value list of unassigned options.
         */
        unassigned: {
            type: Object | null,
            required: true
        },

        /**
         * Label for the "unassigned" list.
         */
        unassigned_label: {
            type: String,
            default: 'Unassigned'
        },

        /**
         * If all selects and buttons are disabled non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * The number of visible options.
         */
        size: {
            type: String | Number | null,
            default: 5
        }

    },
    data() {
        return {
            assigned_selected: [],
            unassigned_selected: []
        }
    },
    methods: {

        /**
         * Move one list "from" to the other.
         *
         * @param {string} from - The original list (assigned | unassigned).
         * @returns {undefined}
         */
        move(from) {
            const assigned = Object.assign({}, this.assigned), unassigned = Object.assign({}, this.unassigned);
            for (const key of this[`${from}_selected`]) {
                if (from === 'assigned') {
                    unassigned[key] = assigned[key]
                    delete assigned[key];
                } else {
                    assigned[key] = unassigned[key];
                    delete unassigned[key];
                }
            }
            this.$emit('update:assigned', assigned);
            this.$emit('update:unassigned', unassigned);
            this[`${from}_selected`] = [];
        }

    }

}
</script>

<style lang="sass">

/* Media query mixin for mobile view breakpoint */
@mixin on-mobile-view
    @media (max-width: 500px)
        @content

/* Select assignment component */
.aui.select-assignment
    display: grid
    grid-template-columns: 1fr 1fr
    grid-gap: 1rem

    /* Select formatting */
    select:not(:disabled)
        background: #fff !important

    /* Adjustments to selects */
    .aui.select-assigned, .aui.select-unassigned
        display: flex
        flex-direction: column

        /* For height alignment */
        .aui.select
            display: flex
            flex-grow: 1

            /* For height alignment */
            .standard-container, .cap-container
                flex-grow: 1

    /* Format selection buttons */
    .aui.btn
        display: flex
        justify-content: center
        align-items: center
        width: 100%
        margin-top: 1rem

    /* Changes for mobile view */
    @include on-mobile-view
        grid-template-columns: 1fr

</style>