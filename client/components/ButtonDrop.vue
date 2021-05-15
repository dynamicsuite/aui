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
  <div class="aui btn-drop" ref="dropdown">

    <!-- The button to toggle the dropdown -->
    <button class="aui btn" :class="style_class" :disabled="is_disabled" @click="toggle">
      <span v-if="text || $slots.default"><slot>{{text}}</slot></span>
      <i :class="icon_class" />
    </button>

    <!-- The dropdown list -->
    <ul v-show="show_dropdown" class="dropdown" ref="menu" :class="list_classes">
      <li v-for="(text, event) in dropdown" :key="'entry-' + event" @click="handleClick(event)">{{text}}</li>
    </ul>

  </div>
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
     * The dropdown menu entries.
     *
     * The key of each entry is the event name that is emitted back to the parent.
     *
     * The value of each entry is the name (text) that is displayed for the menu row.
     *
     * @type {object}
     */
    dropdown: {
      type: Object,
      required: true,
      validator(value) {
        for (const key in value) {
          if (typeof value[key] !== 'string') {
            return false;
          }
        }
        return true;
      }
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
     * The icon classes to apply when the dropdown is inactive.
     *
     * @type {string}
     */
    icon_inactive: {
      type: String,
      default: 'fas fa-caret-down'
    },

    /**
     * The icon classes to apply when the dropdown is active.
     *
     * @type {string}
     */
    icon_active: {
      type: String,
      default: 'fas fa-caret-up'
    },

    /**
     * Where to align the dropdown relative to the button.
     *
     * Accepts: left, right
     *
     * @type {string}
     */
    menu_align: {
      type: String,
      default: 'right',
      validator(value) {
        return ['left', 'right'].indexOf(value) !== -1;
      }
    },

    /**
     * Relative container for the dropdown placement.
     *
     * Used to avoid clipping out of parent element.
     *
     * @type {string | null}
     */
    relative_to: {
      type: String | null,
      default: null
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
    },

    /**
     * The icon class for the dropdown.
     *
     * @returns {string}
     */
    icon_class() {
      return this.show_dropdown ? this.icon_active : this.icon_inactive;
    },

    /**
     * Style classes to apply to the dropdown menu.
     *
     * @returns {object}
     */
    list_classes() {
      return {
        top: !!this.anchor_top,
        [this.menu_align_master]: !!this.menu_align_master,
        [this.menu_align]: !this.menu_align_master
      };
    }

  },
  data() {
    return {
      show_dropdown: false,
      anchor_top: false,
      menu_align_master: null
    }
  },
  methods: {

    /**
     * Handle the dropdown menu click event.
     *
     * @param {string} key - The event name (key).
     * @returns {undefined}
     */
    handleClick(key) {
      this.$emit(key);
      this.$emit('menu-click', key);
      this.show_dropdown = false;
    },

    /**
     * Toggle the dropdown menu.
     *
     * @returns {undefined}
     */
    toggle() {

      this.show_dropdown = !this.show_dropdown;
      this.menu_align_master = null;
      this.anchor_top = false;

      this.$nextTick(() => {

        // Hide the element
        this.$refs['menu'].style.opacity = '0';

        // Get element dimensions
        const rect = this.$refs['menu'].getBoundingClientRect();
        let space_below = window.innerHeight - rect.bottom;
        let space_right = window.innerWidth - rect.right;
        if (this.relative_to) {
          const element = this.$refs['menu'].closest(this.relative_to);
          if (element) {
            space_below = element.offsetHeight - rect.bottom;
            space_right = element.offsetWidth - rect.right;
          }
        }

        // If the element is too close to the right edge, assign a left anchor
        if (space_right < 0) {
          this.menu_align_master = 'right';
        }

        // If the element is too close to the bottom edge, assign it a top anchor
        if (space_below < 0) {
          this.anchor_top = true;
        }

        // Un-hide the element
        this.$refs['menu'].style.opacity = '1';

      });
    },

    /**
     * Reset the visibility state when clicking outside the component.
     *
     * @param {object} event - The click event.
     * @returns {undefined}
     */
    blurDropdownMenu(event) {
      if (!this.$refs.dropdown.contains(event.target)) {
        this.show_dropdown = false;
      }
    }

  },
  created() {
    window.addEventListener('click', this.blurDropdownMenu);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.blurDropdownMenu);
  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* Button group container */
.aui.btn-drop
  display: inline-flex
  position: relative
  align-self: flex-start

  /* Disable browser outline */
  &:focus
    outline: none !important

  /* FontAwesome icon class on the dropdown button */
  .btn > i
    font-size: 0.9rem
    margin: 0 !important

  .btn > span
      margin-right: 0.5rem

  /* Dropdown menu when the button is pressed */
  .dropdown
    position: absolute
    top: 2.25rem
    margin: 0
    padding: 0.5rem 1rem
    background: white
    border: 1px solid $color-border
    border-radius: 0.25rem
    list-style: none
    z-index: 1

    /* Disable browser outline */
    &:focus
      outline: none !important

    /* Left aligned list */
    &.left
      left: 0

    /* Right aligned list */
    &.right
      right: 0

    /* Top attached list */
    &.top
      top: auto
      right: 0
      bottom: 2.25rem

    /* Dropdown entries */
    li
      white-space: nowrap
      text-align: left
      word-break: break-all
      cursor: pointer

      &:not(:only-child):not(:last-child)
        margin-bottom: 0.5rem

      /* List selection styling */
      &:hover
        text-decoration: underline
        color: $color-primary

</style>