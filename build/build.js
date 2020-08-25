const js_compiler = require(process.argv[2].replace('\\', '/') + '/npm/node_modules/uglify-es');
const sass_compiler = require(process.argv[2].replace('\\', '/') + '/npm/node_modules/sass');
const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname, '../components');

// File JS output
let output_js = `/*
  Dynamic Suite: AUI
  License: GPLv3
*/
`;

// File CSS output
let output_css = fs.readFileSync(dir + '\\..\\client\\css\\core.sass').toString()

// Load the component files
let files = fs.readdirSync(dir);

// Iterate on files
files.forEach(file => {

    // Read the file
    let data = fs.readFileSync(dir + '\\' + file).toString();

    // No template, invalid component
    if (!data.includes('<template>') || !data.includes('</template>')) {
        console.log('File ' + file + ' missing template');
        process.exit(1);
    }

    // Find the template
    let template = data.substring(
        data.lastIndexOf('<template>') + 10,
        data.lastIndexOf('</template>')
    );

    // Build the component
    let name = file.substring(0, file.length - 4).replace(/([A-Z])/g, '-$1').toLowerCase().substr(1)
    let component = 'Vue.component("aui-' + name + '", {'

    // Clean the template
    template = template
        .trim()
        .replace(/>\s+</g, '><') // Remove spaces between tags
        .replace(/(\r\n|\n|\r)/gm, '') // Remove line breaks
        .replace(/\s\s+/g, ' ') // Remove large whitespace chunks
        .replace(/>\s+/g, '>') // Remove whitespace after tag ends
        .replace(/\s>+/g, '>') // Remove whitespace before tag ends
        .replace(/\s<+/g, '<') // Remove whitespace after tag starts
        .replace(/<\s+/g, '<'); // Remove whitespace before tag starts

    // Update the component
    component += 'template: `' + template + '`'

    // No template, invalid component
    if (data.includes('<script>') && data.includes('</script>')) {

        // Find the script
        let script = data.substring(
            data.lastIndexOf('<script>') + 8,
            data.lastIndexOf('</script>')
        );

        // Clean the script
        script = script
            .trim()
            .replace('export default {', ''); // Remove export

        let pos = script.lastIndexOf('}');
        script = script.substring(0, pos) + script.substring(pos  + 1)
        script = script.trim();

        component += ',' + script;

    }

    // Complete component
    component += '});';

    // Add to output
    let ugly_js = js_compiler.minify(component);
    if (typeof ugly_js.error !== 'undefined') {
        console.log(ugly_js.error);
        process.exit(1);
    } else {
        output_js += ugly_js.code + '\n';
    }

    if (data.includes('<style lang="sass">') && data.includes('</style>')) {

        // Find the SASS
        let sass = data.substring(
            data.lastIndexOf('<style lang="sass">') + 19,
            data.lastIndexOf('</style>')
        );

        output_css += sass;

    }

});

// Minify
let ugly_css = sass_compiler.renderSync({
    data: output_css,
    indentedSyntax: true,
    outputStyle: 'compressed'
});
output_css = `/*
 * Dynamic Suite: AUI
 * License: GPLv3
 */
` + ugly_css.css.toString();

// Write JS
fs.writeFile('../client/js/aui.min.js', output_js, err => {
    if (err) {
        console.log('Error writing AUI output: ' + err);
    }
});

// Write CSS
fs.writeFile('../client/css/aui.min.css', output_css, err => {
    if (err) {
        console.log('Error writing AUI output: ' + err);
    }
});