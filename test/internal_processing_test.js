import JSBot from "lib/JSBot";
import Chai  from 'chai';

var expect = Chai.expect;

describe("JSBot internal processing", () =>  {
  let jsbot; // define bot

  before(() => {
    jsbot = JSBot(); // initialize Bot
  })

  it("reports a missing semicolon", () => {
    let jsString = 'var a = 5';

    jsbot.process(jsString)
    let error = jsbot.getIssues().errors[0];

    expect(error.reason).to.contain("Missing semicolon");
    expect(error.line).to.equal(1);
    expect(error.character).to.equal(10);
  })

  it("reports a missing bracket", () => {
    let jsString = 'function goo(){';
    jsbot.process(jsString)
    let error = jsbot.getIssues().errors[0];

    expect(error.reason).to.contain("Unmatched");
    expect(error.line).to.equal(1);
    expect(error.character).to.equal(15);
  })

  it("reports unused variables", () => {
    let jsString = 'function goo(){}';
    jsbot.process(jsString)
    let unused = jsbot.getIssues().unused[0];

    expect(unused.name).to.contain("goo");
    expect(unused.line).to.equal(1);
    expect(unused.character).to.equal(10);
  })

  it("reports multiple issues", () => {
    let jsString =
      "function goo() {" +
        "foo = 3\n" +
        "p.start()" +
      "}";
    jsbot.process(jsString);

    // errors:
    //[ { line: 1, character: 24, reason: 'Missing semicolon.' },
    //{ line: 2, character: 10, reason: 'Missing semicolon.' },
    //{ line: 1, character: 17, reason: '\'foo\' is not defined.' },
    //{ line: 2, character: 1, reason: '\'p\' is not defined.' } ]
    var errors = jsbot.getIssues().errors
    expect(errors).to.have.length(4);
    // can keep testing here but the order is not reliable

    // unused:
    // [ { name: 'goo', line: 1, character: 10 } ]
    var unused = jsbot.getIssues().unused
    expect(unused).to.have.length(1);
  })

})

