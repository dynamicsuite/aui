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
  <div class="aui tabs">
    <span
      v-if="!collapsed"
      v-for="(name, tab) in tabs"
      v-html="name"
      class="tab"
      :class="tabClass(tab)"
      @click="handleClick(tab)"
    />
    <aui-button-drop
      v-if="collapsed"
      :dropdown="tabs"
      :text="tabs[tab]"
      @menu-click="handleClick"
      menu_align="left"
    />
  </div>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * The tabs to render. This must be a simple <string, string> key-value object where the key is the tab
     * name and the value is the name to display.
     *
     * @type {object}
     */
    tabs: {
      type: Object,
      required: true
    },

    /**
     * The current tab (key).
     *
     * @type {string | number}
     */
    tab: {
      type: String | Number,
      required: true
    },

    /**
     * If the tabs are disabled and non-interactive.
     *
     * @type {boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      width: 0,
      collapsed: false
    }
  },
  methods: {

    /**
     * Handle the clicking of tabs and update the current tab.
     *
     * @param {string} tab - The clicked tab.
     * @returns {undefined}
     */
    handleClick(tab) {
      if (!this.disabled) {
        this.$emit('update:tab', tab);
        this.$emit('change', tab);
      }
    },

    /**
     * Calculate which classes to use for the given tab.
     *
     * @param {string} tab - The given tab to calculate.
     * @returns {
     *   {disabled: boolean},
     *   {active: boolean}
     * }
     */
    tabClass(tab) {
      return {
        disabled: this.disabled,
        active: tab === this.tab
      };
    },

    /**
     * Check and set the collapsed state.
     *
     * @returns {undefined}
     */
    checkIfCollapsed() {
      window.requestAnimationFrame(() => {
        this.collapsed =
            this.$el.clientWidth <= this.width ||
            this.width + 40 >= this.$el.parentElement.clientWidth;
      });
    }

  },
  mounted() {

    // Listen for window resizes
    window.addEventListener('resize', this.checkIfCollapsed);

    // Check to see how wide the tabs are (in pixels) and then checks if it exceeds the window width
    this.$nextTick(() => {
      for (let i = 0; i < this.$el.childNodes.length; i++) {
        if (typeof this.$el.childNodes[i].offsetWidth !== 'number') {
          continue;
        }
        this.width += this.$el.childNodes[i].offsetWidth + 1;
      }
      this.width += 32;
      this.checkIfCollapsed();
    });

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfCollapsed);
  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* Tabs container */
.aui.tabs
  display: flex
  padding: calc(0.5rem - 1px) 1rem
  border-bottom: 1px solid #ced4da

  /* Collapsed tabs dropdown */
  .btn-drop .btn
    padding: calc(0.5rem + 2px) 1rem

    /* Match tabs */
    span
      margin-top: 1px

  /* Global margin adjustment */
  & > *
    margin-bottom: -0.5rem

  /* Individual tabs */
  .tab
    padding: calc(0.5rem + 2px) 1rem
    margin-right: 1rem
    font-size: 1rem
    cursor: pointer
    white-space: nowrap
    user-select: none
    -webkit-touch-callout: none
    -webkit-user-select: none
    position: relative

    /* Non-active tabs */
    &:not(.active)
      border-left: 1px solid rgba(255, 255, 255, 0)
      border-top: 1px solid rgba(255, 255, 255, 0)
      border-right: 1px solid rgba(255, 255, 255, 0)

    /* Active tabs */
    &.active
      border-bottom: 1px solid $color-container
      border-left: 1px solid $color-border
      border-top: 1px solid transparent
      border-right: 1px solid $color-border

      /* Active border */
      &::before
        content: ''
        position: absolute
        left: -1px
        top: -3px
        width: calc(100% + 2px)
        height: 3px
        background: $color-primary

    /* Disabled tabs */
    &.disabled
      color: #777

      /* Block the cursor when hovering disabled tabs */
      &:hover
        cursor: not-allowed

  /* Button dropdown styling for when the tabs are collapsed */
  .btn
    background: none
    color: $color-text
    border-bottom: 1px solid $color-container
    border-left: 1px solid $color-border
    border-top: 1px solid $color-border
    border-right: 1px solid $color-border
    border-radius: 0.25rem 0.25rem 0 0
    z-index: 3

    /* Color overrides */
    &:hover, &:focus, &.active
      background: none
      color: black

  /* Dropdown overrides */
  .dropdown
    top: 3rem

</style>