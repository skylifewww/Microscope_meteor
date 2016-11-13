Template.answerSubmit.onCreated(function() {
  Session.set('answerSubmitErrors', {});
});

Template.answerSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('answerSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('answerSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.answerSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();
    
    var $body = $(e.target).find('[name=body]');
    var $isRight = $(e.target).find('[name=isRight]');
    var answer = {
      body: $body.val(),
      isRight: $isRight.val(),
      questionId: template.data._id
    };
    
    var errors = {};
    if (! answer.body) {
      errors.body = "Пожалуйста, добавте ответ";
      return Session.set('answerSubmitErrors', errors);
    }
    
    Meteor.call('answerInsert', answer, function(error, answerId) {
      if (error){
        throwError(error.reason);
      } else {
        $body.val('');
        $isRight.val('');
      }
    });
  }
});