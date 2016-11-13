Questions = new Mongo.Collection('questions');

Questions.allow({
  update: function(userId, question) { return ownsDocument(userId, question); },
  remove: function(userId, question) { return ownsDocument(userId, question); }
});

Questions.deny({
  update: function(userId, question, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'category', 'title').length > 0);
  }
});

Questions.deny({
  update: function(userId, question, fieldNames, modifier) {
    var errors = validateQuestion(modifier.$set);
    return errors.title || errors.category;
  }
});

validateQuestion = function (question) {
  var errors = {};

  if (!question.title)
    errors.title = "Пожалуйста, введите вопрос";
  
  if (!question.category)
    errors.category =  "Пожалуйста, введите тему теста";

  return errors;
}

Meteor.methods({
  questionInsert: function(questionAttributes) {
    check(this.userId, String);
    check(questionAttributes, {
      title: String,
      category: String
    });
    
    var errors = validateQuestion(questionAttributes);
    if (errors.title || errors.category)
      throw new Meteor.Error('invalid-post', "Вы можете ввести тему теста и вопрос");
    
    var questionWithSameTitle = Questions.findOne({title: questionAttributes.title});
    if (questionWithSameTitle) {
      return {
        questionExists: true,
        _id: questionWithSameTitle._id
      }
    }
    
    var user = Meteor.user();
    var question = _.extend(questionAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date(),
      answersCount: 0,
      // upvoters: [], 
      // votes: 0
    });
    
    var questionId = Questions.insert(question);
    
    return {
      _id: questionId
    };
  },
  
  // upvote: function(postId) {
  //   check(this.userId, String);
  //   check(postId, String);
    
  //   var affected = Posts.update({
  //     _id: postId, 
  //     upvoters: {$ne: this.userId}
  //   }, {
  //     $addToSet: {upvoters: this.userId},
  //     $inc: {votes: 1}
  //   });
    
  //   if (! affected)
  //     throw new Meteor.Error('invalid', "You weren't able to upvote that post");
  // }
});
