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
    <span class="aui phone">
        {{formatted_phone}}
    </span>
</template>

<script>
export default {
    props: {

        /**
         * The phone number to format
         */
        number: {
            type: String | null,
            default: null
        }

    },
    computed: {

        /**
         * The formatted phone number to render
         */
        formatted_phone() {
            const number = this.number.replace(/[^0-9]/g, '');
            const length = number.length;
            if (length === 10) {
                return `(${number.substr(0, 3)}) ${number.substr(3, 3)}-${number.substr(6, 4)}`;
            } else if (length === 11 && number.charAt(0) === '1') {
                return `+1 (${number.substr(1, 3)}) ${number.substr(4, 3)}-${number.substr(7, 4)}`;
            } else {
                return this.number;
            }
        }

    }
}
</script>