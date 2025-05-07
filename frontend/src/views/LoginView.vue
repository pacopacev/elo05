<template>
    <div class="home">
        <el-card style="max-width: 480px">
            <template #header><strong>Login in MIMS</strong></template>
            <img src="@/assets/logo.png" alt="Logo" style="width: 90%"/>
            <hr>
            <el-form label-width="auto">
                <el-form-item label="Username">
                    <el-input v-model="username" placeholder="Enter your username"/>
                </el-form-item>

                <el-form-item label="Password">
                    <el-input v-model="password" type="password" show-password placeholder="Enter your password"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.prevent="handleLogin">
                        <span v-if="isLoading">Logging in...</span>
                        <span v-else>Login</span></el-button>
                    <el-button @click="handleHome">Back to Home</el-button>
                </el-form-item>
                <p v-if="error" class="error-message text-negative mt-md">{{ error }}</p>
            </el-form>
        </el-card>
    </div>
</template>


<script setup>
    import { ref } from 'vue'
    import axios from 'axios'
    import { useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'

    const username = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const showPassword = ref(false)
    const router = useRouter()

    const handleLogin = async () => {

      isLoading.value = true
      error.value = ''
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
          username: username.value,
          password: password.value,
        })
        localStorage.setItem('token', response.data.token)
        router.push('/dashboard')
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            error.value = 'Invalid credentials'
          } else {
            error.value = 'An error occurred, please try again later.'
          }
        } else {
          error.value = 'Network error, please check your internet connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const handleHome  = () => {
 router.push('/')
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
        padding: 1rem;
        max-width: 400px;
        margin: 0 auto;
      }

      .pa-md {
        padding: 1rem;
      }

      .gutter-md {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-input {
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        width: 100%;
      }

      .password-input {
        position: relative;
      }

      .toggle-password {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
      }

      .submit-button {
        padding: 0.75rem;
        background-color: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        width: 100%;
      }

      .submit-button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }

      .error-message {
        color: #ff5252;
        margin-top: 1rem;
      }

      .text-negative {
        color: #ff5252;
      }

      .mt-md {
        margin-top: 1rem;
      }
</style>

<style>
    .demo-form-inline .el-input {
      --el-input-width: 220px;
    }

    .demo-form-inline .el-select {
      --el-select-width: 220px;
    }
</style>