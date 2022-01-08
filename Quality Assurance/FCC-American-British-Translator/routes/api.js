'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let text = req.body.text;
      let locale = req.body.locale;

      if (text == undefined || locale == undefined) return res.json({ error: 'Required field(s) missing' });

      if (text == "") return res.json({ error: 'No text to translate' });
      if (locale != "american-to-british" && locale != "british-to-american") return res.json({ error: 'Invalid value for locale field' });

      

      let output;
      if (locale == "american-to-british") {
        output = translator.a2b(text);
      } else if (locale == "british-to-american") {
        output = translator.b2a(text);
      }
      
      if (!output) {
        return res.json({
          text: text,
          translation: "Everything looks good to me!"
        });
      } else if (output) {
        return res.json({
          text: text,
          translation: output
        });
      }
    });
};
