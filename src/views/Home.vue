<template>
  <div class="home pa-6">
    <h1>Training Center dashboard</h1>

    <v-btn @click="register" color="pink" dark class="mx-2">Register</v-btn>
    <v-btn @click="signin" color="yellow darken-2" dark>Sign In</v-btn>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  components: {},
  created() {},
  methods: {
    register() {
      this.$http
        .post("/register/role/training_center", {
          firstname: "JET",
          lastname: "Test",
          gender: "M",
          password: "abcd1234",
          address: "Puranics Rumah Bali",
          dateOfBirth: "1993-10-13",
          phoneNumber: "7022815930",
          email: "vagarth.gaurav@gmail.com"
        })
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          console.error(e);
        });
    },

    signin(){
      
      this.$http
        .post("/authenticate/type/training_center", {
          username: "vagarth.gaurav@gmail.com",
          password: "abcd1234",
        })
        .then(r => {
          console.log(r);
        })
        .catch(e => {
          console.error(e);
        });

    }
  }
};
</script>
