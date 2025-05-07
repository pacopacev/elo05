<template>

    <div class="home">

        <el-card style="max-width: 480px">
            <template #header><strong>Register to MIMS</strong></template>
            <img src="@/assets/logo.png" alt="Logo" style="width: 90%"/>
            <hr>
            <el-form label-width="auto">
                <el-form-item label="Username">
                    <el-input v-model="username" placeholder="Enter username" required/>
                    <span class="error-text" v-if="!username && submitted">Username is required</span>
                </el-form-item>
                <el-form-item label="Email">
                    <el-input v-model="email" placeholder="Enter email" required/>
                    <span class="error-text" v-if="!email && submitted">Email is required</span>
                </el-form-item>
                <el-form-item label="Password">
                    <el-input v-model="password" placeholder="Enter password" required minlength="6"/>
                    <span class="error-text" v-if="password.length > 0 && password.length < 6 && submitted">
             Password must be at least 6 characters
           </span>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click.prevent="handleRegister" :disabled="isLoading">
                        <span v-if="isLoading">Registering...</span>
                        <span v-else>Register</span></el-button>

                    <el-button @click="handleHome">
                        <router-link to="/">Back to Home</router-link>
                    </el-button>
                </el-form-item>

            </el-form>
            <hr>
            <p class="mt-md">
                Already have an account?
                <router-link to="/login">Login</router-link>
            </p>


        </el-card>
    </div>


</template>


<script>


    import { mapActions } from 'vuex'
    import { useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'

    const router = useRouter()


    export default {
      data() {
        return {
          username: '',
          email: '',
          password: '',
          error: '',
          isLoading: false,
          submitted: false
        }
      },
      methods: {
        ...mapActions('auth', ['register']),
        async handleRegister() {

          this.submitted = true

          // Basic validation
          if (!this.username || !this.email || this.password.length < 6) {
            return
          }

          this.isLoading = true
          this.error = ''
          try {
            await this.register({
              username: this.username,
              email: this.email,
              password: this.password
            })
            this.$router.push('/dashboard')
          } catch (error) {
            this.error = error.response?.data?.message || 'Registration failed, please try again'
          } finally {
            this.isLoading = false
          }
        }
      }
    }


</script>

<style scoped>

    .home {
            display: flex;
            justify-content: center; /* Horizontal center */
            align-items: center;     /* Vertical center (if needed) */
            text-align: center;      /* Fallback for text */
            padding-top: 10rem
          }
  .form-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }

  .pa-md {
    padding: 20px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .gutter-md {
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
  }

  .form-input:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }

  .error-text {
    color: #ff5252;
    font-size: 0.875rem;
  }

  .error-message {
    padding: 0.75rem;
    background-color: #ffebee;
    color: #d32f2f;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dismiss-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #d32f2f;
  }

  .submit-button {
    padding: 0.75rem;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
  }

  .submit-button:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }

  .mt-md {
    margin-top: 1rem;
  }

  .mb-md {
    margin-bottom: 1rem;
  }

  a {
    color: #1976d2;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>