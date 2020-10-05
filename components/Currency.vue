<template>
    <span class="aui currency" :class="negativeClass">
        {{prettyValue}}
    </span>
</template>

<script>
export default {
    computed: {
        negativeClass() {
            return (this.$slots.default[0].text >= 0) ? '' : 'negative';
        },
        prettyValue() {
            let abs = Math.abs(parseFloat(this.$slots.default[0].text)).toFixed(2);
            return (this.$slots.default[0].text >= 0) ? '$' + abs  : '-$' + abs;
        }
    }
}
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

.negative
    color: $failure

</style>