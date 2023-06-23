<template>
  <div class="container">
    <router-link v-if="!loginLoading" to="/" class="link-dark">
      <BIconArrowLeft width="32" height="32" />
    </router-link>
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <div class="centered">
          <div v-if="!loginLoading">
            <h1 class="text-center">Log in</h1>
            <VueForm
              @submit="onSubmit"
              v-slot="{ errors }"
              :validation-schema="loginUser"
            >
              <div>
                <div class="row">
                  <div class="col-6">
                    <label for="email" class="fw-bold">Email</label>
                  </div>
                  <div class="col-6 text-end">
                    <small for="email" class="text-muted fw-light">
                      Please enter a valid email!
                    </small>
                  </div>
                </div>
                <div class="">
                  <Field
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    as="input"
                    v-model="data.email"
                  />
                  <small class="validation">{{ errors.email }}</small>
                </div>
              </div>

              <div>
                <div class="row">
                  <div class="col-6">
                    <label for="password" class="fw-bold">Password</label>
                  </div>
                  <div class="col-6 text-end">
                    <small for="password" class="text-muted fw-light">
                      Make it secure.
                    </small>
                  </div>
                </div>
                <div class="">
                  <Field
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    as="input"
                    v-model="data.password"
                  />
                  <small class="validation">{{ errors.password }}</small>
                </div>
              </div>

              <div v-if="loading" class="text-center">
                <pre></pre>

                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div v-if="!loading">
                <pre></pre>
                <button type="submit" class="btn btn-dark form-control">
                  Log in
                </button>
              </div>
            </VueForm>
          </div>
          <div v-else class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, Form as VueForm } from 'vee-validate';
import { BIconArrowLeft } from 'bootstrap-icons-vue';

import { getFromObjectPathParsed } from '../utils';

import { usersService } from '../modules/users/users.service';
import { loginUser } from '../modules/users/schemas/login-user.schema';

export default {
  name: 'LoginPage',
  data () {
    return {
      data: {
        email: '',
        password: ''
      },
      loading: false,
      loginLoading: false
    };
  },
  components: {
    VueForm,
    Field,
    BIconArrowLeft
  },
  setup () {
    return { loginUser };
  },
  methods: {
    async onSubmit (values, { resetForm }) {
      try {
        this.loading = true;

        const { email, password } = this.data;

        await usersService.login({
          email,
          password
        });

        resetForm();
      } catch (error) {
        console.log('error.message', error.message);

        this.$toast.error(
          error.message,
          {
            position: 'top-right',
            queue: false
          }
        );
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 95vh;
}

.validation {
  color: red;
}

input {
  border-radius: 0;
  border: 1px solid #000;
}

small {
  font-size: 8pt;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
