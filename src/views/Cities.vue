<template>
  <div>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarContent }}
      <v-btn text @click="snackbar = false" timeout="3000">Close</v-btn>
    </v-snackbar>

    <v-container class="mt-12">
      <v-card class="mx-auto" width="95%">
        <v-card-title>
          Cities
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
                @click="openTrainerDialog('Add new City')"
              >
                <v-icon>mdi-map-marker-plus-outline</v-icon>
              </v-btn>
            </template>
            <span>Add new customer</span>
          </v-tooltip>
        </v-card-title>

        <v-data-table
          :search="search"
          :headers="headers"
          :items="trainers"
          class="elevation-1"
          @click:row="rowSelect"
          :loading="trainersLoader"
        >
          <template v-slot:item.cityName="{ item }">
            <p style=" text-transform: capitalize;">{{item.cityName}}</p>
          </template>

          <template v-slot:item.region.regionFrenchName="{ item }">
            <p style=" text-transform: capitalize;">{{item.region.regionFrenchName}}</p>
          </template>

          <!-- <template v-slot:item.action="{ item }">
            <v-icon class="mr-2" @click="editItem(item)" large>mdi-account-edit</v-icon>
          </template>-->
        </v-data-table>
      </v-card>
    </v-container>

    <v-dialog v-model="trainerDialog" width="70%" persistent>
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>{{trainerDialogTitle}}</v-card-title>
        <v-card-text class="my-4">
          <v-form v-model="formValid" class="ma-0" ref="form">
            <v-layout row wrap class="justify-space-around">
              <v-flex xs12 md4 class="px-2">
                <v-text-field
                  v-model="cityname"
                  :rules="nameRules"
                  :counter="20"
                  label="City"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md4 class="px-2">
                <v-text-field v-model="citypincode" :rules="pincodeRules" label="Pincode" required></v-text-field>
              </v-flex>

              <v-flex xs12 md4 class="px-2">
                <!-- <v-text-field v-model="city" :rules="nameRules" label="City" required></v-text-field> -->
                <v-select
                  style="text-transform:capitalize"
                  v-model="region"
                  :items="regions"
                  item-text="regionFrenchName"
                  item-value="id"
                  label="Region"
                  persistent-hint
                  return-object
                  single-line
                  required
                ></v-select>
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
import moment from "moment";

export default {
  data() {
    return {
      trainerDialog: false,
      trainerDialogTitle: "Add new city",
      formValid: false,
      addTrainerLoader: false,
      trainersLoader: false,

      snackbar: false,
      snackbarContent: "",
      snackbarColor: "",

      regions: [],
      region: [],
      cityname: [],
      citypincode: "",

      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      phoneRules: [
        v => !!v || "Phone Number is required",
        v => !isNaN(v) || "Phone number must be valid",
        v => (v && v.length === 10) || "Phone Number must be 10 characters"
      ],
      pincodeRules: [
        v => !!v || "Pincode is required",
        v => !isNaN(v) || "Pincode must be valid",
        v => (v && v.length === 5) || "Pincode must be 5 characters"
      ],
      nameRules: [
        v => !!v || "Name is required",
        v => isNaN(v) || "Name must be valid"
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

      gender: [
        { item: "Male", value: "M" },
        { item: "Female", value: "F" }
      ],

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
        { text: "City", value: "cityName" },
        { text: "Pincode", value: "pinCode" },
        { text: "Region", value: "region.regionFrenchName" }
        //{ text: "Actions", value: "action", sortable: false }
      ]
    };
  },
  created() {
    this.trainersLoader = true;
    this.$http
      .get("/public/region/findAll")
      .then(res => {
        console.log(res.data);
        this.regions = res.data;
      })
      .catch(e => {
        console.log(e.response);
      });

    this.$http
      .get("/public/findCities", {
        headers: { Authorization: "Bearer " + this.$store.state.token }
      })
      .then(res => {
        this.trainers = res.data;
        this.trainersLoader = false;
      })
      .catch(e => {
        console.log(e.response);
        this.trainersLoader = false;
      });
  },
  methods: {
    capitalize: function(value) {
      if (!value) return "";

      value = value.toString();
      console.log(value.charAt(0).toUpperCase() + value.slice(1));
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    formatDate(date) {
      if (!date) return null;

      //const [year, month, day] = date.split("-");
      let d = new Date(date);
      return moment(d).format("DD/MM/YYYY");
      //return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    },
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
      var data = [
        {
          cityName: this.cityname,
          pinCode: this.citypincode
        }
      ];

      this.$http
        .post(
          "/admin/region/" +
            this.region.id +
            "/cities/save",
          data,
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          //console.log(res);
          this.snackbarContent = "New city added";
          this.snackbarColor = "success";
          this.snackbar = true;
          this.reset();

          this.$http
            .get("/public/findCities", {
              headers: { Authorization: "Bearer " + this.$store.state.token }
            })
            .then(res => {
              this.trainers = res.data;
              this.trainersLoader = false;
            })
            .catch(e => {
              console.log(e.response);
              this.trainersLoader = false;

              this.snackbarContent = "Error getting data.";
              this.snackbarColor = "error";
              this.snackbar = true;
            });
        })
        .catch(e => {
          console.log(e.response);
          if (e.response.status == 409) {
            this.snackbarContent = "The email is already in use.";
            this.snackbarColor = "error";
            this.snackbar = true;

            this.trainersLoader = false;
          }
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
      //console.log(item);
    },
    rowSelect(item) {
      //console.log(item);
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