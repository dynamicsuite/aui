<template>

    <div class="aui telephone">
        <aui-input
            class="country"
            v-if="international"
            v-model="country_code"
            @input="inputHandler('input')"
            @change="inputHandler('change')"
        ></aui-input>

        <aui-input
            class="phone-number"
            label="Phone Number"
            type="tel"
            v-model="number"
            @input="inputHandler('input')"
            @change="inputHandler('change')"
        ></aui-input>

        <aui-input
            class="extension"
            label="Ext."
            v-if="extension"
            v-model="extension_code"
            @input="inputHandler('input')"
            @change="inputHandler('change')"
        ></aui-input>
    </div>

</template>

<script>
export default {
    props: {
        international: {
            type: Boolean,
            default: false
        },
        extension: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            country_code: '+1',
            number: null,
            extension_code: null
        }
    },
    methods: {
        maskCode() {
            this.country_code = `+${this.country_code.match(/\d+/)[0]}`;
        },
        maskNumber() {

            // Clean it up
            let val = this.number.toString()
                .replace('(', '')
                .replace(')', '')
                .replace('-', '')
                .replace(' ', '')

            // Add formatting
            if (val.length < 3) {
                this.number = val;
            } else if (val.length < 6) {
                this.number = val.toString().replace(/(\d{3})/,"($1) ").slice(0, 14);
            } else {
                this.number = val.toString().replace(/(\d{3})(\d{1,3})/,"($1) $2-").slice(0, 14);
                this.$forceUpdate();
            }

        },

        // Wrapper for emitting but include de-masking for tel inputs
        emitPhone(event) {

            let val = this.number;

            if (val) {
                // Demask the number
                val = val.replace(/\D/g,'').substring(0,10);

                if (this.international) {
                    // Prepend the country code
                    val = this.country_code + val;
                }

                if (this.extension && this.extension_code !== null && this.extension_code !== '') {
                    // Append the extension
                    val = val + ' ext. ' + this.extension_code;
                }
            }

            this.$emit(event, val)
        },
        inputHandler(event) {
            this.maskCode()
            this.maskNumber();
            this.emitPhone(event)
        }
    }
}
</script>

<style lang="sass">
.aui.telephone
    display: flex
    align-items: flex-end

    .country
        width: 3rem
        text-align: center
        margin-right: 1rem

    .phone-number
        flex: 1

    .extension
        width: 6rem
        text-align: center
        margin-left: 1rem

</style>