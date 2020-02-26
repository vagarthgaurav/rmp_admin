<template>
  <div>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarContent }}
      <v-btn text @click="snackbar = false" timeout="3000">Close</v-btn>
    </v-snackbar>

    <v-container class="mt-12">
      <v-card class="mx-auto" width="95%">
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
          :loading="trainersLoader"
        >
          <template v-slot:item.address="{ item }">
            {{ item.address.address }}, {{item.address.city.cityName.charAt(0).toUpperCase() + item.address.city.cityName.substring(1)}}
            <br />
            <span style=" font-style: italic;">{{item.address.pinCode}}</span>
          </template>

          <template v-slot:item.emailVerified="{ item }">
            <v-chip dark v-if="item.emailVerified" color="green">
              <v-icon>mdi-email-check-outline</v-icon>
            </v-chip>
            <v-chip dark v-else color="red">
              <v-icon>mdi-email-alert-outline</v-icon>
            </v-chip>
          </template>

          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  small
                  dark
                  fab
                  color="green lighten-2"
                  class="mr-2"
                  @click="openViewScheduleDialog(item.id)"
                >
                  <v-icon v-on="on">mdi-account-clock-outline</v-icon>
                </v-btn>
              </template>
              <span>View Schedule</span>
            </v-tooltip>
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

    <v-dialog v-model="viewScheduleDialog" width="80%" persistent>
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>Trainer Schedule</v-card-title>
        <v-card-text class="my-4">
          <v-row class="fill-height mt-12 elevation-3">
            <v-progress-linear v-if="calendarLoader" indeterminate color="loader" height="5"></v-progress-linear>
            <v-col>
              <v-sheet height="64">
                <v-toolbar flat color="white">
                  <v-btn outlined class="mr-4" @click="setToday">Today</v-btn>
                  <v-btn fab text small @click="prev">
                    <v-icon small>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn fab text small @click="next">
                    <v-icon small>mdi-chevron-right</v-icon>
                  </v-btn>
                  <v-toolbar-title>{{title}}</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-menu bottom right>
                    <template v-slot:activator="{ on }">
                      <v-btn outlined v-on="on">
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="type = 'day'">
                        <v-list-item-title>Day</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'week'">
                        <v-list-item-title>Week</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'month'">
                        <v-list-item-title>Month</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = '4day'">
                        <v-list-item-title>4 days</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab
                        @click="scheduleDialog = true"
                        class="mx-5 mb-2 white--text"
                        color="secondary"
                        v-on="on"
                      >
                        <v-icon>mdi-account-clock</v-icon>
                      </v-btn>
                    </template>
                    <span>Add new dates</span>
                  </v-tooltip>-->
                </v-toolbar>
              </v-sheet>
              <v-sheet height="600">
                <v-calendar
                  ref="calendar"
                  v-model="focus"
                  color="primary"
                  :events="events"
                  :event-color="getEventColor"
                  :event-margin-bottom="3"
                  :now="today"
                  :type="type"
                  @click:more="viewDay"
                  @click:date="viewDay"
                  @change="updateRange"
                ></v-calendar>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-3" dark @click="viewScheduleDialog = false; " class="px-5">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";

var today = new Date(Date.now()).toISOString().slice(-24, -14);

