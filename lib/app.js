import express    from 'express';
import bodyParser from 'body-parser';
import JsBot   from './JsBot';

const port   = process.env.PORT || 3000;
var app      = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Fire JsBot!
app.post('/lunch', (req, res, next) => {
  Yelp.call(req.body.text).then( (response) => {
    JsBot.process(response)
    var response = JsBot.getResponse()
    res.status(200).json(response)
  })
});


// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, () => {
  console.log('Slack bot listening on port ' + port);
});