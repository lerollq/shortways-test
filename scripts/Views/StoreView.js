var StoreView = function(model) {
  this.model = model;
  this.addCountryEvent = new Event(this);
  this.addCityEvent = new Event(this);
  this.addMemberEvent = new Event(this);
  this.removeMemberEvent = new Event(this);

  this.init();
  this.show();
}

StoreView.prototype = {
  init: function() {
    this.createChildren()
    .setupHandlers()
    .enable()
    .initSelect();
    return this;
  },

  createChildren: function() {
    this.$container = $('tbody#table-container');
    
    this.$addCountryForm = $("form#form-add-country");
    this.$addCityForm = $("form#form-add-city");
    this.$addMemberForm = $("form#form-add-member");

    this.$selectMemberCountry = $('select#member-country');
    this.$selectMemberCity = $('select#member-city');
    this.$selectCityCountry = $('select#city-country');

    return this;
  },

  setupHandlers: function() {
    this.onChangeSelectCountryHandler = this.onChangeSelectCountry.bind(this);

    this.addMemberFormHandler = this.addMemberForm.bind(this);
    this.addMemberHandler = this.addMember.bind(this);

    this.addCityFormHandler = this.addCityForm.bind(this);
    this.addCityHandler = this.addCity.bind(this);

    this.addCountryFormHandler = this.addCountryForm.bind(this);
    this.addCountryHandler = this.addCountry.bind(this);

    this.removeMemberButtonHandler = this.removeMemberButton.bind(this);

    return this;
  },

  enable: function() {
    this.$addMemberForm.on('submit', this.addMemberFormHandler)
    this.$addCountryForm.on('submit', this.addCountryFormHandler)
    this.$addCityForm.on('submit', this.addCityFormHandler);

    this.$selectMemberCountry.on('change', this.onChangeSelectCountryHandler)
    
    this.model.addCountryEvent.attach(this.addCountryHandler)
    this.model.addMemberEvent.attach(this.addMemberHandler);
    this.model.addCityEvent.attach(this.addCityHandler);
    return this;
  },

  initSelect: function() {
    const countries = this.model.getCountries();
    for (let country of countries) {
      this.$selectMemberCountry.append(`<option value="${country.id}">${country.name}</option>`);
      this.$selectCityCountry.append(`<option value="${country.id}">${country.name}</option>`);
    }
    const cities = this.model.getCitiesFromCountry(countries[0].id);
    for (let city of cities) {
      this.$selectMemberCity.append(`<option value="${city.id}">${city.name}</option>`)
    }
  },

  onChangeSelectCountry: function() {
    const countryID = this.$selectMemberCountry.val();
    const cities = this.model.getCitiesFromCountry(countryID);
    this.$selectMemberCity.html('');
    for (let city of cities) {
      this.$selectMemberCity.append(`<option value="${city.id}">${city.name}</option>`)
    }
  },

  show: function() {
    this.build();
  },

  build: function() {
    const members = this.model.getMembers();
    let $container = this.$container;
    $container.html('');
    for (let i = 0; i < members.length; i++) {
      const cityName = this.model.getCityName(members[i].city);
      const cityCountryID = this.model.getCityCountryID(members[i].city);
      const countryName = this.model.getCountryName(cityCountryID);
      const countryCode = this.model.getCountryCode(cityCountryID);
      const btn = $(`<button data-index='${i}' class='btn btn-secondary'>Remove</button>`)
      .on('click', this.removeMemberButtonHandler);

      const html = $(`<tr></tr>`).append(`
        <td>${members[i].firstName}</td>
        <td>${members[i].lastName}</td>
        <td>${members[i].address}</td>
        <td>${cityName}</td>
        <td>${countryName}</td>
        <td>${countryCode}`)
        .append(btn)
        .append($('</td>'))
        ;
      
      $container.append(html);
    }
  },

  addCountryForm: function() {
    const data = this.reduceArrayToObject($(this.$addCountryForm).serializeArray())
    this.addCountryEvent.notify(data);
  },

  addMemberForm: function() {
    const data = this.reduceArrayToObject($(this.$addMemberForm).serializeArray())
    this.addMemberEvent.notify(data);
  },

  addCityForm: function() {
    const data = this.reduceArrayToObject($(this.$addCityForm).serializeArray());
    this.addCityEvent.notify(data);
  },

  removeMemberButton: function(e) {
    this.removeMemberEvent.notify({
      index: e.target.dataset.index
    });
    this.show();
  },

  addCountry: function() {
    this.show();
  },

  addMember: function() {
    this.show();
  },

  addCity: function() {
    this.show();
  },

  /** HELPERS */

  reduceArrayToObject: function(array) {
    return array.reduce(function(map, obj) {
      map[obj.name] = obj.value;
      return map;
    }, {});
  }

}