export default {
  data() {
    return {
      trainerDialog: false,
      trainerDialogTitle: "Add new trainer",
      formValid: false,
      addTrainerLoader: false,
      trainersLoader: false,

      snackbar: false,
      snackbarContent: "",
      snackbarColor: "",

      cities: [],

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
        { text: "Prénom", value: "firstname" },
        { text: "Nom de famille", value: "lastname" },
        { text: "Le genre", value: "gender" },
        { text: "Email", value: "email" },
        { text: "Numéro de téléphone", value: "phoneNumber" },
        { text: "Adresse", value: "address" },
        { text: "Email verifed", value: "emailVerified" },
        { text: "Actions", value: "action", sortable: false }
      ],

      trainerID: null,

      today: today,
      focus: today,
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days"
      },
      calendarLoader: false,
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      eventColor: "event",

      events: [],

      scheduleDialog: false,
      formValidSchedule: false,
      addScheduleLoader: false,
      selectedText: "",
      schedulePicker: [],

      viewScheduleDialog: false
    };
  },
  created() {
    this.trainersLoader = true;
    this.$http
      .get("/public/findCities")
      .then(res => {
        this.cities = res.data;
      })
      .catch(e => {
        console.log(e.response);
      });

    this.$http
      .get("/training-center/" + this.user.id + "/findAll/trainer", {
        headers: { Authorization: "Bearer " + this.$store.state.token }
      })
      .then(res => {
        this.trainers = res.data;
        this.trainersLoader = false;

        console.log(this.trainers);
      })
      .catch(e => {
        console.log(e.response);
        this.trainersLoader = false;
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
        email: this.email,
        certificateNumber: this.certificateNumber
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
          //console.log(res);
          this.snackbarContent =
            "New trainer added. Email needs to be confirmed before they can be added to a course.";
          this.snackbarColor = "success";
          this.snackbar = true;
          this.reset();

          this.$http
            .get("/training-center/" + this.user.id + "/findAll/trainer", {
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
    },

    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    deleteEvent({ nativeEvent, event }) {
      let data = [];
      data.push({ id: event.id, scheduleDate: event.start });

      console.log(data);
      this.$http
        .put("/trainer/" + this.user.id + "/schedule/delete", data, {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          this.events = [];

          this.getEvents();

          this.snackbarContent = "Horaire supprimé";
          this.snackbarColor = "warning";
          this.snackbar = true;
        })
        .catch(function(e) {
          console.log(e.response);
        });

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end;
    },
    addSchedule() {
      this.addScheduleLoader = true;
      let data = [];
      data = this.getDates(this.schedulePicker[0], this.schedulePicker[1]);

      this.$http
        .post("/admin/trainer/" + this.trainerID + "/schedule/save", data, {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          this.scheduleDialog = false;
          this.formValidSchedule = false;

          this.addScheduleLoader = false;
          this.events = [];
          this.getEvents();

          this.schedulePicker = [];
          this.snackbarContent = "Horaire ajouté";
          this.snackbarColor = "success";
          this.snackbar = true;
        })
        .catch(function(e) {
          console.log(e);
        });
    },
    resetSchedule() {
      this.scheduleDialog = false;
      this.formValidSchedule = false;

      this.addScheduleLoader = false;
    },
    allowedDates(val) {
      if (this.events) {
        for (let i = 0; i < this.events.length; i++) {
          if (val == this.events[i].start) {
            return null;
          }
        }
      }

      return val;
    },
    dateSelected(val) {
      if (val[1]) {
        let startDate = new Date(val[0]);

        let endDate = new Date(val[1]);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        this.selectedText = diffDays + 1 + " jours sélectionnés";

        this.formValidSchedule = true;
      }
    },
    getDates(startDate, endDate) {
      var dateArray = [];
      var currentDate = moment(startDate);
      var stopDate = moment(endDate);
      while (currentDate <= stopDate) {
        dateArray.push({
          scheduleDate: moment(currentDate).format("YYYY-MM-DD")
        });
        currentDate = moment(currentDate).add(1, "days");
      }
      return dateArray;
    },
    hoveredEvent(e) {
      e.event.color = "eventHover";
    },
    hoveredEventLeave(e) {
      e.event.color = "event";
    },

    getEvents() {
      this.calendarLoader = true;
      this.$http
        .get(
          "/training-center/" +
            this.user.id +
            "/trainer/" +
            this.trainerID +
            "/schedule/findAll",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          console.log(res.data);
          let events = res.data;

          events.forEach((event, i) => {
            this.events.push({
              id: event.id,
              name: "",
              start: event.scheduleDate,
              end: event.scheduleDate,
              color: "event"
            });
          });

          this.calendarLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.calendarLoader = false;
        });
    },

    openViewScheduleDialog(id) {
      this.formValidSchedule = false;
      this.events = [];
      this.trainerID = id;
      this.getEvents();
      this.viewScheduleDialog = true;
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
    },
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);

      const startYear = start.year;

      return `${startMonth} ${startYear}`;
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  }
};
</script>