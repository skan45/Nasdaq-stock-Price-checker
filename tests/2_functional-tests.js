const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

    test("viewing get request /api/stock-prices/", function (done) {
        chai
            .request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({ stock: "TSLA" })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, "TSLA")
                assert.exists(res.body.stockData.price, "TSLA  price")
                done()
            });

    });
    test("viewing one stock and liking it : GET request to /api/stock-price/?like=true", function (done) {
        chai
            .request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({ stock: "GOLD", like: true })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, "GOLD")
                assert.equal(res.body.stockData.likes, 1)
                assert.exists(res.body.stockData.price, "GOLD  price")
                done();
            }
            )
    });
    test("viewing the same  stock and liking it again  : GET request to /api/stock-price/?like=true", function (done) {
        chai
            .request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({ stock: "GOLD", like: true })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, "GOLD")
                assert.equal(res.body.stockData.likes, 1)
                assert.exists(res.body.stockData.price, "GOLD  price")
                done();
            }
            )
    });
    test("viewing two stocks: GET request to /api/stock-price/", function (done) {
        chai
            .request(server)
            .get("/api/stock-prices/")
            .set("content-type", "application/json")
            .query({ stock: ["AMZN", "T"] })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData[0].stock, "AMZN");
                assert.equal(res.body.stockData[1].stock, "T");
                assert.exists(res.body.stockData[0].prices, "AMZN has price");
                assert.exists(res.body.stockData[1].prices, "T has price");
                done();
            });
    });
    test("viewing two stocks: GET request to /api/stock-price/ and liking them", function (done) {
    chai
        .request(server)
        .get("/api/stock-prices/")
        .set("content-type", "application/json")
        .query({ stock: ["AMZN", "T"], like: true })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData[0].stock, "AMZN");
            assert.equal(res.body.stockData[1].stock, "T");
            assert.exists(res.body.stockData[0].prices, "AMZN has price");
            assert.exists(res.body.stockData[1].prices, "T has price");
            assert.exists(res.body.stockData[0].rel_likes, "AMZN has rel_likes");
            assert.exists(res.body.stockData[1].rel_likes, "T has rel_likes");
            done();
        });
});

    




})

