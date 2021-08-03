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
      type="radio"
      :name="name"
      :value="data"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
    />
  </aui-form-control>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * Radio label.
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
     * Data value of the radio.
     *
     * @type {string | number | boolean | null}
     */
    data: {
      type: String | Number | Boolean | null,
      default: null
    },

    /**
     * The model binding value of the radio.
     *
     * @type {string | number | boolean | null}
     */
    value: {
      type: String | Number | Boolean | null,
      default: null
    },

    /**
     * The name attribute to group the radio with.
     *
     * @type {string}
     */
    name: {
      type: String,
      required: true
    },

    /**
     * If the radio is disabled and non-interactive.
     *
     * @type {boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * Success subtext to display under the radio.
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
     * Failure subtext to display under the radio.
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
     * Subtext to display under the radio.
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
        parent: 'radio',
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

/* Radio structure */
.aui.radio

  /* Pseudo element styling */
  .pseudo:after
    content: ""
    position: absolute
    display: none
    top: 8px
    left: 8px
    width: 8px
    height: 8px
    border-radius: 50%
    background: white

  /* Pseudo element styling */
  .pseudo
    border-radius: 50%

</style>