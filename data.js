'use strict'

var sparkly = require('sparkly')
var moment = require('moment')

// todo: change minute-buckets to hourly buckets
var bucketFormat = 'YYYYMMDD-hhmm'
var data = require('./default-data.json')
var commsByBucket = data.comms
var pushesByBucket = data.pushes

// todo: cycle out old data
// ...

function renderChart (width, countByBucket) {
  var points = []

  var bucket
  var counter = width
  while (counter >= 0) {
    bucket = moment().subtract(counter, 'minutes').format(bucketFormat)
    points.push(countByBucket[bucket] || 0)
    counter -= 1
  }

  return sparkly(points)
}

module.exports.renderCommChart = function () {
  return renderChart(15, commsByBucket)
}

module.exports.renderPushChart = function () {
  return renderChart(15, pushesByBucket)
}

module.exports.recordComm = function () {
  var d = moment()
  // todo: change minute-buckets to hourly buckets
  var bucket = d.format(bucketFormat)
  if (!commsByBucket[bucket]) {
    commsByBucket[bucket] = 0
  }
  commsByBucket[bucket] += 1
}

module.exports.recordPush = function () {
  var d = moment()
  // todo: change minute-buckets to hourly buckets
  var bucket = d.format(bucketFormat)
  if (!pushesByBucket[bucket]) {
    pushesByBucket[bucket] = 0
  }
  pushesByBucket[bucket] += 1
}
