var StoreController = function(model, view) {
  this.model = model;
  this.view = view;
  this.init();
}

StoreController.prototype = {
  init: function() {
    this.setupHandlers().enable();
  },

  setupHandlers: function() {
    this.addCountryHandler = this.addCountry.bind(this);
    this.addMemberHandler = this.addMember.bind(this);
    this.addCityHandler = this.addCity.bind(this);
    this.removeMemberButtonHandler = this.removeMember.bind(this);

    return this;
  },

  enable: function() {
    this.view.addCountryEvent.attach(this.addCountryHandler);
    this.view.addMemberEvent.attach(this.addMemberHandler);
    this.view.addCityEvent.attach(this.addCityHandler);
    this.view.removeMemberEvent.attach(this.removeMemberButtonHandler);

    return this;
  },

  addCountry: function(sender, args) {
    this.model.addCountry(args);
  },

  addMember: function(sender, args) {
    this.model.addMember(args);
  },

  addCity: function(sender, args) {
    this.model.addCity(args);
  },

  removeMember: function(sender, args)  {
    this.model.removeMember(args);
  }
}