// Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require("supertest")
const app = require("../app")
const db = require("../db")

let testInvoices;
beforeeach( async ()=>{
    const result = await db.query("INSERT INTO invoices (comp_Code, amt, paid, paid_date) VALUES ('LULU', '200', 'true', '2022-06-10')")
    testInvoices = result.rows
}
)

aftereach( async()=>{
    await db.query("DELETE FROM invoices")
})

afterAll(async () => {
    await db.end()
})

describe("", async()=>{
    test("", async()=>{})
})

describe("GET /invoices", async()=>{
    test("get an invoice from the list", async()=>{
        const res = await request(app).get("/invoices")
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([testInvoices])
    })
})

describe("GET /invoices/:id", async()=>{
    test("Get a single invoice", async()=>{
        const res = await request(app).get(`/invoices/${testInvoices.id}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([testInvoices])
    })
})

describe("POST /invoices", async()=>{
    test("make a new invoice", async()=>{
        const res = await request(app).post("/invoices").send({comp_Code:"CSCO", amt:"300", paid:"false", paid_date:""})
        expect(res.status).toBe(201)
        expect(res.body).toEqual({comp_Code:"CSCO", amt:"300", paid:"false", paid_date:""})
    })
})

describe("PATCH /invoice/:id", async()=>{
    test("update a company that paid their invoice", async()=>{
        const res = await request(app).patch(`/invoices/${invoices.id}`).send({comp_Code:"CSCO", amt:"300", paid:"true", paid_date:"2023-11-1"})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({comp_Code:"CSCO", amt:"300", paid:"true", paid_date:"2023-11-1"})
    })
    test("Respond with a 404 for an invalid id", async()=>{
        const res = await request(app).patch(`/invoice/lol`)
        expect(res.statusCode).toBe(404)
    })
})

describe("DELETE ", async()=>{
    test("delete an invoice", async()=>{
        const res = await request(app).delete(`/invoices/${invoices.id}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ msg: 'DELETED!' })
    })

})