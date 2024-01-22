'use strict';
const StockModel = require('../models').stock;
const fetch = require("node-fetch");

async function saveStock(stock, like, ip) {
  const foundstock = await StockModel.findOne({ symbol: stock }).exec();
  
  if (!foundstock) {
    const newstock = new StockModel({
      symbol: stock,
      likes: like=="true" ? [ip] : [], // Only add IP to likes if like is true
    });

    const createnew = await newstock.save();
    return createnew;
  } else {
    if (like && foundstock.likes.indexOf(ip) === -1) {
      foundstock.likes.push(ip);
    }
    
    const saved = await foundstock.save();
    return saved;
  }
}

async function getStock(stock) {
  const api = await fetch(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
  );
  
  const { symbol, latestPrice } = await api.json();
  return { symbol, latestPrice };
}

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      
      if (Array.isArray(stock)) {
        const { symbol, latestPrice } = await getStock(stock[0]);
        const firstStockData = await saveStock(stock[0], like, req.ip);
        const { symbol: symbol2, latestPrice: latestPrice2 } = await getStock(stock[1]);
        const secondStockData = await saveStock(stock[1], like, req.ip);

        let stockData = [];

        if (!symbol) {
          stockData.push({
            rel_likes: firstStockData.likes.length - secondStockData.likes.length
          });
        } else {
          stockData.push({
            stock: symbol,
            prices: latestPrice,
            rel_likes: firstStockData.likes.length - secondStockData.likes.length,
          });
        }

        if (!symbol2) {
          stockData.push({
            rel_likes: secondStockData.likes.length - firstStockData.likes.length
          });
        } else {
          stockData.push({
            stock: symbol2,
            prices: latestPrice2,
            rel_likes: secondStockData.likes.length - firstStockData.likes.length,
          });
        }

        res.json({
          stockData,
        });
        return;
      }

      const { symbol, latestPrice } = await getStock(stock);
      if (!symbol) {
        res.json({
          stockData: { likes: like=="true" ? 1 : 0 }
        });
        return;
      }

      const oneStockData = await saveStock(stock, like, req.ip);
      console.log(oneStockData);
      res.json({
        stockData: {
          stock: symbol,
          price: latestPrice,
          likes: oneStockData.likes.length,
        },
      });
    });
};
