Answers = new Mongo.Collection('answers');

Meteor.methods({
  answerInsert: function(answerAttributes) {
    check(this.userId, String);
    check(answerAttributes, {
      questionId: String,
      body: String,
      isRight: String
    });
    
    var user = Meteor.user();
    var question = Questions.findOne(answerAttributes.questionId);

    if (!question)
      throw new Meteor.Error('invalid-comment', 'Вы можете добавить ответы');
    
    answer = _.extend(answerAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    
    // update the post with the number of comments
    Questions.update(answer.questionId, {$inc: {answersCount: 1}});
    
    // create the comment, save the id
    answer._id = Answers.insert(answer);
    
    // now create a notification, informing the user that there's been a comment
    // createAnswerNotification(answer);
    
    return answer._id;
  }
});
