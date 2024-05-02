process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let snickers = { name: "snickers", price: 1.99 };

beforeEach(function() {
    items.length = 0;
    items.push(snickers);
});

afterEach(function() {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});

describe("GET /items", function() {
  test("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({items: [snickers]});
  });
});


describe("GET /items/:name", function() {
  test("Gets a single item", async function() {
    const resp = await request(app).get(`/items/${snickers.name}`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({item: snickers});
  });

  test("Responds with 404 if can't find item", async function() {
    const resp = await request(app).get(`/items/doggy`);
    expect(resp.statusCode).toBe(404);
  });
});


describe("POST /items", function() {
  test("Creates a new item", async function() {
    const resp = await request(app)
      .post(`/items`)
      .query({
        name: "skittles",
        price : Number(1.50)
      });
    const r  = JSON.parse(resp.text);
    expect(resp.statusCode).toBe(200);
    expect(r).toEqual({
       name: "skittles", price: 1.50
    });
  });
});


describe("PATCH /items/:name", function() {
  test("Updates a single item", async function() {
    const resp = await request(app)
      .patch(`/items/${snickers.name}`)
      .query({
        name: "banana",
        price: 0.49
      });
    const r  = JSON.parse(resp.text);
    console.log(r);
    expect(resp.statusCode).toBe(200);
    expect(r).toEqual({
      'updated': { name: "banana", price: 0.49 }
    });
  });

  test("Responds with 404 if id invalid", async function() {
    const resp = await request(app).patch(`/items/doggy`);
    expect(resp.statusCode).toBe(404);
  });
});


describe("DELETE /items/:name", function() {
  test("Deletes a single a item", async function() {
    const resp = await request(app).delete(`/items/${snickers.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual("Deleted");
  });
});
