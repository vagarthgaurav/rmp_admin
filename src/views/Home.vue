<template>
  <div class="home">
    
    <v-container class="mt-12">
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
                        <v-btn
                          dark
                          fab
                          color="blue ligthen-1"
                          class="mr-2"
                          small
                          @click="openParticipantDialog(item, 'ongoing')"
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
    </v-container>

    <v-dialog v-model="addClassDialog" width="fit-content" persistent>
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>{{classDialogTitle}}</v-card-title>
        <v-form class="ma-0" ref="form" v-model="formValid">
          <v-card-text>
            <v-layout row wrap>
              <!--Trainer BAFM-->
              <v-flex xs12 sm6 md4 class="px-3">
                <v-row class="ma-0 pt-0">
                  <v-col cols="12" sm="10" class="ma-0 pt-0">
                    <v-select
                      v-model="trainerBafm"
                      :items="trainersListBafm"
                      item-text="firstname"
                      item-value="id"
                      label="Select BAFM"
                      prepend-icon="mdi-folder-account"
                      :rules="[v => !!v || 'Select a BAFM']"
                      @change="bafmChanged"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="2" class="ma-0 pt-0">
                    <v-btn
                      small
                      fab
                      color="green lighten-2"
                      class="mt-2"
                      @click="bafmViewSchedule"
                      :disabled="!bafmScheduleButtonDisabled"
                    >
                      <v-icon color="white">mdi-account-clock-outline</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-flex>

              <!--Trainer Psychologue-->
              <v-flex xs12 sm6 md4 class="px-3">
                <v-row class="ma-0 pt-0">
                  <v-col cols="12" sm="10" class="ma-0 pt-0">
                    <v-select
                      v-model="trainerPsycho"
                      :items="trainersListPsycho"
                      item-text="firstname"
                      item-value="id"
                      label="Select Psychologue"
                      prepend-icon="mdi-folder-account-outline"
                      :rules="[v => !!v || 'Select a Psychology']"
                      @change="psychoChanged"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="2" class="ma-0 pt-0">
                    <v-btn
                      small
                      fab
                      color="green lighten-2"
                      class="mt-2"
                      @click="psychoViewSchedule"
                      :disabled="!psychoScheduleButtonDisabled"
                    >
                      <v-icon color="white">mdi-account-clock-outline</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
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
                      <v-btn fab small dark v-on="on" color="yellow darken-4" class="mr-2">
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
                          {{ course.uniqueIdentifier }} -
                          <span
                            style="text-transform: capitalize"
                          >{{ course.trainingCenterLocation.city.cityName }}</span>
                          - {{formatDate(item.startingDate)}} au {{formatDate(course.endingDate)}}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-btn
                    dark
                    fab
                    color="blue ligthen-1"
                    class="mx-2"
                    small
                    @click="openCertificateDialog(item)"
                  >
                    <v-icon right class="mr-2">mdi-account-box-multiple-outline</v-icon>
                  </v-btn>

                  <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        dark
                        fab
                        color="blue ligthen-1"
                        class="mx-2"
                        small
                        @click="getRegistrationDetails(item.id)"
                      >
                        <v-icon right class="mr-2" v-on="on">mdi-account-box-multiple-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>View Details</span>
                  </v-tooltip>-->
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

    <v-dialog v-model="certificateDialog" width="fit-content" style="overflow: auto">
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>Generate Certificate</v-card-title>
        <v-card-text>
          <div id="certificatePDFWrapper" style="padding: 10pt;color: black;width: 210mm;">
            <v-row no-gutters>
              <v-col cols="12" md="4"></v-col>
              <v-col cols="12" md="4" class="text-center">
                <img id="logo" width="800" src="../assets/logo.png" />
              </v-col>
              <v-col cols="12" md="4" class="text-right"></v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="py-5 mx-2">
          <v-btn color="success" @click="generateCertificate">Yes</v-btn>
          <v-btn color="red" dark @click="certificateDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
