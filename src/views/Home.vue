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
