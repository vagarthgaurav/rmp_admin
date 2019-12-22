<template>
  <div class="home">
    <v-container class="mt-12">
      <v-card class="mx-auto" width="95%">
        <v-card-title>
          Courses
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
              <v-btn fab class="mx-5 primary--text" color="secondary" v-on="on" @click="addClass">
                <v-icon>mdi-card-plus</v-icon>
              </v-btn>
            </template>
            <span>Add new course</span>
          </v-tooltip>
        </v-card-title>

        <v-data-table
          :search="search"
          :headers="headers"
          :items="allCourses"
          class="elevation-1"
          @click:row="rowSelect"
        >
          <template v-slot:item.startingDate="{ item }">{{ formatDate(item.startingDate) }}</template>

          <template v-slot:item.endingDate="{ item }">{{ formatDate(item.endingDate) }}</template>

          <template
            v-slot:item.actualNumberOfParticipant="{ item }"
          >{{ item.actualNumberOfParticipant }}/{{item.maximumNumberOfParticipant}}</template>

          <template v-slot:item.action="{ item }">
            <v-icon class="mr-2" @click="editItem(item)">mdi-account-edit</v-icon>
            <v-icon @click="deleteItem(item)">mdi-account-minus</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <v-dialog v-model="addClassDialog" width="70%" persistent>
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>{{classDialogTitle}}</v-card-title>
        <v-form class="ma-0" ref="form" v-model="formValid">
          <v-card-text>
            <v-layout row wrap>
              <!--Trainer BAFM-->
              <v-flex xs12 sm6 md4 class="px-3">
                <v-select
                  v-model="trainerBafm"
                  :items="trainersListBafm"
                  item-text="firstname"
                  item-value="id"
                  label="Select BAFM"
                  prepend-icon="mdi-folder-account"
                  :rules="[v => !!v || 'Select a BAFM']"
                ></v-select>
              </v-flex>

              <!--Trainer Psychologue-->
              <v-flex xs12 sm6 md4 class="px-3">
                <v-select
                  v-model="trainerPsycho"
                  :items="trainersListPsycho"
                  item-text="firstname"
                  item-value="id"
                  label="Select Psychologue"
                  prepend-icon="mdi-folder-account-outline"
                  :rules="[v => !!v || 'Select a Psychology']"
                ></v-select>
              </v-flex>

              <!--Locations-->
              <v-flex xs12 md4 class="px-3">
                <v-select
                  v-model="location"
                  :items="locationList"
                  item-text="name"
                  item-value="id"
                  label="Select Location"
                  prepend-icon="mdi-home-map-marker"
                  :rules="[v => !!v || 'Select a location']"
                ></v-select>
              </v-flex>

              <!--Start Date-->
              <v-flex xs12 sm6 md6 class="px-3">
                <v-menu
                  ref="smenu"
                  v-model="smenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  :rules="[v => !!v || 'Select a start date']"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="startDateFormatted"
                      label="Starting Date"
                      prepend-icon="mdi-calendar-plus"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="startDate" no-title scrollable :min="today">
                    <v-spacer></v-spacer>
                    <v-btn outlined color="primary" @click="smenu = false">Cancel</v-btn>
                    <v-btn color="primary" @click="startDateChosen">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>

              <!-- End Date-->
              <v-flex xs12 sm6 md6 class="px-3">
                <v-text-field
                  v-model="endDateFormatted"
                  label="Ending Date"
                  prepend-icon="mdi-calendar-check"
                  readonly
                ></v-text-field>
              </v-flex>

              <!--Class start time -->
              <v-flex xs12 sm6 md6 class="px-3">
                <v-text-field
                  prepend-icon="mdi-clock"
                  v-model="startTime"
                  v-mask="mask"
                  label="Start Time"
                  :rules="[v => !!v || 'Enter a start time']"
                ></v-text-field>
              </v-flex>

              <!--Class End time-->
              <v-flex xs12 sm6 md6 class="px-3">
                <v-text-field
                  prepend-icon="mdi-clock-check"
                  v-model="endTime"
                  v-mask="mask"
                  label="End Time"
                ></v-text-field>
              </v-flex>

              <!--Max Participants-->
              <v-flex xs12 sm6 md6 class="px-3">
                <v-text-field
                  v-model="participants"
                  label="Max Participants"
                  prepend-icon="mdi-account-group"
                  value="20"
                  readonly
                ></v-text-field>
              </v-flex>

              <!--Price-->
              <v-flex xs12 sm6 md6 class="px-3">
                <v-text-field
                  v-model="price"
                  label="Price"
                  prepend-icon="mdi-currency-eur"
                  v-mask="priceMask"
                  :rules="[v => !!v || 'Enter a price']"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-form>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-3"
            class="white--text"
            :loading="newCoursesLoader"
            :disabled="!formValid"
            @click="submitClass"
          >Submit</v-btn>

          <v-btn color="red darken-3" class="white--text" @click="cancelClass">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";

