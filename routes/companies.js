const express = require("express")
const ExpressError = require("../expressError")
const slugify = require("slugify")
const db = require("../db");


router.get("/", async (request, response, next)=>{
    try{
        const results = await db.query(`SELECT * FROM companies ORDER BY name`) //Order by name//
        return response.json({companies:results.rows})
    }
    catch(err){
        return next(err) 
    }
})

router.get("/:code", async (request, response, next)=>{
    try{
       const {code} = req.params;
       const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [code])
        if(results.rows.length === 0){
            throw new ExpressError(`Cannot find companie with code of ${code}`, 404)
        }
    }
    catch (err){
        return next(err)
    }
})


//POST 1.0//
// router.post("/", async (req, res, next)=>{
//     try{
//         const {code, name, description} = req.body;
//         const results = await db.query("INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description", [code, name, description])
//         return response.statusCode(201).json({companies: results.rows[0]})
//     }
//     catch(err){
//         return next(err)
//     }
// })

//POST 1.1
router.post("/", async (req, res, next)=>{
    try{
        let code = slugify(name, {lower: true})
        const {name, description} = req.body;
        const results = await db.query("INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description", [code, name, description])
        return response.statusCode(201).json({companies: results.rows[0]})
    }
    catch(err){
        return next(err)
    }
})

router.patch("/:code", async(request, response, next)=>{
    try{
        const {code} = req.params
        const {name, description} = req.body;
        const results = await db.query("UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description", [code, name, description]);
        if (results.rows.length === 0){
            return response.send({companies: results.rows})  
        }
    }
    catch(e){
        return next(e)
    }
})

router.delete("/:code", async(req, res, next)=>{
    try{
        const {code} = req.params.code
        const results = db.query(`DELETE FROM companies WHERE CODE = $1`, [code])
        return res.send({msg: "DELETED!"})
    }
    catch(err){
        return next(err)
    }
})

router.get("/companies/:code")

module.exports = router;