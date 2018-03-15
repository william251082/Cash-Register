Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
  this.redirect('basic');
});

Meteor.startup(function() {
  AutoForm.setDefaultTemplate("semanticUI");

  // Meteor.publish('orders.allOrders', () => {
  //     return Orders.find();
  // })
  //
  //   const numberOrders = Orders.find({}).count();
  // console.log(numberOrders);
});
