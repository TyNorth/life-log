<template>
  <q-toggle
    v-model="darkMode"
    @update:model-value="$q.dark.toggle"
    checked-icon="sym_o_dark_mode"
    unchecked-icon="sym_o_light_mode"
    color="accent"
    class="dark-mode-toggle sticky-top"
  />

  <div class="container">
    <q-card class="login-card" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h4 text-weight-bold q-mb-md">Welcome to Log Life</div>
        <div class="text-subtitle1">Log in to access your personal journal.</div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <form @submit.prevent="login">
          <div class="q-gutter-md">
            <q-input
              label="Email"
              filled
              type="email"
              v-model="email"
              required
              :dense="true"
              color="primary"
            />
            <q-input
              label="Password"
              filled
              type="password"
              v-model="password"
              required
              :dense="true"
              color="primary"
            />
          </div>

          <div class="login-actions q-mt-xl">
            <q-btn
              no-caps
              rounded
              type="submit"
              color="primary"
              :disabled="loading"
              unelevated
              size="md"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </q-btn>
          </div>
        </form>

        <div class="text-center q-mt-md">
          <router-link to="/signup" class="text-primary">
            Don't have an account? Sign up here.
          </router-link>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
// import { useRouter } from 'vue-router' // If you are using Vue Router
import { useQuasar } from 'quasar'
const email = ref('')
const password = ref('')
const loading = ref(false)
const $q = useQuasar()
// const router = useRouter() // If you are using Vue Router
const darkMode = computed(() => {
  return $q.dark.mode
})
const login = async () => {
  loading.value = true

  // 1. Use Supabase client to authenticate the user
  //    (replace with your actual Supabase authentication logic)
  // const { error } = await this.$supabase.auth.signInWithPassword({
  //   email: email.value,
  //   password: password.value,
  // })

  // 2. Handle the authentication response
  // if (error) {
  //   // Show error message to the user (e.g., using Quasar's Notify plugin)
  //   console.error('Authentication error:', error)
  // } else {
  //   // Redirect to the main journal page
  //   // router.push('/journal') // If you are using Vue Router
  // }

  loading.value = false
}

watch($q.dark.isActive, (newValue) => {
  darkMode.value = newValue
})
</script>

<style lang="scss" scoped>
.login-card {
  width: 300px; // Adjust the width as needed
}

.container {
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-actions {
  display: flex;
  justify-content: flex-end;
}

.sticky-top {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 8;
}
</style>
