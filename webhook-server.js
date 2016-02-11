'use strict'

var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/webhook', secret: process.env.WEBHOOK_SECRET })
var port = process.env.PORT || 7000
var data = require('./data')

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(port)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

// ----
// code events

handler.on('push', function (event) {
  data.recordPush()
})

// ----
// communication events

var recentIssues = {}

handler.on('commit_comment', function (event) {
  data.recordComm()
})

handler.on('pull_request', function (event) {
  data.recordComm()
})

handler.on('pull_request_review_comment', function (event) {
  data.recordComm()
})

handler.on('issues', function (event) {
  var issue = event.payload.issue
  recentIssues[issue.number] = issue
  data.recordComm()
})

handler.on('issue_comment', function (event) {
  var issue = event.payload.issue
  recentIssues[issue.number] = issue
  data.recordComm()
})

var sendToSlack = require('./send-to-slack')
var lastState
setInterval(function () {
  var commChart = data.renderCommChart()
  var pushChart = data.renderPushChart()

  // don't keep sending the chart if nothing has changed
  var state = commChart + pushChart
  if (lastState === state) { return }
  lastState = state

  var info = {
    repoUrl: process.env.REPO_URL,
    commChart: commChart,
    pushChart: pushChart,
    recentIssues: []
  }

  // format recent issues list
  Object.keys(recentIssues).forEach(function (key) {
    var issue = recentIssues[key]
    info.recentIssues.push(issue.html_url)
  })

  // clear the recent issues list
  recentIssues = {}

  sendToSlack('_Communication:_ `' + commChart + '`  _Pushes_: `' + pushChart + '`', info)
}, 5000)
