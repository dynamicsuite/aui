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
  <div v-if="show" class="aui alert" :class="style_class">

    <!-- Alert content -->
    <div>
      <h3 v-if="title">{{title}}</h3>
      <slot>{{text}}</slot>
    </div>

    <!-- The close button -->
    <i v-if="closeable" class="fa fa-times close" @click="handleClose" />

  </div>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * The alert type.
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
     * An optional title for the alert to display above the alert message.
     *
     * @type {string}
     */
    title: {
      type: String,
    },

    /**
     * The body of the alert.
     *
     * This is an alias for the slot content when using plaintext.
     *
     * Slot should be used if custom HTML is required.
     *
     * @type {string | null}
     */
    text: {
      type: String | null,
      required: false
    },

    /**
     * If the alert is shown and rendered on the DOM.
     *
     * @type {boolean | string | null}
     */
    show: {
      type: Boolean | String | null,
      default: true
    },

    /**
     * If the alert is closable by the user.
     *
     * @type {boolean}
     */
    closeable: {
      type: Boolean,
      default: false
    }

  },
  computed: {

    /**
     * Style class for the alert container.
     *
     * @returns {object}
     */
    style_class() {
      return {
        [this.type]: this.type !== 'none'
      };
    }

  },
  methods: {

    /**
     * Handle the close functionality.
     *
     * @returns {undefined}
     */
    handleClose() {
      this.$emit('update:show', false);
      this.$emit('close');
    }

  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* Alert container */
.aui.alert
  display: flex
  padding: 0.5rem
  border-radius: 0.25rem

  /* Margin override */
  & > div:first-of-type > h3:first-of-type
    margin: 0

  /* Alert close button */
  .close
    margin-left: auto
    font-size: 1rem
    cursor: pointer

  /* Primary alert theme */
  &.primary
    background: lighten($color-primary, 55%)
    color: $color-primary
    border: 1px solid lighten($color-primary, 45%)

  /* Secondary alert theme */
  &.secondary
    background: $color-text-inverted
    color: $color-secondary
    border: 1px solid $color-border

  /* Success alert theme */
  &.success
    background: lighten($color-success, 35%)
    color: darken($color-success, 15%)
    border: 1px solid lighten($color-success, 30%)

  /* Warning alert theme */
  &.warning
    background: lighten($color-warning, 35%)
    color: darken($color-warning, 25%)
    border: 1px solid lighten($color-warning, 20%)

  /* Failure alert theme */
  &.failure
    background: lighten($color-failure, 35%)
    color: darken($color-failure, 15%)
    border: 1px solid lighten($color-failure, 30%)

</style>