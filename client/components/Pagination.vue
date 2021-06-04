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
  <div class="aui pagination">

    <!-- Display range text -->
    <div class="range">
      <label>Showing</label>
      <select :disabled="disabled" @change="updateLimit" :value="limit">
        <option
          v-for="range_limit in list_range_limit"
          :key="'page-limit-' + range_limit"
          :value="range_limit"
          v-html="range_limit"
        />
      </select>
      <span>from {{from.toLocaleString()}} to {{to.toLocaleString()}} of {{total.toLocaleString()}}</span>
    </div>

    <!-- Pagination buttons  -->
    <div v-if="pages > 1" class="aui paginate-group">

      <!-- Left Chevrons -->
      <aui-button
        type="none"
        class="chevron"
        text="«"
        :disabled="disabled"
        @click="paginate(1)"
      />
      <aui-button
        type="none"
        class="chevron"
        text="‹"
        :disabled="disabled"
        @click="paginate(page - 1)"
      />

      <!-- Page buttons -->
      <aui-button
        v-for="(page, key) in button_range"
        :key="'pagination-' + key"
        :type="paginateButtonType(page)"
        :disabled="disabled"
        class="page-button"
        @click="paginate(page)"
      />

      <!-- Right Chevrons -->
      <aui-button
        type="none"
        class="chevron"
        text="›"
        :disabled="disabled"
        @click="paginate(page + 1)"
      />
      <aui-button
        type="none"
        class="chevron"
        text="»"
        :disabled="disabled"
        @click="paginate(pages)"
      />

    </div>

    <!-- Single page display -->
    <div v-else class="single-page"><strong>1</strong> / <strong>1</strong></div>

  </div>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * If the buttons are disable and non-interactive.
     *
     * @type {boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * The current page.
     *
     * @type {number}
     */
    page: {
      type: Number,
      required: true
    },

    /**
     * The total number of potential records in the dataset.
     *
     * @type {number}
     */
    total: {
      type: Number,
      required: true
    },

    /**
     * The record limit per page.
     *
     * @type {number}
     */
    limit: {
      type: Number,
      required: true
    },

    /**
     * The possible limit options for the dropdown.
     *
     * @type {number[]}
     */
    list_range_limit: {
      type: Array,
      required: true
    }

  },
  computed: {

    /**
     * The total number of available pages.
     *
     * @returns {number}
     */
    pages() {
      return Math.ceil(this.total / this.limit);
    },

    /**
     * The offset value of current page.
     *
     * @returns {number}
     */
    offset() {
      let offset = (this.page - 1) * this.limit;
      if (offset > this.total) {
        offset = this.total - this.limit
        this.$emit('update:page', this.pages);
      }
      return offset;
    },

    /**
     * The beginning of the viewable range.
     *
     * @returns {number}
     */
    from() {
      return this.offset + 1;
    },

    /**
     * Ending of the viewable range.
     *
     * @returns {number}
     */
    to() {
      let to = this.from + this.limit - 1;
      if (to > this.total) {
        to = this.total;
      }
      return to;
    },

    /**
     * The range of buttons to render.
     *
     * Each button represents it's respective page that clicking will paginate to.
     *
     * @returns {number[]}
     */
    button_range() {
      const range = [];
      if (this.pages < 5) {
        for (let i = 1; i <= this.pages; i++) {
          range.push(i);
        }
      } else if (this.page < 3) {
        for (let i = 1; i <= 5; i++) {
          range.push(i);
        }
      } else {
        const at_end = this.page + 2 > this.pages
        const offset = !at_end ? this.page + 2 : this.pages;
        for (let i = at_end ? this.pages - 4 : this.page - 2; i <= offset; i++) {
          range.push(i);
        }
      }
      return range;
    }

  },
  methods: {

    /**
     * Update the limit from the range limits.
     *
     * @param {object} event - The change event handler.
     * @returns {undefined}
     */
    updateLimit(event) {
      this.$emit('update:limit', parseInt(event.target.value));
      this.$emit('update:page', 1);
      this.$emit('paginate');
    },

    /**
     * Emit a page back to the parent to be paginated.
     *
     * @param {number} page - The page to paginate to.
     * @returns {undefined}
     */
    paginate(page) {

      // Do not allow pagination when disabled
      if (this.disabled) {
        return;
      }

      // Ignore current page clicks
      if (page === this.page) {
        return;
      }

      // Do not paginate out of range
      if (page < 1 || page > this.pages) {
        return;
      }

      // Emit the pagination to the given page
      this.$emit('update:page', page);
      this.$emit('paginate');

    },

    /**
     * Get the button type for the given pagination button page.
     *
     * The button for the current page should be primary, all others should be secondary.
     *
     * @param {number | string} page - The page number.
     * @return {string}
     */
    paginateButtonType(page) {
      return this.page === parseInt(page) ? 'primary' : 'none';
    }

  }
}
</script>

<style lang="sass">

/* Import AUI Core */
@import "../sass/aui"

/* Pagination container */
.aui.pagination
  display: flex
  align-items: center
  justify-content: center
  flex-wrap: wrap

  /* Split range and buttons on mobile view */
  @media (max-width: 680px)
    flex-direction: column

  /* Range display */
  .range
    white-space: nowrap

    /* Lower font size for ipads and lower */
    @media (max-width: 680px)
      font-size: 0.9rem

    /* Separate from buttons on mobile view */
    @media (max-width: 680px)
      display: flex
      flex-direction: column
      margin-bottom: 0.5rem

      /* Align rows */
      label, select
        text-align: center
        margin-bottom: 0.5rem !important

    /* Select for limit */
    select
      height: 2rem
      padding: 0 0.25rem
      margin: 0 0.35rem
      border-radius: 0.25rem
      border: 1px solid $color-border
      text-align-last: center
      background: $color-text-inverted

      /* When disabled */
      &:disabled
        cursor: not-allowed
        background: darken($color-border, 5%) !important

      /* Remove chrome outline */
      &:focus
        outline: none

  /* Pagination buttons */
  .paginate-group
    display: flex
    margin-left: auto

    /* Mobile buttons */
    @media (max-width: 680px)
      margin-left: 0

      /* Buttons on mobile */
      .page-button:not(.primary)
        display: none

    /* Pagination buttons */
    .aui.btn
      font-size: 0.8rem

      &:not(.primary)
        color: $color-secondary

      &:not(.primary):hover
        color: black

      /* Custom styling to override the default aui primary class */
      &.primary
        border: 1px solid $color-secondary
        background: none
        color: black
        font-weight: bold

      /* Chevron buttons */
      &.chevron
        font-size: 1rem

  /* Single page replacement for buttons */
  .single-page
    display: flex
    margin-left: auto

    @media (max-width: 680px)
      display: none

</style>