var today = new Date(Date.now()).toISOString().slice(-24, -14);

export default {
  directives: {
    mask
  },
  data() {
    return {
      formValid: false,
      addClassDialog: false,
      classDialogTitle: "Add new course",
      newCoursesLoader: false,
      today: today,
      search: "",

      trainersListBafm: [],
      trainersListPsycho: [],
      locationList: [],

      allCourses: [],

      classDialog: false,
      smenu: false,
      emenu: false,
      tsmenu: false,
      temenu: false,
      currentUserId: "",
      ongoingClasses: [],
      pastClasses: [],
      cancelledClasses: [],
      currentUser: [],
      className: "",
      startDate: "",
      startDateFormatted: "",
      endDate: "",
      endDateFormatted: "",
      startTime: "",
      endTime: "",
      price: "",
      address: "",

      pincode: "",
      city: "",
      region: "",
      street: "",
      participants: 20,
      trainerBafm: "",
      trainerPsycho: "",
      location: "",

      mask: "##:##",
      priceMask: "###",

      headers: [
        { text: "Location", value: "trainingCenterLocation.city.cityName" },
        { text: "Start date", value: "startingDate" },
        { text: "End date", value: "endingDate" },
        { text: "Price", value: "price" },
        {
          text: "No. of participants",
          value: "actualNumberOfParticipant",
          align: "center"
        },
        { text: "Psychologist", value: "psychologist.firstname" },
        { text: "BAFM", value: "bafm.firstname" },
        { text: "Actions", value: "action", sortable: false }
      ]
    };
  },
  created() {
    // -------------------------- Get all courses ------------------------------
    this.$http
      .get("/training-center/" + this.user.id + "/internship/findAll ", {
        headers: { Authorization: "Bearer " + this.$store.state.token }
      })
      .then(res => {
        console.log(res.data);
        this.allCourses = res.data;
      })
      .catch(e => {
        console.log(e.response);
      });
    // ------------------------------------------------------------------------

    // ------------------------ Find all BAFM ---------------------------------
    this.$http
      .get("/training-center/" + this.user.id + "/findAll/trainer/subType/1", {
        headers: { Authorization: "Bearer " + this.$store.state.token }
      })
      .then(res => {
        this.trainersListBafm = res.data;
      })
      .catch(e => {
        console.log(e.response);
      });
    // ------------------------------------------------------------------------

    // ----------------------- Find all Psychologists -------------------------
    this.$http
      .get("/training-center/" + this.user.id + "/findAll/trainer/subType/2", {
        headers: { Authorization: "Bearer " + this.$store.state.token }
      })
      .then(res => {
        this.trainersListPsycho = res.data;
      })
      .catch(e => {
        console.log(e.response);
      });
    // -----------------------------------------------------------------------

    // ---------------------- Get all locations ------------------------------
    this.locationList = this.$store.getters.getLocations;
    // -----------------------------------------------------------------------
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      //const [year, month, day] = date.split("-");
      let d = new Date(date);

      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    },
    reset() {
      this.addClassDialog = false;
      this.formValid = false;

      this.addCoursesLoader = false;

      this.$refs.form.reset();
      this.participants = 20;
    },
    addClass() {
      this.addClassDialog = true;
    },
    closeClassDialog() {
      this.addClassDialog = false;
    },
    startDateChosen() {
      this.$refs.smenu.save(this.startDate);
      this.startDateFormatted = this.formatDate(this.startDate);
      let d = new Date(this.startDate);

      this.endDate = new Date(d.setDate(d.getDate() + 1))
        .toISOString()
        .slice(0, 10);

      this.endDateFormatted = this.formatDate(this.endDate);
    },
    submitClass() {
      this.addCoursesLoader = true;
      let data = {
        startingDate: this.startDate + "T00:00:00",
        endingDate: this.endDate + "T00:00:00",
        maximumNumberOfParticipant: 20,
        price: this.price
      };

      this.$http
        .post(
          "/training-center/" +
            this.user.id +
            "/create-internship/bafm/" +
            this.trainerBafm +
            "/psychologist/" +
            this.trainerPsycho +
            "/location/" +
            this.location,
          data,
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          this.$http
            .get("/training-center/" + this.user.id + "/internship/findAll ", {
              headers: { Authorization: "Bearer " + this.$store.state.token }
            })
            .then(res => {
              this.allCourses = res.data;
            })
            .catch(e => {
              console.log(e.response);
            });
          this.reset();
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    cancelClass() {
      this.reset();
    },
    // TODO -- finish writing edit and delete course
    editItem(item) {
      console.log(item);
    },
    deleteItem(item) {
      console.log(item);
    },
    rowSelect(item) {
      console.log(item);
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  }
};
</script>
