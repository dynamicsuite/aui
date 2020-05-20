/*
 * Aui Package
 * Copyright (C) 2020 Dynamic Suite Team
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
 */
Vue.component('aui-button', {
    template: `
        <button :class="classes" :disabled="is_disabled" @click="$emit('click')">
            <span v-if="isDelayed()">
                <i class="fa fa-spin fa-circle-notch loading-icon"></i>
                <span v-if="has_loading_text" class="loading-text">{{loading_text}}</span>
                <slot v-else></slot>
            </span>
            <slot v-else></slot>
        </button>`,
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        loading_text: {
            type: String,
            default: null
        }
    },
    methods: {
        isDelayed() {
            if (this.loading) {
                setTimeout(() => {
                    if (this.loading) this.show_spinner = true;
                }, 100);
            }
            else {
                this.show_spinner = false;
            }

            return this.show_spinner;
        }
    },
    computed: {
        has_loading_text() {
            return typeof this.loading_text === 'string';
        },
        is_disabled() {
            return this.loading || this.disabled;
        },
        classes() {
            return {
                aui: true,
                btn: true,
                'btn-primary': this.default_class
            }
        }
    },
    data: function() {
        return {
            show_spinner: false,
            default_class: false
        }
    },
    mounted() {
        if (this.$el.classList.value === 'aui btn') {
            this.default_class = true;
        }
    }
});
Vue.component('aui-button-drop', {
    template: `
        <button class="aui btn btn-dropdown" @click="menu_active = !menu_active" @focusout="menu_active = false" @touchleave="menu_active = false">
            <span v-if="$slots.default"><slot></slot></span>
            <i :class="icon_classes"></i>
            <ul class="dropdown-menu" :class="menu_align" v-if="menu_active">
                <li v-for="option in options" @click="doAction(option.action)">{{option.label}}</li>
            </ul>
        </button>`,
    props: {
        classes: {
            type: String
        },
        options: {
            type: Array,
            required: true
        },
        label: {
            type: String
        },
        icon_classes: {
            type: String,
            default: 'fa fa-bars'
        },
        menu_align: {
            style: String,
            default: 'left',
            validator: prop => {
                if (prop === 'left' || prop === 'right') return true;
                else {
                    console.log('AUI-BUTTON: Menu alignment can only be left or right.');
                    return false;
                }
            }
        }
    },
    data: function() {
        return {
            menu_active: false
        }
    },
    methods: {
        doAction(action) {
            if (typeof(action) === 'string') {
                window.open(action);
            } else if (typeof(action) === 'function') {
                action();
            } else {
                console.log('AUI-BTN-DROPDOWN: Action passed to button click is not string or function; type: ' + typeof(action));
            }
        },
        hide(event) {
            this.menu_active = false;
        },
        setActive(tab) {
            this.options.forEach((option) => {
                option.active = false;
            });

            tab.active = true;
        }
    }
});
Vue.component('aui-table', {
    template: ` 
    <div class="aui table-container">
        <div class="input-aligner" :class="search_align">
            <aui-input v-if="search" id="table-search" v-model="search_term" :value="search_term" placeholder="Search..."></aui-input>
        </div>
        <table class="table">
            <thead>
                <tr v-if="headers">
                    <th v-for="header in headers">
                        {{header}}
                    </th>
                </tr>
                <tr v-else>
                    <th v-for="(value, key) in current_data[0].values" v-if="subsetAllowed(key)">
                        {{key}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="element in current_data" v-if="element.action" @click="element.action">
                    <td v-for="(value, key) in element.values" v-if="subsetAllowed(key)">
                        {{value}}
                    </td>
                </tr>
                <tr v-for="element in current_data" v-if="!element.action">
                    <td v-for="(value, key) in element.values" v-if="subsetAllowed(key)">
                        {{value}}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="no-data" if="current_data.length === 0">No Data</div>
    </div>
    `,
    props: {
        data: {
            type: Array,
            required: true
        },
        subset: {
            type: Array,
            default: null
        },
        headers: {
            type: Array
        },
        search: {
            type: Boolean
        },
        search_value: {
            type: String
        },
        search_align: {
            type: String,
            default: 'right',
            validator: prop => {
                if (prop === 'left' || prop === 'right') return true;
                else {
                    console.log('AUI-TOGGLE: Label location can only be left, right, top, or bottom.');
                    return false;
                }
            }
        }
    },
    data: function() {
         return {
            current_data: this.data,
            search_term: this.search_value
        }
    },
    watch: {
        search_term() {
            let term = this.search_term.toLowerCase();

            this.current_data = this.data.filter((element) => {

                let found = false;

                element.forEach((value) => {

                    let val = value.toString().toLowerCase();

                    if (val.includes(term)) {
                        found = true;
                    }

                });

                return found;
            });

            if (term === '') this.current_data = this.data;
        }
    },
    methods: {
        subsetAllowed(key) {
            if (this.subset === null) {
                return true;
            } else {
                return this.subset.includes(key);
            }
        }
    }
});
Vue.component('aui-input', {
    template: `
    <div :id="id + '-container'" class="aui input-container">
        <label :for="id" v-if="title">{{title}}</label>
        <div class="input-block" :class="capsClass()">
            <div class="leading-element edge-element" :class="classFailure() + classSuccess()" v-if="leading_text" v-html="leading_text"></div>
            <input
                :id="id"
                ref="input"
                :type="type" 
                :name="name"
                :placeholder="placeholder"
                :tabindex="tabindex"
                :disabled="disabled"
                :readonly="readonly"
                :class="classes + classFailure() + classSuccess()"
                :value="value"
                :step="step"
                :min="min"
                :max="max"
                :autocomplete="autocomplete"
                @keydown="$emit('keydown', $event)"
                @change="$emit('change', $event.target)"
                @select="$emit('select', $event.target)"
                @focus="$emit('focus', $event.target)"
                @blur="$emit('blur', $event.target)"
                @input="$emit('input', $event.target.value)"
            >
            <div class="trailing-element edge-element" :class="classFailure() + classSuccess()" v-if="trailing_text">{{trailing_text}}</div>
        </div>
        <div class="aui subtext" :class="subtextColorClass()" v-if="subtext">{{subtext}}</div>
    </div>`,
    props: {
        id: {
            type: String
        },
        title: {
            type: String
        },
        name: {
            type: String
        },
        type: {
            type: String,
            default: 'text'
        },
        subtext:{
            type: String
        },
        placeholder: {
            type: String
        },
        tabindex: {
            type: String | Number
        },
        leading_text: {
            type: String
        },
        trailing_text: {
            type: String
        },
        classes: {
            type: String,
            default: ''
        },
        allowed: {
            type: String,
            validator: prop => {
                if (prop === '' || prop === 'right' || prop === 'top' || prop === 'bottom') return true;
                else {
                    console.log('ERROR - AUI-INPUT: Allowed prop can only be \'whole\', \'number\', or \'text\'.');
                    return false;
                }
            }
        },
        disabled: {
            type: Boolean
        },
        readonly: {
            type: Boolean
        },
        success: {
            type: Boolean
        },
        failure: {
            default: false
        },
        list: {
            type: String
        },
        value: {
            type: String | Number
        },
        step: {
            type: String | Number
        },
        min: {
            type: String | Number
        },
        max: {
            type: String | Number
        },
        autocomplete: {
            type: String,
            default: 'on'
        }

    },
    methods: {
        focus() {
            this.$refs.input.focus();
        },
        select() {
            this.$refs.input.select();
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
        capsClass() {
            if (this.leading_text || this.trailing_text) return ' caps';
        },
        dateMinimum() {
            if (this.min === 'today') {
                let today = new Date().toISOString().slice(0, 10);
                return today;
            } else {
                return this.min;
            }
        },
        dateMaximum() {
            if (this.max === 'today') {
                let today = new Date().toISOString().slice(0, 10);
                return today;
            } else {
                return this.max;
            }
        }
    }
});
Vue.component('aui-select', {
   template: `
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
    </div>`,
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
});
Vue.component('aui-datalist', {
    template: `
        <div :id="id + '-container'" class="aui datalist-container">
            <label :for="id" v-if="title">{{title}}</label>
            <input 
                :id="id" 
                :name="name"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :value="value"
                :class="classes + classFailure() + classSuccess()"
                :list="id + '-datalist'"
                :failure="failure"
                :success="success"
                @keydown="$emit('keydown')"
                @focus="$emit('focus')"
                @blur="$emit('blur')"
                @input="$emit('input', $event.target.value)"
            >
            <div class="aui subtext" :class="subtextColorClass()" v-if="subtext">{{subtext}}</div>
            
            <datalist :id="id + '-datalist'">
                <option v-for="option in current_options">{{option}}</option> 
            </datalist>
        </div>
    `,
    props: {
        id: {
            type: String,
            required: true
        },
        options: {
            type: Array | Object,
            required: true
        },
        validate: {
            type: Boolean,
            default: true
        },
        title: {
            type: String
        },
        classes: {
            type: String,
            default: ''
        },
        name: {
            type: String
        },
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String
        },
        disabled: {
            type: Boolean
        },
        readonly: {
            type: Boolean
        },
        success: {
            default: false
        },
        failure: {
            default: false
        },
        subtext: {
            type: String
        },
        value: {
            type: String | Number
        }
    },
    data: function() {
        return {
            show_menu: false,
            current_options: this.options,
            search_term: ''
        }
    },
    watch: {
        search_term() {
            this.searchAndUpdate()
        },
        options() {
            this.searchAndUpdate()
        }
    },
    methods: {
        searchAndUpdate() {
            let term = this.search_term.toLowerCase();

            if (Array.isArray(this.options)) {
                this.current_options = this.options.filter((element) => {

                    let val = element.toString().toLowerCase();

                    if (val.includes(term)) {
                        return true;
                    }

                });

                if (term === '') this.current_options = this.options;

            } else {
                this.current_options = Object.keys(this.options)
                    .filter((element) => {
                        let val = this.options[element].toString().toLowerCase();

                        if (val.includes(term)) {
                            return true;
                        }
                    })
                    .reduce((obj, key) => {
                        obj[key] = this.options[key];
                        return obj;
                    }, {})
                ;

                if (term === '') this.current_options = this.options;
            }

            if (Object.keys(this.current_options).length === 0) this.current_options = ['No options available'];

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
        }
    }
});
Vue.component('aui-radio', {
    template: `
    <div class="aui">
        <label class="radio-container">
            <slot></slot>
            <input type="radio" :name="name" :checked="checked"  @change="$emit('input', $event.target.checked)">
            <span class="radio"></span>
        </label>
    </div>`,
    props: {
        name: {
            type: String,
            required: true
        },
        checked: {
            type: Boolean
        }
    }
});
Vue.component('aui-checkbox', {
    template: `
        <label class="aui check-container">
            <slot></slot>
            <input type="checkbox" :checked="checked" :disabled="disabled" @change="$emit('input', $event.target.checked)">
            <span class="checkmark"></span>
        </label>
        `,
    props: {
        checked: {
            type: Boolean
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
});
Vue.component('aui-toggle', {
    template: `
    <div class="aui aui-toggle flex">
        <span class="switch-container" :class="label_location">
            <label>{{label}}</label>
            <label class="switch">
                <input type="checkbox" :checked="checked" @change="$emit('input', $event.target.checked)">
                <span class="slider round"></span>
            </label>
        </span>
    </div>`,
    props: {
        checked: {
            type: Boolean
        },
        label: {
            type: String,
        },
        label_location: {
            type: String,
            default: 'top',
            validator: prop => {
                if (prop === 'left' || prop === 'right' || prop === 'top' || prop === 'bottom') return true;
                else {
                    console.log('AUI-TOGGLE: Label location can only be left, right, top, or bottom.');
                    return false;
                }
            }
        }
    }
});
Vue.component('aui-tab', {
    template: `
    <span class="aui tab" :class="getActiveClass()" @click="$emit('click'); doAction(action)">
        {{label}}
    </span>`,
    props: {
        active: {
            type: Boolean,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        action: {
            type: String | Function
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getActiveClass() {
            let classes = this.active ? 'active' : '';
            if (this.disabled) {
                classes += ' disabled';
            }
            return classes;
        },
        doAction() {
            if (this.disabled) {
                return;
            }
            if (typeof(this.action) === 'string') {
                window.open(this.action);
            } else if (typeof(this.action) === 'function') {
                this.action();
            } else {
                console.log('AUI-TAB: Action passed to click is not string or function; type: ' + typeof(this.action));
            }
        },
    }
});
Vue.component('aui-tabs', {
    template: `
    <div class="aui tabs">
        <aui-tab 
            v-for="(option, index) in options" 
            :key="index" :active="option.active" 
            :label="option.label" 
            :action="option.action"
            :disabled="option.disabled"
            @click="setActive(option)" 
            v-if="showTabs"
        >
        </aui-tab>
        <aui-button-drop :options="options" v-if="!showTabs" menu_align="right">{{getActive()}}</aui-button-drop>
    </div>`,
    props: {
        options: {
            type: Array
        },
    },
    data: function() {
        return {
            width: null,
            hideWidth: null,
            showTabs: true
        }
    },
    methods: {
        setActive(new_active) {
            if (new_active.disabled) {
                return;
            }
            this.options.forEach((option) => {
                option.active = false;
            });

            new_active.active = true;
        },
        getActive() {
            let active = this.options.filter((option) => {
                if (option.active) return true;
            });

            return active[0].label;
        },
        manageOverflow() {

            window.requestAnimationFrame(() => {
                this.showTabs = this.$el.clientWidth >= this.width;
            });

        }
    },
    created: function() {
        window.addEventListener('resize', this.manageOverflow);
    },
    mounted: function() {
        this.width = 0;

        this.$children.forEach((component) => {
            this.width = this.width + component.$el.offsetWidth + 16;
        });

        this.width = this.width + 32;
        this.showTabs = this.$el.clientWidth >= this.width;
    },
    destroyed: function() {
        window.removeEventListener('resize', this.manageOverflow);
    }
});
Vue.component('aui-alert', {
    template: `
    <div class="aui alert" v-if="visible">
        <span class="title-bar" v-if="title" >
            <h4 class="alert-title">{{title}}</h4>
            <i class="fa fa-times" v-if="close" @click="$emit('click')"></i>
        </span>
        <p v-if="title">
            <slot></slot>
        </p>
        <p v-else>
            <slot></slot>
            <i class="fa fa-times" v-if="close" @click="$emit('click')"></i>
        </p>
    </div>`,
    props: {
        title: {
            type: String
        },
        close: {
            type: Boolean,
            default: false
        },
        visible: {
            default: true
        }
    }
});
Vue.component('aui-badge', {
    template: `<span class="aui badge"><slot></slot></span>`
});
Vue.component('aui-card', {
    template: `
    <div class="aui card">
        <div class="card-header">{{header}}</div>
        <div class="card-body">
            <h4>{{title}}</h4>
            <p class="card-text">
                <slot></slot>
            </p>
        </div>
    </div>`,
    props: {
        header: {
            type: String,
            required: true
        },
        title: {
            type: String
        }
    }
});
Vue.component('aui-modal', {
    template: `
    <div class="aui modal-container" v-if="state" @click.self="toggleEmit()">
        <div class="modal">
            <div v-if="title" class="modal-header" :class="title_classes">
                <h4>{{title}}</h4>
                <i class="fa fa-times" @click.self="toggleEmit()" v-if="close"></i>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
        </div>
    </div>`,
    props: {
        state: {
            type: Boolean,
            required: true
        },
        title: {
            type: String
        },
        html: {
            type: String
        },
        close: {
            type: Boolean,
            default: true
        },
        title_classes: {
            type: String
        }
    },
    methods: {
        escEmit(event) {
            if (event.keyCode === 27) {
                this.$emit('modal-close');
            }
        },
        toggleEmit() {
            if (this.close) {
                this.$emit('modal-toggle');
            }
        }
    },
    watch: {
        state() {
            if (this.state && document.getElementById('ds-nav-container') && document.getElementById('ds-view-header')) {
                document.getElementById('ds-nav-container').style.zIndex = '0';
                document.getElementById('ds-view-header').style.zIndex = '-1';
                document.getElementById('ds-nav-container').classList.remove("ds-nav-show-mobile")
            } else if (!this.state  && document.getElementById('ds-nav-container') && document.getElementById('ds-view-header')) {
                document.getElementById('ds-nav-container').style.zIndex = '1';
                document.getElementById('ds-view-header').style.zIndex = '0';
            }
        }
    },
    created: function() {
        if (this.close) document.addEventListener('keyup', this.escEmit);
    },
    destroyed: function() {
        if (this.close) document.removeEventListener('keyup', this.escEmit);
    }
});
Vue.component('aui-list-item', {
    template: `
        <li class="aui list-item" :class="activeClass" @click="runCallback()">
            <span class="text">
                <div class="title"><slot></slot></div>
                <div class="aui subtext" v-if="subtext">{{subtext}}</div>
            </span>
            <span class="icon" v-if="isActive()"></span>
        </li>`,
    props: {
        callback: {
            type: Function
        },
        subtext: {
            type: String
        }
    },
    methods: {
        isActive() {
            return !!this.callback;
        },
        runCallback() {
            if (this.callback) this.callback();
        }
    },
    computed: {
        activeClass() {
            return (this.callback) ? ' active' : '';
        }
    }
});
Vue.component('aui-list-group', {
    template: `
    <ul class="aui list-group">
        <aui-list-item v-for="(item, index) in data" :key="index" :callback="item.callback" :subtext="item.subtext">{{item.content}}</aui-list-item>
    </ul>`,
    props: {
        data: {
            type: Array,
            required: true
        }
    }
});
Vue.component('aui-wysiwyg', {
    template: `
    <div :id="id + '-container'" class="aui wysiwyg-container">
        <title :for="id" class="wysiwyg-title">{{title}}</title>
        <div :id="id"></div>
    </div>`,
    props: {
        id: {
            type: String,
            required: true
        },
        title: {
            type: String
        },
        text: {
            default: ''
        }
    },
    data() {
        return {
            editor: null
        }
    },
    mounted: function() {
        const comp = this;

        comp.editor = pell.init({
            element: document.getElementById(comp.id),
            defaultParagraphSeparator: "p",
            styleWithCSS: true,
            onChange: html => {
                comp.$emit('input', html);
            },
            actions: ["bold", "italic", "underline", "heading1", "ulist", "olist"],
            classes: {
                actionbar: "pell-actionbar",
                button: "pell-btn",
                content: "pell-content",
                selected: "pell-button-selected",
            },
        });

        comp.editor.content.innerHTML = comp.text;
    },
    watch: {
        text() {
            if (this.editor.content.innerHTML === '') {
                this.editor.content.innerHTML = this.text;
            }
        }
    }
});
Vue.component('aui-pagination', {
    template: `<div class="aui aui-pagination">
        <span v-if="total">Showing {{from}} to {{to}} of {{total}} {{name}}</span>
        <div class="aui btn-group">
            <aui-button class="btn-secondary" @click="first()" v-if="page > 1"><i class="fa fa-arrow-left"></i></aui-button>
            <aui-button class="btn-secondary" @click="previous()" v-if="page > 1">{{page - 1}}</aui-button>
            <aui-button class="btn-secondary">{{page}}</aui-button>
            <aui-button class="btn-secondary" @click="next()" v-if="page !== pages">{{page + 1}}</aui-button>
            <aui-button class="btn-secondary" @click="last()" v-if="page !== pages"><i class="fa fa-arrow-right"></i></aui-button>
        </div>
    </div>`,
    props: {
        pages: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        limit: Number,
        name: String
    },
    data() {
        return {
            page: 1,
            to: 0,
            from: 0
        }
    },
    methods: {
        first() {
            this.page = 1;
            this.emitPage();
        },
        previous() {
            const previous = this.page - 1;
            if (previous > 0) {
                this.page = previous;
                this.emitPage();
            }
        },
        next() {
            const next = this.page + 1;
            if (next <= this.pages) {
                this.page = next;
                this.emitPage();
            }
        },
        last() {
            this.page = this.pages;
            this.emitPage();
        },
        updateRange() {
            this.from = ((this.page - 1) * this.limit) + 1;
            this.to = this.from + this.limit - 1;
            if (this.to > this.total) {
                this.to = this.total;
            }
        },
        emitPage() {
            this.updateRange();
            this.$emit('change', this.page);
        }
    }
});