<template>
    <span class="aui currency" :class="negativeClass">
        {{prettyValue}}
    </span>
</template>

<script>
export default {
    props: {
        value: {
            type: String
        }
    },
    computed: {
        negativeClass() {
            return (this.value >= 0) ? '' : 'negative';
        },
        prettyValue() {
            let abs = Math.abs(parseFloat(this.value)).toFixed(2);
            return (this.value >= 0) ? '$' + abs  : '-$' + abs;
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