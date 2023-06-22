<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center align-items-center">
        <div class="row">
          <div class="col-6 align-self-center text-center">
            <router-link to="/register" role="button" class="btn btn-dark">REGISTRARSE</router-link>
          </div>
          <div class="col-6 align-self-center text-center">
            <router-link to="/login" role="button" class="btn btn-outline-dark" :style="{ width: '10rem' }">INICIAR SESIÓN</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
}

.row {
  height: 100%;
}
</style>
