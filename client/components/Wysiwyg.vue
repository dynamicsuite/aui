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
    <div ref="editor" />
  </aui-form-control>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * WYSIWYG label.
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
     * Pell action bar actions.
     *
     * @type {string[]}
     */
    actions: {
      type: Array,
      default: () => ['bold', 'italic', 'underline', 'heading1', 'ulist', 'olist']
    },

    /**
     * Default HTML tag separator for paragraphs.
     *
     * @type {string}
     */
    default_paragraph_separator: {
      type: String,
      default: 'p'
    },

    /**
     * If the content should be styled with CSS vs tags.
     *
     * @type {boolean}
     */
    style_with_css: {
      type: Boolean,
      default: true
    },

    /**
     * Custom Pell widget classes.
     *
     * @type {object}
     */
    classes: {
      type: Object,
      default: () => {
        return {
          actionbar: 'pell-actionbar',
          button: 'pell-btn',
          content: 'pell-content',
          selected: 'pell-button-selected'
        }
      }
    },

    /**
     * The model binding value of the WYSIWYG.
     *
     * @type {string | number | boolean | null}
     */
    value: {
      type: String | Number | Boolean | null,
      default: null
    },

    /**
     * WYSIWYG placeholder text.
     *
     * @type {string | null}
     */
    placeholder: {
      type: String | null,
      default: null
    },

    /**
     * If the WYSIWYG is disabled and non-interactive.
     *
     * @type {boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * Success subtext to display under the WYSIWYG.
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
     * Failure subtext to display under the WYSIWYG.
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
     * Subtext to display under the WYSIWYG.
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
  data() {
    return {
      editor: null
    };
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
        parent: 'wysiwyg',
        label: this.$slots.default ? this.$slots.default : this.label,
        success: this.success,
        failure: this.failure,
        subtext: this.subtext
      };
    }

  },
  watch: {

    /**
     * Update the value on model changes.
     *
     * @param {string} value - The new value.
     * @returns {undefined}
     */
    value: function (value) {
      if (this.editor.content.innerHTML !== value) {
        this.editor.content.innerHTML = value;
      }
    },

    /**
     * Adjust the disabled state.
     *
     * @param {string} value - The new disabled state.
     * @returns {undefined}
     */
    disabled: function (value) {
      this.$refs.editor
        .querySelector('.pell-content')
        .setAttribute('contenteditable', value ? 'false' : 'true');
    }

  },
  mounted() {
    this.editor = pell.init({
      element: this.$refs.editor,
      actions: this.actions,
      defaultParagraphSeparator: this.default_paragraph_separator,
      styleWithCSS: this.style_with_css,
      classes: this.classes,
      onChange: html => {
        this.$emit('input', html);
      }
    });
    this.$refs.editor
      .querySelector('.pell-content')
      .setAttribute('contenteditable', this.disabled ? 'false' : 'true');
    if (this.value) {
      this.editor.content.innerHTML = this.value;
    }
  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* WYSIWYG structure */
.aui.wysiwyg

  /* Success feedback */
  &.success .pell-actionbar, &.failure .pell-actionbar
    border-bottom: none !important

  /* Editor action bar area */
  .pell-actionbar
    display: flex
    background: lighten($color-border, 15%)
    border-top-left-radius: 0.25rem
    border-top-right-radius: 0.25rem
    border: 1px solid $color-border

    /* Action bar buttons */
    .pell-btn
      display: flex
      justify-content: center
      align-content: center
      font-size: 1.2rem
      height: 2.5rem
      line-height: 2.5rem
      width: 2.5rem
      background: none
      border: none
      outline: none

      /* Selection overrides */
      &:hover, &.pell-button-selected
        cursor: pointer
        background: lighten($color-border, 10%)

  /* Editor content */
  .pell-content
    padding: 0.75rem
    min-height: 4rem
    border-left: 1px solid $color-border
    border-right: 1px solid $color-border
    border-bottom: 1px solid $color-border
    border-radius: 0 0 0.25rem 0.25rem
    background: white
    overflow-y: scroll

    /* Disabled editor */
    &[contenteditable="false"]
      cursor: not-allowed !important
      background: darken($color-border, 5%) !important

    /* Editor focus */
    &:focus
      outline: none
      box-shadow: 0 2px 5px 0 #ccc inset

    /* Resets */
    p
      margin: 0
      padding: 0

</style>