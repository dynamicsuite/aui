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
  <aui-form-control v-bind="properties">
    <input
      type="checkbox"
      :value="value"
      :checked="toggled"
      :disabled="disabled"
      @input="$emit('input', $event.target.checked)"
    />
  </aui-form-control>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * Toggle label.
     *
     * This is an alias for the slot content when using plaintext.
     *
     * Slot should be used if custom HTML is required.
     *
     * @type {string | null}
     */
    label: {
      type: String | null,
      default: null
    },

    /**
     * The model binding value of the toggle.
     *
     * @type {string | number | boolean | null}
     */
    value: {
      type: String | Number | Boolean | null,
      default: null
    },

    /**
     * If the toggle is toggled by default.
     *
     * @type {boolean | number}
     */
    toggled: {
      type: Boolean | Number,
      default: false
    },

    /**
     * If the toggle is disabled and non-interactive.
     *
     * @type {boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * Success subtext to display under the toggle.
     *
     * Subtext values override each other in the following order, only one may be present at a time:
     *
     * success > failure > subtext
     *
     * @type {string | null}
     */
    success: {
      type: String | null,
      default: null
    },

    /**
     * Failure subtext to display under the toggle.
     *
     * Subtext values override each other in the following order, only one may be present at a time:
     *
     * success > failure > subtext
     *
     * @type {string | null}
     */
    failure: {
      type: String | null,
      default: null
    },

    /**
     * Subtext to display under the toggle.
     *
     * Subtext values override each other in the following order, only one may be present at a time:
     *
     * success > failure > subtext
     *
     * @type {string | null}
     */
    subtext: {
      type: String | null,
      default: null
    }

  },
  computed: {

    /**
     * Properties to pass down to the form control component.
     *
     * @returns {
     *   {parent: string},
     *   {label: string},
     *   {success: string},
     *   {failure: string},
     *   {subtext: string}
     * }
     */
    properties() {
      return {
        parent: 'toggle',
        label: this.$slots.default ? this.$slots.default : this.label,
        success: this.success,
        failure: this.failure,
        subtext: this.subtext
      };
    }

  }
}
</script>

<style lang="sass">

/* Toggle structure */
.aui.toggle

  /* Pseudo element */
  .pseudo
    width: 56px !important
    height: 28px !important
    cursor: pointer
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: #ccc
    -webkit-transition: 0.1s
    transition: 0.1s
    border-radius: 34px

    /* Slider circle */
    &:before
      position: absolute
      content: ""
      height: 20px
      width: 20px
      left: 4px
      bottom: 4px
      background: white
      -webkit-transition: 0.1s
      transition: 0.1s
      border-radius: 50%

  /* Slider transition */
  input:checked ~ .pseudo:before
    -webkit-transform: translateX(28px)
    -ms-transform: translateX(28px)
    transform: translateX(28px)

  /* Offset subtext */
  .subtext
    margin-left: calc(56px + 0.5rem)

</style>