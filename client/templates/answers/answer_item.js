Template.answerItem.helpers({
  submittedText: function() {
    return this.submitted.toString();
  },
  ownQuestion: function() {
  	if (this.userId === '9N3gpDQceKJtSeuXt'){
    return this.userId == Meteor.userId();
};
  }
});