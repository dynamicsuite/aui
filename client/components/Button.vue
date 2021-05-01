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
  <button class="aui btn" :class="style_class" :disabled="is_disabled" @click="$emit('click')">

    <!-- Button content -->
    <i v-if="loading" class="fa fa-spin fa-circle-notch" />
    <template v-if="loading && loading_text">{{loading_text}}</template>
    <template v-else><slot>{{text}}</slot></template>

    <!-- Attached badge -->
    <aui-badge v-if="badge" :type="badge" :text="badge_text" />

  </button>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * The button type.
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
     * Button text.
     *
     * This is an alias for the slot content when using plaintext.
     *
     * Slot should be used if custom HTML is required.
     *
     * @type {string | null}
     */
    text: {
      type: String | null,
      default: null
    },

    /**
     * If the button is disabled and non-interactive.
     *
     * @type {boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * If the button is in its loading state.
     *
     * @type {boolean}
     */
    loading: {
      type: Boolean,
      default: false
    },

    /**
     * Text to display on the button when in the loading state (optional).
     *
     * @type {string}
     */
    loading_text: {
      type: String,
      default: null
    },

    /**
     * The badge type.
     *
     * If this is NULL, no badge will be displayed.
     *
     * This determines the style class applied for the badge.
     *
     * @type {string | null}
     */
    badge: {
      type: String | null,
      default: null,
      validator(value) {
        return [null, 'none', 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
      }
    },

    /**
     * Text to display in the attached badge.
     *
     * @type {string}
     */
    badge_text: {
      type: String,
      default: '!'
    }

  },
  computed: {

    /**
     * Style class for the button.
     *
     * @returns {object}
     */
    style_class() {
      return {
        [this.type]: this.type !== 'none'
      };
    },

    /**
     * If the button is in a disabled state.
     *
     * @returns {boolean}
     */
    is_disabled() {
      return this.loading || this.disabled;
    }

  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* Default button styling */
.aui.btn
  border: none
  text-align: center
  border-radius: 0.25rem
  padding: 0.5rem 0.75rem
  font-size: 1rem
  user-select: none
  cursor: pointer
  position: relative
  -moz-box-sizing: content-box
  -webkit-box-sizing: content-box
  box-sizing: content-box
  height: calc(1rem + 2px)

  /* Remove browser focus */
  &:focus
    outline: none !important

  &:disabled
    cursor: not-allowed

  /* Space spinner */
  i.fa-spin
    margin-right: 0.25rem
    font-size: 0.9rem

  /* Attached badge if present */
  .aui.badge
    display: inline-block
    position: absolute
    min-width: 0.5rem
    top: -0.6rem
    right: -0.68rem
    z-index: 1
    border: 1px solid white !important

  /* Primary button theme */
  &.primary
    background: $color-primary
    color: white

    &:hover, &.active
      background: lighten($color-primary, 10%)

    &:disabled
      background: lighten($color-primary, 30%)

  /* Secondary button theme */
  &.secondary
    background: $color-secondary
    color: white

    &:hover, &.active
      background: lighten($color-secondary, 10%)

    &:disabled
      background: lighten($color-secondary, 30%)

  /* Success button theme */
  &.success
    background: $color-success
    color: white

    &:hover, &.active
      background: lighten($color-success, 10%)

    &:disabled
      background: lighten($color-success, 20%)

  /* Warning button theme */
  &.warning
    background: $color-warning

    &:hover, &.active
      background: lighten($color-warning, 10%)

    &:disabled
      background: lighten($color-warning, 20%)

  /* Failure button theme */
  &.failure
    background: $color-failure
    color: white

    &:hover, &.active
      background: lighten($color-failure, 10%)

    &:disabled
      background: lighten($color-failure, 20%)

</style>