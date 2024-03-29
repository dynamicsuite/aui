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
    <select
      ref="select"
      :value="value"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :multiple="multiple"
      :size="size"
      v-model="selected"
      @focus="$emit('focus', $event.target)"
      @blur="$emit('blur', $event.target)"
      @change="$emit('input', selected)"
    >
      <option v-for="(option, key) in render_options" :key="'option-' + key" :value="key">
        {{option}}
      </option>
    </select>
  </aui-form-control>
</template>

<script>
// noinspection JSValidateTypes
export default {
  props: {

    /**
     * Select label.
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
     * Content to display in the leading select cap.
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
     * Content to display in the trailing select cap.
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
     * The model binding value of the select.
     *
     * @type {string | number | boolean | null}
     */
    value: {
      type: String | Number | Boolean | null,
      default: null
    },

    /**
     * Select autocomplete value.
     *
     * @type {string | null}
     */
    autocomplete: {
      type: String | null,
      default: null
    },

    /**
     * If the select is disabled and non-interactive.
     *
     * @type {boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * Options to be rendered.
     *
     * This must be an object where the key is the value that will be assigned to the option and the value is
     * the option label.
     *
     * @type {object | array}
     */
    options: {
      type: Object | Array,
      default: () => ({})
    },

    /**
     * If it is possible to select multiple entries.
     *
     * @type {boolean}
     */
    multiple: {
      type: Boolean,
      default: false
    },

    /**
     * The number of visible options.
     *
     * @type {string | number | null}
     */
    size: {
      type: String | Number | null,
      default: null
    },

    /**
     * Success subtext to display under the select.
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
     * Failure subtext to display under the select.
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
     * Subtext to display under the select.
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
     * If no icon should trail the select on feedback, for use in short length selects.
     *
     * @type {boolean}
     */
    no_feedback_icon: {
      type: Boolean,
      default: false
    },

    /**
     * If the select should render US states as its options.
     *
     * @type {boolean}
     */
    us_states: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      selected: this.value,
      states: {
        '0': '',
        'AL': 'Alabama',
        'AK': 'Alaska',
        'AS': 'American Samoa',
        'AZ': 'Arizona',
        'AR': 'Arkansas',
        'CA': 'California',
        'CO': 'Colorado',
        'CT': 'Connecticut',
        'DE': 'Delaware',
        'DC': 'District Of Columbia',
        'FM': 'Federated States Of Micronesia',
        'FL': 'Florida',
        'GA': 'Georgia',
        'GU': 'Guam',
        'HI': 'Hawaii',
        'ID': 'Idaho',
        'IL': 'Illinois',
        'IN': 'Indiana',
        'IA': 'Iowa',
        'KS': 'Kansas',
        'KY': 'Kentucky',
        'LA': 'Louisiana',
        'ME': 'Maine',
        'MH': 'Marshall Islands',
        'MD': 'Maryland',
        'MA': 'Massachusetts',
        'MI': 'Michigan',
        'MN': 'Minnesota',
        'MS': 'Mississippi',
        'MO': 'Missouri',
        'MT': 'Montana',
        'NE': 'Nebraska',
        'NV': 'Nevada',
        'NH': 'New Hampshire',
        'NJ': 'New Jersey',
        'NM': 'New Mexico',
        'NY': 'New York',
        'NC': 'North Carolina',
        'ND': 'North Dakota',
        'MP': 'Northern Mariana Islands',
        'OH': 'Ohio',
        'OK': 'Oklahoma',
        'OR': 'Oregon',
        'PW': 'Palau',
        'PA': 'Pennsylvania',
        'PR': 'Puerto Rico',
        'RI': 'Rhode Island',
        'SC': 'South Carolina',
        'SD': 'South Dakota',
        'TN': 'Tennessee',
        'TX': 'Texas',
        'UT': 'Utah',
        'VT': 'Vermont',
        'VI': 'Virgin Islands',
        'VA': 'Virginia',
        'WA': 'Washington',
        'WV': 'West Virginia',
        'WI': 'Wisconsin',
        'WY': 'Wyoming'
      }
    }
  },
  computed: {

    /**
     * Properties to pass down to the form control component.
     *
     * @returns {
     *   {parent: string},
     *   {label: string},
     *   {leading_cap: string},
     *   {trailing_cap: string},
     *   {success: string},
     *   {failure: string},
     *   {subtext: string},
     *   {no_feedback_icon: boolean}
     * }
     */
    properties() {
      return {
        parent: 'select',
        label: this.$slots.default ? this.$slots.default : this.label,
        leading_cap: this.leading_cap,
        trailing_cap: this.trailing_cap,
        success: this.success,
        failure: this.failure,
        subtext: this.subtext,
        no_feedback_icon: !!this.no_feedback_icon
      };
    },

    /**
     * Get the options to render.
     *
     * If us_states is set to TRUE, the options will render all US states.
     *
     * @returns {object}
     */
    render_options() {
      return this.us_states ? this.states : this.options;
    }

  },
  watch: {

    /**
     * Watch for value changes and update the selected values to match.
     */
    value() {
      this.selected = this.value;
    }

  },
  methods: {

    /**
     * Focus wrapper.
     *
     * @returns {undefined}
     */
    focus() {
      this.$refs['select'].focus();
    },

    /**
     * Focus wrapper.
     *
     * @returns {undefined}
     */
    select() {
      this.$refs['select'].select();
    }

  }
}
</script>

<style lang="sass">

/* Select structure */
.aui.select:not(.success):not(.failure) select:not([multiple="multiple"])
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3cpath fill='%23444444' d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z'/%3e%3c/svg%3e")
  padding-right: 2.5rem
  background-repeat: no-repeat
  background-position: right 0.25rem center
  background-size: 1.25rem

</style>