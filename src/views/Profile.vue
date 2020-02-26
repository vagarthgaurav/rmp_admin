<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          absolute
          top
          right
          class="mx-5 my-10 primary--text"
          color="secondary"
          v-on="on"
          @click="openLocationDialog('Add new location')"
        >
          <v-icon>mdi-map-marker-plus</v-icon>
        </v-btn>
      </template>
      <span>Add new location</span>
    </v-tooltip>

    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarContent }}
      <v-btn text @click="snackbar = false" timeout="3000">Close</v-btn>
    </v-snackbar>

    <!-- Training center details -->
    <v-container class="mt-12">
      <v-card style="max-width: 800px; width: 95%; margin: auto; ">
        <v-card-text class="pa-0">
          <v-layout row class="profile">
            <v-flex xs4 md3>
              <v-layout column class="profileTitleBox pa-4">
                <v-flex xs class="my-2">
                  <span class="profileTitle">Name</span>
                </v-flex>
                <v-flex xs3 class="my-2">
                  <span class="profileTitle">Email</span>
                </v-flex>
                <v-flex xs3 class="my-2">
                  <span class="profileTitle">Date of Creation</span>
                </v-flex>
                <v-flex xs3 class="my-2">
                  <span class="profileTitle">Phone Number</span>
                </v-flex>
                <v-flex xs3 class="my-2">
                  <span class="profileTitle">Siren Number</span>
                </v-flex>
                <v-divider></v-divider>
                <v-flex xs3 class="my-4">
                  <span class="profileTitle">Password</span>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs8 md9>
              <v-layout column class="pa-4">
                <v-flex xs class="my-2 mx-5">
                  <span class="profileData">{{user.firstname}} {{user.lastname}}</span>
                </v-flex>
                <v-flex xs3 class="my-2 mx-5">
                  <span class="profileData">{{user.email}}</span>
                </v-flex>
                <v-flex xs3 class="my-2 mx-5">
                  <span class="profileData">{{formatDate(user.createdAt)}}</span>
                </v-flex>
                <v-flex xs3 class="my-2 mx-5">
                  <span class="profileData">{{user.phoneNumber}}</span>
                </v-flex>
                <v-flex xs3 class="my-2 mx-5">
                  <span class="profileData">{{user.sirenNumber}}</span>
                </v-flex>
                <v-divider></v-divider>
                <v-flex xs3 class="my-2 mx-5">
                  <span class="profileData">
                    <v-btn
                      text
                      color="red"
                      class="white--text"
                      @click="passwordResetDialog=true"
                    >Modify Password</v-btn>
                  </span>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- lOCATION CARDS -->
    <v-container class="px-12">
      <v-progress-linear v-if="locationsLoader" color="primary" rounded indeterminate></v-progress-linear>
      <h2 class="headline my-3">Locations</h2>
      <v-layout row wrap>
        <v-flex xs12 md6 lg6 v-for="(location,i) in locations" :key="i" class="px-4 py-3">
          <v-card color="primary" class="black--text lighten-4">
            <v-layout row class="pa-2">
              <v-flex xs4 md6>
                <v-layout column class="pa-4">
                  <v-flex xs4 class="my-2">
                    <span class="profileTitle">Name</span>
                  </v-flex>
                  <v-flex xs4 class="my-2">
                    <span class="profileTitle">Contact person</span>
                  </v-flex>
                  <v-flex xs4 class="my-2">
                    <span class="profileTitle">Contact number</span>
                  </v-flex>
                  <v-flex xs4 class="my-3">
                    <span class="profileTitle">Certificate number</span>
                  </v-flex>
                  <v-flex xs4 class="my-2">
                    <span class="profileTitle">Address</span>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs8 md6>
                <v-layout column class="pa-4">
                  <v-flex xs8 class="my-2 mx-5">
                    <span class="profileData">{{location.name}}</span>
                  </v-flex>
                  <v-flex xs8 class="my-2 mx-5">
                    <span class="profileData">{{location.personOfContact}}</span>
                  </v-flex>
                  <v-flex xs8 class="my-2 mx-5">
                    <span class="profileData">{{location.contactNumber}}</span>
                  </v-flex>
                  <v-flex xs8 class="my-2 mx-5">
                    <span class="profileData">{{location.certificateNumber}}</span>
                  </v-flex>
                  <v-flex xs8 class="mt-6 mx-5">
                    <span class="profileData" style="text-transform: capitalize">
                      {{location.address}}
                      <br />
                      {{location.city.pinCode}} {{location.city.cityName}}
                    </span>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3" style="background-color: rgb(230,230,230)">
              <v-spacer></v-spacer>
              <v-btn text color="green darken-2" dark @click="editLocation(location)">Edit</v-btn>
              <v-btn text color="red darken-2" dark @click="deleteLocation(location.id)">delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <div class="LocationDialog">
      <v-dialog v-model="modifyLocationDialog" width="70%">
        <v-card>
          <v-card-title class="headline primary white--text pa-2" primary-title>{{dialogTitle}}</v-card-title>

          <v-card-text>
            <v-form class="ma-0" ref="form" v-model="formValid">
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 class="pa-2">
                    <v-text-field v-model="name" :rules="rules" :counter="20" label="Nom" required></v-text-field>
                  </v-flex>

                  <v-flex xs12 md6 class="pa-2">
                    <v-select
                      v-model="region"
                      :items="regions"
                      item-text="regionFrenchName"
                      item-value="id"
                      label="Region"
                      persistent-hint
                      return-object
                      single-line
                      required
                      @change="onRegionChange"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 md6 class="pa-2">
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
                      :readonly="cityReadOnly"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 md6 class="pa-2">
                    <v-text-field v-model="street" :rules="rules" label="Street" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 class="pa-2">
                    <v-text-field v-model="pincode" :rules="pincodeRules" label="Pincode" required></v-text-field>
                  </v-flex>

                  <v-flex xs12 md4 class="pa-2">
                    <v-text-field v-model="certificateNumber" label="Numéro d′agrement" required></v-text-field>
                  </v-flex>

                  <v-flex xs12 md4 class="pa-2">
                    <v-text-field v-model="personOfContact" label="Nom du contact du lieu" required></v-text-field>
                  </v-flex>

                  <v-flex xs12 md4 class="pa-2">
                    <v-text-field
                      v-model="numberOfContact"
                      :rules="phoneRules"
                      label="Numéro de contact"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!formValid"
              color="green darken-3"
              class="white--text px-5"
              :loading="addCoursesLoader"
              @click="addLocation"
            >Submit</v-btn>

            <v-btn color="red darken-3" class="white--text px-5" @click="closeLocationDialog">cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-dialog v-model="passwordResetDialog" persistent width="600">
      <v-card>
        <v-card-title class="headline primary white--text pa-2" primary-title>Reset Password</v-card-title>

        <v-card-text class="pa-4">
          <p class="font-weight-bold subtitle">Enter new password:</p>
          <v-form ref="resetForm" v-model="resetFormValid">
            <v-col cols="12">
              <v-row xs12 class="pa-4">
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  type="password"
                  label="Password"
                ></v-text-field>
              </v-row>
              <v-row xs12 class="pa-4">
                <v-text-field
                  v-model="repeatPassword"
                  :rules="passwordRules"
                  type="password"
                  label="Repeat Password"
                ></v-text-field>
              </v-row>
            </v-col>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!resetFormValid"
            color="green darken-3"
            class="white--text px-5"
            :loading="resetLoader"
            @click="resetPassword"
          >Submit</v-btn>

          <v-btn color="red darken-3" dark @click="formReset()" class="px-5">Close</v-btn>
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
      locations: {},
      locationsLoader: false,

      regions: [],

      snackbar: false,
      snackbarContent: "",
      snackbarColor: "",

      cities: [],
      cityReadOnly: true,
      editLocationId: null,

      formValid: false,

      modifyLocationDialog: false,
      dialogTitle: "",
      modify: 0,

      addCoursesLoader: false,

      name: "",
      city: "",
      region: "",
      pincode: "",
      street: "",
      certificateNumber: "",
      personOfContact: "",
      numberOfContact: "",

      rules: [v => !!v || "Field is required"],
      pincodeRules: [
        v => !!v || "Pincode is required",
        v => !isNaN(v) || "Pincode must be valid",
        v => (v && v.length === 5) || "Pincode must be 5 characters"
      ],
      nameRules: [
        v => !!v || "City is required",
        v => isNaN(v) || "City must be valid"
      ],
      phoneRules: [
        v => !!v || "Phone Number is required",
        v => !isNaN(v) || "Phone number must be valid",
        v => (v && v.length === 10) || "Phone Number must be 10 characters"
      ],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length >= 6) || "Pincode must be 6 characters"
      ],

      passwordResetDialog: false,
      resetLoader: false,
      resetFormValid: false,

      password: "",
      repeatPassword: ""
    };
  },
  created() {
    this.locationsLoader = true;
    this.$http
      .get("/training-center/" + this.user.id + "/location/findAll", {
        headers: { Authorization: "Bearer " + this.$store.state.token }
      })
      .then(res => {
        console.log(res.data);
        this.locations = res.data;
        this.locationsLoader = false;
      })
      .catch(e => {
        console.log(e.response);
        this.locationsLoader = false;
        this.snackbarContent = "No Locations found.";
        this.snackbarColor = "warning";
        this.snackbar = true;
      });

    this.$http
      .get("/public/region/findAll")
      .then(res => {
        this.regions = res.data;
      })
      .catch(e => {
        console.log(e);
      });
  },
  methods: {
    //Format date
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY - HH:mm");
    },
    // RESET METHOD FOR MODIFY LOCATION DIALOG
    reset() {
      this.modifyLocationDialog = false;
      this.cities = [];
      this.cityReadOnly = true;
      this.formValid = false;

      this.addCoursesLoader = false;

      this.$refs.form.reset();
    },
    // OPEN MODIFY LOCATION DIALOG TO ADD A NEW LOCATION
    openLocationDialog(title) {
      this.dialogTitle = title;
      this.modify = 0;
      this.modifyLocationDialog = true;
    },
    // CLOSE MODIFY LOCATION DIALOG
    closeLocationDialog() {
      this.modifyLocationDialog = false;
      this.reset();
    },
    addLocation() {
      // ADD A NEW LOCATION TO THE TRAINING CENTER
      // TODO - Locations don't display properly once moving to another page and back
      this.addCoursesLoader = true;

      if (this.modify == 0) {
        var data = {
          certificateNumber: this.certificateNumber,
          name: this.name,
          contactNumber: this.numberOfContact,
          personOfContact: this.personOfContact,
          pinCode: this.pincode,
          address: this.street
        };

        this.$http
          .post(
            "/training-center/" +
              this.user.id +
              "/save/location/city/" +
              this.city.id,
            data,
            {
              headers: { Authorization: "Bearer " + this.$store.state.token }
            }
          )
          .then(res => {
            this.$http
              .get("/training-center/" + this.user.id + "/location/findAll", {
                headers: { Authorization: "Bearer " + this.$store.state.token }
              })
              .then(res => {
                this.locations = res.data;

                this.snackbarContent = "Location added";
                this.snackbarColor = "success";
                this.snackbar = true;

                //localStorage.setItem("locations", JSON.stringify(res.data));
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(e => {
            console.log(e);
          });

        this.reset();
      }

      // EDIT AN EXISTING LOCATION
      else if (this.modify == 1) {
        var data2 = {
          certificateNumber: this.certificateNumber,
          name: this.name,
          contactNumber: this.numberOfContact,
          personOfContact: this.personOfContact,
          pinCode: this.pincode,
          address: this.street,
          city: {
            id: this.city.id
          }
        };

        this.$http
          .put(
            "/training-center/" +
              this.user.id +
              "/update/location/" +
              this.editLocationId,
            data2,
            {
              headers: { Authorization: "Bearer " + this.$store.state.token }
            }
          )
          .then(res => {
            this.$http
              .get("/training-center/" + this.user.id + "/location/findAll", {
                headers: { Authorization: "Bearer " + this.$store.state.token }
              })
              .then(res => {
                this.locations = res.data;

                this.snackbarContent = "Location edited";
                this.snackbarColor = "success";
                this.snackbar = true;

                //localStorage.setItem("locations", JSON.stringify(res.data));
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(e => {
            console.log(e.response);
          });

        //this.locations = this.$store.getters.getLocations;
        this.reset();
      }
    },
    // OPEN MODIFY LOCATION DIALOG TO EDIT A LOCATION
    editLocation(item) {
      this.$http
        .get("/public/findCitiesIn/region/" + item.city.region.id)
        .then(res => {
          this.cities = res.data;
          this.cityReadOnly = false;
        })
        .catch(e => {
          //console.log(e.response);
        });

      this.dialogTitle = "Edit Location details";
      this.modify = 1;

      this.editLocationId = item.id;

      this.name = item.name;
      this.certificateNumber = item.certificateNumber;
      this.numberOfContact = item.contactNumber;
      this.personOfContact = item.personOfContact;
      this.pincode = item.pinCode;
      this.street = item.address;
      this.region = item.city.region.id;
      this.city = item.city.id;

      this.modifyLocationDialog = true;
    },
    deleteLocation(id) {
      this.$http
        .delete("/training-center/" + this.user.id + "/delete/location/" + id, {
          headers: { Authorization: "Bearer " + this.$store.state.token }
        })
        .then(res => {
          //console.log(res);
          this.$http
            .get("/training-center/" + this.user.id + "/location/findAll", {
              headers: { Authorization: "Bearer " + this.$store.state.token }
            })
            .then(res => {
              this.locations = res.data;
              localStorage.setItem("locations", JSON.stringify(res.data));
              this.snackbarContent = "Location deleted";
              this.snackbarColor = "success";
              this.snackbar = true;
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          console.log(e.response);
          if (e.response.status == 422) {
            this.snackbarContent =
              "Location cannot be deleted when there is an ongoing internship.";
            this.snackbarColor = "warning";
            this.snackbar = true;
          }
        });
    },
    onRegionChange(region) {
      this.$http
        .get("/public/findCitiesIn/region/" + region.id)
        .then(res => {
          console.log(res.data);
          this.cities = res.data;
          this.cityReadOnly = false;
        })
        .catch(e => {
          //console.log(e.response);
        });
    },
    resetPassword() {
      this.resetLoader = true;
      // if (this.user.email == this.resetEmail) {
      //   this.$http
      //     .post("/reset-password-request?email=" + this.resetEmail, {})
      //     .then(() => {
      //       //console.log(res);
      //       this.snackbarContent =
      //         "We have sent a link to your email. Please click on the link to reset your password. The link is valid only for 5 minutes.";
      //       this.snackbarColor = "success";
      //       this.snackbar = true;
      //       this.resetLoader = false;

      //       this.formReset();
      //     })
      //     .catch(e => {
      //       console.log(e.response);
      //       this.snackbarContent = "Fatal error. Contact admin.";
      //       this.snackbarColor = "error";
      //       this.snackbar = true;
      //       this.resetLoader = false;
      //     });
      // } else {
      //   this.snackbarContent =
      //     "The email you entered does not match the email in our database. Check again.";
      //   this.snackbarColor = "error";
      //   this.snackbar = true;
      //   this.resetLoader = false;
      // }

      if (this.password == this.repeatPassword) {
        this.$http
          .post(
            "/reset-password?user-id=" +
              this.user.id +
              "&password=" +
              this.password
          )
          .then(res => {
            //console.log(res);

            this.snackbarContent =
              "Password changed successfully. You will be logged out now. Please login with your new password.";
            this.snackbarColor = "success";
            this.snackbar = true;
            this.resetLoader = false;
            this.formReset();
            let self = this;
            setTimeout(function() {
              self.logout();
            }, 5000);
          })
          .catch(e => {
            console.log(e.response);
            this.snackbarContent = "Error. Contact admin.";
            this.snackbarColor = "error";
            this.snackbar = true;

            this.resetLoader = false;
          });
      } else {
        this.snackbarContent = "Passwords dont match.";
        this.snackbarColor = "error";
        this.snackbar = true;

        this.resetLoader = false;
      }
    },
    formReset() {
      this.$refs.resetForm.reset();
      this.passwordResetDialog = false;
    },
    logout() {
      this.$store.commit("signout");
      window.location.href = "/login";
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  }
};
</script>

<style >
.contain {
  padding: 20px;
}

.profile {
  background: #70a9a1;
}

.profileTitleBox {
  border-right: 1px solid #222222;
}

.profileTitle {
  color: #fcfcfc;
  letter-spacing: 2pt;
  font-size: 16px;
  font-weight: 600;
}

.profileData {
  color: #fcfcfc;
  font-size: 16px;
}
</style>