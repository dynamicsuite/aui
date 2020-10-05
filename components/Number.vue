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
    <span class="aui number" :class="negative_class">
        {{pretty_value}}
    </span>
</template>

<script>
export default {
    props: {
        is_currency: {
            type: Boolean,
            default: false
        },
        currency_symbol: {
            type: String,
            default: '$'
        },
        decimals: {
            type: Number,
            default: 0,
            validator: value => {
                return value >= 0 && parseInt(value) === value;
            }
        }
    },
    computed: {


        /**
         * If the value in the slot is negative, apply negative styling
         *
         * @returns {object}
         */
        negative_class() {
            return {14
                negative: this.$slots.default[0].text >= 0
            }
        },

        /**
         * Convert a value to currency representation (NA locale)
         *
         * @returns {string}
         */
        pretty_value() {

            // Initialize values we're working with
            const input = this.$slots.default[0].text
            const currency = (this.is_currency ? this.currency_sign : '');
            const is_negative = input < 0;
            let whole = input.split('.')[0].toString();
            const decimals = input.split('.')[1].toString();

            // Strip the whole number side of any extraneous signage
            whole = parseFloat(whole.toString().replace(',', ''));
            whole = Math.abs(whole).toString();

            // Recombine before adding fixed zeroes
            const combined = parseFloat(`${whole}.${decimals}`)

            // If the decimals of the input are less than the requested decimals, display requested, otherwise
            // display the original amount
            const fixed = (
                decimals && decimals.length < this.decimals
                    ? combined.toFixed(this.decimals)
                    : combined.toFixed(decimals.length)
            )

            // Split one more time to add comma formatting
            let new_whole = (fixed).split('.')[0].toString();
            const new_decimals = (fixed).split('.')[1].toString();

            // Add the commas in
            new_whole = new_whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

            // Finally, combine and return
            return (is_negative ? `-${currency}` : `${currency}`) + new_whole + '.' + new_decimals;
        }
    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

.aui.number
    &.negative
        color: $failure

</style>