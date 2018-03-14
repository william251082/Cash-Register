// import SimpleSchema from 'simpl-schema';
// import { Tracker } from 'meteor/tracker';


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
    type: Number,
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
    license: {
        type: String,
        label: 'License',
        allowedValues: ["Basic", "Register", "Printer"]
    }
});

Schemas.Hardware = new SimpleSchema({
    hardware: {
        type: Array,
        minCount: 1,
        maxCount: 7,
        label: 'Choose Hardware',
        autoform: {
            options: [
                {
                    label: "Terminal (15.6\")",
                    value: "Terminal (15.6\")"
                },
                {
                    label: "Tablet (10.0\")",
                    value: "Tablet (10.0\")"
                },
                {
                    label: "Tablet houder",
                    value: "Tablet houder"
                },
                {
                    label: "Mobile (5.0\")",
                    value: "Mobile (5.0\")"
                },
                {
                    label: "Barprinter",
                    value: "Barprinter"
                },
                {
                    label: "Keukenprinter",
                    value: "Keukenprinter"
                },
                {
                    label: "Kassalade",
                    value: "Kassalade"
                }
            ]
        }
    },
    'hardware.$': {
        type: String
    }
});

Schemas.Installation = new SimpleSchema({
    installation: {
        type: String,
        label: 'Installation',
        allowedValues: ["Standard", "Wiring"]
    }
});

Schemas.paymentInformation = new SimpleSchema({
    choose: {
        type: String,
        allowedValues: [
            'Monthly',
            'Yearly',
            '3-years'
        ],
        optional: true,
        label: 'Choose a payment plan'
    },
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
    },
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
    Schemas.Installation,
    Schemas.Hardware,
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
            id: 'installation',
            title: 'Installation',
            schema: Schemas.Installation
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
          step: 'license',
          step: 'hardware',
          step: 'installation',
          step: 'contact-information'
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
