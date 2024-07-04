const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const { route } = require("./companies");
const { request, response } = require("../app");
const app = require("../app");


router.get("/", async (request, response, next)=>{
    try{
        const results = await db.query("SELECT * FROM invoices");
        return response.json({invoices: results.rows}
        )
    }
    catch(err){
        return next(err)
    }
})

router.get("/:id", async(req, res, next)=>{
    try{
        const {id} = req.params
        const results = await db.query("SELECT * FROM invoices WHERE id = $1", [id])
        if(results.rows.lenght === 0){
            throw new ExpressError(`Cannot find the invoice with the id of ${id}`, 404)
        
        }
        return res.send({invoices: results.rows})
    }
    catch(e){
        return next(e)
    }
})

router.post("/", async (req, res, next)=>{
    try{
        const {comp_Code, amt, paid, paid_date} = req.body
        const results = await db.query("INSERT INTO invoices (comp_Code, amt, paid, paid_date) VALUES($1, $2, $3, $4) RETURNING comp_Code, amt, paid, paid_date", {comp_Code, amt, paid, paid_date})
        return res.status(201).json({invoices: results.rows})
    }
    catch(e){
        return next(e)
    }
})

router.patch("/id", async(req, res, next)=>{
    try{
        const {id} = req.params
        const {comp_Code, amt, paid, paid_date} = req.body
        const results = await db.query("UPDATE invoices SET comp_Code=$1, amt=$2, paid=$3, paid_date=$4 WHERE id=$5 RETURNING comp_Code, amt, paid, paid_date, id", [comp_Code, amt, paid, paid_date, id])
        if(results.rows.length === 0){
            throw new ExpressError(`Cannot update this invoice with the id of ${id}`, 404)
        }
        return res.send({invoices: results.rows})
    }
    catch(e){
        next(e)
    }
})

router.delete('/:id', async (req, res, next)=>{
    try{
        const results = await db.query('DELETE FROM invoices WHERE id=$1', [req.params.id])
    return res.send({msg:"DELETED!"})
    }
    catch(err){
        return next(err)
    }
})

router.get("/companies/:code", async (req, res, next)=>{
    try{
        const {code} = req.params.code
        const {id} = req.params.id
        const {name, description} = req.body;
        const {comp_Code, amt, paid, paid_date} = req.body
        const resultsC = await db.query("SELECT * FROM companies WHERE id=$1, name=$2, description=$3", [id, name, description]);
        const resultsI = await db.query("SELECT * FROM invoices WHERE comp_Code=$3, amt=%4, paid=$5, paid_date=$6", [comp_Code, amt, paid, paid_date]);
        if(resultsC.rows.length === 0){
            throw new ExpressError(`the company cannot be found with the given ${code}`, )
        }
        return res.json({company: resultsC.rows, invoices: resultsI.rows})

    }
    catch(e){
        next(e)
    }
})

module.exports = router;