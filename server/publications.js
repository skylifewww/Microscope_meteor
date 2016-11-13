Meteor.publish('questions', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Questions.find({}, options);
});

Meteor.publish('singleQuestion', function(id) {
  check(id, String);
  return Questions.find(id);
});


Meteor.publish('answers', function(questionId) {
  check(questionId, String);
  return Answers.find({questionId: questionId});
});


Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
