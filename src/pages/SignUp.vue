<template>
  <div class="flex flex-center">
    <q-toggle
      v-model="darkMode"
      @update:model-value="$q.dark.toggle"
      checked-icon="sym_o_dark_mode"
      unchecked-icon="sym_o_light_mode"
      color="accent"
      class="dark-mode-toggle sticky-top"
    />
    <q-card class="login-card" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h4 text-weight-bold q-mb-md">Welcome to Log Life</div>
        <div class="text-subtitle1">Sign Up to access your personal journal.</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <form @submit.prevent="signUp">
          <div class="q-gutter-md">
            <q-input :dense="true" label="Email" filled type="email" v-model="email" required />
            <q-input
              :dense="true"
              label="Password"
              filled
              type="password"
              v-model="password"
              required
            />
            <q-input
              :dense="true"
              label="Confirm Password"
              filled
              type="password"
              v-model="confirmPassword"
              required
            />
          </div>

          <div class="signup-actions q-mt-lg">
            <q-btn rounded type="submit" size="md" color="primary" :disabled="loading" unelevated>
              {{ loading ? 'Signing Up...' : 'Sign Up' }}
            </q-btn>
          </div>
        </form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
// import { useRouter } from 'vue-router' // If you are using Vue Router
import { useQuasar } from 'quasar'
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const $q = useQuasar()
// const router = useRouter() // If you are using Vue Router

const darkMode = computed(() => {
  return $q.dark.mode
})

const signUp = async () => {
  if (password.value !== confirmPassword.value) {
    // Show error message: Passwords don't match
    console.error('Passwords do not match')
    return
  }

  loading.value = true

  // 1. Use Supabase client to create a new user
  //    (replace with your actual Supabase authentication logic)
  // const { error } = await this.$supabase.auth.signUp({
  //   email: email.value,
  //   password: password.value,
  // })

  // 2. Handle the authentication response
  // if (error) {
  //   // Show error message to the user (e.g., using Quasar's Notify plugin)
  //   console.error('Sign up error:', error)
  // } else {
  //   // Redirect to the login page or the main journal page
  //   // router.push('/login') // If you are using Vue Router
  // }

  loading.value = false
}

watch($q.dark.isActive, (newValue) => {
  darkMode.value = newValue
})
</script>

<style lang="scss" scoped>
.login-card {
  width: 300px;
}

.signup-actions {
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
