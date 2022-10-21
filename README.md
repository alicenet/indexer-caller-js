JSDOC Installation and Usage

You can install JSDoc globally or in your project's node_modules folder.

To install the latest version on npm globally (might require sudo; learn how to fix this):

npm install -g jsdoc
To install the latest version on npm locally and save it in your package's package.json file:

npm install --save-dev jsdoc
Note: By default, npm adds your package using the caret operator in front of the version number (for example, ^3.6.3). We recommend using the tilde operator instead (for example, ~3.6.3), which limits updates to the most recent patch-level version. See this Stack Overflow answer for more information about the caret and tilde operators.

To install the latest development version locally, without updating your project's package.json file:

npm install git+https://github.com/jsdoc/jsdoc.git
If you installed JSDoc locally, the JSDoc command-line tool is available in ./node_modules/.bin. To generate documentation for the file yourJavaScriptFile.js:

./node_modules/.bin/jsdoc yourJavaScriptFile.js
If you installed JSDoc globally, run the jsdoc command:

jsdoc yourJavaScriptFile.js
By default, the generated documentation is saved in a directory named out. You can use the --destination (-d) option to specify another directory.

Run jsdoc --help for a complete list of command-line options.