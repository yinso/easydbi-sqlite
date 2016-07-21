#!/usr/bin/env coffee # -*- coffee-script -*- -p
DBI = require 'easydbi'
Promise = require 'bluebird'
require '../src/sqlite3'
assert = require 'assert'
path = require 'path'
fs = require 'fs'
loglet = require 'loglet'

describe 'sqlite driver test', () ->
  
  db = null 
  
  it 'can setup', (done) ->
    try 
      DBI.setup 'test', {type: 'sqlite', options: {filePath: path.join(__dirname, '..', 'example', 'test.db')}}
      done null
    catch e
      console.log 'connect.error', e
      done e
  
  it 'can prepare', (done) ->
    try
      DBI.load 'test', require('../example/test')
      done null
    catch e
      done e

  
  it 'can connect', (done) ->
    try
      DBI.connect 'test', (err, conn) ->
        if err
          done err
        else
          db = conn
          done null
    catch e
      done e

  it 'can create/insert/select', (done) ->
    db.createTestAsync({})
      .then ->
        db.execAsync 'insert into test_t (c1, c2) values ($c1, $c2)', {c1: 1, c2: 2}
      .then ->
        db.insertTestAsync {c1:3, c2:4}
      .then ->
        db.selectTestAsync {}
      .then (rows) ->
        assert.deepEqual rows, [{c1: 1, c2: 2}, {c1: 3, c2: 4}]
        done null
      .catch done
  it 'can have concurrent connections', (done) ->
    this.timeout(20000)
    helper = (count) ->
      DBI.connectAsync('test')
        .then (conn) ->
          conn.insertTestAsync({c1:2, c2:4})
            .then ->
              conn.selectTestAsync {}
            .then (rows) ->
              conn.disconnectAsync()
                .then ->
                  rows
    list = [1, 2, 3, 4, 5, 6, 7]
    Promise.map(list, helper)
      .then (results) ->
        db.selectTestAsync({})
      .then (rows) ->
        assert.equal rows.length, list.length + 2
      .then ->
        done null
      .catch done

  it 'clean up', (done) ->
    fs.unlink path.join(__dirname, '..', 'example', 'test.db'), done
    
    
    
