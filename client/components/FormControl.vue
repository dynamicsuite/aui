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
  <div class="aui form-control" :class="container_classes">

    <!-- Custom label -->
    <slot name="label"></slot>

    <!-- Standard form control -->
    <label v-if="can_have_caps" class="standard-container">

      <!-- The label text -->
      <span v-if="label" class="label" v-html="label" />

      <!-- Components that can have leading/trailing caps -->
      <span class="cap-container">

        <!-- Leading cap -->
        <span v-if="leading_cap" class="leading-cap" v-html="leading_cap" />

        <!-- Trailing cap -->
        <span v-if="trailing_cap" class="trailing-cap" v-html="trailing_cap" />

        <!-- Parent content -->
        <slot />

      </span>

    </label>

    <!-- Pseudo form control -->
    <label v-if="has_pseudo" class="pseudo-container">

      <!-- Parent content -->
      <slot />

      <!-- The pseudo element -->
      <span v-if="has_pseudo" class="pseudo" />

      <!-- The label text -->
      <span v-if="label" class="label" v-html="label" />

    </label>

    <!-- WYSIWYG and slider form control -->
    <label v-if="is_wysiwyg && label" class="label" v-html="label" />
    <slot v-if="is_wysiwyg" />

    <!-- Slider form control -->
    <slot v-if="is_slider"></slot>

    <!-- Input subtext -->
    <span v-if="subtext_value" class="subtext">{{subtext_value}}</span>

  </div>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * Parent type of the form control component.
     *
     * @type {string}
     */
    parent: {
      type: String,
      required: true,
      validator(value) {
        return [
          'checkbox',
          'input',
          'radio',
          'select',
          'textarea',
          'toggle',
          'wysiwyg',
          'slider',
          'range'
        ].indexOf(value) !== -1;
      }
    },

    /**
     * Label text to display above the form control input.
     *
     * @type {string | null}
     */
    label: {
      type: String | null,
      required: false,
      default: null
    },

    /**
     * Content to display in the leading form control input cap.
     *
     * Free-form HTML.
     *
     * @type {string | null}
     */
    leading_cap: {
      type: String | null,
      default: null
    },

    /**
     * Content to display in the trailing form control input cap.
     *
     * Free-form HTML.
     *
     * @type {string | null}
     */
    trailing_cap: {
      type: String | null,
      default: null
    },

    /**
     * Success subtext to display under the form control input.
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
     * Failure subtext to display under the form control input.
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
     * Subtext to display under the form control input.
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
    },

    /**
     * If no icon should trail the form control input on feedback, for use in short length form control inputs.
     *
     * @type {boolean}
     */
    no_feedback_icon: {
      type: Boolean,
      default: false
    }

  },
  computed: {

    /**
     * Some parent components rely on a pseudo element.
     *
     * @returns {boolean}
     */
    has_pseudo() {
      return this.parent === 'checkbox' || this.parent === 'radio' || this.parent === 'toggle';
    },

    /**
     * If the form control component type can have leading/trailing caps.
     *
     * @returns {boolean}
     */
    can_have_caps() {
      return this.parent === 'input' || this.parent === 'select' || this.parent === 'textarea';
    },

    /**
     * If the form control is a container for a "what you see is what you get" editor.
     *
     * @returns {boolean}
     */
    is_wysiwyg() {
      return this.parent === 'wysiwyg';
    },

    /**
     * If the form control is a container for a slider.
     *
     * @returns {boolean}
     */
    is_slider() {
      return this.parent === 'slider' || this.parent === 'range';
    },

    /**
     * Class states for the form control component.
     *
     * @returns {object}
     */
    container_classes() {
      return {
        [this.parent]: true,
        'success': !!this.success,
        'failure': !!this.failure,
        'no-feedback-icon': this.no_feedback_icon
      };
    },

    /**
     * The value of the subtext text.
     *
     * @returns {string}
     */
    subtext_value() {
      if (typeof this.success === 'string') {
        return this.success;
      } else if (typeof this.failure === 'string') {
        return this.failure;
      } else {
        return this.subtext;
      }
    }

  },
  watch: {

    /**
     * Watch the failure state and scroll the view to the highest failed form control component.
     */
    failure() {
      const scroll_callback = () => {
        let view = document.getElementById('ds-view');
        if (!view) {
          view = document.body;
        }
        const el = document.querySelectorAll('.aui.form-control.failure')[0]
        if (el) {
          const box = el.getBoundingClientRect();
          view.scrollBy({
            top: box.top - box.height - 100,
            behavior: 'smooth'
          });
        }
      }
      clearTimeout(window.aui_form_control_failure_timeout);
      window.aui_form_control_failure_timeout = setTimeout(scroll_callback, 99);
    }

  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/*
 * Feedback styling.
 * Requires a color ($type) and a feedback icon SVG string ($feedback-icon).
 */
@mixin feedback($type, $feedback-icon)

  /* Background icon when not blocked */
  &:not(.no-feedback-icon) input, &:not(.no-feedback-icon) select
    background-image: url($feedback-icon)

  /* Pseudo element feedback */
  .pseudo-container

    /* Unchecked background */
    &:hover input:not(:checked) ~ .pseudo
      background: lighten($type, 20%)

    /* Checked background */
    input:checked ~ .pseudo
      background: $type

    /* Checked background */
    input:not(:checked) ~ .pseudo
      background: lighten($type, 30%)

  /* Border inputs */
  input, select, textarea, .pell-actionbar, .pell-content
    border: 1px solid $type !important

  /* Leading cap overrides */
  .leading-cap
    border-left: 1px solid $type !important
    border-top: 1px solid $type !important
    border-bottom: 1px solid $type !important

  /* Trailing cap overrides */
  .trailing-cap
    border-right: 1px solid $type !important
    border-top: 1px solid $type !important
    border-bottom: 1px solid $type !important

  /* Set subtext color */
  .subtext
    color: $type

/* Form control container */
.aui.form-control
  display: flex
  flex-direction: column

  /* Form control components that can have caps */
  .cap-container
    display: grid
    grid-template-columns: auto 1fr auto
    grid-auto-flow: dense

    /* Space label */
    &:not(:only-child)
      margin-top: 0.25rem

    /* Form control input caps */
    .leading-cap, .trailing-cap
      display: flex
      justify-content: center
      align-items: center
      font-size: 0.9rem
      padding: 0 0.5rem
      background: lighten($color-border, 10%)
      border: 1px solid $color-border
      white-space: nowrap

    /* Leading form control input cap */
    .leading-cap
      grid-column: 1
      justify-self: flex-start
      border-radius: 0.25rem 0 0 0.25rem
      margin-right: -2px

      /* Clear border radius against inputs */
      & ~ input, & ~ select, & ~ textarea
        border-top-left-radius: 0
        border-bottom-left-radius: 0
        padding-left: calc(0.5rem + 1px)

    /* Trailing form control input cap */
    .trailing-cap
      grid-column: 3
      justify-self: flex-end
      border-radius: 0 0.25rem 0.25rem 0
      margin-left: -2px

      /* Clear border radius against inputs */
      & ~ input, & ~ select, & ~ textarea
        border-top-right-radius: 0
        border-bottom-right-radius: 0
        padding-right: calc(0.5rem + 1px)

    /* The actual form control inputs */
    input, select, textarea
      min-width: 0
      grid-column: 2
      font-size: 1rem
      padding: 0.5rem
      border-radius: 0.25rem
      border: 1px solid $color-border
      background: $color-text-inverted
      text-overflow: ellipsis
      margin: 0 // Required for iOS
      -moz-box-sizing: border-box
      -webkit-box-sizing: border-box
      box-sizing: border-box
      min-height: 2rem
      //min-width: 2rem

      /* Clear chrome outline */
      &:focus
        outline: none
        box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.8)

      /* Darken background when disabled */
      &:disabled
        opacity: 1
        cursor: not-allowed
        background-color: darken($color-border, 5%) !important

    /* Height normalization */
    input
      height: 1.25rem

    /* Height normalization */
    select
      min-height: 1.25rem

  /* Form control components that use a pseudo element */
  .pseudo-container
    display: flex
    cursor: pointer
    user-select: none

    /* Label alignment */
    .label
      display: flex
      align-items: center

    /* Darken on hover */
    &:hover .pseudo
      background: darken($color-border, 10%)

    /* Checkmark/circle */
    & > .pseudo:after
      content: ""
      position: absolute
      display: none

    /* Pseudo element overrides */
    & > input:checked ~ .pseudo:after
      display: flex

    /* Input overrides */
    input
      position: absolute
      opacity: 0

      /* Disabled overrides */
      &:disabled ~ .pseudo, &:disabled ~ .label
        cursor: not-allowed

      /* Disabled overrides */
      &:disabled ~ .pseudo
        background: darken($color-border, 5%)

      /* Background when checked and not disabled */
      &:checked:not(:disabled) ~ .pseudo
        background: $color-primary

      /* Background when checked and disabled */
      &:checked:disabled ~ .pseudo
        background: $color-secondary

    /* Checkmark styling */
    .pseudo
      position: relative
      min-height: 1.5rem
      min-width: 1.5rem
      margin-right: 0.5rem
      background: $color-border

  /* Subtext override */
  &.radio .subtext, &.checkbox .subtext
    margin-left: 2rem

  /* Subtext styling */
  .subtext
    margin-top: 0.25rem
    font-size: 0.8rem
    color: $color-text-soft
    text-align: left

  /* Background icon when not blocked */
  &.success:not(.no-feedback-icon) input,
  &.success:not(.no-feedback-icon) select,
  &.failure:not(.no-feedback-icon) input,
  &.failure:not(.no-feedback-icon) select
    padding-right: 2.5rem
    background-repeat: no-repeat
    background-position: right 0.5rem center
    background-size: 1.25rem

  /* Success feedback overrides */
  &.success
    @include feedback($color-success, "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3cpath fill='%2338af47' d='M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001'/%3e%3c/svg%3e")

  /* Failure feedback overrides */
  &.failure
    @include feedback($color-failure, "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3cpath fill='%23e24848' d='M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z'/%3e%3c/svg%3e")

</style>