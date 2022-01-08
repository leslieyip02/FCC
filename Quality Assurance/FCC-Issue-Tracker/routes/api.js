'use strict';

//const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const issueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  open: { type: Boolean, default: true },
  status_text: { type: String, default: "" }
});

module.exports = function (app) {

  app.route('/api/issues/:project')
    
    .get(function (req, res){
      let project = req.params.project;

      let Project = mongoose.model(project, issueSchema);
      Project.find(req.query, (err, issues) => {
        if (err) return console.log(err);
        //console.log(issues);
        res.json(issues);
      });
    })
    
    .post(function (req, res){
      let project = req.params.project;

      if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
        const newIssue = {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          open: true,
          status_text: req.body.status_text || ""            
        };

        let Project = mongoose.model(project, issueSchema);
        Project.create(newIssue, (err, insertedIssue) => {
          if (err) return console.log(err);
          newIssue._id = insertedIssue._id;
          //console.log(newIssue);
          res.json(newIssue);
        })
      } else {
        res.json({ error: "required field(s) missing" });
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;

      if (req.body._id) {
        let updatedIssue = {
          issue_title: req.body.issue_title || undefined,
          issue_text: req.body.issue_text || undefined,
          created_by: req.body.created_by || undefined,
          assigned_to: req.body.assigned_to || undefined,
          status_text: req.body.status_text || undefined,
          open: req.body.open || undefined
        };

        Object.keys(updatedIssue).forEach((key) => {
          updatedIssue[key] === undefined ? delete updatedIssue[key] : {}
        });

        if (Object.keys(updatedIssue).length == 0) {
          return res.json({ error: 'no update field(s) sent', '_id': req.body._id })
        } else {
          updatedIssue.updated_on = new Date().toISOString();
        }
        
        let Project = mongoose.model(project, issueSchema);
        Project.findByIdAndUpdate(req.body._id, updatedIssue, { returnDocument: "after"}, (err, issue) => {
          if (err) return console.log(err);
          if (issue == null) return res.json({ error: 'could not update', '_id': req.body._id });
          //console.log(issue);
          res.json({  result: 'successfully updated', '_id': req.body._id })
        });
      } else {
        res.json({ error: 'missing _id' });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
      if (req.body._id) {
        let Project = mongoose.model(project, issueSchema);
        Project.findByIdAndDelete(req.body._id, (err, deletedIssue) => {
          if (err) return console.log(err);
          if (deletedIssue == null) return res.json({ error: 'could not delete', '_id': req.body._id });
          return res.json({ result: 'successfully deleted', '_id': req.body._id })
        })
      } else {
        res.json({ error: 'missing _id' });
      }
    });
    
};