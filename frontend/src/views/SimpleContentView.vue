<template>
  <div class="simple-content">
    <h2>Welcome to Your Dashboard</h2>
    <el-divider />

    <div class="content-card">
      <el-card shadow="hover">
        <p>This is your simple content loaded from a separate file.</p>
        <p>You can add any components or content here.</p>

        <el-button type="primary" @click="showMessage">
          Click Me
        </el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    showMessage() {
      this.$message.success('Button clicked!')
    }
  }
}
</script>

<style scoped>
.simple-content {
  padding: 20px;
}
.content-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>