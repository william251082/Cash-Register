Orders = new Meteor.Collection('orders', {connection: null});

Schemas.contactInformation = new SimpleSchema({
  firstName:{
    type: String,
    label: 'First Name'
  },
    LastName:{
        type: String,
        label: 'Last Name'
    },
  phone: {
    type: String,
    label: 'Phone Number'
  },
  email: {
    type: String,
    label: 'Email'
  },
  age: {
    type: String,
    label: 'Age'
  },
    gender: {
        type: String,
        label: 'Gender'
    }
});

Schemas.License = new SimpleSchema({
    fields: {
        type: String,
        label: 'License',
        allowedValues: ["Basic", "Register", "Printer"]
    }
});

Schemas.Hardware = new SimpleSchema({
    fields: {
        type: String,
        label: 'Hardware',
        allowedValues: [
            "Terminal (15.6\")",
            "Tablet (10.0\")",
            "Tablet houder",
            "Mobile (5.0\")",
            "Barprinter",
            "Keukenprinter",
            "Kassalade"
        ]
    }
});

Schemas.paymentInformation = new SimpleSchema({
  paymentMethod: {
    type: String,
    label: 'Payment method',
    allowedValues: ['credit-card', 'bank-transfer'],
    autoform: {
      options: [{
        label: 'Credit card',
        value: 'credit-card'
      }, {
        label: 'Bank transfer',
        value: 'bank-transfer'
      }]
    }
  },
  acceptTerms: {
    type: Boolean,
    label: 'I accept the terms and conditions.',
    autoform: {
      label: false
    },
    autoValue: function() {
      if (this.isSet && this.value !== true) {
        this.unset();
      }
    }
  }
});

Orders.attachSchema([
  Schemas.contactInformation,
  Schemas.License,
  Schemas.paymentInformation
]);

Template.basic.helpers({
  steps: function() {
    return [{
      id: 'contact-information',
      title: 'Contact',
      schema: Schemas.contactInformation
    },
        {
            id: 'license',
            title: 'License',
            schema: Schemas.License
        },
        {
            id: 'hardware',
            title: 'Hardware',
            schema: Schemas.Hardware
        },
        {
      id: 'payment-information',
      title: 'Payment & confirm',
      schema: Schemas.paymentInformation,
      onSubmit: function(data, wizard) {
        var self = this;
        Orders.insert(_.extend(wizard.mergedData(), data), function(err, id) {
          if (err) {
            self.done();
          } else {
            Router.go('viewOrder', {
              _id: id
            });
          }
        });
      }
    }];
  }
});

Wizard.useRouter('iron:router');

Router.route('/basic/:step?', {
  name: 'basic',
  onBeforeAction: function() {
    if (!this.params.step) {
      this.redirect('basic', {
        step: 'contact-information',
          step: 'license',
          step: 'hardware'
      });
    } else {
      this.next();
    }
  }
});

Router.route('/orders/:_id', {
  name: 'viewOrder',
  template: 'viewOrder',
  data: function() {
    return Orders.findOne(this.params._id);
  }
});
