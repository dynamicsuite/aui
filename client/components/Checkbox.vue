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
      :checked="checked"
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
     * Checkbox label.
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
     * The model binding value of the checkbox.
     *
     * @type {string | number | boolean | null}
     */
    value: {
      type: String | Number | Boolean | null,
      default: null
    },

    /**
     * If the checkbox is checked by default.
     *
     * @type {boolean | number}
     */
    checked: {
      type: Boolean | Number,
      default: false
    },

    /**
     * If the checkbox is disabled and non-interactive.
     *
     * @type {boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * Success subtext to display under the checkbox.
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
     * Failure subtext to display under the checkbox.
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
     * Subtext to display under the checkbox.
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
        parent: 'checkbox',
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

/* Checkbox structure */
.aui.checkbox

  /* Pseudo element styling */
  .pseudo:after
    left: 8px
    top: 4px
    width: 5px
    height: 10px
    border: solid white
    border-width: 0 3px 3px 0
    -webkit-transform: rotate(45deg)
    -ms-transform: rotate(45deg)
    transform: rotate(45deg)

  /* Offset subtext */
  .subtext
    margin-left: 2rem

</style>