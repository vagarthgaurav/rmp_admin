<template>
  <div class="home pa-6">
    <v-card>
      <v-card-title>
        Courses
        <v-spacer></v-spacer>
        <v-text-field append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn fab class="mx-5 primary--text" color="secondary" v-on="on" @click="addClass">
              <v-icon>mdi-card-plus</v-icon>
            </v-btn>
          </template>
          <span>Add new course</span>
        </v-tooltip>
      </v-card-title>
    </v-card>

    <v-dialog v-model="addClassDialog" width="70%">
      <v-card>
        <v-card-title class="headline primary white--text pa-4" primary-title>Add new class</v-card-title>

        <v-card-text>
          <v-layout row wrap>
            <!--Trainer BAFM-->
            <v-flex xs12 sm6 md4 class="px-3">
              <v-select
                v-model="trainerBafm"
                :items="trainersListBafm"
                label="Select BAFM"
                prepend-icon="mdi-file-account"
              ></v-select>
            </v-flex>

            <!--Trainer Psychologue-->
            <v-flex xs12 sm6 md4 class="px-3">
              <v-select
                v-model="trainerPsycho"
                :items="trainersListPsycho"
                label="Select Psychologue"
                prepend-icon="mdi-file-account-outline"
              ></v-select>
            </v-flex>

            <!--Locations-->
            <v-flex xs12 md4 class="px-3">
              <v-select
                v-model="location"
                :items="locationList"
                label="Select Location"
                prepend-icon="mdi-map-marker"
                @change="locationChanged"
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
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="startDateFormatted"
                    label="Starting Date"
                    prepend-icon="mdi-calendar-today"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="startDate" no-title scrollable :min="today">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="smenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="startDateChosen">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>

            <!-- End Date-->
            <v-flex xs12 sm6 md6 class="px-3">
              <v-text-field
                v-model="endDateFormatted"
                label="Ending Date"
                prepend-icon="mdi-calendar"
                readonly
              ></v-text-field>
            </v-flex>

            <!--Class start time -->
            <v-flex xs12 sm6 md6 class="px-3">
              <v-text-field
                prepend-icon="mdi-briefcase-clock-outline"
                v-model="startTime"
                mask="time"
                label="Start Time"
              ></v-text-field>
            </v-flex>

            <!--Class End time-->
            <v-flex xs12 sm6 md6 class="px-3">
              <v-text-field
                prepend-icon="mdi-briefcase-clock"
                v-model="endTime"
                mask="time"
                label="End Time"
              ></v-text-field>
            </v-flex>

            <!--Max Participants-->
            <v-flex xs12 sm6 md6 class="px-3">
              <v-text-field
                v-model="participants"
                label="Max Participants"
                prepend-icon="mdi-account-check"
                value="20"
                readonly
              ></v-text-field>
            </v-flex>

            <!--Price-->
            <v-flex xs12 sm6 md6 class="px-3">
              <v-text-field v-model="price" label="Price" prepend-icon="mdi-currency-eur"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-3"
            class="white--text px-5"
            :loading="newCoursesLoader"
            @click="submitClass"
          >Submit</v-btn>

          <v-btn color="red darken-3" class="white--text px-5" @click="closeClassDialog">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addClassDialog: false
    };
  },
  methods: {
    addClass() {
      this.addClassDialog = true;
    },
    closeClassDialog() {
      this.addClassDialog = false;
    }
  }
};
</script>