moment.locale("fr");

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

      certificateDialog: false,

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
      ],

      trainerID: null,

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

      bafmScheduleButtonDisabled: false,
      psychoScheduleButtonDisabled: false,
      selectedStudent: null,
      selectedClass: null
    };
  },
  created() {
    this.getAllCourses();
    this.getEndedCourses();
    //this.getCancelledCourses();
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
    openParticipantDialog(item, type) {
      this.selectedClass = item;
      this.oldClass = item.id;

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
            item.id +
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
      //console.log(this.newClass, this.oldClass, this.selectedStudentId);
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
        .get("/training-center/" + this.user.id + "/internship/findAll/0", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
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
        .get("/training-center/" + this.user.id + "/internship/findAll/2", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
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
        .get("/training-center/" + this.user.id + "/internship/findAll/3", {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
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
    completeCourse(item) {
      //console.log(item);

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
    getRegistrationDetails(participantId) {
      this.$http
        .get(
          "/training-center/" +
            this.user.id +
            "/findRegistrationDetails/internship/" +
            this.oldClass +
            "/customer/" +
            participantId,
          {
            headers: { Authorization: "Bearer " + this.$store.state.token }
          }
        )
        .then(res2 => {
          console.log(res2.data);
        })
        .catch(e => {
          console.log(e.response);
        });
    },

    openCertificateDialog(student) {
      this.selectedStudent = student;

      this.certificateDialog = true;
    },

    generateCertificate() {
      console.log(this.selectedStudent);
      console.log(this.selectedClass);

      //mercredi 12 septembre 2012 et jeudi 13 septembre 2012
      let caseNo = 4;
      let s = this.selectedStudent;

      // this.$http
      //   .get("/customer/" + s.id + "/driving-licence/findAll",{
      //     headers: { Authorization: "Bearer " + this.$store.state.token }
      //   })
      //   .then(res => {
      //     console.log(res.data);
      //   })
      //   .catch(e => {console.log(e.response)});

      this.getRegistrationDetails(s.id);

      const doc = new jsPDF("p", "pt", "a4");
      doc.setFontSize(9);
      doc.text(30, 70, "PERMIS A TOUS");
      doc.text(30, 85, "9 avenue Michelet");
      doc.text(30, 100, "93120 La courneuve");

      doc.setFontSize(16);
      doc.text(170, 160, "ATTESTATION DE SUIVI DE STAGE");

      doc.setFontSize(9);

      if (caseNo == 1) {
        doc.text(
          30,
          200,
          " Cas 1 : Stage volontaire (art. L. 223-6 alinéa 2 et R. 223-8 du code de la route)."
        );
      } else if (caseNo == 2) {
        doc.text(
          30,
          200,
          "Cas 2 : Stage obligatoire pour les conducteurs qui ont commis pendant le délai probatoire une infraction ayant donné lieu à une perte d'au "
        );
        doc.text(
          30,
          212,
          "moins trois points (art. L. 223-6 et R. 223-4 du code de la route)."
        );
      } else if (caseNo == 3) {
        doc.text(
          30,
          200,
          "Cas 3 : Stage en alternative à la poursuite judiciaire proposé par le Procureur de la République ou en exécution d'une l'art."
        );
        doc.text(
          30,
          212,
          " 41-1 et 5° de l'article 41-2 du code de procédure pénale)."
        );
      } else if (caseNo == 4) {
        doc.text(
          30,
          200,
          "Cas 4 : Peine complémentaire ou obligation imposée dans le cadre du sursis avec mise à l'épreuve (art.131-35-1 et R.132-45 "
        );
        doc.text(30, 212, "du code pénal).");
      }

      doc.setFontSize(10);

      doc.text(30, 250, "Je soussigné(e) ");
      doc.setFontType("bold");
      doc.text(105, 250, "Julien BONHOMME, ");
      doc.setFontType("normal");
      doc.text(
        205,
        250,
        "Responsable de la formation spécifique, titulaire de l’Agrément Préfectoral N°:"
      );
      doc.text(30, 265, "2011/31.00, atteste que :");

      doc.text(30, 300, "Nom: ");
      doc.setFontType("bold");
      doc.text(60, 300, s.firstname);
      doc.setFontType("normal");

      doc.text(320, 300, "Prénom: ");
      doc.setFontType("bold");
      doc.text(360, 300, s.lastname);
      doc.setFontType("normal");

      doc.text(30, 315, "Date de naissance: ");
      doc.setFontType("bold");
      doc.text(120, 315, moment(s.dateOfBirth).format("DD/MM/YYYY"));
      doc.setFontType("normal");

      doc.text(320, 315, "Lieu de naissance: ");
      doc.setFontType("bold");
      doc.text(410, 315, "Blanc mesnil");
      doc.setFontType("normal");

      doc.text(30, 330, "Résidant à: ");
      doc.setFontType("bold");
      doc.text(85, 330, s.address.address);
      doc.setFontType("normal");

      doc.text(30, 345, "Code postal: ");
      doc.setFontType("bold");
      doc.text(90, 345, s.address.pinCode);
      doc.setFontType("normal");

      let city = s.address.city.cityName;

      doc.text(320, 345, "Ville: ");
      doc.setFontType("bold");
      doc.text(350, 345, city.charAt(0).toUpperCase() + city.substring(1));
      doc.setFontType("normal");

      doc.text(30, 360, "N° de permis: ");
      doc.setFontType("bold");
      doc.text(95, 360, "12NN03357");
      doc.setFontType("normal");

      doc.text(30, 375, "Délivré le: ");
      doc.setFontType("bold");
      doc.text(90, 375, "15/10/2007");
      doc.setFontType("normal");

      doc.text(320, 375, "Par la Préfecture de: ");
      doc.setFontType("bold");
      doc.text(415, 375, "BOBIGNY");
      doc.setFontType("normal");

      doc.rect(30, 390, 520, 75);
      doc.setFontType("italic");
      doc.text(40, 410, "Rubrique à compléter uniquement dans les cas 2 à 4.");
      doc.text(40, 425, "Ayant commis une infraction au code de la route.");
      doc.setFontType("normal");

      doc.text(40, 455, "le");
      doc.text(220, 455, "heure");
      doc.text(350, 455, "lieu de l'infraction");

      doc.text(
        30,
        490,
        "a suivi le stage de formation spécifique correspondant au cas visé ci-dessus, qui s’est déroulé : "
      );

      doc.text(
        30,
        505,
        moment(this.selectedClass.startingDate).format("dddd dd MMMM YYYY") +
          " et " +
          moment(this.selectedClass.endingDate).format("dddd dd MMMM YYYY")
      );

      doc.text(
        30,
        530,
        this.selectedClass.trainingCenterLocation.address +
          ", " +
          this.selectedClass.trainingCenterLocation.pinCode +
          " " +
          this.selectedClass.trainingCenterLocation.city.cityName
            .charAt(0)
            .toUpperCase() +
          this.selectedClass.trainingCenterLocation.city.cityName.substring(1)
      );

      doc.text(30, 560, "Le 13/09/2012 à LA COURNEUVE :");

      doc.setFontType("bold");
      doc.text(60, 590, "Directeur du centre");
      doc.text(280, 590, "Animateurs");
      doc.text(450, 590, "Stagiaire");

      doc.setFontType("normal");
      doc.setFontSize(9);
      doc.text(65, 605, "Signature et Cachet");
      doc.text(285, 605, "Signatures");
      doc.text(452, 605, "Signature");

      doc.text(240, 620, "BAFM/BAFCRI:");
      doc.text(
        305,
        620,
        this.selectedClass.bafm.firstname +
          " " +
          this.selectedClass.bafm.lastname
      );
      doc.text(240, 635, "Psychologue:");
      doc.text(
        305,
        635,
        this.selectedClass.psychologist.firstname +
          " " +
          this.selectedClass.psychologist.lastname
      );

      doc.setFontSize(6);
      doc.text(
        30,
        680,
        "* Cas 1 : Cette attestation doit être transmise par l'organisme dans les quinze jours suivant la fin du stage au préfet du département du lieu du stage (article R.223-8-I du code de la route)"
      );

      doc.text(
        30,
        690,
        "* Cas 2 : Cette attestation doit être transmise par l'organisme de formation dans les quinze jours suivant la fin du stage:"
      );
      doc.text(
        40,
        700,
        "• au Préfet du département du lieu du stage (article R.223-8-1 du code de la route), accompagnée de la copie de la lettre réf 48 N reçue par l'intéressé"
      );
      doc.text(
        40,
        710,
        "• au comptable du Trésor du lieu de commission de l'infraction. En outre, l'intéressé doit adresser à ce comptable une demande de remboursement ou d'interruption de mise en recouvrement,"
      );

      doc.text(
        40,
        720,
        "  dûment remplie et accompagnée des pièces nécessaires. Ce document est obtenu auprès de l'organisme chargé de la formation spécifique."
      );

      doc.text(
        30,
        730,
        "* Cas 3 : Cette attestation doit être transmise par l'intéressé dans les quinze jours suivant la fin du stage au Procureur de la République concerné"
      );

      doc.text(
        30,
        740,
        "* Cas 4 : Cette attestation doit être transmise par le condamné:"
      );

      doc.text(
        40,
        750,
        "• au procureur de la République si le stage est accompli comme peine complémentaire (art. 131-35-1 du code pénal)"
      );

      doc.text(
        40,
        760,
        "• au juge d'application des peines ou au service pénitentiaire d'insertion et de probation chargé du suivi de l'obligation, si le stage est imposé dans le cadre du sursis avec mise à l'épreuve (art. R."
      );

      doc.text(40, 770, "  132-45 du code pénal).");

      doc.rect(60, 790, 470, 0);

      html2canvas(document.querySelector("#logo")).then(canvas => {
        const img = canvas.toDataURL("image/jpeg", 1);
        doc.addImage(img, "JPEG", 280, 40, 70, 80);
        doc.output("dataurlnewwindow");
      });
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
          if (val != this.events[i].start) {
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
    },
    psychoViewSchedule() {
      this.openViewScheduleDialog(this.trainerPsycho);
    },
    bafmViewSchedule() {
      this.openViewScheduleDialog(this.trainerBafm);
    },
    bafmChanged() {
      this.bafmScheduleButtonDisabled = true;
    },
    psychoChanged() {
      this.psychoScheduleButtonDisabled = true;
    }
  },
  computed: {
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

