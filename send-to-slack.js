var Slack = require('slack-node');

var channelName = process.env.SLACK_CHANNEL;
var userName = process.env.SLACK_BOTNAME;
var slackToken = process.env.SLACK_TOKEN;

var slack = new Slack(slackToken);
slack.setWebhook(process.env.SLACK_WEBHOOK)

module.exports = function (text, info) {
  var fields = []
  if (info.recentIssues.length) {
    fields.push({
      title: 'Recent Issues',
      value: info.recentIssues.join('\n'),
      short: false
    })
  }

  var attachments = []
  if (fields.length) {
    attachments.push(
      {
        fallback: '',
        color: '#EEE',
        fields: fields
      }
    )
  }

  var opts = {
    text: text,
    channel: '#'+channelName,
    username: userName,
    icon_emoji: ':chart_with_upwards_trend:',
    attachments: attachments
  };

  slack.webhook(opts, function(err, res){
    if (err) { return console.error(err); }
    if (res.status !== 'ok') { return console.error(res); }
  });
}
