import { JSHINT } from 'jshint';
import jsBeautify from 'js-beautify'

export default function JSBot() {

  // jshint options
  const _lintOptions = {
    undef: true
  }

  // The initial raw javascript code string
  let _jsString = "";

  // The processed, ready to "hint" Javascript array
  let _jsHintSource = [];

  // Generated error array
  let _errors = [];

  // Generated unused array
  let _unused = [];

  // Set beautifier
  let _beutify = jsBeautify.js

  const process = (jsString) => {
    clearPreviousChecks()

    // Set the input string and beutify it for proper line results
    _jsString = _beutify(jsString)

    // Parse the input to fit the jshint source format
    parseInput();

    // Make hint magic
    jshint();

    // Fetch useful data from the hints
    parseErrors();
    parseUnused();

  }

  const clearPreviousChecks = () => {
    _jsHintSource = [];
    _jsString     = "";
    _errors       = [];
    _unused       = [];
  }

  const jshint = () => {
    JSHINT(_jsHintSource, _lintOptions);
  }

  const parseErrors = () => {
    if(JSHINT.errors.length > 0) {
      _errors = JSHINT.errors.map((errorObj) => {
        if(errorObj) {
          return { line: errorObj.line, character: errorObj.character, reason: errorObj.reason }
        }
      });
    }
  }

  const parseUnused = () => {
    // example {name: foo, line:1 , character: 13 }
    // console.log(JSHINT.data().unused)
    _unused = JSHINT.data().unused;
  }

  const parseInput = () => {
    _jsHintSource = _jsString.split(/\n/);
  }

  const getPayload = () => {
    return {
      errors: _errors,
      unused: _unused,
      source: _jsString // already formatted
    }
  }

  return {
    process: process,
    getPayload: getPayload,
  }

}
