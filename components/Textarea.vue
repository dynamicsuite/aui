<template>
    <div :id="container_id" class="aui textarea">
        <label>
            <span class="label-text" v-if="label">
                {{label}}
            </span>
            <textarea
                :id="id"
                :class="input_classes"
                :name="name_computed"
                :placeholder="placeholder"
                :disabled="disabled"
                :value="value"
                ref="textarea"
                @keydown="$emit('keydown', $event)"
                @change="$emit('change', $event.target)"
                @select="$emit('select', $event.target)"
                @focus="$emit('focus', $event.target)"
                @blur="$emit('blur', $event.target)"
                @input="$emit('input', $event.target.value)"
            />
        </label>
        <div v-if="subtext_value" class="subtext" :class="subtext_classes">
            {{subtext_value}}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            // Unique HTML ID for the input and container
            id: {
                type: String
            },
            // Label to display before the input
            label: {
                type: String
            },
            // Input HTML name
            name: {
                type: String
            },
            // Placeholder text for textarea
            placeholder: {
                type: String
            },
            // If the textarea is disabled
            disabled: {
                type: Boolean,
                default: false
            },
            // Initial value of the input
            value: {
                type: String | Number | Boolean
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
            // Input subtext
            subtext: {
                type: String
            },
            // If no icon should trail the input on feedback, for use in short length inputs
            no_feedback_icon: {
                type: Boolean,
                default: false
            },
        },
        computed: {
            // Style classes for the input
            input_classes() {
                return {
                    'border-success': this.success,
                    'border-failure': this.failure,
                    'no-feedback-icon': this.no_feedback_icon,
                    'right-cap': this.trailing_cap,
                    'left-cap': this.leading_cap
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
                if (typeof this.success === 'string') {
                    return this.success;
                } else if (typeof this.failure === 'string') {
                    return this.failure;
                } else {
                    return this.subtext;
                }
            },
            // Value of the container ID
            container_id() {
                return this.id ? this.id + '-container' : '';
            },
            // Name calc for autocomplete disabling
            name_computed() {
                if (this.disable_autofill) {
                    return 'autofill-disabled-' +
                        Math.random().toString(36).substring(2, 15) +
                        Math.random().toString(36).substring(2, 15);
                } else {
                    return this.name;
                }
            },
        },
        watch: {
            failure() {
                const scroll_callback = () => {
                    let view = document.getElementById('ds-view');
                    let el = document.querySelectorAll('.aui .border-failure')[0]
                    if (el) {
                        let box = el.getBoundingClientRect()
                        let scroll_position = box.top - box.height - 100
                        view.scrollBy({
                            top: scroll_position,
                            behavior: 'smooth'
                        });
                    }
                }
                clearTimeout(window.aui_failure_timeout);
                window.aui_failure_timeout = setTimeout(scroll_callback, 99);
            }
        },
        methods: {
            // Force focus
            focus() {
                this.$refs.input.focus();
            },
            // Force select
            select() {
                this.$refs.input.select();
            }
        }
    }
</script>

<style lang="sass">
    /* Import the core DS colors */
@import "../../../client/css/colors"

// Input container
.aui.textarea
    display: flex
    flex-direction: column

    /* Input label */
    label
        margin-bottom: 0

        /* Input group separators */
        span
            display: flex

        .input-parent
            display: grid
            grid-template-columns: auto 1fr auto
            grid-auto-flow: dense

        .label-text
            margin-bottom: .25rem

        /* The input itself */
        textarea
            grid-column: 2
            display: flex
            flex: 1
            font-size: 1rem
            padding: 0.5rem
            border-radius: 0.25rem
            border: 1px solid #ced4da
            width: 100%
            -webkit-box-sizing: border-box
            -moz-box-sizing: border-box
            box-sizing: border-box

            /* Where the input meets the leading cap (if any) */
            &.left-cap
                border-top-left-radius: 0
                border-bottom-left-radius: 0
                padding-left: calc(0.5rem + 1px)

            /* Where the input meets the trailing cap (if any) */
            &.right-cap
                border-top-right-radius: 0
                border-bottom-right-radius: 0
                padding-right: calc(0.5rem + 1px)

            /* Clear focus */
            &:focus
                outline: none
                box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.8)

            /* Disabled flag */
            &:disabled
                background: darken(#e9ecef, 15%)

            /* Success feedback */
            &.border-success
                border: 1px solid $success

                /* The leading input group cap (if any) */
                .leading-cap
                    border-left: 1px solid $success
                    border-top: 1px solid $success
                    border-bottom: 1px solid $success

                /* The trailing input group cap (if any) */
                .trailing-cap
                    border-right: 1px solid $success
                    border-top: 1px solid $success
                    border-bottom: 1px solid $success

                /* Feedback icon if not disabled */
                &:not(.no-feedback-icon)
                    padding-right: 2.5rem !important
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")
                    background-repeat: no-repeat
                    background-position: right .5rem center
                    background-size: 1.5rem

            /* Failure feedback */
            &.border-failure
                border: 1px solid $failure

                /* The leading input group cap (if any) */
                .leading-cap
                    border-left: 1px solid $failure
                    border-top: 1px solid $failure
                    border-bottom: 1px solid $failure

                /* The trailing input group cap (if any) */
                .trailing-cap
                    border-right: 1px solid $failure
                    border-top: 1px solid $failure
                    border-bottom: 1px solid $failure

                /* Feedback icon if not disabled */
                &:not(.no-feedback-icon)
                    padding-right: 2.5rem !important
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")
                    background-repeat: no-repeat
                    background-position: right 0.5rem center
                    background-size: 1.5rem

    /* Input subtext */
    .subtext
        font-size: .8rem
        margin-top: .25rem
        color: #6c757d
        text-align: left

        &.text-success
            color: $success

        &.text-failure
            color: $failure
</style>