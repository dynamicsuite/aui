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
        <div class="aui select assigned">
            <label>
                <span class="label-text">{{assigned_label}}</span>
                <select multiple :disabled="disabled" v-model="assigned_selected">
                    <option v-for="(label, value) in assigned" :value="value">{{label}}</option>
                </select>
            </label>
            <aui-button
                :text="'Move to &quot;' + unassigned_label + '&quot; list'"
                type="secondary"
                :disabled="disabled"
                @click="move('assigned')"
            />
        </div>
        <div class="aui select unassigned">
            <label>
                <span class="label-text">{{unassigned_label}}</span>
                <select multiple :disabled="disabled" v-model="unassigned_selected">
                    <option v-for="(label, value) in unassigned" :value="value">{{label}}</option>
                </select>
            </label>
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
         * List of assigned options.
         */
        assigned: {
            type: Object,
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
         * List of unassigned options.
         */
        unassigned: {
            type: Object,
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
         * If all selects are disabled
         */
        disabled: {
            type: Boolean,
            default: false
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
         * Move one list "from" to another.
         *
         * @param from
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
    margin-bottom: 1rem

    /* Assignment groups */
    .assigned, .unassigned
        margin-top: 0 !important

    /* Select formatting */
    select
        min-height: 10rem
        margin-bottom: 1rem
        background: #fff !important

    /* Changes for mobile view */
    @include on-mobile-view
        grid-template-columns: 1fr

</style>