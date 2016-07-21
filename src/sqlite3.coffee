
sqlite3 = require('sqlite3').verbose()
DBI = require 'easydbi'
Driver = require 'easydbi/lib/driver'
queryHelper = require 'easydbi/lib/query'
loglet = require 'loglet'
Errorlet = require 'errorlet'

class Sqlite3Driver extends Driver
  @pool = false
  @id = 0
  constructor: (@key, @options) ->
    super @key, @options
    @connstr = @makeConnStr @options
    @type = 'sqlite3'
  makeConnStr: (options) ->
    if options?.memory
      ":memory:"
    else if options.filePath
      options.filePath
    else
      ":memory:"
  connect: (cb) ->
    self = @
    @inner = new sqlite3.Database @connstr, (err) ->
      if err
        cb err
      else
        loglet.debug "#{self.driverName()}.connect:OK", self.id
        cb null, self
  isConnected: () ->
    val = @inner instanceof sqlite3.Database
    loglet.debug "#{@driverName()}.isConnected", val
    val
  innerQuery: (stmt, args, cb) ->
    try
      [ normedStmt, normedArgs ] = queryHelper.arrayify stmt, args
      @inner.all normedStmt, normedArgs, cb
    catch e
      cb e
  innerExec: (stmt, args, cb) ->
    self = @
    waitCallback = () ->
      self.innerExec stmt, args, cb
    [ normedStmt, normedArgs ] = queryHelper.arrayify stmt, args
    @inner.run normedStmt, normedArgs, (err, res) ->
      if err?.code == 'SQLITE_BUSY'
        setTimeout waitCallback, self.options?.timeout or 500
      else
        cb err
  innerDisconnect: (cb) ->
    @inner.close cb
  innerClose: (cb) ->
    @inner.close cb

DBI.register 'sqlite', Sqlite3Driver

module.exports = Sqlite3Driver
