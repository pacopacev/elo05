<!-- frontend/src/components/MenuItem.vue -->
<template>
  <template v-if="menuItem.children && menuItem.children.length > 0">
    <el-sub-menu :index="menuItem.route || menuItem.id.toString()">
      <template #title>
        <el-icon v-if="menuItem.icon">
          <component :is="menuItem.icon" />
        </el-icon>
        <span>{{ menuItem.title }}</span>
      </template>
      <menu-item
        v-for="child in menuItem.children"
        :key="child.id"
        :menu-item="child"
      />
    </el-sub-menu>
  </template>
  <template v-else>
    <el-menu-item :index="menuItem.route || menuItem.id.toString()" :route="menuItem.route">
      <el-icon v-if="menuItem.icon">
        <component :is="menuItem.icon" />
      </el-icon>
      <span>{{ menuItem.title }}</span>
    </el-menu-item>
  </template>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    menuItem: {
      type: Object,
      required: true
    }
  }
}
</script>