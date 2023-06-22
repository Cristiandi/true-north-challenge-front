<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="centered">
          <h1 class="text-center">Records</h1>
        </div>

        <pre></pre>

        <input type="text" v-model="searchTerm" placeholder="Search..." />
        <table class="table">
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                @click="sortData(column.key)"
              >
                {{ column.label }}
                <span
                  v-if="sortColumn === column.key"
                  :class="sortOrder === 1 ? 'arrow-up' : 'arrow-down'"
                ></span>
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredData" :key="item.id">
              <td v-for="column in columns" :key="column.key">
                {{ item[column.key] }}
              </td>
              <td>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteRecord({ uid: item.uid })"
                  :disabled="loading"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <select @change="setPerPage">
            <option value="2" selected>2 per page</option>
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
          </select>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="setPage(page)"
            :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { recordsService } from '../modules/records/records.service';
import { mapState } from 'vuex';

const COLUMNS = [
  {
    key: 'id',
    label: 'ID'
  },
  {
    key: 'userBalance',
    label: 'User Balance'
  },
  {
    key: 'result',
    label: 'Result'
  },
  {
    key: 'createdAt',
    label: 'Created At'
  }
];

export default {
  name: 'RecordsPage',
  data () {
    return {
      loading: false,
      totalItems: 0,
      data: [],
      columns: COLUMNS,
      perPage: 2,
      currentPage: 1,
      sortColumn: 'id',
      sortOrder: 'ASC',
      searchTerm: ''
    };
  },
  computed: mapState({
    userFromState: (state) => state.user,
    filteredData () {
      console.log('executing filteredData');

      let filtered = this.data;

      // Filter data based on search term
      if (this.searchTerm) {
        filtered = filtered.filter((item) => {
          for (const column of this.columns) {
            const value = item[column.key];
            const stringValue = '' + value;
            if (stringValue.toLowerCase().includes(this.searchTerm.toLowerCase())) {
              return true;
            }
          }
          return false;
        });
      }

      return filtered;
    },
    totalPages () {
      if (this.searchTerm) {
        return Math.ceil(this.filteredData.length / this.perPage);
      }

      return Math.ceil(this.totalItems / this.perPage);
    }
  }),
  methods: {
    async fetchData ({ q, take, skip, orderBy, order }) {
      // Fetch data from API and set it using this.data
      const response = await recordsService.getRecords({
        userAuthUid: this.userFromState?.uid,
        q,
        take,
        skip,
        orderBy,
        order
      });

      const { count, data } = response;

      this.totalItems = count;
      this.data = data;
    },
    setPage (page) {
      this.currentPage = page;

      this.fetchData({
        take: this.perPage,
        skip: (this.currentPage - 1) * this.perPage,
        orderBy: this.sortColumn,
        order: this.sortOrder
      });
    },
    sortData (column) {
      if (this.sortColumn === column) {
        this.sortOrder = 'DESC';
        this.fetchData({
          take: this.perPage,
          skip: (this.currentPage - 1) * this.perPage,
          orderBy: this.sortColumn,
          order: this.sortOrder
        });
      } else {
        this.sortColumn = column;
        this.sortOrder = 'ASC';
        this.fetchData({
          take: this.perPage,
          skip: (this.currentPage - 1) * this.perPage,
          orderBy: this.sortColumn,
          order: this.sortOrder
        });
      }
    },
    setPerPage (event) {
      this.perPage = event.target.value;
      this.fetchData({
        take: this.perPage,
        skip: (this.currentPage - 1) * this.perPage,
        orderBy: this.sortColumn,
        order: this.sortOrder
      });
    },
    async deleteRecord ({ uid }) {
      this.loading = true;
      await recordsService.delete({ uid });
      this.fetchData({
        take: this.perPage,
        skip: (this.currentPage - 1) * this.perPage,
        orderBy: this.sortColumn,
        order: this.sortOrder
      }).finally(() => {
        this.loading = false;
      });
    }
  },
  created () {
    this.fetchData({
      take: this.perPage,
      skip: (this.currentPage - 1) * this.perPage,
      orderBy: this.sortColumn,
      order: this.sortOrder
    });
  }
};
</script>

<style>
/* Add your custom styles here */
</style>
