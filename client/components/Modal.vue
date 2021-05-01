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
  <div v-if="show" class="aui modal-container" @mousedown.self="handleClose">
    <div class="modal">
      <div v-if="title" class="header" :class="type">
        <span>{{title}}</span>
        <i v-if="closeable" class="fas fa-times" @click.self="handleClose" />
      </div>
      <div class="body">
        <slot>
          <section class="content">
            <slot name="content" />
          </section>
          <footer>
            <div v-if="$slots.left" class="left">
              <slot name="left" />
            </div>
            <div v-if="$slots.right" class="right">
              <slot name="right" />
            </div>
          </footer>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * The modal type.
     *
     * This determines the style class applied.
     *
     * @type {string | null}
     */
    type: {
      type: String | null,
      default: 'primary',
      validator(value) {
        return [null, 'primary', 'secondary', 'success', 'warning', 'failure'].indexOf(value) !== -1;
      }
    },

    /**
     * If the modal should be shown.
     *
     * @type {boolean}
     */
    show: {
      type: Boolean,
      required: true
    },

    /**
     * The title bar text of the modal.
     *
     * @type {string | number | null}
     */
    title: {
      type: String | Number | null,
      default: null
    },

    /**
     * If the modal is closeable.
     *
     * @type {boolean}
     */
    closeable: {
      type: Boolean,
      default: true
    }

  },
  watch: {

    /**
     * Show watcher for overflow.
     */
    show(value) {
      if (value) {
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      } else {
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
      }
    }

  },
  methods: {

    /**
     * Run close binding for the escape key press.
     *
     * @param {object} event - The keydown event.
     * @returns {undefined}
     */
    escapeClose(event) {
      if (event.key === 'Escape') {
        this.handleClose();
      }
    },

    /**
     * Actually close the modal (if possible).
     *
     * @returns {undefined}
     */
    handleClose() {
      if (this.closeable) {
        this.$emit('close');
        this.$emit('update:show', false);
      }
    }

  },
  mounted() {
    if (this.closeable) {
      document.addEventListener('keyup', this.escapeClose);
    }
  },
  beforeDestroy() {
    if (this.closeable) {
      document.removeEventListener('keyup', this.escapeClose);
    }
  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* The modal container */
.aui.modal-container
  position: fixed
  top: 0
  left: 0
  height: 100%
  width: 100%
  background: rgba(0, 0, 0, 0.8)
  z-index: 99
  display: flex
  justify-content: center
  align-items: center

  /* The modal itself */
  .modal
    display: flex
    flex-direction: column
    z-index: 100
    max-width: 600px
    min-width: 300px
    max-height: 80%
    width: 100%
    margin: 0 0.5rem

    /* Pad out modal contents */
    & > *
      padding: 1rem

    /* Header, if present */
    .header
      display: flex
      padding: 0
      justify-content: space-between
      align-items: center
      border-bottom: 1px solid #ced4da
      border-radius: 0.25rem 0.25rem 0 0

      /* Header theme - Primary */
      &.primary
        color: $color-text-inverted
        background: $color-primary

      /* Header theme - Secondary */
      &.secondary
        color: $color-text-inverted
        background: $color-secondary

      /* Header theme - Success */
      &.success
        color: $color-text-inverted
        background: $color-success

      /* Header theme - Warning */
      &.warning
        background: $color-warning

      /* Header theme - Failure */
      &.failure
        color: $color-text-inverted
        background: $color-failure

      /* Modal header title */
      span
        font-weight: bold
        font-size: 1.125rem
        margin: 1rem

      /* Modal close button */
      .fas.fa-times
        padding: 0.5rem 0.6rem
        margin: 0.5rem
        cursor: pointer
        border-radius: 50%

        &:hover
          background: rgba(0, 0, 0, 0.2)

    /* Modal slot body */
    .body
      background: $color-container
      border-radius: 0 0 0.25rem 0.25rem
      overflow-y: auto

      /* Strip common margins */
      .content > *:first-child
        margin-top: 0

      /* Strip common margins */
      .content > *:last-child
        margin-bottom: 0

    /* Borders for when no header is present */
    .body:only-child
      border-radius: 0.25rem

    /* Footer bar*/
    footer
      display: flex
      border-top: 1px solid $color-border
      padding-top: 0.5rem
      margin-top: 1rem

      /* Justify right content */
      .right
        margin-left: auto

</style>