<!--
Aui Package
Copyright (C) 2020 Dynamic Suite Team

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation version 3.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software Foundation,
Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
-->

<template>
    <div :id="container_id" class="aui select">
        <label>
            {{label}}
            <select
                :id="id"
                :class="input_classes"
                :name="name"
                :disabled="disabled"
                :value="value"
                @input="$emit('input', $event.target.value)"
                @change="$emit('change', $event.target.value)"
            >
                <option v-for="(option, value) in render_options" :value="value">{{option}}</option>
            </select>
        </label>
        <div v-if="subtext_value" class="subtext" :class="subtext_classes">{{subtext_value}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            // Unique HTML ID for the select
            id: {
                type: String
            },
            // Label to display before the select
            label: {
                type: String
            },
            // Select HTML name
            name: {
                type: String
            },
            // If the select is disabled or not
            disabled: {
                type: Boolean,
                default: false
            },
            // Current value of the select
            value: {
                type: String | Number| Boolean
            },
            // Select options to render
            options: {
                type: Array | Object
            },
            // Success feedback state
            success: {
                type: String | Boolean,
                default: false
            },
            // Failure feedback state
            failure: {
                type: String | Boolean,
                default: false
            },
            // Select subtext
            subtext: {
                type: String
            },
            // If the select should render US states for its options
            us_states: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
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
            // Which options list should render
            render_options() {
                return this.us_states ? this.states : this.options;
            },
            // Style classes for the input (select)
            input_classes() {
                return {
                    'border-success': this.success,
                    'border-failure': this.failure
                }
            },
            // Style classes for the subtext
            subtext_classes() {
                return {
                    'text-success': this.success,
                    'text-failure': this.failure
                }
            },
            // Value of the subtext text
            subtext_value() {
                if (this.success) {
                    return this.success;
                } else if (this.failure) {
                    return this.failure;
                } else {
                    return this.subtext;
                }
            },
            // Value of the container ID
            container_id() {
                return this.id ? this.id + '-container' : '';
            }
        }
    }
</script>

<style lang="sass">

/* Import the core DS colors */
@import "../../../client/css/colors"

// Select styling
.aui.select
    display: flex
    flex-direction: column
    margin-bottom: 1rem

    /* Select label */
    label
        display: flex
        flex-direction: column
        margin-bottom: 0
        width: 100%

        /* Select input root styling */
        select
            display: flex
            flex: 1
            margin-top: 0.25rem
            font-size: 1rem
            padding: 0.5rem
            border-radius: 0.25rem
            border: 1px solid #ced4da
            -webkit-appearance: none
            -moz-appearance: none
            background: #fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23ced4da'><polygon points='0,0 100,0 50,50'/></svg>") no-repeat calc(100% - 10px) 65%
            background-size: 12px

            /* Clear focus */
            &:focus
                outline: none
                box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.8)

            /* Disabled flag */
            &:disabled
                background: darken(#e9ecef, 15%)

            /* Success styling */
            &.border-success
                padding-right: 2.5rem !important
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")
                background-repeat: no-repeat
                background-position: right 0.5rem center
                background-size: 1.5rem
                border: 1px solid $success

            /* Failure styling */
            &.border-failure
                padding-right: 2.5rem !important
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")
                background-repeat: no-repeat
                background-position: right 0.5rem center
                background-size: 1.5rem
                border: 1px solid $failure

    /* Input subtext */
    .subtext
        font-size: 0.8rem
        margin-top: 0.25rem
        color: #6c757d
        width: 100%

</style>