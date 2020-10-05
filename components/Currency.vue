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

            let is_negative = input < 0;
            let input = this.$slots.default[0].text
            let currency = (this.is_currency ? this.currency_sign : '')

            //let decimals = (this.$slots.default[0].text + "").split(".")[1];
            //console.log(decimals > value)

            input = parseFloat(input.toString().replace(',', ''));
            input = Math.abs(input);
            return (is_negative ? `-${currency}` : `${currency}`) + input.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
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