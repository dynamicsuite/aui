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

        /**
         * If the number should be rendered as currency
         */
        is_currency: {
            type: Boolean,
            default: false
        },

        /**
         * The currency symbol to use if the number is defined as currency
         */
        currency_symbol: {
            type: String,
            default: '$'
        },

        /**
         * The number of zeros that should pad the number to the right of the decimal place
         */
        padding: {
            type: Number | null,
            default: null,
            validator: value => {
                return value >= 0 && parseInt(value) === value;
            }
        },

        /**
         * The number to format and display
         */
        number: {
            type: Number | String,
            required: true
        }

    },
    computed: {

        /**
         * If the value in the slot is negative, apply negative styling
         *
         * @returns {object}
         */
        negative_class() {
            return {
                negative: parseFloat(this.number.toString().replace(/[^0-9.-]/g, '')) < 0
            }
        },

        /**
         * Convert a value to fixed decimal format with optional currency symbols
         *
         * @returns {string}
         */
        pretty_value() {

            // Initialize values we're working with
            const input = this.number.toString().replace(/[^0-9.-]/g, '');
            const currency = (this.is_currency ? this.currency_symbol : '');
            const is_negative = parseFloat(input) < 0;
            const whole = Math.abs(parseInt(input.split('.')[0])).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const fractional = input.split('.')[1];
            const pad_length = this.padding !== null ? this.padding : (this.is_currency ? 2 : 0);

            // Format the decimals
            let decimals = '.';

            // Fractional value present, make sure they are the proper length
            if (!isNaN(fractional)) {
                decimals += (fractional.toString().length < pad_length
                    ? fractional.padEnd(pad_length + 1, '0')
                    : fractional
                );
            }

            // Decimals not present, make sure pad length is met
            else if (pad_length > 0) {
                decimals = decimals.padEnd(pad_length + 1, '0');
            }

            // No decimals at all
            else {
                decimals = '';
            }

            // Combine the sign, currency, and value, and return
            return (is_negative ? '-' : '') + (currency ? currency : '') + `${whole}${decimals}`;

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