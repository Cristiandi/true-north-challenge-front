<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <pre></pre>

        <h1>{{ nickName }}</h1>

        <pre></pre>

        <div class="centered">
          <h1 class="text-center">Calculator</h1>
        </div>

        <VueForm
          @submit="onSubmit"
          v-slot="{ errors }"
          :validation-schema="operateSchema"
        >
          <div>
            <div class="row">
              <div class="col-6">
                <label for="operation" class="fw-bold">Operation</label>
              </div>
              <div class="col-6 text-end">
                <small for="operation" class="text-muted fw-light">
                  Select an operation.
                </small>
              </div>
            </div>
            <div class="">
              <Field
                class="form-control"
                id="operation"
                name="operation"
                as="select"
                v-model="data.operation"
              >
                <option value="addition">Add</option>
                <option value="subtraction">Subtract</option>
                <option value="multiplication">Multiply</option>
                <option value="division">Divide</option>
                <option value="square_root">Square Root</option>
                <option value="random_string">Random String</option>
              </Field>
              <small class="validation">{{ errors.operation }}</small>
            </div>
          </div>

          <div>
            <div class="row">
              <div class="col-6">
                <label for="number-a" class="fw-bold">Number A</label>
              </div>
              <div class="col-6 text-end">
                <small for="number-a" class="text-muted fw-light">
                  First number.
                </small>
              </div>
            </div>
            <div>
              <Field
                type="number"
                class="form-control"
                id="number-a"
                name="number-a"
                as="input"
                v-model="data.a"
              />
              <small class="validation">{{ errors.a }}</small>
            </div>
          </div>

          <div>
            <div class="row">
              <div class="col-6">
                <label for="number-b" class="fw-bold">Number B</label>
              </div>
              <div class="col-6 text-end">
                <small for="number-b" class="text-muted fw-light">
                  Second number.
                </small>
              </div>
            </div>
            <div>
              <Field
                type="number"
                class="form-control"
                id="number-b"
                name="number-b"
                as="input"
                v-model="data.b"
              />
              <small class="validation">{{ errors.b }}</small>
            </div>

            <pre></pre>

            <div v-if="result">
              <div class="alert alert-success">
                <strong>Result:</strong> {{ result }}
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="btn btn-dark form-control"
                :disabled="loading"
              >
                CALCULATE
              </button>
            </div>
          </div>
        </VueForm>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
import { mapState } from 'vuex';
import { Field, Form as VueForm } from 'vee-validate';

import { recordsService } from '../modules/records/records.service';

import { getErrorMessage } from '../utils';

import { operateSchema } from '../modules/records/schemas/operate.schema';

const OPERATIONS_NEEDING_A = [
  'addition',
  'subtraction',
  'multiplication',
  'division',
  'square_root'
];
const OPERATIONS_NEEDING_B = [
  'addition',
  'subtraction',
  'multiplication',
  'division'
];

export default {
  name: 'HomePage',
  data () {
    return {
      nickName: undefined,
      loading: false,
      data: {
        operation: undefined,
        a: undefined,
        b: undefined
      },
      result: undefined
    };
  },
  components: {
    VueForm,
    Field
  },
  setup () {
    return { operateSchema };
  },
  computed: mapState({
    userFromState: (state) => state.user
  }),
  methods: {
    async onSubmit (values, { resetForm }) {
      this.loading = true;

      let parsedA, parsedB;

      if (OPERATIONS_NEEDING_A.includes(this.data.operation)) {
        if (!this.data.a) {
          this.$toast.error('Number A is required.', {
            position: 'top-right',
            queue: false
          });

          this.loading = false;

          return;
        }

        parsedA = parseInt(this.data.a, 10);

        if (isNaN(parsedA)) {
          this.$toast.error('Number A must be a number.', {
            position: 'top-right',
            queue: false
          });

          this.loading = false;

          return;
        }
      }

      if (OPERATIONS_NEEDING_B.includes(this.data.operation)) {
        if (!this.data.b) {
          this.$toast.error('Number B is required.', {
            position: 'top-right',
            queue: false
          });

          this.loading = false;

          return;
        }

        parsedB = parseInt(this.data.b, 10);

        if (isNaN(parsedB)) {
          this.$toast.error('Number B must be a number.', {
            position: 'top-right',
            queue: false
          });

          this.loading = false;

          return;
        }
      }

      try {
        const data = await recordsService.operate({
          userAuthUid: this.userFromState?.uid,
          operation: this.data.operation,
          a: parsedA,
          b: parsedB
        });

        this.result = data?.operationResponse?.result;

        const message = `Operation ${this.data.operation} was successful. User balance is now ${data?.userBalance}`;

        this.$toast.success(message, {
          position: 'top-right',
          queue: false
        });

        resetForm();
      } catch (error) {
        this.$toast.error(getErrorMessage(error) || error.message, {
          position: 'top-right',
          queue: false
        });
      }

      this.loading = false;
    }
  },
  created () {
    this.nickName = this.userFromState?.email.split('@')[0];
  },
  mounted () {
    console.log('HomePage mounted');
    console.log('this.userFromState', this.userFromState);
  }
};
</script>
