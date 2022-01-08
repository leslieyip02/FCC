const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {

  a2b(text) {
    if (!text) return;
    let outputText = text;
    let changed = false;

    for (let aWord in americanToBritishSpelling) {
      let regex = "\\b" + aWord + "\\b";
      let re = new RegExp(regex, "i");
      if (re.test(outputText)) {
        let replacement = ['<span class="highlight">', '</span>'];
        replacement.splice(1, 0, americanToBritishSpelling[aWord]);
        replacement = replacement.join("");
        outputText = outputText.replace(re, replacement);
        changed = true;
      }
    }

    let outputTextArr = outputText.split(" ");
    outputTextArr.forEach((word, i) => {
      for (let aWord in americanToBritishTitles) {
        if (word.toLowerCase() == aWord.toLowerCase()) {
          let replacement = ['<span class="highlight">', '</span>'];
          replacement.splice(1, 0, americanToBritishTitles[aWord]);
          replacement = replacement.join("");
          outputTextArr.splice(i, 1, replacement);
          changed = true;
        }
      }
    });
    outputText = outputTextArr.join(" ");

    for (let aWord in americanOnly) {
      let regex = "\\b" + aWord + "\\b";
      let re = new RegExp(regex, "i");
      if (re.test(outputText)) {
        let replacement = ['<span class="highlight">', '</span>'];
        replacement.splice(1, 0, americanOnly[aWord]);
        replacement = replacement.join("");
        outputText = outputText.replace(re, replacement);
        changed = true;
      }
    }

    let timeRegex = /[0-2][0-9]:[0-6][0-9]/;
    if (timeRegex.test(outputText)) {
      let replacement = ['<span class="highlight">', '</span>'];
      let newTime = outputText.match(timeRegex)[0];
      newTime = newTime.replace(":", ".");
      replacement.splice(1, 0, newTime);
      replacement = replacement.join("");
      outputText = outputText.replace(timeRegex, replacement);
      changed = true;
    }

    if (changed) return outputText;
    return false;
  }

  b2a(text) {
    if (!text) return;
    let outputText = text;
    let changed = false;

    for (let aWord in americanToBritishSpelling) {
      let regex = "\\b" + americanToBritishSpelling[aWord] + "\\b";
      let re = new RegExp(regex, "i");
      if (re.test(outputText)) {
        let replacement = ['<span class="highlight">', '</span>'];
        replacement.splice(1, 0, aWord);
        replacement = replacement.join("");
        outputText = outputText.replace(re, replacement);
        changed = true;
      }
    }

    let outputTextArr = outputText.split(" ");
    outputTextArr.forEach((word, i) => {
      for (let aWord in americanToBritishTitles) {
        if (word.toLowerCase() == americanToBritishTitles[aWord].toLowerCase()) {
          let replacement = ['<span class="highlight">', '</span>'];
          replacement.splice(1, 0, aWord);
          replacement = replacement.join("");
          outputTextArr.splice(i, 1, replacement);
          changed = true;
        }
      }
    });
    outputText = outputTextArr.join(" ");

    let wordsUsedToReplace = [];
    for (let bWord in britishOnly) {
      let regex = "\\b" + bWord + "\\b";
      let re = new RegExp(regex, "i");
      if (re.test(outputText) && wordsUsedToReplace.indexOf(britishOnly[bWord]) == -1) {
        let replacement = ['<span class="highlight">', '</span>'];
        replacement.splice(1, 0, britishOnly[bWord]);
        replacement = replacement.join("");
        wordsUsedToReplace.push(britishOnly[bWord]);
        outputText = outputText.replace(re, replacement);
        changed = true;
      }
    }

    let timeRegex = /[0-2]*[0-9]\.[0-6][0-9]/;
    if (timeRegex.test(outputText)) {
      let replacement = ['<span class="highlight">', '</span>'];
      let newTime = outputText.match(timeRegex)[0];
      newTime = newTime.replace(".", ":");
      replacement.splice(1, 0, newTime);
      replacement = replacement.join("");
      outputText = outputText.replace(timeRegex, replacement);
      changed = true;
    }

    if (changed) return outputText;
    return false;
  }

}

module.exports = Translator;