<template>
  <div>
    <v-container class="mt-12">
      <v-card class=" mx-auto" width="95%">
        <v-card-title>
          Trainers
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-account-search-outline"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                class="mx-5 primary--text"
                color="secondary"
                v-on="on"
                @click="openTrainerDialog('Add new trainer')"
              >
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </template>
            <span>Add new trainer</span>
          </v-tooltip>
        </v-card-title>

        <v-data-table
          :search="search"
          :headers="headers"
          :items="trainers"
          class="elevation-1"
          @click:row="rowSelect"
        >
          <template v-slot:item.address="{ item }">
            {{ item.address.address }}, {{item.address.city.cityName.charAt(0).toUpperCase() + item.address.city.cityName.substring(1)}}
            <br />
            <span style=" font-style: italic;">{{item.address.city.pinCode}}</span>
          </template>

          <template v-slot:item.action="{ item }">
            <v-icon class="mr-2" @click="editItem(item)">mdi-account-edit</v-icon>
            <v-icon @click="deleteItem(item)">mdi-account-minus</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <v-dialog v-model="trainerDialog" width="70%" persistent>
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>{{trainerDialogTitle}}</v-card-title>
        <v-card-text class="my-4">
          <v-form v-model="formValid" class="ma-0" ref="form">
            <v-layout row wrap class="justify-space-around">
              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="firstname"
                  :rules="nameRules"
                  :counter="20"
                  label="First name"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="lastname"
                  :rules="nameRules"
                  :counter="20"
                  label="Last name"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  :disabled="emailDisabled"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="phonenumber"
                  :rules="phoneRules"
                  label="Phone Number"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-select
                  :items="gender"
                  item-text="item"
                  item-value="value"
                  label="Gender"
                  :rules="[v => !!v || 'Gender is required']"
                  v-model="genderSelect"
                ></v-select>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-select
                  v-model="typeOfTrainer"
                  :items="trainerType"
                  item-text="item"
                  item-value="value"
                  label="Select Type"
                ></v-select>
              </v-flex>

              <v-flex xs12 md12 class="px-3">
                <v-layout row wrap class="justify-space-between">
                  <v-flex xs12 md2 class="text-xs-left">
                    <h3 class="grey--text text--darken-2 pt-4">Date of Birth:</h3>
                  </v-flex>

                  <v-flex xs12 md3 class="px-3">
                    <v-select
                      :items="days"
                      label="Date"
                      :rules="[v => !!v || 'Date is required']"
                      v-model="day"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 md3 class="px-3">
                    <v-select
                      :items="months"
                      item-text="item"
                      item-value="value"
                      label="Month"
                      :rules="[v => !!v || 'Month is required']"
                      v-model="month"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 md3 class="px-3">
                    <v-select
                      :items="years"
                      label="Year"
                      :rules="[v => !!v || 'Year is required']"
                      v-model="year"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12 md4 class="pa-2">
                <v-text-field v-model="street" :rules="rules" label="Street" required></v-text-field>
              </v-flex>
              <v-flex xs12 md4 class="pa-2">
                <v-text-field v-model="pincode" :rules="pincodeRules" label="Pincode" required></v-text-field>
              </v-flex>

              <v-flex xs12 md4 class="pa-2">
                <!-- <v-text-field v-model="city" :rules="nameRules" label="City" required></v-text-field> -->
                <v-select
                  v-model="city"
                  :items="cities"
                  item-text="cityName"
                  item-value="id"
                  label="City"
                  persistent-hint
                  return-object
                  single-line
                  required
                ></v-select>
              </v-flex>

              <v-flex xs12 md12 class="px-3">
                <v-text-field
                  v-model="certificateNumber"
                  :rules="[v => !!v || 'Certificate Number is required']"
                  label="Certificate number"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!formValid"
            color="green darken-3"
            class="white--text px-5"
            :loading="addTrainerLoader"
            @click="registerTrainer"
          >Submit</v-btn>

          <v-btn color="red darken-3" dark @click="reset()" class="px-5">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trainerDialog: false,
      trainerDialogTitle: "Add new trainer",
      formValid: false,
      addTrainerLoader: false,
      cities: [],

      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      phoneRules: [
        v => !!v || "Phone Number is required",
        v => !isNaN(v) || "Phone number must be valid",
        v => (v && v.length === 9) || "Phone Number must be  9 characters"
      ],
      pincodeRules: [
        v => !!v || "Pincode is required",
        v => !isNaN(v) || "Pincode must be valid",
        v => (v && v.length === 5) || "Pincode must be 5 characters"
      ],
      nameRules: [
        v => !!v || "City is required",
        v => isNaN(v) || "City must be valid"
      ],
      rules: [v => !!v || "Field is required"],

      trainerType: [
        { item: "Psychologue", value: 2 },
        { item: "BAFM", value: 1 }
      ],

      days: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31"
      ],
      months: [
        { item: "Janvier", value: "01" },
        { item: "Février", value: "02" },
        { item: "Mars", value: "03" },
        { item: "Avril", value: "04" },
        { item: "Mai", value: "05" },
        { item: "Juin", value: "06" },
        { item: "Juillet", value: "07" },
        { item: "Aout", value: "08" },
        { item: "Septembre", value: "09" },
        { item: "Octobre", value: "10" },
        { item: "Novembre", value: "11" },
        { item: "Décembre", value: "12" }
      ],

      gender: [{ item: "Male", values: "M" }, { item: "Female", values: "F" }],

      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      genderSelect: "",
      typeOfTrainer: "",
      day: "",
      month: "",
      year: "",
      street: "",
      pincode: "",
      city: "",
      certificateNumber: "",

      trainers: [],
      search: "",
      trainerIsLoading: false,
      emailDisabled: false,

      headers: [
        { text: "Prénom", value: "firstname" },
        { text: "Nom de famille", value: "lastname" },
        { text: "Le genre", value: "gender" },
        { text: "Email", value: "email" },
        { text: "Numéro de téléphone", value: "phoneNumber" },
        { text: "Adresse", value: "address" },
        { text: "Actions", value: "action", sortable: false }
      ]
    };
  },
  created() {
    this.$http
      .get("/public/findCities")
      .then(res => {
        this.cities = res.data;
      })
      .catch(e => {
        console.log(e.response);
      });

    this.trainerIsLoading = true;

    this.$http
      .get("/training-center/" + this.user.id + "/findAll/trainer", {
        headers: { Authorization: "Bearer " + this.$store.state.token }
      })
      .then(res => {
        console.log(res.data);
        this.trainers = res.data;
        this.trainerIsLoading = false;
      })
      .catch(e => {
        console.log(e.response);
      });
  },
  methods: {
    reset() {
      this.trainerDialog = false;
      this.formValid = false;

      this.addTrainerLoader = false;

      this.$refs.form.reset();
    },
    openTrainerDialog(title) {
      this.trainerDialog = true;
    },
    registerTrainer() {
      this.addTrainerLoader = true;
      var data = {
        firstname: this.firstname,
        lastname: this.lastname,
        gender: this.genderSelect,
        password: this.phonenumber,
        address: {
          address: this.street,
          pinCode: this.pincode,
          city: {
            id: this.city.id
          }
        },
        dateOfBirth: this.year + "-" + this.month + "-" + this.day,
        phoneNumber: this.phonenumber,
        email: this.email
      };

      this.$http
        .post(
          "/training-center/" +
            this.user.id +
            "/register/trainer/" +
            this.typeOfTrainer,
          data,
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          console.log(res);
          this.reset();
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    editItem(item) {
      let date = new Date(item.dateOfBirth);

      this.firstname = item.firstname;
      this.lastname = item.lastname;
      this.genderSelect = item.gender;
      this.phonenumber = item.phoneNumber;
      this.typeOfTrainer = "";

      this.email = item.email;
      this.emailDisabled = true;

      this.day = this.days[date.getDate() - 1];
      this.month = this.months[date.getMonth()];
      this.year = date.getFullYear();

      this.pincode = item.address.pinCode;
      this.street = item.address.address;
      this.city = item.address.city.id;
      this.certificateNumber = "";

      this.trainerDialog = true;
    },
    deleteItem(item) {
      console.log(item);
    },
    rowSelect(item) {
      console.log(item);
    }
  },
  computed: {
    years: function() {
      let d = new Date().getFullYear();

      let end = d - 60;
      let start = d - 18;

      let t = [];
      for (let i = start; i >= end; i--) {
        t.push(i);
      }

      return t;
    },
    user() {
      return this.$store.getters.getUser;
    }
  }
};
</script>