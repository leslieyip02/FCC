'use strict';

module.exports = function(app) {

  const MongoClient = require('mongodb').MongoClient;
  const bcrypt = require('bcrypt');

  app.route('/api/stock-prices')
    .get(function(req, res) {
      // console.log(req.query)

      let stocks = [];
      if (typeof req.query.stock == "string") {
        stocks.push(req.query.stock.toUpperCase());
      } else {
        req.query.stock.forEach(stock => {
          stocks.push(stock.toUpperCase());
        });
      }

      // get ip
      let ip_addr = req.headers['x-forwarded-for'];
      
      async function getLikes(stock) {
        try {
          let client = await MongoClient.connect(
            process.env.MONGO_URI, 
            {
              useNewUrlParser: true, 
              useUnifiedTopology: true
            }
          );

          const db = client.db('stocksDB');

          async function like(update) {
            // upsert into collection
            if (update) {
              // hash ip
              let hashed = bcrypt.hash(ip_addr, 12);
              return db.collection('stocks').findOneAndUpdate(
                  { stock: stock },
                  { 
                    $inc: { likes: 1 },
                    $push: { hashed: await hashed }
                  },
                  { upsert: true, returnDocument: 'after' }
                )
                .then(updated => updated.value.likes)
                .catch(e => console.log(e));

            // read like value if it exists
            } else {
              return db.collection('stocks').findOne({ stock: stock })
                .then(found => found ? found.likes : 0)
                .catch(e => console.log(e));
            }
          }
          
          // prevent like update by default
          let likePromise = new Promise((resolve, reject) => {
            resolve(false);
          });
          if (req.query.like === 'true') {
            likePromise = new Promise((resolve, reject) => {
              db.collection('stocks').findOne({ stock: stock })
                .then(doc => {
                  let update;
                  // check if the like is valid
                  // 1) new stock entry so the doc doesn't exist
                  if (!doc) {
                    update = true;
                  
                  // 2) the like is from a new ip
                  } else if (doc.hashed.length > 0) {
                    // let duplicate = doc.hashed.some(async (ip) => {
                    //   return await bcrypt.compare(ip_addr, ip);
                    // });
                    // update = duplicate ? false : true;

                    let promiseArr = [];
                    doc.hashed.forEach(ip => {
                      let unique = new Promise((resolve, reject) => {
                        bcrypt.compare(ip_addr, ip)
                        .then(res => {
                          if (res) {
                            reject(false);
                          } else {
                            resolve(true);
                          }
                        });
                      });
                      promiseArr.push(unique);
                    });
                    
                    Promise.all(promiseArr)
                      .then(res => {
                        if (!res) {
                          update = false;
                        } else {
                          update = true;
                        }
                      })
                      .catch(e => console.log(e));
                    
                  // no update by default
                  } else {
                    update = false;
                  }

                  // return update
                  resolve(update);
                })
                .catch(e => reject(console.log(e)));
              });
          }

          return likePromise
            .then(update => {
              let likes = like(update);
              return likes;
            })
            .catch(e => console.log(e));
        } catch(e) {
          console.log(e);
        }
      }

      async function getStockData(stock) {
        let likes = getLikes(stock);
        
        let url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;

        // parse api data
        let price = fetch(url)
          .then(response => response.json())
          .then(parsed => {
            // handle invalid stocks
            if (!parsed.latestPrice) return { "error": "not found" }
            return parsed.latestPrice
          });

        return Promise.all([price, likes])
          .then(data => {
            // return stock data
            return {
              "stock": stock,
              "price": data[0],
              "likes": data[1]
            }
          });
      }

      async function respond() {
        if (stocks.length === 1) {
          return getStockData(stocks[0]);
        } else if (stocks.length === 2) {
          let stocksData = await Promise.all([
            getStockData(stocks[0]),
            getStockData(stocks[1])
          ]);

          // calculate like difference and remove likes property
          stocksData[0].rel_likes = stocksData[0].likes - stocksData[1].likes;
          stocksData[1].rel_likes = stocksData[1].likes - stocksData[0].likes;
          delete stocksData[0].likes;
          delete stocksData[1].likes;

          // wait for both stocks' data to be fetched
          return stocksData;
        }
      }

      // return a response
      respond()
        .then(response => {
          // console.log(response);
          res.json({
            "stockData": response
          });
        })
        .catch(e => console.log(e));

  });
};
