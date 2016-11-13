Template.questionPage.helpers({
  answers: function() {
    return Answers.find({questionId: this._id});
  },
  ownQuestion: function() {
  	if (this.userId === '9N3gpDQceKJtSeuXt'){
    return this.userId == Meteor.userId();
};}

});