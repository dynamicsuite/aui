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
  <ul class="aui list-group">
    <li v-for="(row, key) in list" :key="'list-group-row-' + key" @click="$emit('click', row.value)">
      <span v-if="row.icon" class="leading-icon"><i :class="row.icon"></i></span>
      <div class="text">
        <div class="title">{{row.title}}</div>
        <div v-if="row.subtext" class="subtext" v-html="row.subtext" />
      </div>
      <span class="trailing-icon"></span>
    </li>
  </ul>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * The list of groups to render. Each child of the array must be an object and each object must contain a
     * "title" of type "string", and "value" of any type. The "value" will be emitted on click of the group. You
     * may also include a "subtext" of type "string" which will be subtext displayed on the row below the title. If
     * an "icon" of type "string" is present, the icon will be appended before the text values. The "icon" value
     * must be a valid Font Awesome icon class.
     *
     * @type {array}
     */
    list: {
      type: Array,
      required: true,
      validator: value => {
        for (const row of value) {
          if (typeof row.title !== 'string') {
            return false;
          }
          if (typeof row.subtext !== 'undefined' && typeof row.subtext !== 'string') {
            return false;
          }
          if (typeof row.icon !== 'undefined' && typeof row.icon !== 'string') {
            return false;
          }
        }
        return true;
      }
    }
  }

}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* List group container */
.aui.list-group
  padding: 0
  border: 1px solid $color-border
  border-radius: 0.25rem
  background: white

  /* Individual list groups */
  li
    padding: 0.75rem 3rem 0.75rem 0.75em
    list-style: none
    display: flex
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3cpath fill='%23888888' d='M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z'/%3e%3c/svg%3e")
    background-repeat: no-repeat
    background-position: right 0.5rem center
    background-size: 1.5rem
    cursor: pointer
    user-select: none

    /* Leading icon if present */
    .leading-icon
      font-size: 2rem
      color: darken($color-border, 10%)
      width: 2.5rem
      display: flex
      justify-content: center
      align-items: center

      /* Icon centering */
      i
        display: flex
        justify-content: center
        align-items: center

      /* Padding when icon present */
      & + .text
        margin-left: 1rem

    /* Vertical align text */
    .text
      display: flex
      flex-direction: column
      justify-content: center

    /* Entry title */
    .title
      font-weight: bold

    /* Entry subtext*/
    .subtext
      font-size: 0.9rem
      color: $color-text-soft

    /* Hover effects for the group*/
    &:hover
      background-color: rgba(0, 0, 0, 0.1)

    /* Group spacing style */
    &:not(:last-child)
      border-bottom: 1px solid #ced4da

</style>