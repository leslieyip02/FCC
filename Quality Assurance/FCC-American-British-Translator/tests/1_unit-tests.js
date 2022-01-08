const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translator = new Translator();

suite('Unit Tests', () => {
  test("1", () => {
    let string = 'Mangoes are my favorite fruit.';
    assert.equal(translator.a2b(string), 'Mangoes are my <span class="highlight">favourite</span> fruit.');
  });

  test("2", () => {
    let string = 'I ate yogurt for breakfast.';
    assert.equal(translator.a2b(string), 'I ate <span class="highlight">yoghurt</span> for breakfast.');
  });

  test("3", () => {
    let string = 'We had a party at my friend\'s condo.';
    assert.equal(translator.a2b(string), 'We had a party at my friend\'s <span class="highlight">flat</span>.');
  });

  test("4", () => {
    let string = 'Can you toss this in the trashcan for me?';
    assert.equal(translator.a2b(string), 'Can you toss this in the <span class="highlight">bin</span> for me?');
  });

  test("5", () => {
    let string = 'The parking lot was full.';
    assert.equal(translator.a2b(string), 'The <span class="highlight">car park</span> was full.');
  });

  test("6", () => {
    let string = 'Like a high tech Rube Goldberg machine.';
    assert.equal(translator.a2b(string), 'Like a high tech <span class="highlight">Heath Robinson device</span>.');
  });

  test("7", () => {
    let string = 'To play hooky means to skip class or work.';
    assert.equal(translator.a2b(string), 'To <span class="highlight">bunk off</span> means to skip class or work.');
  });

  test("8", () => {
    let string = 'No Mr. Bond, I expect you to die.';
    assert.equal(translator.a2b(string), 'No <span class="highlight">Mr</span> Bond, I expect you to die.');
  });

  test("9", () => {
    let string = 'Dr. Grosh will see you now.';
    assert.equal(translator.a2b(string), '<span class="highlight">Dr</span> Grosh will see you now.');
  });

  test("10", () => {
    let string = 'Lunch is at 12:15 today.';
    assert.equal(translator.a2b(string), 'Lunch is at <span class="highlight">12.15</span> today.');
  });

  test("11", () => {
    let string = 'We watched the footie match for a while.';
    assert.equal(translator.b2a(string), 'We watched the <span class="highlight">soccer</span> match for a while.');
  });

  test("12", () => {
    let string = 'Paracetamol takes up to an hour to work.';
    assert.equal(translator.b2a(string), '<span class="highlight">Tylenol</span> takes up to an hour to work.');
  });

  test("13", () => {
    let string = 'First, caramelise the onions.';
    assert.equal(translator.b2a(string), 'First, <span class="highlight">caramelize</span> the onions.');
  });

  test("14", () => {
    let string = 'I spent the bank holiday at the funfair.';
    assert.equal(translator.b2a(string), 'I spent the <span class="highlight">public holiday</span> at the <span class="highlight">carnival</span>.');
  });

  test("15", () => {
    let string = 'I had a bicky then went to the chippy.';
    assert.equal(translator.b2a(string), 'I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.');
  });

  test("16", () => {
    let string = 'I\'ve just got bits and bobs in my bum bag.';
    assert.equal(translator.b2a(string), 'I\'ve just got <span class="highlight">odds and ends</span> in my <span class="highlight">fanny pack</span>.');
  });

  test("17", () => {
    let string = 'The car boot sale at Boxted Airfield was called off.';
    assert.equal(translator.b2a(string), 'The <span class="highlight">swap meet</span> at Boxted Airfield was called off.');
  });

  test("18", () => {
    let string = 'Have you met Mrs Kalyani?';
    assert.equal(translator.b2a(string), 'Have you met <span class="highlight">Mrs.</span> Kalyani?');
  });

  test("19", () => {
    let string = 'Prof Joyner of King\'s College, London.';
    assert.equal(translator.b2a(string), '<span class="highlight">Prof.</span> Joyner of King\'s College, London.');
  });

  test("20", () => {
    let string = 'Tea time is usually around 4 or 4.30.';
    assert.equal(translator.b2a(string), 'Tea time is usually around 4 or <span class="highlight">4:30</span>.');
  });

  test("21", () => {
    let string = 'Mangoes are my favorite fruit.';
    assert.equal(translator.a2b(string), 'Mangoes are my <span class="highlight">favourite</span> fruit.');
  });

  test("22", () => {
    let string = 'I ate yogurt for breakfast.';
    assert.equal(translator.a2b(string), 'I ate <span class="highlight">yoghurt</span> for breakfast.');
  });

  test("23", () => {
    let string = 'We watched the footie match for a while.';
    assert.equal(translator.b2a(string), 'We watched the <span class="highlight">soccer</span> match for a while.');
  });

  test("24", () => {
    let string = 'Paracetamol takes up to an hour to work.';
    assert.equal(translator.b2a(string), '<span class="highlight">Tylenol</span> takes up to an hour to work.');
  });
});

/*


    Translate Mangoes are my favorite fruit. to British English
    Translate I ate yogurt for breakfast. to British English
    Translate We had a party at my friend's condo. to British English
    Translate Can you toss this in the trashcan for me? to British English
    Translate The parking lot was full. to British English
    Translate Like a high tech Rube Goldberg machine. to British English
    Translate To play hooky means to skip class or work. to British English
    Translate No Mr. Bond, I expect you to die. to British English
    Translate Dr. Grosh will see you now. to British English
    Translate Lunch is at 12:15 today. to British English
    Translate We watched the footie match for a while. to American English
    Translate Paracetamol takes up to an hour to work. to American English
    Translate First, caramelise the onions. to American English
    Translate I spent the bank holiday at the funfair. to American English
    Translate I had a bicky then went to the chippy. to American English
    Translate I've just got bits and bobs in my bum bag. to American English
    Translate The car boot sale at Boxted Airfield was called off. to American English
    Translate Have you met Mrs Kalyani? to American English
    Translate Prof Joyner of King's College, London. to American English
    Translate Tea time is usually around 4 or 4.30. to American English
    Highlight translation in Mangoes are my favorite fruit.
    Highlight translation in I ate yogurt for breakfast.
    Highlight translation in We watched the footie match for a while.
    Highlight translation in Paracetamol takes up to an hour to work.

*/