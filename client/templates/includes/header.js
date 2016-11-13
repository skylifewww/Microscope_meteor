Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();
    
    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });
    
    return active && 'active';
  },
  currentUser: function() {
  	if (this.userId === '9N3gpDQceKJtSeuXt'){
    return this.userId == Meteor.userId();
   };
  },
   ownQuestion: function() {
  	if (this.userId === '9N3gpDQceKJtSeuXt'){
    return this.userId == Meteor.userId();
};}
});