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
                  <span class="profileTitle">Phone Number</span>
                </v-flex>
                <v-flex xs3 class="my-2">
                  <span class="profileTitle">Address</span>
                </v-flex>
                <v-flex xs3 class="my-2">
                  <span class="profileTitle">Pincode</span>
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
                  <span class="profileData">{{user.phoneNumber}}</span>
                </v-flex>
                <v-flex xs3 class="my-2 mx-5">
                  <span class="profileData">{{user.address.address}}</span>
                </v-flex>
                <v-flex xs3 class="my-2 mx-5">
                  <span class="profileData">{{user.address.pinCode}}</span>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- lOCATION CARDS -->
    <v-container>
      <h2 class="headline my-3">Locations</h2>
      <v-layout row wrap>
        <v-flex xs12 md4 lg3 v-for="(item,i) in locations" :key="i" class="px-4 py-3">
          <v-card color="pink" class="black--text accent-1 lighten-5">
            <v-layout row wrap>
              <v-flex xs12 class="pa-3">
                <div class="title mb-3">
                  <v-icon left large v-if="item.main">mdi-home-map-marker</v-icon>
                  <v-icon left large v-else>mdi-map-marker</v-icon>

                  <span class="ml-2 subheading">{{item.name}}</span>
                </div>
                <v-divider light></v-divider>
              </v-flex>

              <v-flex xs6 class="px-6 py-2">
                <span class="body-1">{{item.address}}</span>
                <br />
                <span></span>
                <br />
                <span>{{item.city.cityName}}, {{item.city.pinCode}}</span>
              </v-flex>
              <v-flex xs6 class="px-6 py-2">
                <span class="body-1">{{item.personOfContact}}</span>
                <br />
                <span></span>
                <br />
                <span>{{item.contactNumber}}</span>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3" style="background-color: rgb(230,230,230)">
              <v-spacer></v-spacer>
              <v-btn text color="green darken-2" dark @click="editLocation(item)">Edit</v-btn>
              <v-btn text color="red darken-2" dark @click="deleteLocation(item.id)">delete</v-btn>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      locations: {},
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
        v => (v &&v.length === 5) || "Pincode must be 5 characters"
      ],
      nameRules: [
        v => !!v || "City is required",
        v => isNaN(v) || "City must be valid"
      ],
      phoneRules: [
        v => !!v || "Phone Number is required",
        v => !isNaN(v) || "Phone number must be valid",
        v => (v && v.length === 9) || "Phone Number must be  9 characters"
      ]
    };
  },
  created() {
    this.locations = this.$store.getters.getLocations;
  },
  methods: {
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
            "/training-center/" + this.user.id + "/save/location/city/1",
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
                localStorage.setItem("locations", JSON.stringify(res.data));
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(e => {
            console.log(e);
          });

        this.locations = this.$store.getters.getLocations;
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
                localStorage.setItem("locations", JSON.stringify(res.data));
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(e => {
            console.log(e.response);
          });

        this.locations = this.$store.getters.getLocations;
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
          console.log(res);
          this.$http
            .get("/training-center/" + this.user.id + "/location/findAll", {
              headers: { Authorization: "Bearer " + this.$store.state.token }
            })
            .then(res => {
              this.locations = res.data;
              localStorage.setItem("locations", JSON.stringify(res.data));
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          console.log(e.response);
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
    }
  },
  computed: {
    user() {
      
      return this.$store.getters.getUser;
    },
    // locations() {
    //   console.log(this.$store.getters.getLocations);
    //   return this.$store.getters.getLocations;
    // },
    regions() {
      return this.$store.getters.getRegions;
    }
  }
};
</script>

<style >
.contain {
  padding: 20px;
}

.profile {
  background: #fcb3c6;
}

.profileTitleBox {
  border-right: 1px solid #222222;
}

.profileTitle {
  color: #3f3f3f;
  letter-spacing: 2pt;
  font-size: 16px;
  font-weight: 600;
}

.profileData {
  color: #3f3f3f;
  font-size: 16px;
}
</style>