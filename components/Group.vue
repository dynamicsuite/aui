<template>
    <div class="aui group">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {}
}
</script>

<style lang="sass">

.aui.group
    display: flex

    &> * input, &> * select
        border-radius: 0 !important
        margin: 0
        border-left: none !important

    &> *:first-child
        border-radius:  .25rem 0 0 .25rem

        input, select
            border-radius:  .25rem 0 0 .25rem !important
            border-left: 1px solid #ced4da !important


    &> *:last-child
        border-radius: 0  .25rem .25rem 0

        input, select
            border-radius: 0  .25rem .25rem 0 !important
            border-left: 1px solid #ced4da !important


</style>