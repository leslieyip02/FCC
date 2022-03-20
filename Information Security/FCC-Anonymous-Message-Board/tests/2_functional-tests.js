const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let board = 'test';
  let text = 'test_text';
  let password = 'test_password';

  let thread_id, reply_id;
  
  test('Creating a new thread', function(done) {
    chai.request(server)
      .post('/api/threads/test')
      .set('x-forwarded-for', '116.86.12.45')
      .send({
        board: board,
        text: text,
        delete_password: password
      })
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.equal(res.body.board, board);
        assert.equal(res.body.text, text);
        assert.equal(res.body.delete_password, password);
        thread_id = res.body._id;
        done();
      });
  });

  test('Creating a new reply', function(done) {
    chai.request(server)
      .post('/api/replies/test')
      .send({
        board: board,
        thread_id: thread_id,
        text: text,
        delete_password: password
      })
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.equal(res.body.board, board);
        assert.equal(res.body.replies[0].text, text);
        assert.equal(res.body.replies[0].delete_password, password);
        reply_id = res.body.replies[0]._id;
        done();
      });
  });

  test('Reporting a thread', function(done) {
    chai.request(server)
      .put('/api/threads/test')
      .send({
        thread_id: thread_id
      })
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.equal(res.text, 'reported');
        done();
      });
  });

  test('Reporting a reply', function(done) {
    chai.request(server)
      .put('/api/replies/test')
      .send({
        thread_id: thread_id,
        reply_id: reply_id
      })
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.equal(res.text, 'reported');
        done();
      });
  });

  test('Viewing the 10 most recent threads', function(done) {
    chai.request(server)
      .get('/api/threads/test')
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.isAtMost(res.body.length, 10);
        assert.notExists(res.body[0].delete_password);
        assert.notExists(res.body[0].reported);
        if (res.body[0].replies.length > 0) {
          assert.isAtMost(res.body[0].replies.length, 3);
          assert.notExists(res.body[0].replies[0].delete_password);
          assert.notExists(res.body[0].replies[0].reported);
        }
        done();
      });
  });

  test('Viewing a single thread with all replies', function(done) {
    chai.request(server)
      .get(`/api/replies/test?thread_id=${thread_id}`)
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.notExists(res.body.delete_password);
        assert.notExists(res.body.reported);
        if (res.body.replies.length > 0) {
          assert.notExists(res.body.replies[0].delete_password);
          assert.notExists(res.body.replies[0].reported);
        }
        done();
      });
  })

  test('Deleting a reply with wrong password', function(done) {
    chai.request(server)
      .delete('/api/replies/test')
      .send({
        thread_id: thread_id,
        reply_id: reply_id,
        delete_password: 'wrong_password'
      })
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        done();
      });
  });

  test('Deleting a reply with correct password', function(done) {
    chai.request(server)
      .delete('/api/replies/test')
      .send({
        thread_id: thread_id,
        reply_id: reply_id,
        delete_password: password
      })
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        done();
      });
  });
  
  test('Deleting a thread with wrong password', function(done) {
    chai.request(server)
      .delete('/api/threads/test')
      .send({
        thread_id: thread_id,
        delete_password: 'wrong_password'
      })
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.equal(res.text, 'incorrect password');
        done();
      });
  });

  test('Deleting a thread with correct password', function(done) {
    chai.request(server)
      .delete('/api/threads/test')
      .send({
        thread_id: thread_id,
        delete_password: password
      })
      .end(function(err, res) {
        if (err) throw err;
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        done();
      });
  });
});

/*


    Creating a new thread: POST request to /api/threads/{board}
    Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}
    Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password
    Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password
    Reporting a thread: PUT request to /api/threads/{board}
    Creating a new reply: POST request to /api/replies/{board}
    Viewing a single thread with all replies: GET request to /api/replies/{board}
    Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password
    Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password
    Reporting a reply: PUT request to /api/replies/{board}


*/