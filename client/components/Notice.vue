<!--
This file is part of the Dynamic Suite Docs package.

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.

@package DynamicSuite\Docs
@author Grant Martin <commgdog@gmail.com>
@copyright 2021 Dynamic Suite Team
-->

<template>
  <div class="aui notice">
    <i :class="icon_classes"></i>
    <h4><slot>{{text}}</slot></h4>
    <span v-if="subtext" v-html="subtext"></span>
  </div>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * Notice type which defined the color of the notice.
     *
     * @type {string}
     */
    type: {
      type: String,
      default: 'secondary',
      validator: value => {
        return ['primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
      }
    },

    /**
     * The Font Awesome icon to display for the notice.
     *
     * @type {string}
     */
    icon: {
      type: String,
      default: 'fas fa-cog',
    },

    /**
     * The text to display under the icon.
     *
     * This can be set with this property or using the default slot.
     *
     * @type {string | number | null}
     */
    text: {
      type: String | Number | null,
      default: null
    },

    /**
     * Subtext to display under the notice text.
     *
     * @type {string | number | null}
     */
    subtext: {
      type: String | Number | null,
      default: null
    }

  },
  computed: {

    /**
     * Classes to apply to the icon.
     *
     * @returns {object}
     */
    icon_classes() {
      return {
        [this.icon]: true,
        [this.type]: true
      };
    }

  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* Notice container */
.aui.notice
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

  /* Icon */
  i
    font-size: 3rem
    margin-bottom: 0.5rem

    &.primary
      color: $color-primary

    &.secondary
      color: lighten($color-secondary, 20%)

    &.success
      color: $color-success

    &.warning
      color: $color-warning

    &.failure
      color: $color-failure

  /* Text */
  h4
    margin: 0
    color: $color-text-soft

  /* Subtext */
  span
    margin-top: 0.25rem
    font-size: 0.9rem
    color: $color-text-softest

</style>