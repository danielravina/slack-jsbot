import JSBotParser from "lib/JSBotParser";
import JSBotPresenter from "lib/JSBotPresenter";
import Chai  from 'chai';

var expect = Chai.expect;

describe("JSBot Presenter", () =>  {
  let parser, presenter;

  before(() => {
    parser    = JSBotParser();
    presenter = JSBotPresenter();
  })

  it("presents the error in a slackable way", () => {
    let jsString = 'var a = 5';

    parser.process(jsString)
    presenter.process(parser.getPayload())

    expect

  })
})