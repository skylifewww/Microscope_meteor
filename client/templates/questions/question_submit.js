Template.questionSubmit.onCreated(function() {
  Session.set('questionSubmitErrors', {});
});

Template.questionSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('questionSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('questionSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.questionSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var question = {
      category: $(e.target).find('[name=category]').val(),
      title: $(e.target).find('[name=title]').val()
    };
    
    var errors = validateQuestion(question);
    if (errors.title || errors.category)
      return Session.set('questionSubmitErrors', errors);
    
    Meteor.call('questionInsert', question, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);
      
      // show this result but route anyway
      if (result.questionExists)
        throwError('Этот вопрос уже введен');
      
      Router.go('home', {_id: result._id});  
    });
  }
});