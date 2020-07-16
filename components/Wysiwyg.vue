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
    <div :id="id + '-container'" class="aui wysiwyg-container">
        <title :for="id" class="wysiwyg-title">{{title}}</title>
        <div :id="id"></div>
    </div>
</template>

<script>
    export default {
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
    }
</script>


<style lang="sass" scoped>

    @import "../../../client/css/colors"

    .aui.wysiwyg-container

        .wysiwyg-title
            display: block
            margin-bottom: .5rem

        .wysiwyg
            border: 1px solid #ccc
            border-radius: 4px

        .pell-actionbar
            display: flex
            background: #f9f9f9
            border-top-left-radius: .25rem
            border-top-right-radius: .25rem
            border: 1px solid #ced4da

            .pell-btn
                display: flex
                justify-content: center
                align-content: center
                font-size: 1.2rem
                height: 2.5rem
                line-height: 2.5rem
                width: 2.5rem
                background: none
                border: none

                &:hover
                    cursor: pointer
                    background: darken(#f9f9f9, 10%)

        .pell-content
            padding: .75rem
            min-height: 4rem
            border-left: 1px solid #ced4da
            border-right: 1px solid #ced4da
            border-bottom: 1px solid #ced4da
            border-radius: 0 0 .25rem .25rem
            background: white
            overflow-y: scroll

            &:focus
                outline: none
                box-shadow: 0 2px 5px -0px #ccc inset

            p
                margin: 0
                padding: 0
                overflow-wrap: break-spaces

</style>