<!--
This file is part of the Dynamic Suite AUI package.

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.

@package DynamicSuite\AUI
@author Grant Martin <commgdog@gmail.com>
@author Michael Ryan <hatduck@gmail.com>
@copyright 2021 Dynamic Suite Team
-->

<template>
    <div class="aui select-assignment">
        <div class="aui select-assigned">
            <aui-select
                :label="assigned_label"
                :options="assigned"
                multiple
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
                multiple
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
// noinspection JSValidateTypes
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
            this.$emit('update', {
                assigned: assigned,
                unassigned: unassigned
            });
            this[`${from}_selected`] = [];
        }

    }

}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

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