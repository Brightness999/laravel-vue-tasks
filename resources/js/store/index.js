import axios from 'axios';
import { createStore } from 'vuex'
import sharedMutations from 'vuex-shared-mutations';
import Cookies from 'js-cookie';

export default createStore({
    state() {
        return {
            tasks: null,
            user: null,
            totalSize: 0,
        }
    },
    getters: {
        user(state) {
            return state.user;
        },
        verified(state) {
            if (state.user) return state.user.email_verified_at
            return null
        },
        id(state) {
            if (state.user) return state.user.id
            return null
        },
        tasks(state) {
            if (state.tasks) return state.tasks
            return []
        },
        totalSize(state) {
            if (state.tasks) return state.totalSize
            return 0
        }
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        setTasks(state, payload) {
            state.tasks = payload;
        },
        setTotalSize(state, payload) {
            state.totalSize = payload;
        }
    },

    actions: {
        async login({ dispatch }, payload) {
            try {
                await axios.post('/api/login', payload).then((res) => {
                    Cookies.set('token', res.data.access_token);
                    return dispatch('getUser');
                }).catch((err) => {
                    throw err.response
                });
            } catch (e) {
                throw e
            }
        },

        async register({ dispatch }, payload) {
            try {
                await axios.post('/api/register', payload).then((res) => {
                    return dispatch('login', { 'email': payload.email, 'password': payload.password })
                }).catch((err) => {
                    throw (err.response)
                })
            } catch (e) {
                throw (e)
            }
        },

        async logout({ commit }) {
            const token = Cookies.get('token');
            await axios.post('/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                commit('setUser', null);
                Cookies.remove('token');
            }).catch((err) => {

            })

        },

        async getUser({ commit }) {
            const token = Cookies.get('token');
            if (token) {
                await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    commit('setUser', res.data);
                }).catch((err) => {
                    throw err.response
                })
            }
        },

        async profile({ commit }, payload) {
            const token = Cookies.get('token');
            if (token) {
                await axios.patch('/api/profile', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    commit('setUser', res.data.user);
                }).catch((err) => {
                    throw err.response
                })
            }
        },
        
        async password({ }, payload) {
            const token = Cookies.get('token');
            if (token) {
                await axios.patch('/api/password', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch((err) => {
                    throw err.response
                })
            }
        },

        async verifyResend({ dispatch }, payload) {
            let res = await axios.post('/api/verify-resend', payload)
            if (res.status != 200) throw res
            return res
        },

        async verifyEmail({ dispatch }, payload) {
            let res = await axios.post('/api/verify-email/' + payload.id + '/' + payload.hash)
            if (res.status != 200) throw res
            dispatch('getUser')
            return res
        },

        async getTasks({ commit }, payload) {
            const token = Cookies.get('token');
            if (token) {
                await axios.post('/api/tasks', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    commit('setTasks', res.data.tasks);
                    commit('setTotalSize', res.data.totalSize);
                }).catch((err) => {
                    throw err.response;
                })
            }
        },

        async getBoardTasks({ commit }) {
            const token = Cookies.get('token');
            if (token) {
                await axios.post('/api/board_tasks', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    commit('setTasks', res.data);
                }).catch((err) => {
                    throw err.response;
                })
            }
        },

        async createTask({ commit, state }, payload) {
            const token = Cookies.get('token');
            if (token) {
                await axios.post('/api/task', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    commit('setTasks', [...state.tasks, res.data]);
                }).catch((err) => {
                    throw err.response
                })
            }
        },

        async updateTask({ commit, state }, payload) {
            const token = Cookies.get('token');
            if (token) {
                await axios.put(`/api/task/${payload.id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    const newTasks = state.tasks.map(task => task.id === payload.id ? res.data : task);
                    commit('setTasks', newTasks);
                }).catch((err) => {
                    throw err.response
                })
            }
        },

        async deleteTask({ commit, state }, payload) {
            const token = Cookies.get('token');
            if (token) {
                await axios.delete(`/api/task/${payload}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    const newTasks = state.tasks.filter(task => task.id != payload);
                    commit('setTasks', newTasks);
                }).catch((err) => {
                    throw err.response
                })
            }
        },
    },
    plugins: [sharedMutations({ predicate: ['setUser', 'createTask', 'updateTask', 'deleteTask', 'setTasks'] })],
})
