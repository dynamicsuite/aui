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