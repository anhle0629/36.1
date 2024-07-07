// Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require("supertest")
const app = require("../app")
const db = require("../db")

let testCompany;

beforeeach( async()=>{
    let result = await db.query(
        "INSERT INTO companies (code, name, description) VALUES ('lulu', Lululemon, 'Athlesuire clothing brand') RETURNING code, name, description")
    testCompany = result.rows
})

aftereach( async()=>{
    await db.query("DELETE FROM companies")
})

afterAll(async () => {
    await db.end()
})

describe("", async()=>{
    test("", async()=>{})
})

describe("GET /companies", async()=>{
    test("Get a list with one company", async()=>{
        const res = await request(app).get("/companies")
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([testCompany]) 
    })
})

describe("GET /companies/:code", async()=>{
    test("Get a single company", async()=>{
        const res = await request(app).get(`/companies/${testCompany.code}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([testCompany])
    })
})

describe("POST /companies", async()=>{
    test("add a company to the list", async()=>{
        const res = await request(app).post("/companies").send({code: "CSCO", name:"CISCO", description:'A techonology network company'})
        expect(res.status).toBe(201)
        expect(res.body).toEqual(
            {code:"CSCO", name:"CISCO", description:"A techonology network company"}
        )
    })
})

describe("PATCH /companies/:code", () => {
    test("Updates a single company", async () => {
        const res = await request(app).patch(`/companies/${testCompany.code}`).send({code:"CSCO", name: "CISCO", description:'help to build a data network'})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({code: "CISCO", name: "CISCO", description:'help to build a data network'})
    })
    test("Respond with a 404 for invalid code", async()=>{
        const res = await request(app).patch("/companies/abc").send({code:"CSCO", name: "CISCO", description:'help to build a data network'})
        expect(res.statusCode).toBe(404)
    })
})

describe("DELETE /companies/:code", async ()=>{
    test("Delete a single companies")
    const res = await request(app).delete(`/companies/:code`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({msg: "DELETED!"})
})