const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {  
  test('Viewing one stock', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=AAPL')
      .set('x-forwarded-for', '116.86.12.45')
      .end((err, res) => {
        if (err) throw err;
        
        assert.equal(res.status, 200);
        // check for stock name
        assert.equal(res.body.stockData["stock"], 'AAPL');
        // check for stock price
        assert.isNumber(res.body.stockData["price"]);
        // check likes
        // not reliable to test the actual like number
        assert.isNumber(res.body.stockData["likes"]);

        done();
      });
  });

  let aapllikes = 0;
  
  test('Viewing one stock and liking it', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=AAPL&like=true')
      .set('x-forwarded-for', '116.86.12.45')
      .end((err, res) => {
        if (err) throw err;
        
        assert.equal(res.status, 200);
        // check for stock name
        assert.equal(res.body.stockData["stock"], 'AAPL');
        // check for stock price
        assert.isNumber(res.body.stockData["price"]);
        // check likes
        // not reliable to test the actual like number
        assert.isNumber(res.body.stockData["likes"]);
        aapllikes = res.body.stockData["likes"]

        done();
      });
  });

  test('Viewing the same stock and liking it again', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=AAPL')
      .set('x-forwarded-for', '116.86.12.45')
      .end((err, res) => {
        if (err) throw err;
        
        assert.equal(res.status, 200);
        // check for stock name
        assert.equal(res.body.stockData["stock"], 'AAPL')
        // check for stock price
        assert.isNumber(res.body.stockData["price"]);
        // check likes
        assert.isNumber(res.body.stockData["likes"]);
        assert.equal(res.body.stockData["likes"], aapllikes);

        done();
      });
  });

  test('Viewing two stocks', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=AAPL&stock=NFLX')
      .set('x-forwarded-for', '116.86.12.45')
      .end((err, res) => {
        if (err) throw err;
        
        assert.equal(res.status, 200);
        // check for stock names
        assert.equal(res.body.stockData[0]["stock"], 'AAPL');
        assert.equal(res.body.stockData[1]["stock"], 'NFLX');
        // check for stock prices
        assert.isNumber(res.body.stockData[0]["price"]);
        assert.isNumber(res.body.stockData[1]["price"]);
        // check for rel likes
        // not reliable to test the actual like number
        assert.isNumber(res.body.stockData[0]["rel_likes"]);
        assert.isNumber(res.body.stockData[1]["rel_likes"]);
        assert.equal(res.body.stockData[0]["rel_likes"], -res.body.stockData[1]["rel_likes"])

        done();
      });
  });

  test('Viewing two stocks and liking them', function(done) {
    chai
      .request(server)
      .get('/api/stock-prices?stock=AAPL&stock=NFLX&like=true')
      .set('x-forwarded-for', '116.86.12.45')
      .end((err, res) => {
        if (err) throw err;
        
        assert.equal(res.status, 200);
        // check for stock names
        assert.equal(res.body.stockData[0]["stock"], 'AAPL');
        assert.equal(res.body.stockData[1]["stock"], 'NFLX');
        // check for stock prices
        assert.isNumber(res.body.stockData[0]["price"]);
        assert.isNumber(res.body.stockData[1]["price"]);
        // check for rel likes
        // not reliable to test the actual like number
        assert.isNumber(res.body.stockData[0]["rel_likes"]);
        assert.isNumber(res.body.stockData[1]["rel_likes"]);
        assert.equal(res.body.stockData[0]["rel_likes"], -res.body.stockData[1]["rel_likes"])

        done();
      });
  });

});

// MongoClient.connect(
//     process.env.MONGO_URI, 
//     {
//       useNewUrlParser: true, 
//       useUnifiedTopology: true
//     }
//   )
//   .then(client => {
//     const db = client.db('stocksDB');
//     // test stocks: AAPL and NFLX
//     // remove any test entries if present
//     db.collection('stocks').deleteOne({ stock: 'AAPL' });
//     db.collection('stocks').deleteOne({ stock: 'NFLX' });
//   });

/**

  Viewing one stock: GET request to /api/stock-prices/
  Viewing one stock and liking it: GET request to /api/stock-prices/
  Viewing the same stock and liking it again: GET request to /api/stock-prices/
  Viewing two stocks: GET request to /api/stock-prices/
  Viewing two stocks and liking them: GET request to /api/stock-prices/

**/