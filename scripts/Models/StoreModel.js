var StoreModel = function() {
  this.dataStore = {};
  this.filename = "datastore.json";
  this.file = {};
  this.addCountryEvent = new Event(this);
  this.addMemberEvent = new Event(this);
  this.addCityEvent = new Event(this);
  this.removeMemberEvent = new Event(this);
}

StoreModel.prototype = {
  init: async function (callback) {
    if (!localStorage.getItem("datastore")) {
      fetch('./ressources/datastore.json', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then((json) => {
        localStorage.setItem("datastore", JSON.stringify(json.datastore));
        this.setDataStore();
        callback();
      })
      .catch(err => callback(err));
    } else {
      this.setDataStore();
      callback();
    }
  },

  setDataStore: function() {
    this.dataStore = JSON.parse(localStorage.getItem('datastore')); 
  },

  updateDataStore: function() {
    localStorage.setItem("datastore", JSON.stringify(this.dataStore));
    this.setDataStore();
  },

  /**********CITIES METHOD************/

  getCities: function() {
    return this.dataStore.cities;
  },

  getCitiesFromCountry: function(countryID) {
    return this.dataStore.cities.filter(p => Number(p.country_id) === Number(countryID));
  },

  getCityName: function(id) {
    return this.dataStore.cities.find(p => Number(p.id) === id).name;
  },

  getCityCountryID: function(id) {
    return this.dataStore.cities.find(p => Number(p.id) === id).country_id;
  },

  addCity: function(values) {
    this.dataStore.cities.push({
      id: this.dataStore.countries.length + 1,
      country_id: Number(values["city-country"]),
      name: values["city-name"],
    });
    this.updateDataStore();
  },

  /**********COUNTRIES METHOD************/

  getCountries: function() {
    return this.dataStore.countries;
  },

  getCountryCode: function(id) {
    const code = this.dataStore.countries.find(p => Number(p.id) === id).code;
    return code;
  },

  getCountryName: function(id) {
    const name = this.dataStore.countries.find(p => Number(p.id) === id).name;
    return name;
  },

  addCountry: function(values) {
    if (!values["country-code"] || !values["country-name"]) {
      alert("Missing Field");
    } else if (this.dataStore.countries.find(p => p.code === values["country-code"])) {
      alert(`A Country with Code: ${values["country-code"]}  already exists`)
    } else if (this.dataStore.countries.find(p => p.name === values["country-name"])) {
      alert(`A Country with Name: ${values["country-name"]}  already exists`)
    } 
    else {
      this.dataStore.countries.push({
        id: this.dataStore.countries.length + 1,
        code: values["country-code"],
        name: values["country-name"],
      })
    }
    this.updateDataStore();
    this.addCountryEvent.notify();
  },

  /**********MEMBERS METHOD************/

  getMembers: function() {
    return this.dataStore.members;
  },

  addMember: function(values) {
    if (!values["member-firstname"] || !values["member-lastname"] || !values["member-address"] || !values["member-city"]) {
      alert("Missing Field");
    } else {
      this.dataStore.members.push({
        id: this.dataStore.members.length + 1,
        firstName: values["member-firstname"],
        lastName: values["member-lastname"],
        address: values["member-address"],
        city: Number(values["member-city"]),
      })
      this.updateDataStore();
      this.addMemberEvent.notify();

    }
  },

  removeMember: function(values) {
    this.dataStore.members.splice(values.index, 1);
    this.updateDataStore();
    this.removeMemberEvent.notify();
  }

}