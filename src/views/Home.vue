<template>
  <div class="home">
    <v-container>
      <v-card flat tile width="95%" class="mx-auto">
        <v-card-text>
          <v-card class="mx-auto">
            <v-card-title>
              Training Centers
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
                    @click="registerTrainingCenterDialog = true"
                  >
                    <v-icon color="white">mdi-map-marker-plus-outline</v-icon>
                  </v-btn>
                </template>
                <span>Add training center</span>
              </v-tooltip>
            </v-card-title>

            <v-snackbar v-model="snackbar" :color="snackbarColor">
              {{ snackbarContent }}
              <v-btn text @click="snackbar = false" timeout="3000">Close</v-btn>
            </v-snackbar>

            <v-data-table
              :search="search"
              :headers="trainingCenterHeaders"
              :items="trainingCenterList"
              class="elevation-1"
              @click:row="rowSelect"
              :loading="trainingCenterLoader"
            >
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
                <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn text fab small @click="openLocationsDialog(item.trainingCenterLocations)">
                    <v-icon right class="mr-2" v-on="on">mdi-map-marker-multiple-outline</v-icon>
                  </v-btn>
                </template>
                <span>View Locations</span>
                </v-tooltip>-->

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      dark
                      class="elevation-1 mr-5"
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
        </v-card-text>
      </v-card>
    </v-container>
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
                                <v-btn
                                  text
                                  fab
                                  small
                                  @click="openParticipantDialog(item.id, 'completed')"
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
                          >{{course.uniqueIdentifier}} / {{ course.trainingCenterLocation.city.cityName }}</span>
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

    <v-dialog v-model="registerTrainingCenterDialog">
      <v-card class="mt-10 mb-12">
        <v-card-title
          class="headline primary white--text pa-2"
          primary-title
        >Register Training Center</v-card-title>
        <v-card-text class="my-4 pa-12">
          <v-form v-model="formRegisterTrainingCenterValid" class="ma-0" ref="registerform">
            <v-layout row wrap class="justify-space-around">
              <v-flex xs12 md4 class="px-3">
                <v-text-field
                  v-model="trainingCenterName"
                  :rules="nameRules"
                  :counter="30"
                  label="Name"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md4 class="px-3">
                <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
              </v-flex>

              <v-flex xs12 md4 class="px-3">
                <v-text-field
                  v-model="phonenumber"
                  :rules="phoneRules"
                  label="Phone Number"
                  required
                ></v-text-field>
              </v-flex>

              <!-- <v-flex xs12 md6 class="px-3">
                <v-text-field
                  type="password"
                  :rules="passwordRules"
                  v-model="password"
                  label="Password"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="repeatPassword"
                  type="password"
                  :rules="passwordRules"
                  label="Repeat Password"
                  required
                ></v-text-field>
              </v-flex>-->

              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="trainingCenterManager"
                  :rules="nameRules"
                  label="Training Center Manager"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="sirenNumber"
                  :rules="sirenRules"
                  label="Siren Number"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 class="px-3">
                <h2 class="my-6">Main Location</h2>
              </v-flex>
              <v-flex xs12 md6 class="px-3">
                <v-text-field v-model="locationName" :rules="rules" label="Name" required></v-text-field>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="certificateNumber"
                  :rules="[v => !!v || 'Certificate Number is required']"
                  label="Certificate number"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="locationPerson"
                  :rules="nameRules"
                  label="Person of Contact"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 class="px-3">
                <v-text-field
                  v-model="locationPhoneNumber"
                  :rules="phoneRules"
                  label="Training Center Phone Number"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md4 class="px-3">
                <v-text-field v-model="street" :rules="rules" label="Street" required></v-text-field>
              </v-flex>
              <v-flex xs12 md4 class="px-3">
                <v-text-field v-model="pincode" :rules="pincodeRules" label="Pincode" required></v-text-field>
              </v-flex>

              <v-flex xs12 md4 class="pa-2">
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
            </v-layout>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!formRegisterTrainingCenterValid"
            color="green darken-3"
            class="white--text px-5"
            :loading="addTrainingLoader"
            @click="registerTrainingCenter"
          >Submit</v-btn>

          <v-btn color="red darken-3" dark @click="resetTrainingCenter()" class="px-5">Clear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import moment from "moment";

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

      blockUserDialog: false,
      blockID: null,
      blockDialogTitle: "Block User?",

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

      trainingCenterList: [],
      trainingCenterLoader: false,
      coursesDialog: false,
      trainingCenterID: null,

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

      maxParticipants: null,
      trainerBafm: "",
      trainerPsycho: "",
      location: "",

      mask: "##:##",
      priceMask: "###",

      headers: [
        { text: "ID", value: "uniqueIdentifier" },
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
      ],

      trainingCenterHeaders: [
        { text: "Name", value: "firstname" },
        { text: "Manager", value: "trainingCenterManager" },
        { text: "Siren Number", value: "sirenNumber" },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "phoneNumber" },
        { text: "Email Verified", value: "emailVerified" },
        { text: "Account Blocked", value: "accountNonLocked" },
        { text: "Actions", value: "action", sortable: false }
      ],

      registerTrainingCenterDialog: false,

      formRegisterTrainingCenterValid: false,
      email: "",
      phonenumber: "",
      sirenNumber: "",
      trainingCenterName: "",
      trainingCenterManager: "",
      day: "",
      month: "",
      year: "",
      street: "",
      pincode: "",
      city: "",
      certificateNumber: "",
      locationPhoneNumber: "",
      locationName: "",
      locationPerson: "",

      password: "",
      repeatPassword: "",

      cities: [],

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

      addTrainingLoader: false,

      gender: [
        { item: "Male", value: "M" },
        { item: "Female", value: "F" }
      ],

      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      phoneRules: [
        v => !!v || "Phone Number is required",
        v => !isNaN(v) || "Phone number must be valid",
        v => (v && v.length === 10) || "Phone Number must be 10 characters"
      ],
      sirenRules: [
        v => !!v || "Siren is required",
        v => !isNaN(v) || "Siren number must be valid",
        v => (v && v.length === 9) || "Siren number must be 9 characters"
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
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length >= 6) || "Pincode must be 6 characters"
      ],
      trainerType: [
        { item: "Psychologue", value: 2 },
        { item: "BAFM", value: 1 }
      ]
    };
  },
  created() {
    this.getAllTrainingCenters();

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

    this.$http
      .get("/public/findCities")
      .then(res => {
        this.cities = res.data;
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
          "/admin/" +
            this.user.id +
            "/training-center/" +
            this.trainingCenterID +
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
            this.snackbarContent = "Course added";
            this.snackbarColor = "success";
            this.snackbar = true;

            this.getAllCourses();
            this.getEndedCourses();
            this.getCancelledCourses();
            this.getCompletedCourses();
            this.reset();
          }
        })
        .catch(e => {
          console.log(e.response);
          if (e.response.status != 500) {
            this.snackbarContent = e.response.data.message;
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
          "/admin/" +
            this.user.id +
            "/findAll-customer/internship/" +
            id +
            "/status/1",
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
      let newId = this.newClass,
        oldId = this.oldClass,
        studentId = this.selectedStudentId;

      this.$http
        .get(
          "/admin/" +
            this.user.id +
            "/findAll-customer/internship/" +
            this.newClass +
            "/status/1",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          let participants = res.data;
          for (let i = 0; i <= participants.length - 1; i++) {
            if (this.selectedStudentId == participants[i].id) {
              this.snackbarContent =
                "Student cannot be moved to the new course as they are already registered to it.";
              this.snackbarColor = "warning";
              this.snackbar = true;

              this.confirmChangeCourseDialog = false;
            } else {
              this.confirmMoveStudent(oldId, newId, studentId);
            }
          }
        })
        .catch(e => {
          console.log(e.response);
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
        .get(
          "/admin/" +
            this.user.id +
            "/training-center/" +
            this.trainingCenterID +
            "/internship/findAll/1",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          //console.log("All courses");
          this.allCourses = res.data;
          this.ongoingCoursesLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.allCourses = [];
          this.ongoingCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    getCancelledCourses() {
      // -------------------------- Get cancelled courses ------------------------------
      this.cancelledCoursesLoader = true;
      this.$http
        .get(
          "/admin/" +
            this.user.id +
            "/training-center/" +
            this.trainingCenterID +
            "/internship/findAll/0",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          //console.log(res.data);
          // console.log("All cancelled courses");
          this.cancelledCourses = res.data;
          this.cancelledCoursesLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.cancelledCourses = [];
          this.cancelledCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    getCompletedCourses() {
      // -------------------------- Get Completed courses ------------------------------
      this.completedCoursesLoader = true;
      this.$http
        .get(
          "/admin/" +
            this.user.id +
            "/training-center/" +
            this.trainingCenterID +
            "/internship/findAll/2",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          //console.log("All completed courses");

          this.completedCourses = res.data;
          this.completedCoursesLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.completedCourses = [];
          this.completedCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    getEndedCourses() {
      // -------------------------- Get Ended courses ------------------------------
      this.completedCoursesLoader = true;
      this.$http
        .get(
          "/admin/" +
            this.user.id +
            "/training-center/" +
            this.trainingCenterID +
            "/internship/findAll/3",
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          //console.log(res.data);
          //console.log('All ended courses');
          this.endedCourses = res.data;
          this.ToCompleteCoursesLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.endedCourses = [];
          this.toCompleteCoursesLoader = false;
        });
      // ------------------------------------------------------------------------
    },
    confirmMoveStudent(oldId, newId, studentId) {
      this.$http
        .put(
          "/admin/" +
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
    completeCourse(item) {
      //console.log(item);
      // TODO -- Complete course
      this.$http
        .put(
          "/training-center/" +
            this.user.id +
            "/complete-internship/" +
            item.id,
          {},
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res => {
          console.log(res.data);
          this.getEndedCourses();
          this.getCompletedCourses();

          this.snackbarContent = "Course Marked as completed.";
          this.snackbarColor = "success";
          this.snackbar = true;
        })
        .catch(e => {
          console.log(e.response);
          this.snackbarContent = "Error. Contact Admin.";
          this.snackbarColor = "Error";
          this.snackbar = true;
        });
    },
    getAllTrainingCenters() {
      this.trainingCenterLoader = true;

      this.$http
        .get("/admin/" + this.user.id + "/findAll/3", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          this.trainingCenterList = res.data;
          this.trainingCenterLoader = false;
        })
        .catch(e => {
          console.log(e.response);
          this.trainingCenterList = [];
          this.trainingCenterLoader = false;
        });
    },
    openCoursesDialog(item) {
      this.trainingCenterID = item;

      this.getAllCourses();
      this.getEndedCourses();
      this.getCancelledCourses();
      this.getCompletedCourses();

      this.coursesDialog = true;
    },
    openLocationsDialog(locations) {
      console.log(locations);
    },
    openBlockUserDialog(id, blockedStatus) {
      if (blockedStatus == false) {
        this.blockDialogTitle = "Unblock User?";
      } else {
        this.blockDialogTitle = "Block User?";
      }
      this.blockId = id;
      this.blockUserDialog = true;

      console.log(blockedStatus);
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
          this.getAllTrainingCenters();
          this.blockUserDialog = false;
        })
        .catch(e => {
          console.log(e.response);
        });
    },

    resetTrainingCenter() {
      this.formValid = false;

      this.addTrainerLoader = false;

      this.$refs.registerform.reset();
    },
    registerTrainingCenter() {
      if (this.password == this.repeatPassword) {
        this.addTrainingLoader = true;
        var data = {
          name: this.trainingCenterName,
          dateOfCreation: moment().format("YYYY-MM-DD"),
          phoneNumber: this.phonenumber,
          email: this.email,
          password: this.phonenumber,
          trainingCenterManager: this.trainingCenterManager,
          sirenNumber: this.sirenNumber,
          trainingCenterLocations: [
            {
              certificateNumber: this.certificateNumber,
              name: this.locationName,
              contactNumber: this.locationPhoneNumber,
              personOfContact: this.locationPerson,
              address: this.street,
              pinCode: this.pincode,
              isMain: true,
              city: {
                id: this.city.id
              }
            }
          ]
        };

        this.$http
          .post("/training-center/register", data)
          .then(res => {
            console.log(res);
            this.snackbarContent = "Training center added.";
            this.snackbarColor = "success";
            this.snackbar = true;

            this.addTrainingLoader = false;
            this.resetTrainingCenter();
            this.getAllTrainingCenters();
            this.registerTrainingCenterDialog = false;
          })
          .catch(e => {
            console.log(e.response);
            this.addTrainingLoader = false;
            if (e.response.status == 409) {
              this.snackbarContent =
                "Email or Phone number is already in use. ";
              this.snackbarColor = "error";
              this.snackbar = true;
            } else {
              this.snackbarContent = "Fatal error. Contact admin. ";
              this.snackbarColor = "error";
              this.snackbar = true;
            }
          });
      } else {
        this.snackbarContent = "Passwords dont match";
        this.snackbarColor = "error";
        this.snackbar = true;
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    years: function() {
      let d = new Date().getFullYear();

      let end = d - 60;
      let start = d - 18;

      let t = [];
      for (let i = start; i >= end; i--) {
        t.push(i);
      }

      return t;
    }
  }
};
</script>
