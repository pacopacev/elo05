<template>
    <div class="home">

        <el-card style="max-width: 480px">
            <template #header><strong>Welcome to MIMS</strong></template>
            <img src="@/assets/logo.png" alt="Logo" class="logo"/>
            <hr>
            <div class="links">
                <el-button type="info" size="large" @click="visible = true">
                    <router-link to="/login" style="color: inherit; text-decoration: none;">Login</router-link>
                </el-button>
                <el-button type="info" size="large" @click="visible = true">
                    <router-link to="/register" style="color: inherit; text-decoration: none;">Register</router-link>
                </el-button>
            </div>
        </el-card>


        <div>
            <div ref="graphContainer" style="width: 100%; height: 600px;"></div>
        </div>


    </div>
</template>

<script>
    export default {
      name: 'HomePage'
    }
</script>

<style scoped>
    .home {
    display: flex;
      justify-content: center; /* Horizontal center */
      align-items: center;     /* Vertical center (if needed) */
      text-align: center;      /* Fallback for text */

    }



    h1 {
      color: #2c3e50;
      margin-bottom: 2rem;
    }

    .links {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .nav-link {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      text-decoration: none;
      color: #42b983;
      font-weight: bold;
      border: 2px solid #42b983;
      border-radius: 5px;
      transition: all 0.3s ease;
      width: 200px;
      text-align: center;
    }

    .nav-link:hover {
      background-color: #42b983;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .logo {
  width: 320px;
  height: auto;
}

    @media (min-width: 768px) {
      .links {
        flex-direction: row;
        justify-content: center;
      }
    }
</style>

