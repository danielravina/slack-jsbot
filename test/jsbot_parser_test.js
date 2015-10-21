import JSBotParser from "lib/JSBotParser";
import Chai  from 'chai';

var expect = Chai.expect;

describe("JSBot Parser", () =>  {
  let parser; // define bot

  before(() => {
    parser = JSBotParser(); // initialize Bot
  })

  it("reports a missing semicolon", () => {
    let jsString = 'var a = 5';

    parser.process(jsString)
    let error = parser.getPayload().errors[0];

    expect(error.reason).to.contain("Missing semicolon");
    expect(error.line).to.equal(1);
    expect(error.character).to.equal(10);
  })

  it("reports a missing bracket", () => {
    let jsString = 'function goo(){';
    parser.process(jsString)
    let error = parser.getPayload().errors[0];
    expect(error.reason).to.contain("Unmatched");
    expect(error.line).to.equal(1);

    expect(error.character).to.equal(16);
  })

  it("reports unused variables", () => {
    let jsString = 'function goo(){}';
    parser.process(jsString)
    let unused = parser.getPayload().unused[0];

    expect(unused.name).to.contain("goo");
    expect(unused.line).to.equal(1);
    expect(unused.character).to.equal(10);
  })

  it("reports multiple issues", () => {
    let jsString = "function goo() { foo = 3\n p.start() }";
    parser.process(jsString);

    // errors:
    //[ { line: 1, character: 24, reason: 'Missing semicolon.' },
    //{ line: 2, character: 10, reason: 'Missing semicolon.' },
    //{ line: 1, character: 17, reason: '\'foo\' is not defined.' },
    //{ line: 2, character: 1, reason: '\'p\' is not defined.' } ]
    var errors = parser.getPayload().errors
    expect(errors).to.have.length(4);
    // can keep testing here but the order is not reliable

    // unused:
    // [ { name: 'goo', line: 1, character: 10 } ]
    var unused = parser.getPayload().unused
    expect(unused).to.have.length(1);
  })

})

