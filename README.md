# Slack Github Integration

Premise: it's nice to see updates from github in a slack channel, because it gives some sense of progress. But when there is a lot of activity it becomes way too noisy.

Goal: give periodical summaries of activity happening on github (issues, comments, etc) without taking over the channel.

## Requirements

To run this you need a server running node. I haven't checked exact versions yet but should (?) run on anything > 0.12.0. Works fine on a free heroku instance.

You'll also need to:

- get a slack API token
- configure a webhook on your github repo
- configure an incoming webhook in your slack channel

More detailed instructions to come :)

## Ideas / Bug Reports?

yes please
