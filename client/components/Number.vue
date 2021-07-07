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
  <span class="aui number" :class="negative_class">
    {{pretty_value}}
  </span>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * If the number should be rendered as currency.
     *
     * @type {boolean}
     */
    is_currency: {
      type: Boolean,
      default: false
    },

    /**
     * The currency symbol to use if the number is defined as currency.
     *
     * @type {string}
     */
    currency_symbol: {
      type: String,
      default: '$'
    },

    /**
     * The number of zeros that should pad the number to the right of the decimal place.
     *
     * @type {number | null}
     */
    padding: {
      type: Number | null,
      default: null,
      validator: value => {
        return value >= 0 && parseInt(value) === value;
      }
    },

    /**
     * The number to format and display.
     *
     * @type {number | string | null}
     */
    number: {
      type: Number | String | null,
      required: true
    }

  },
  computed: {

    /**
     * If the value in the slot is negative, apply negative styling.
     *
     * @returns {
     *     {negative: boolean}
     * }
     */
    negative_class() {
      return {
        negative: this.number !== null && parseFloat(this.number.toString().replace(/[^0-9.-]/g, '')) < 0
      }
    },

    /**
     * Convert a value to fixed decimal format with optional currency symbols.
     *
     * @returns {string}
     */
    pretty_value() {

      // Null number check
      if (this.number === null) {
        return '';
      }

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
      if (fractional) {
        decimals += (fractional.toString().length < pad_length
          ? fractional.padEnd(pad_length, '0')
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

/* Import AUI Core */
@import "../sass/aui"

/* Number overrides */
.aui.number
  white-space: nowrap

  &.negative
    color: $color-failure

</style>