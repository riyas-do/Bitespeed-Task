const {fetchContactDetails} = require("../controllers/contactController")
const Router = require('express').Router();

Router.get('/',(req,res)=>res.status(200).send("Hello bitespeed team!"));
Router.post('/identity',fetchContactDetails);

module.exports = {Router}