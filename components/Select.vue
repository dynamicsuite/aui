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
    <div :id="id + '-container'" class="aui select-container">
        <label :for="id" v-if="title">{{title}}</label>
        <div class="select-block">
            <select
                :name="name"
                :id="id"
                :class="classes + classFailure() + classSuccess()"
                :value="value"
                :disabled="disabled"
                @input="$emit('input', $event.target.value)"
                @change="$emit('change', $event.target.value)"
            >
                <option v-if="us_states" v-for="(element, key) in states" :value="key" :selected="isSelected(key)">{{element}}</option>
                <option v-if="!us_states" v-for="(element, key) in data" :value="key" :selected="isSelected(key)">{{element}}</option>
            </select>
        </div>
        <div class="aui subtext" :class="subtextColorClass()" v-if="subtext" >{{subtext}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            data: {
                type: Array | Object
            },
            value: {
                type: Array | Object | String | Boolean | Number
            },
            title: {
                type: String
            },
            name: {
                type: String
            },
            subtext: {
                type: String
            },
            success: {
                type: Boolean
            },
            failure: {
                default: false
            },
            classes: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
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
        methods: {
            isSelected(key) {
                return key == this.value;
            },
            classSuccess() {
                return (this.success) ? ' border-success' : '' ;
            },
            classFailure() {
                return (this.failure) ? ' border-failure' : '' ;
            },
            subtextColorClass() {
                if (this.success) return 'text-success';
                if (this.failure) return 'text-failure';
                return '';
            },
        }
    }
</script>