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
        currency_sign: {
            type: String,
            default: '$'
        },
        decimals: {
            type: Number,
            default: 0,
            validator: function(value) {
                return value >= 0 && parseInt(value) === value;
            }
        }
    },
    computed: {
        // If the value in the slot is negative, apply negative styling
        negative_class() {
            return (this.$slots.default[0].text >= 0) ? '' : 'negative';
        },

        // Convert a value to currency representation (NA locale)
        pretty_value() {

            // Initialize values we're working with
            let input = this.$slots.default[0].text
            let currency = (this.is_currency ? this.currency_sign : '');
            let is_negative = input < 0;
            let whole = (input + "").split(".")[0].toString();
            let decimals = (input + "").split(".")[1].toString();

            // Pretty up the integer side of the number
            whole = parseFloat(whole.toString().replace(',', ''));
            whole = Math.abs(whole).toString();

            // Recombine before adding fixed zeroes
            let combined = parseFloat(whole + '.' + decimals)

            // If the decimals of the input are less than the requested decimals, display requested, otherwise
            // display the original amount
            let fixed = (
                decimals && decimals.length < this.decimals ?
                combined.toFixed(this.decimals) : combined.toFixed(decimals.length)
            )

            // Split one more time to add comma formatting
            let new_whole = (fixed + "").split(".")[0].toString();
            let new_decimals = (fixed + "").split(".")[1].toString();

            // Add the commas in
            new_whole = new_whole.replace(/\B(?=(\d{3})+(?!\d))/g, `,`)

            // Finally, combine and return
            return (is_negative ? `-${currency}` : `${currency}`) + new_whole + '.' + new_decimals;
        },
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