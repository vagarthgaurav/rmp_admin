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
          <template v-slot:item.dateOfBirth="{ item }">{{ formatDate(item.dateOfBirth) }}</template>

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

          <template v-slot:item.gender="{ item }">
            <span dark v-if="item.gender == 'M'">
              <v-icon>mdi-gender-male</v-icon>Male
            </span>
            <span dark v-else>
              <v-icon>mdi-gender-female</v-icon>Female
            </span>
          </template>

          <template v-slot:item.emailVerified="{ item }">
            <v-chip dark v-if="item.emailVerified" color="green">
              <v-icon>mdi-email-check-outline</v-icon>
            </v-chip>
            <v-chip dark v-else color="red">
              <v-icon>mdi-email-alert-outline</v-icon>
            </v-chip>
          </template>

          <template v-slot:item.accountNonLocked="{ item }">
            <v-chip dark v-if="item.accountNonLocked == true" color="green">
              <v-icon>mdi-account-tie-outline</v-icon>
            </v-chip>
            <v-chip dark v-else color="red">
              <v-icon>mdi-account-off-outline</v-icon>
            </v-chip>
          </template>

          <template v-slot:item.action="{ item }">
            <!-- <v-icon class="mr-2" @click="editItem(item)" large>mdi-account-edit</v-icon> -->

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  class="elevation-1 mr-2 mt-2 mb-2"
                  color="blue darken-4"
                  fab
                  small
                  @click="openCoursesDialog(item.id)"
                >
                  <v-icon right class="mr-2" v-on="on">mdi-folder-multiple-outline</v-icon>
                </v-btn>
              </template>
              <span>View Courses</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  class="elevation-1 mr-2 mt-2 mb-2"
                  color="green darken-4"
                  fab
                  small
                  @click="openViewScheduleDialog(item.id)"
                >
                  <v-icon right class="mr-2" v-on="on">mdi-clock-outline</v-icon>
                </v-btn>
              </template>
              <span>View Schedule</span>
            </v-tooltip>

            <v-tooltip bottom v-if="item.accountNonLocked == true">
              <template v-slot:activator="{ on }">
                <v-btn
                  class="elevation-1"
                  color="error darken-2"
                  fab
                  small
                  @click="openBlockUserDialog(item.id, item.accountNonLocked)"
                  :disabled="item.id == user.id"
                >
                  <v-icon right class="mr-2" v-on="on">mdi-account-cancel-outline</v-icon>
                </v-btn>
              </template>
              <span>Block User</span>
            </v-tooltip>

            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="elevation-1"
                  color="success darken-2"
                  fab
                  small
                  @click="openBlockUserDialog(item.id, item.accountNonLocked)"
                  :disabled="item.id == user.id"
                >
                  <v-icon right class="mr-2" v-on="on">mdi-account-check-outline</v-icon>
                </v-btn>
              </template>
              <span>Unblock User</span>
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

              <v-flex xs12 md4 class="px-3">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  :disabled="emailDisabled"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md4 class="px-3">
                <v-text-field
                  v-model="phonenumber"
                  :rules="phoneRules"
                  label="Phone Number"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md4 class="px-3">
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
                <!-- <v-text-field v-model="city" :rules="nameRules" label="City" required></v-text-field> -->
                <v-select
                  v-model="trainingCenter"
                  :items="trainingCenters"
                  item-text="firstname"
                  item-value="id"
                  label="Training Center"
                  persistent-hint
                  return-object
                  single-line
                  required
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

    <v-dialog v-model="blockUserDialog" width="30%">
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>{{blockDialogTitle}}</v-card-title>
        <v-card-actions class="pt-12 pb-4 mx-2">
          <v-spacer></v-spacer>
          <v-btn color="success" @click="blockUnblockUser">Yes</v-btn>
          <v-btn color="red" dark @click="blockUserDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="coursesDialog" width="80%" persistent>
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>Courses</v-card-title>
        <v-card-text class="pa-3">
          <v-tabs background-color="primary lighten-2" class="elevation-2" dark>
            <v-tabs-slider></v-tabs-slider>

            <v-tab :href="'#tab-1'" @click="getAllCourses">Active</v-tab>
            <v-tab :href="'#tab-2'" @click="getEndedCourses">Ended</v-tab>
            <v-tab :href="'#tab-3'" @click="getCompletedCourses">Completed</v-tab>
            <!-- <v-tab :href="'#tab-4'" @click="getCancelledCourses">Cancelled</v-tab> -->

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

                      <!-- <v-tooltip bottom>
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
                      </v-tooltip>-->
                    </v-card-title>

                    <v-snackbar v-model="snackbar" :color="snackbarColor">
                      {{ snackbarContent }}
                      <v-btn text @click="snackbar = false" timeout="3000">Close</v-btn>
                    </v-snackbar>

                    <v-data-table
                      :search="search"
                      :headers="coursesHeaders"
                      :items="allCourses"
                      class="elevation-1"
                      @click:row="rowSelect"
                      :loading="ongoingCoursesLoader"
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
                              @click="openParticipantDialog(item.id, 'ongoing')"
                              :disabled="item.actualNumberOfParticipant == 0"
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
                          :headers="coursesHeaders"
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

                          <template
                            v-slot:item.endingDate="{ item }"
                          >{{ formatDate(item.endingDate) }}</template>

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
                              <span>Confirm completion</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  class="mx-2"
                                  text
                                  fab
                                  small
                                  @click="openParticipantDialog(item.id, 'ended')"
                                  :disabled="item.actualNumberOfParticipant == 0"
                                >
                                  <v-icon
                                    right
                                    class="mr-2"
                                    v-on="on"
                                  >mdi-account-box-multiple-outline</v-icon>
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
                          :headers="coursesHeaders"
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

                          <template
                            v-slot:item.endingDate="{ item }"
                          >{{ formatDate(item.endingDate) }}</template>

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

                          <!-- <template v-slot:item.action="{ item }">
                            
                          </template>-->
                        </v-data-table>
                      </v-card>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- ------------------------------------------------------------------------------------ -->

            <!-- ------------------------------------Canceled internships---------------------------- -->
            <!-- <v-tab-item :value="'tab-4'">
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
            </v-tab-item>-->

            <!-- ----------------------------------------------------------------------------------- -->
          </v-tabs>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-3" class="white--text" @click="coursesDialog = false">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="scheduleDialog" width="fit-content" persistent>
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>Add schedule dates</v-card-title>
        <v-card-text class="my-4">
          <v-date-picker
            v-model="schedulePicker"
            show-current
            :min="today"
            :allowed-dates="allowedDates"
            range
            :selected-items-text="selectedText"
            @input="dateSelected"
          ></v-date-picker>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!formValidSchedule"
            color="green darken-3"
            class="white--text px-5"
            :loading="addScheduleLoader"
            @click="addSchedule"
          >Submit</v-btn>

          <v-btn color="red darken-3" dark @click="resetSchedule()" class="px-5">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewScheduleDialog" width="80%" persistent>
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>Add schedule dates</v-card-title>
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
                  <v-toolbar-title>{{ title }}</v-toolbar-title>
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

                  <v-tooltip bottom>
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
                  </v-tooltip>
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
                  @mouseenter:event="hoveredEvent"
                  @mouseleave:event="hoveredEventLeave"
                  @click:event="deleteEvent"
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

    <v-dialog v-model="confirmChangeCourseDialog" width="fit-content">
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>Delete Schedule?</v-card-title>
        <v-card-actions class="py-5 mx-2">
          <v-btn color="success">Yes</v-btn>
          <v-btn color="red" dark @click="cancelStudentMove">No</v-btn>
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

      trainingCenters: [],
      trainingCenter: null,

      blockUserDialog: false,
      blockID: null,
      blockDialogTitle: "Block User?",

      coursesDialog: false,
      allCourses: [],
      cancelledCourses: [],
      completedCourses: [],
      endedCourses: [],

      ongoingCoursesLoader: false,
      completedCoursesLoader: false,
      cancelledCoursesLoader: false,
      endedCoursesLoader: false,

      trainerID: null,

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
        { text: "Date Of Birth", value: "dateOfBirth" },
        { text: "Email", value: "email" },
        { text: "Numéro de téléphone", value: "phoneNumber" },
        { text: "Adresse", value: "address", width: "15%" },
        { text: "Email Verified", value: "emailVerified" },
        { text: "Account Blocked", value: "accountNonLocked" },
        { text: "Actions", value: "action", sortable: false, width: "11%" }
      ],

      coursesHeaders: [
        { text: "ID", value: "uniqueIdentifier" },
        { text: "Location", value: "trainingCenterLocation.name" },
        { text: "City", value: "trainingCenterLocation.city.cityName" },
        { text: "Start date", value: "startingDate" },
        { text: "End date", value: "endingDate" },
        { text: "Price", value: "price" },
        // {
        //   text: "No. of participants",
        //   value: "actualNumberOfParticipant",
        //   sortable: false,
        //   align: "center"
        // },
        { text: "Psychologist", value: "psychologist.firstname" },
        { text: "BAFM", value: "bafm.firstname" }
        // { text: "Actions", value: "action", sortable: false }
      ],

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

      viewScheduleDialog: false,
      confirmChangeCourseDialog: false
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
      .get("/admin/" + this.user.id + "/findAll/2", {
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

    this.$http
      .get("/admin/" + this.user.id + "/findAll/3", {
        headers: { Authorization: "Bearer " + this.$store.state.token }
      })
      .then(res => {
        this.trainingCenters = res.data;
      })
      .catch(e => {
        console.log(e.response);
      });
  },
  methods: {
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

      // TODO -- Get training center to associate trainer to

      this.$http
        .post(
          "/admin/" +
            this.user.id +
            "/register-trainer/subtype/" +
            this.typeOfTrainer +
            "/training-center/" +
            this.trainingCenter.id,
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
            .get("/admin/" + this.user.id + "/findAll/2", {
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
    openBlockUserDialog(id, blockedStatus) {
      if (blockedStatus == false) {
        this.blockDialogTitle = "Unblock User?";
      } else {
        this.blockDialogTitle = "Block User?";
      }
      this.blockId = id;
      this.blockUserDialog = true;
    },
    blockUnblockUser() {
      this.$http
        .put(
          "/admin/" + this.user.id + "/block-user/" + this.blockId,
          {},
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          if (res.status == 200) {
            if (res.data == false) {
              this.snackbar = true;
              this.snackbarContent = "User Blocked";
              this.snackbarColor = "warning";
            } else {
              this.snackbar = true;
              this.snackbarContent = "User Unblocked";
              this.snackbarColor = "success";
            }
          }
          this.$http
            .get("/admin/" + this.user.id + "/findAll/2", {
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
          this.blockUserDialog = false;
        })
        .catch(e => {
          console.log(e.response);
        });
    },

    getAllCourses() {
      // -------------------------- Get all courses ------------------------------
      this.ongoingCoursesLoader = true;
      this.$http
        .get("admin/trainer/" + this.trainerID + "/findAll/internship/1", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          console.log(res.data.content);
          //console.log("All courses");
          this.allCourses = res.data.content;
          this.ongoingCoursesLoader = false;
        })
        .catch(e => {
          //console.log(e.response);
          this.allCourses = [];
          this.ongoingCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    getCancelledCourses() {
      // -------------------------- Get cancelled courses ------------------------------
      this.cancelledCoursesLoader = true;
      this.$http
        .get("admin/trainer/" + this.trainerID + "/findAll/internship/0", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          //console.log(res.data);
          // console.log("All cancelled courses");
          this.cancelledCourses = res.data.content;
          this.cancelledCoursesLoader = false;
        })
        .catch(e => {
          //console.log(e.response);
          this.cancelledCourses = [];
          this.cancelledCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    getCompletedCourses() {
      // -------------------------- Get Completed courses ------------------------------
      this.completedCoursesLoader = true;
      this.$http
        .get("admin/trainer/" + this.trainerID + "/findAll/internship/2", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          //console.log("All completed courses");

          this.completedCourses = res.data.content;
          this.completedCoursesLoader = false;
        })
        .catch(e => {
          // console.log(e.response);
          this.completedCourses = [];
          this.completedCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    getEndedCourses() {
      // -------------------------- Get Ended courses ------------------------------
      this.completedCoursesLoader = true;
      this.$http
        .get("admin/trainer/" + this.trainerID + "/findAll/internship/2", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          //console.log(res.data);
          //console.log('All ended courses');
          this.endedCourses = res.data.content;
          this.ToCompleteCoursesLoader = false;
        })
        .catch(e => {
          //console.log(e.response);
          this.endedCourses = [];
          this.toCompleteCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    openCoursesDialog(item) {
      this.trainerID = item;

      this.getAllCourses();
      this.getEndedCourses();
      this.getCancelledCourses();
      this.getCompletedCourses();

      this.coursesDialog = true;
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
        .get("/admin/trainer/" + this.trainerID + "/schedule/findAll", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
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
    },

    cancelStudentMove() {},
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