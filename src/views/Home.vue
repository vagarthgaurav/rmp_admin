<template>
  <div class="home">
    <v-container class="mt-12">
      <v-tabs background-color="primary lighten-2" class="elevation-2" dark>
        <v-tabs-slider></v-tabs-slider>

        <v-tab :href="'#tab-1'">Active</v-tab>
        <v-tab :href="'#tab-2'">Ended</v-tab>
        <v-tab :href="'#tab-3'">Completed</v-tab>
        <v-tab :href="'#tab-4'">Cancelled</v-tab>

        <!-- ------------------------------------Active internships------------------------------ -->
        <v-tab-item :value="'tab-1'">
          <v-card flat tile>
            <v-card-text>
              <v-card class="mx-auto">
                <v-card-title>
                  Active internships
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
                        @click="addClass"
                      >
                        <v-icon>mdi-card-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Add new course</span>
                  </v-tooltip>
                </v-card-title>

                <v-snackbar v-model="snackbar" :color="snackbarColor">
                  {{ snackbarContent }}
                  <v-btn text @click="snackbar = false" timeout="3000">Close</v-btn>
                </v-snackbar>

                <v-data-table
                  :search="search"
                  :headers="headers"
                  :items="allCourses"
                  class="elevation-1"
                  @click:row="rowSelect"
                  :loading="ongoingCoursesLoader"
                >
                  <template v-slot:item.trainingCenterLocation.name="{ item }">
                    <span style="text-transform: capitalize">{{ item.trainingCenterLocation.name }}</span>
                  </template>
                  <template v-slot:item.trainingCenterLocation.city.cityName="{ item }">
                    <span
                      style="text-transform: capitalize"
                    >{{ item.trainingCenterLocation.city.cityName }} - {{ item.trainingCenterLocation.city.pinCode }}</span>
                  </template>
                  <template v-slot:item.startingDate="{ item }">{{ formatDate(item.startingDate) }}</template>

                  <template v-slot:item.endingDate="{ item }">{{ formatDate(item.endingDate) }}</template>

                  <template v-slot:item.actualNumberOfParticipant="{ item }">
                    <v-chip
                      dark
                      v-if="item.actualNumberOfParticipant >=5"
                      color="green"
                    >{{ item.actualNumberOfParticipant }}/{{item.maximumNumberOfParticipant}}</v-chip>
                    <v-chip
                      dark
                      v-else
                      color="red"
                    >{{ item.actualNumberOfParticipant }}/{{item.maximumNumberOfParticipant}}</v-chip>
                  </template>

                  <template v-slot:item.action="{ item }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn text fab small @click="openParticipantDialog(item.id, 'ongoing')">
                          <v-icon right class="mr-2" v-on="on">mdi-account-box-multiple-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>View Participants</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-card>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- ------------------------------------------------------------------------------------ -->

        <!-- ------------------------------------Ended internships---------------------------- -->
        <v-tab-item :value="'tab-2'">
          <v-card flat tile>
            <v-card-text>
              <v-card flat tile>
                <v-card-text>
                  <v-card class="mx-auto">
                    <v-card-title>
                      Ended internships
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-account-search-outline"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-card-title>

                    <v-snackbar v-model="snackbar" :color="snackbarColor">
                      {{ snackbarContent }}
                      <v-btn text @click="snackbar = false" timeout="3000">Close</v-btn>
                    </v-snackbar>

                    <v-data-table
                      :search="search"
                      :headers="headers"
                      :items="endedCourses"
                      class="elevation-1"
                      @click:row="rowSelect"
                      :loading="endedCoursesLoader"
                    >
                      <template v-slot:item.trainingCenterLocation.name="{ item }">
                        <span
                          style="text-transform: capitalize"
                        >{{ item.trainingCenterLocation.name }}</span>
                      </template>
                      <template v-slot:item.trainingCenterLocation.city.cityName="{ item }">
                        <span
                          style="text-transform: capitalize"
                        >{{ item.trainingCenterLocation.city.cityName }} - {{ item.trainingCenterLocation.city.pinCode }}</span>
                      </template>
                      <template
                        v-slot:item.startingDate="{ item }"
                      >{{ formatDate(item.startingDate) }}</template>

                      <template v-slot:item.endingDate="{ item }">{{ formatDate(item.endingDate) }}</template>

                      <template v-slot:item.actualNumberOfParticipant="{ item }">
                        <v-chip
                          dark
                          v-if="item.actualNumberOfParticipant >=5"
                          color="green"
                        >{{ item.actualNumberOfParticipant }}/{{item.maximumNumberOfParticipant}}</v-chip>
                        <v-chip
                          dark
                          v-else
                          color="red"
                        >{{ item.actualNumberOfParticipant }}/{{item.maximumNumberOfParticipant}}</v-chip>
                      </template>

                      <template v-slot:item.action="{ item }">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn text fab small @click="completeCourse(item)">
                              <v-icon right class="mr-2" v-on="on">mdi-progress-check</v-icon>
                            </v-btn>
                          </template>
                          <span>View Participants</span>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- ----------------------------------------------------------------------------------- -->

        <!-- ------------------------------------Completed internships--------------------------- -->
        <v-tab-item :value="'tab-3'">
          <v-card flat tile>
            <v-card-text>
              <v-card flat tile>
                <v-card-text>
                  <v-card class="mx-auto">
                    <v-card-title>
                      Completed internships
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-account-search-outline"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-card-title>

                    <v-snackbar v-model="snackbar" :color="snackbarColor">
                      {{ snackbarContent }}
                      <v-btn text @click="snackbar = false" timeout="3000">Close</v-btn>
                    </v-snackbar>

                    <v-data-table
                      :search="search"
                      :headers="headers"
                      :items="completedCourses"
                      class="elevation-1"
                      @click:row="rowSelect"
                      :loading="completedCoursesLoader"
                    >
                      <template v-slot:item.trainingCenterLocation.name="{ item }">
                        <span
                          style="text-transform: capitalize"
                        >{{ item.trainingCenterLocation.name }}</span>
                      </template>
                      <template v-slot:item.trainingCenterLocation.city.cityName="{ item }">
                        <span
                          style="text-transform: capitalize"
                        >{{ item.trainingCenterLocation.city.cityName }} - {{ item.trainingCenterLocation.city.pinCode }}</span>
                      </template>
                      <template
                        v-slot:item.startingDate="{ item }"
                      >{{ formatDate(item.startingDate) }}</template>

                      <template v-slot:item.endingDate="{ item }">{{ formatDate(item.endingDate) }}</template>

                      <template v-slot:item.actualNumberOfParticipant="{ item }">
                        <v-chip
                          dark
                          v-if="item.actualNumberOfParticipant >=5"
                          color="green"
                        >{{ item.actualNumberOfParticipant }}/{{item.maximumNumberOfParticipant}}</v-chip>
                        <v-chip
                          dark
                          v-else
                          color="red"
                        >{{ item.actualNumberOfParticipant }}/{{item.maximumNumberOfParticipant}}</v-chip>
                      </template>

                      <template v-slot:item.action="{ item }">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              text
                              fab
                              small
                              @click="openParticipantDialog(item.id, 'completed')"
                            >
                              <v-icon right class="mr-2" v-on="on">mdi-account-box-multiple-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>View Participants</span>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- ------------------------------------------------------------------------------------ -->

        <!-- ------------------------------------Canceled internships---------------------------- -->
        <v-tab-item :value="'tab-4'">
          <v-card flat tile>
            <v-card-text>
              <v-card flat tile>
                <v-card-text>
                  <v-card class="mx-auto">
                    <v-card-title>
                      Cancelled internships
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-account-search-outline"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-card-title>

                    <v-snackbar v-model="snackbar" :color="snackbarColor">
                      {{ snackbarContent }}
                      <v-btn text @click="snackbar = false" timeout="3000">Close</v-btn>
                    </v-snackbar>

                    <v-data-table
                      :search="search"
                      :headers="headers"
                      :items="cancelledCourses"
                      class="elevation-1"
                      @click:row="rowSelect"
                      :loading="cancelledCoursesLoader"
                    >
                      <template v-slot:item.trainingCenterLocation.name="{ item }">
                        <span
                          style="text-transform: capitalize"
                        >{{ item.trainingCenterLocation.name }}</span>
                      </template>
                      <template v-slot:item.trainingCenterLocation.city.cityName="{ item }">
                        <span
                          style="text-transform: capitalize"
                        >{{ item.trainingCenterLocation.city.cityName }} - {{ item.trainingCenterLocation.city.pinCode }}</span>
                      </template>
                      <template
                        v-slot:item.startingDate="{ item }"
                      >{{ formatDate(item.startingDate) }}</template>

                      <template v-slot:item.endingDate="{ item }">{{ formatDate(item.endingDate) }}</template>

                      <template v-slot:item.actualNumberOfParticipant="{ item }">
                        <v-chip
                          dark
                          v-if="item.actualNumberOfParticipant >=5"
                          color="green"
                        >{{ item.actualNumberOfParticipant }}/{{item.maximumNumberOfParticipant}}</v-chip>
                        <v-chip
                          dark
                          v-else
                          color="red"
                        >{{ item.actualNumberOfParticipant }}/{{item.maximumNumberOfParticipant}}</v-chip>
                      </template>

                      <template v-slot:item.action="{ item }">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              text
                              fab
                              small
                              @click="openParticipantDialog(item.id, 'cancelled')"
                            >
                              <v-icon right class="mr-2" v-on="on">mdi-account-box-multiple-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>View Participants</span>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- ----------------------------------------------------------------------------------- -->
      </v-tabs>
    </v-container>

    <v-dialog v-model="addClassDialog" width="fit-content" persistent>
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
                  v-model="maxParticipants"
                  label="Max Participants"
                  prepend-icon="mdi-account-group"
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

    <v-dialog v-model="participantsDialog" width="fit-content" persistent>
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>Participants</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-data-table
                :search="participantSearch"
                :headers="participantsHeader"
                :items="participants"
                class="elevation-1"
                :loading="participantsLoader"
              >
                <template v-slot:item.dateOfBirth="{ item }">{{ formatDate(item.dateOfBirth) }}</template>
                <template v-slot:item.address="{ item }">
                  {{ item.address.address }}
                  <br />
                  {{item.address.pinCode}}
                  <span
                    style="text-transform: capitalize;"
                  >{{item.address.city.cityName}}</span>
                </template>

                <template v-slot:item.action="{ item }" v-if="participantsDialogShowActions">
                  <v-menu bottom left offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon>mdi-account-arrow-right-outline</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item
                        v-for="(course, i) in allCourses"
                        :key="i"
                        @click="newCourseSelected(course.id, item.id)"
                      >
                        <v-list-item-title>
                          <span
                            style="text-transform: capitalize"
                          >{{ course.trainingCenterLocation.city.cityName }}</span>
                          - {{formatDate(item.startingDate)}} au {{formatDate(course.endingDate)}}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-3" class="white--text" @click="closeParticipantsDialog">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmChangeCourseDialog" width="fit-content">
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>Confirm Course change?</v-card-title>
        <v-card-actions class="py-5 mx-2">
          <v-btn color="success" @click="moveStudent">Yes</v-btn>
          <v-btn color="red" dark @click="cancelStudentMove">No</v-btn>
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

      participantsDialog: false,
      participantSearch: "",
      participantsLoader: false,
      participants: [],
      participantsDialogShowActions: false,

      oldClass: null,
      newClass: null,
      selectedStudentId: null,

      allCourses: [],
      cancelledCourses: [],
      completedCourses: [],
      endedCourses: [],

      ongoingCoursesLoader: false,
      completedCoursesLoader: false,
      cancelledCoursesLoader: false,
      endedCoursesLoader: false,
      changeCourseDialog: false,
      confirmChangeCourseDialog: false,

      snackbar: false,
      snackbarContent: "",
      snackbarColor: "",

      today: today,
      search: "",

      trainersListBafm: [],
      trainersListPsycho: [],
      locationList: [],

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
      maxParticipants: null,
      trainerBafm: "",
      trainerPsycho: "",
      location: "",

      mask: "##:##",
      priceMask: "###",

      headers: [
        { text: "Location", value: "trainingCenterLocation.name" },
        { text: "City", value: "trainingCenterLocation.city.cityName" },
        { text: "Start date", value: "startingDate" },
        { text: "End date", value: "endingDate" },
        { text: "Price", value: "price" },
        {
          text: "No. of participants",
          value: "actualNumberOfParticipant",
          sortable: false,
          align: "center"
        },
        { text: "Psychologist", value: "psychologist.firstname" },
        { text: "BAFM", value: "bafm.firstname" },
        { text: "Actions", value: "action", sortable: false }
      ],

      participantsHeader: [
        { text: "First Name", value: "firstname" },
        { text: "Last Name", value: "lastname" },
        { text: "Date of Birth", value: "dateOfBirth" },
        { text: "Address", value: "address" },
        { text: "Action", value: "action", sortable: false }
      ]
    };
  },
  created() {
    this.getAllCourses();
    this.getEndedCourses();
    this.getCancelledCourses();
    this.getCompletedCourses();
    // ---------------------- Get all regions --------------------------------
    this.$http
      .get("/public/region/findAll")
      .then(res => {
        this.regions = res.data;
      })
      .catch(e => {
        console.log(e);
      });
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
    },
    addClass() {
      this.maxParticipants = 20;

      // ------------------------ Find all BAFM ---------------------------------
      this.$http
        .get(
          "/training-center/" + this.user.id + "/findAll/trainer/subType/1",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          this.trainersListBafm = res.data;
        })
        .catch(e => {
          console.log(e.response);
        });
      // ------------------------------------------------------------------------

      // ----------------------- Find all Psychologists -------------------------
      this.$http
        .get(
          "/training-center/" + this.user.id + "/findAll/trainer/subType/2",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          this.trainersListPsycho = res.data;
        })
        .catch(e => {
          console.log(e.response);
        });
      // -----------------------------------------------------------------------

      // ---------------------- Get all locations ------------------------------
      this.$http
        .get("/training-center/" + this.user.id + "/location/findAll", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          this.locationList = res.data;
        })
        .catch(e => {
          console.log(e.response);
        });
      // ---------------------------------------------------------------------

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
        startingDate: this.startDate + "T" + this.startTime + ":00",
        endingDate: this.endDate + "T" + this.endTime + ":00",
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
          console.log(res);
          if (res.data.status == 208) {
            console.log("Course already exists!");

            this.snackbarContent = "Course already exists!";
            this.snackbarColor = "warning";
            this.snackbar = true;
          } else {
            this.$http
              .get(
                "/training-center/" + this.user.id + "/internship/findAll ",
                {
                  headers: {
                    Authorization: "Bearer " + this.$store.state.token
                  }
                }
              )
              .then(res => {
                this.snackbarContent = "Course added";
                this.snackbarColor = "success";
                this.snackbar = true;

                this.getAllCourses();
              })
              .catch(e => {
                console.log(e.response);
              });
            this.reset();
          }
        })
        .catch(e => {
          console.log(e.response);
          if (e.response.status == 404) {
            this.snackbarContent = "Trainer not available for selected date";
            this.snackbarColor = "warning";
            this.snackbar = true;
          }
        });
    },
    cancelClass() {
      this.reset();
    },
    // TODO -- finish writing edit and delete course
    editItem(item) {},
    deleteItem(item) {},
    rowSelect(item) {},
    openParticipantDialog(id, type) {
      this.oldClass = id;
      if (type == "ongoing") {
        this.participantsDialogShowActions = true;
      }

      // -------------------------- Get all participants ------------------------------
      this.participantsLoader = true;
      this.$http
        .get(
          "/training-center/" +
            this.user.id +
            "/findAll-customer/internship/" +
            id +
            "/status/2",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          this.participants = res.data;

          this.participantsDialog = true;
          this.participantsLoader = false;
        })
        .catch(e => {
          console.log(e.response);
        });
      // ------------------------------------------------------------------------
    },
    closeParticipantsDialog() {
      this.participants = [];
      this.oldClass = null;
      this.newClass = null;
      this.participantsDialog = false;
      this.participantsDialogShowActions = false;
    },
    moveStudent() {
      console.log(this.newClass, this.oldClass, this.selectedStudentId);
      let newId = this.newClass,
        oldId = this.oldClass,
        studentId = this.selectedStudentId;

      this.$http
        .get(
          "/training-center/" +
            this.user.id +
            "/findAll-customer/internship/" +
            this.newClass +
            "/status/2",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          let participants = res.data;
          for (let i = 0; i <= participants.length - 1; i++) {
            if (this.selectedStudentId == participants[i].id) {
              this.snackbarContent =
                "Student cannot be moved to the new course as they are already registered it.";
              this.snackbarColor = "warning";
              this.snackbar = true;

              this.confirmChangeCourseDialog = false;
            } else {
              this.confirmMoveStudent(oldId, newId, studentId);
            }
          }
        })
        .catch(e => {
          console.log(e);
          if (e.response.status == 404) {
            this.confirmMoveStudent(oldId, newId, studentId);
          }
        });
    },
    cancelStudentMove() {
      this.newClass = null;
      this.selectedStudentId = null;
      this.confirmChangeCourseDialog = false;
    },
    newCourseSelected(newCourseId, studentId) {
      this.newClass = newCourseId;
      this.selectedStudentId = studentId;

      this.confirmChangeCourseDialog = true;
    },
    getAllCourses() {
      // -------------------------- Get all courses ------------------------------
      this.ongoingCoursesLoader = true;
      this.$http
        .get("/training-center/" + this.user.id + "/internship/findAll/1", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          //console.log(res.data);
          this.allCourses = res.data;
          this.ongoingCoursesLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.ongoingCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    getCancelledCourses() {
      // -------------------------- Get cancelled courses ------------------------------
      this.cancelledCoursesLoader = true;
      this.$http
        .get(
          "/training-center/" +
            this.user.id +
            "/internship-completed/findAll/0",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          console.log(res.data);
          this.cancelledCourses = res.data;
          this.cancelledCoursesLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.cancelledCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    getCompletedCourses() {
      // -------------------------- Get cancelled courses ------------------------------
      this.completedCoursesLoader = true;
      this.$http
        .get(
          "/training-center/" +
            this.user.id +
            "/internship-completed/findAll/2",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          this.completedCourses = res.data;
          this.completedCoursesLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.completedCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    getEndedCourses() {
      // -------------------------- Get cancelled courses ------------------------------
      this.completedCoursesLoader = true;
      this.$http
        .get(
          "/training-center/" +
            this.user.id +
            "/internship-completed/findAll/3",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          this.ToCompleteCourses = res.data;
          this.ToCompleteCoursesLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.toCompleteCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    confirmMoveStudent(oldId, newId, studentId) {
      this.$http
        .put(
          "/training-center/" +
            this.user.id +
            "/move/customer/" +
            studentId +
            "/old-internship/" +
            oldId +
            "/new-internship/" +
            newId,
          [],
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token
            }
          }
        )
        .then(res => {
          console.log(res);

          if (res.status == 200) {
            this.confirmChangeCourseDialog = false;
            this.closeParticipantsDialog();

            this.getAllCourses();

            this.snackbarContent = "Customer moved successfully";
            this.snackbarColor = "success";
            this.snackbar = true;
          }
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    completeCourses(item) {
      console.log(item);

      // this.$http
      //   .put("/training-center/00/complete-internship/00")
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(e => {
      //     console.log(e.response);
      //   });
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  }
};
</script>
