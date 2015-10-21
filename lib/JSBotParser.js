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

  // generated error array
  let _errors = [];

  // generated unused array
  let _unused = [];

  // set beutifier
  let _beutify = jsBeautify.js

  const process = (jsString) => {
    clearPreviousChecks()

    // set the input string and beutify it for proper line results
    _jsString = _beutify(jsString)

    // parse the input to fit the jshint source format
    parseInput();

    // make magic
    jshint();

    // fetch useful data from the hints
    fetchErrors();
    fetchUnused();
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

  const fetchErrors = () => {
    if(JSHINT.errors.length > 0) {
      _errors = JSHINT.errors.map((errorObj) => {
        if(errorObj) {
          return { line: errorObj.line, character: errorObj.character, reason: errorObj.reason }
        }
      });
    }
  }

  const fetchUnused = () => {
    // example {name: foo, line:1 , character: 13 }
    // console.log(JSHINT.data().unused)
    _unused = JSHINT.data().unused;
  }

  const parseInput = () => {
    _jsHintSource = _jsString.split(/\n/);
  }


  // Getters
  const getIssues = () => {
    // return all the issues
    return { errors: _errors, unused: _unused }
  }

  const getJsString = () => {
    return _jsString;
  }

  return {
    process: process,
    getIssues: getIssues,
    getJsString: getJsString
  }

}
