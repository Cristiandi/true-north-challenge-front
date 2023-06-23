<template>
  <div class="container">
    <div class="row">
      <router-link to="/" class="link-dark">
        <BIconArrowLeft width="32" height="32" />
      </router-link>
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <div class="centered">
          <h1 class="text-center">Sing up</h1>
          <VueForm
            @submit="onSubmit"
            v-slot="{ errors }"
            :validation-schema="registerUserSchema"
          >
            <div>
              <div class="row">
                <div class="col-6">
                  <label for="email" class="fw-bold">Email</label>
                </div>
                <div class="col-6 text-end">
                  <small for="email" class="text-muted fw-light">
                    A valid email.
                  </small>
                </div>
              </div>
              <div>
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
                    A valid and secured password.
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

            <div>
              <div class="row">
                <div class="col-6">
                  <label for="confirmPassword" class="fw-bold"> Password </label>
                </div>
                <div class="col-6 text-end">
                  <small for="confirmPassword" class="text-muted fw-light">
                    Re enter your password.
                  </small>
                </div>
              </div>
              <div class="">
                <Field
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  as="input"
                  v-model="data.confirmPassword"
                />
                <small class="validation">{{ errors.confirmPassword }}</small>
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
                Sign up
              </button>
            </div>
          </VueForm>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.centered {
  /* display: flex; */
  /* flex-direction: column; */
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
</style>

<script>
import { Field, Form as VueForm } from 'vee-validate';
import { BIconArrowLeft } from 'bootstrap-icons-vue';

import { registerUserSchema } from '../modules/users/schemas/register-user.schema';
import { usersService } from '../modules/users/users.service';
import { getErrorMessage, sleep } from '../utils';

export default {
  name: 'RegisterPage',
  data () {
    return {
      data: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      loading: false
    };
  },
  components: {
    VueForm,
    Field,
    BIconArrowLeft
  },
  setup () {
    return { registerUserSchema };
  },
  methods: {
    async onSubmit (values, { resetForm }) {
      this.loading = true;

      try {
        const { message } = await usersService.register({
          fullName: this.data.fullName,
          email: this.data.email,
          phoneNumber: this.data.phoneNumber,
          password: this.data.password,
          confirmPassword: this.data.confirmPassword
        });

        this.$toast.success(message, {
          position: 'top-right',
          queue: false
        });

        resetForm();

        sleep(3000);

        await usersService.login({
          email: this.data.email,
          password: this.data.password
        });
      } catch (error) {
        this.$toast.error(getErrorMessage(error) || error.message, {
          position: 'top-right',
          queue: false
        });
      }

      this.loading = false;
    }
  }
};
</script>
