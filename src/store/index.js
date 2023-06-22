import { createStore } from 'vuex';

import router from '../router';

import { usersService } from '../modules/users/users.service';

export default createStore({
  state: {
    user: undefined,
    showNavbar: false
  },
  mutations: {
    setUser (state, val) {
      state.user = val;
    },
    setShowNavbar (state, val) {
      state.showNavbar = val;
    }
  },
  actions: {
    async setCurrentUser ({ commit }, user) {
      // set user in state
      commit('setUser', {
        ...user
      });
    },
    async logout ({ commit }) {
      await usersService.logout();
      // clear user and redirect to /
      commit('setUser', undefined);

      router.push('/');
    },
    handleShowNavbar ({ commit }, showNavbar) {
      // set the show side bar value
      // console.log('showSideBar', showSideBar);
      commit('setShowNavbar', showNavbar);
    }
  },
  modules: {},
  getters: {
    user (state) {
      return state.user;
    },
    showNavbar (state) {
      return state.showNavbar;
    }
  }
});
