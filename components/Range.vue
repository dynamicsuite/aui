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
    <aui-form-control v-bind="properties">
        <template v-slot:label>
            <label>
                <span>{{prefix}}{{lowest}}{{suffix}}</span>
                <span>{{prefix}}{{highest}}{{suffix}}</span>
            </label>
        </template>
        <div class="range-container">
            <div class="bar"></div>
            <div class="filler" ref="filler"></div>
            <input
                type="range"
                ref="slider1"
                :min="min"
                :max="max"
                @mousemove="moveHandler"
                @input="handleChange"
                v-model="start"
            />
            <input
                type="range"
                ref="slider2"
                :min="min"
                :max="max"
                @mousemove="moveHandler"
                @input="handleChange"
                v-model="end"
            />
        </div>
    </aui-form-control>
</template>

<script>
export default {
    props: {
        /**
         * Minimum value
         */
        min: {
            type: Number,
            required: true
        },

        /**
         * Maximum value
         */
        max: {
            type: Number,
            required: true
        },

        /**
         * String to prefix values with
         */
        prefix: {
            type: String | null,
            default: null
        },

        /**
         * String to suffix values with
         */
        suffix: {
            type: String | null,
            default: null
        },

        /**
         * If the input is disabled and non-interactive.
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * Input tab index.
         */
        tabindex: {
            type: String | Number | null,
            default: null
        },

        /**
         * Success subtext to display under the input.
         *
         * Subtext values override each other in the following order, only one may be present at a time:
         *
         * success > failure > subtext
         */
        success: {
            type: String | null,
            default: null
        },

        /**
         * Failure subtext to display under the input.
         *
         * Subtext values override each other in the following order, only one may be present at a time:
         *
         * success > failure > subtext
         */
        failure: {
            type: String | null,
            default: null
        },

        /**
         * Subtext to display under the input.
         *
         * Subtext values override each other in the following order, only one may be present at a time:
         *
         * success > failure > subtext
         */
        subtext: {
            type: String | null,
            default: null
        }
    },
    data() {
        return {
            start: 0,
            end: 0,
            highest: null,
            lowest: null
        }
    },
    computed: {
        /**
         * Properties to pass down to the form control component.
         *
         * @returns {
         *     {parent: string},
         *     {label: string},
         *     {success: string},
         *     {failure: string},
         *     {subtext: string}
         * }
         */
        properties() {
            return {
                parent: 'range',
                label: this.$slots.default ? this.$slots.default : this.label,
                success: this.success,
                failure: this.failure,
                subtext: this.subtext
            };
        }
    },
    methods: {

        handleChange() {
            this.$emit('update:min', this.lowest);
            this.$emit('update:max', this.highest);
        },

        moveHandler(event) {

            // Length of the slider
            let x_length = this.$refs['slider1'].getBoundingClientRect().right

            // Position on slider as a percentage of the slider
            let position = event.clientX / x_length;

            // Get distance from each thumb
            let start_pos = Math.floor(Math.abs(this.start - Math.floor(position * this.max)));
            let end_pos = Math.floor(Math.abs(this.end - Math.floor(position * this.max)));

            if (!event.buttons) {
                if (start_pos < end_pos) {
                    this.$refs['slider1'].style.zIndex = '2';
                    this.$refs['slider2'].style.zIndex = '1';
                } else {
                    this.$refs['slider2'].style.zIndex = '2';
                    this.$refs['slider1'].style.zIndex = '1';
                }
            }
        },

        setHighLow() {
            this.lowest = Math.min(this.start, this.end);
            this.highest = Math.max(this.start, this.end);
        }

    },
    watch: {
        start() {
            this.setHighLow()
        },
        end() {
            this.setHighLow();
        }
    },
    mounted() {
        this.start = this.min;
        this.end = this.max;

        this.setHighLow();
    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

@mixin slider-theme
    -webkit-appearance: none
    appearance: none
    width: 18px
    height: 18px
    border-radius: 50%
    background: $primary
    cursor: pointer

.aui.range
    position: relative

    label
        display: flex
        justify-content: space-between

    .range-container
        margin-top: .5rem

    .bar
        position: absolute
        -webkit-appearance: none
        appearance: none
        width: 100%
        height: 8px
        background: #d3d3d3
        outline: none
        z-index: 0
        bottom: -4px

    input
        width: 100%
        margin: 0
        position: absolute
        -webkit-appearance: none
        appearance: none
        height: 0
        outline: none
        bottom: 0

        &::-webkit-slider-thumb
            @include slider-theme

        &::-moz-range-thumb
            @include slider-theme

        &:first-of-type
            z-index: 2

        &:last-of-type
            z-index: 1

</style>