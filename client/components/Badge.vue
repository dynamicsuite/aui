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
  <span class="aui badge" :class="style_class">
    <slot>{{text}}</slot>
  </span>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * The badge type.
     *
     * This determines the style class applied.
     *
     * @type {string}
     */
    type: {
      type: String,
      default: 'primary',
      validator(value) {
        return ['none', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
      }
    },

    /**
     * Badge text.
     *
     * This is an alias for the slot content when using plaintext.
     *
     * Slot should be used if custom HTML is required.
     *
     * @type {string | Number}
     */
    text: {
      type: String | Number
    }

  },
  computed: {

    /**
     * Style class for the badge.
     *
     * @returns {object}
     */
    style_class() {
      return {
        [this.type]: this.type !== 'none'
      };
    }

  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* Badge Styling */
.aui.badge
  display: inline-flex
  line-height: 0.8rem
  font-size: 0.8rem
  font-weight: bold
  padding: 0.25rem 0.4rem
  border-radius: 1rem
  text-align: center
  white-space: nowrap

  /* Primary Badge Styling */
  &.primary
    background: $color-primary
    color: $color-text-inverted

  /* Secondary Badge Styling */
  &.secondary
    background: $color-secondary
    color: $color-text-inverted

  /* Success Badge Styling */
  &.success
    background: $color-success
    color: $color-text-inverted

  /* Warning Badge Styling */
  &.warning
    background: $color-warning
    border: 1px solid lighten($color-warning, 30%)

  /* Failure Badge Styling */
  &.failure
    background: $color-failure
    color: $color-text-inverted

</style>