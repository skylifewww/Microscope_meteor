Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

QuestionsListController = RouteController.extend({
  template: 'questionsList',
  increment: 10, 
  questionsLimit: function() { 
    return parseInt(this.params.questionsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.questionsLimit()};
  },
  subscriptions: function() {
    this.questionsSub = Meteor.subscribe('questions', this.findOptions());
  },
  questions: function() {
    return Questions.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      questions: self.questions(),
      ready: self.questionsSub.ready,
      nextPath: function() {
        if (self.questions().count() === self.questionsLimit())
          return self.nextPath();
      }
    };
  }
});

NewQuestionsController = QuestionsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newQuestions.path({questionsLimit: this.questionsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewQuestionsController
});

Router.route('/questions/:_id', {
  name: 'questionPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singleQuestion', this.params._id),
      Meteor.subscribe('answers', this.params._id)
    ];
  },
  data: function() { return Questions.findOne(this.params._id); }
});

Router.route('/questions/:_id/edit', {
  name: 'questionEdit',
  waitOn: function() { 
    return Meteor.subscribe('singleQuestion', this.params._id);
  },
  data: function() { return Questions.findOne(this.params._id); }
});

Router.route('/submit', {name: 'questionSubmit'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'questionPage'});
Router.onBeforeAction(requireLogin, {only: 'questionSubmit'});
