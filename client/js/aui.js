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
        <button class="btn" :class="classes" :disabled="loading" @click="$emit('click')">
            <span v-if="loading">
                <i class="fa fa-spin fa-circle-notch loading-icon"></i>
                <span v-if="loading_text" class="loading-text">{{loading_text}}</span>
                <slot v-else></slot>
            </span>
            <slot v-else></slot>
        </button>`,
    props: {
        classes: {
            type: String
        },
        loading: {
            type: Boolean,
            default: false
        },
        loading_text: {
            type: String
        }
    }
});
Vue.component('aui-button-drop', {
    template: `
        <button class="btn btn-dropdown" :class="classes" @click="menu_active = !menu_active" @focusout="menu_active = false" @touchleave="menu_active = false">
            <slot></slot>
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
    <div class="table-container">
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
                    <th v-for="(value, key) in current_data[0]">
                        {{key}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="element in current_data">
                    <td v-for="value in element">
                        {{value}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    props: {
        data: {
            type: Array,
            required: true
        },
        headers: {
            type: Array,
            required: true
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
    }
});
Vue.component('aui-input', {
    template: `
    <div :id="id + '-container'" class="input-container">
        <label :for="id" v-if="title">{{title}}</label>
        <div class="input-block" :class="capsClass()">
            <div class="leading-element edge-element" :class="classFailure() + classSuccess()" v-if="leading_text">{{leading_text}}</div>
            <input :id="id" 
                :type="type" 
                :name="name"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :class="classes + classFailure() + classSuccess()"
                :value="value"
                :min="dateMinimum()"
                :max="dateMaximum()"
                @keydown="$emit('keydown', $event.target)"
                @change="$emit('change', $event.target)"
                @focus="$emit('focus', $event.target)"
                @blur="$emit('blur', $event.target)"
                @input="$emit('input', $event.target.value)"
            >
            <div class="trailing-element edge-element" :class="classFailure() + classSuccess()" v-if="trailing_text">{{trailing_text}}</div>
        </div>
        <div class="subtext" :class="subtextColorClass()" v-if="subtext">{{subtext}}</div>
    </div>`,
    props: {
        id: {
            type: String,
            required: true
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
        min: {
            type: String | Number
        },
        max: {
            type: String | Number
        }

    },
    data: function() {
        return {
        }
    },
    methods: {
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
                console.log(today);
                return today;
            } else {
                return this.min;
            }
        },
        dateMaximum() {
            if (this.max === 'today') {
                let today = new Date().toISOString().slice(0, 10);
                console.log(today);
                return today;
            } else {
                return this.max;
            }
        }
    }
});
Vue.component('aui-select', {
   template: `
    <div :id="id + '-container'" class="select-container">
        <label :for="id" v-if="title">{{title}}</label>
        <div class="select-block">
            <select :name="name" :id="id" :class="classes" :value="value" :disabled="disabled" @change="$emit('input', $event.target.value)">
                <option v-for="(element, key) in data" :value="key" :selected="isSelected(key)">{{element}}</option>
            </select>
        </div>
        <div class="subtext" v-if="subtext" >{{subtext}}</div>
    </div>`,
    props: {
        id: {
            type: String,
            required: true
        },
        data: {
            type: Array | Object,
            required: true
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
        classes: {
            type: String,
            default: ''
        },
        selected: {
            type: String | Number
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
       isSelected(key) {
           return this.selected === key;
       }
    }
});
Vue.component('aui-datalist', {
    template: `
        <div :id="id + '-container'" class="datalist-container">
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
                @keydown="$emit('keydown')"
                @focus="$emit('focus')"
                @blur="$emit('blur')"
                @input="$emit('input', $event.target.value)"
            >
            <div class="subtext" :class="subtextColorClass()" v-if="subtext">{{subtext}}</div>
            
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
    <div>
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
        <label class="check-container">
            <slot></slot>
            <input type="checkbox" :checked="checked" @change="$emit('input', $event.target.checked)">
            <span class="checkmark"></span>
        </label>
        `,
    props: {
        checked: {
            type: Boolean
        }
    }
});
Vue.component('aui-toggle', {
    template: `
    <div class="flex">
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
    <span class="tab" :class="getActiveClass()" @click="$emit('click'); doAction(action)">
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
        }
    },
    methods: {
        getActiveClass() {
            return (this.active) ? 'active' : '';
        },
        doAction() {
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
    <div class="tabs">
        <aui-tab v-for="option in options" :active="option.active" :label="option.label" :action="option.action" @click="setActive(option)" v-if="showTabs"></aui-tab>
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
    <div class="alert" :class="classes" v-if="visible">
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
        classes: {
            type: String
        },
        close: {
            type: Boolean,
            default: true
        },
        visible: {
            default: true
        }
    }
});
Vue.component('aui-badge', {
    template: `<span class="badge" :class="classes"><slot></slot></span>`,
    props: {
        classes: {
            type: String,
            required: true
        }
    }
});
Vue.component('aui-card', {
    template: `
    <div class="card" :class="classes">
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
        },
        classes: {
            type: String,
            required: true
        }
    }
});
Vue.component('aui-modal', {
    template: `
    <div class="aui-modal-container" v-if="state" @click.self="toggleEmit()">
        <div class="aui-modal">
            <div v-if="title" class="aui-modal-header" :class="title_classes">
                <h4>{{title}}</h4>
                <i class="fa fa-times" @click.self="toggleEmit()" v-if="close"></i>
            </div>
            <div class="aui-modal-body">
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
            if (this.state) {
                document.getElementById('ds-nav-container').style.zIndex = '0';
                document.getElementById('ds-view-header').style.zIndex = '-1';
                document.getElementById('ds-nav-container').classList.remove("ds-nav-show-mobile")
            } else {
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
        <li class="list-item" :class="activeClass" @click="runCallback()">
            <span class="text">
                <div class="title"><slot></slot></div>
                <div class="subtext" v-if="subtext">{{subtext}}</div>
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
    <ul class="aui-list-group">
        <aui-list-item v-for="item in data" :callback="item.callback" :subtext="item.subtext">{{item.content}}</aui-list-item>
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
    <div :id="id + '-container'" class="wysiwyg-container">
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
        }
    },
    mounted: function() {
        const comp = this;

        pell.init({
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
    }
});