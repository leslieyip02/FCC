'use strict';
const mongoose    = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "msgBoardDB" });

const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true }
});
const threadSchema = new mongoose.Schema({
  board: { type: String, required: true },
  text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true },
  replies: { type: [ replySchema ], default: [] },
});

let Reply = mongoose.model('reply', replySchema);
let Thread = mongoose.model('thread', threadSchema);

module.exports = function (app) {

  function errorResponse(err, res) {
    console.log(err);
    return res.status(500);
  }
  
  app.route('/api/threads/:board')
    .get(function(req, res) {
      let board = req.params.board;

      Thread.find(
        { board: board },
        '-delete_password -reported',
        {
          sort: { bumped_on: 'desc' },
          limit: 10,
          lean: true
        },
        function (err, threads) {
          if (err) return errorResponse(err, res);
          let output = [];   
          threads.forEach((thread) => {
            let recentReplies = thread.replies.sort((a, b) => {
              return b.created_on - a.created_on;
            }).slice(0, 3);
            
            recentReplies.forEach(reply => {
              delete reply.delete_password;
              delete reply.reported;
            });
            output.push({
              text: thread.text,
              created_on: thread.created_on,
              bumped_on: thread.bumped_on,
              replies: recentReplies,
              _id: thread._id
            });
          });
          return res.json(output);
        }
      );
    })
    
    .post(function(req, res) {
      let board = req.params.board;
      let text = req.body.text;
      let delete_password = req.body.delete_password;
      let thread = new Thread({
        board: board,
        text: text,
        delete_password: delete_password
      });
      
      thread.save(function(err, thread) {
        if (err) return errorResponse(err, res);
        return res.json(thread);
      });
    })

    .delete(function(req, res) {
      let thread_id = req.body.thread_id;
      let delete_password = req.body.delete_password;

      Thread.deleteOne(
        {
          thread_id: thread_id,
          delete_password: delete_password
        },
        function(err, deleted) {
          if (deleted.deletedCount == 0) return res.send('incorrect password');
          if (err) return errorResponse(err, res);
          return res.send('success');
        }
      );
    })
    
    .put(function(req, res) {
      let thread_id = req.body.thread_id;

      Thread.findByIdAndUpdate(
        thread_id,
        { reported: true },
        function(err, thread) {
          if (err) return errorResponse(err, res);
          return res.send('reported');
        }
      );
    });
    
  app.route('/api/replies/:board')
    .get(function(req, res) {
      let thread_id = req.query.thread_id;
      
      Thread.findById(
        thread_id, 
        function(err, thread) {
          if (thread == null) return res.json({ error: 'No such thread.'});
          if (err) return errorResponse(err, res);
          let replies = thread.replies.map(reply => {
            return {
              text: reply.text,
              created_on: reply.created_on,
              _id: reply._id
            }
          });
          let output = {
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: replies,
            _id: thread._id
          };
          return res.json(output);
        });
      
    })
    
    .post(async function(req, res) {
      let thread_id = req.body.thread_id;
      const reply = new Reply(req.body);
      
      Thread.findByIdAndUpdate(
        thread_id, 
        { 
          bumped_on: await reply.created_on,
          $push: { replies: await reply }
        },
        { new: true },
        function(err, thread) {
          if (thread == null) return res.json({ error: 'No such thread.'});
          if (err) return errorResponse(err, res);
          reply.save(function(err, reply) {
            if (err) return errorResponse(err, res);
            return res.json(thread);
          });
        }
      );
    })

    .delete(function(req, res) {
      let thread_id = req.body.thread_id;
      let reply_id = req.body.reply_id;
      let delete_password = req.body.delete_password;
      
      Reply.findOneAndUpdate(
        {
          id: reply_id,
          delete_password: delete_password
        },
        { text: '[deleted]' },
        function(err, reply) {
          if (reply == null) return res.send('incorrect password');
          if (err) return errorResponse(err, res);

          Thread.findOneAndUpdate(
            { _id: thread_id, 'replies._id': reply_id },
            { $set: { 'replies.$.text': '[deleted]' } },
            function(err, thread) {
              if (err) return errorResponse(err, res);
              return res.send('success');
            }
          );          
        }
      );
    })
    .put(function(req, res) {
      let thread_id = req.body.thread_id;
      let reply_id = req.body.reply_id;

      Reply.findByIdAndUpdate(
        reply_id,
        { reported: true },
        function (err, reply) {
          if (err) return errorResponse(err, res);
          
          Thread.findOneAndUpdate(
            { _id: thread_id, 'replies._id': reply_id },
            { $set: { 'replies.$.reported': true } },
            function(err, thread) {
              if (err) return errorResponse(err, res);
              return res.send('reported');
            }
          );
        }
      );
    });
};
