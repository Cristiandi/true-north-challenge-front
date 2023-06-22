<template>
  <nav class="navbar fixed-bottom navbar-light bg-light">
    <div class="container-fluid justify-content-around">
      <router-link to="" class="link-dark" @click.prevent="logout">
        <BIconDoorOpen width="25" height="25" />
      </router-link>
      <router-link to="/records" class="link-dark">
        <BIconList width="32" height="32" />
      </router-link>
      <router-link to="/home" class="link-dark">
        <BIconHouseDoor width="32" height="32" />
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
nav {
  border: 1px solid #000;
}
</style>

<script>
import { BIconHouseDoor, BIconDoorOpen, BIconList } from 'bootstrap-icons-vue';

export default {
  name: 'NavbarComponent',
  data () {},
  components: {
    BIconDoorOpen,
    BIconHouseDoor,
    BIconList
  },
  methods: {
    async logout () {
      await this.$store.dispatch('logout');
    }
  }
};
</script>
