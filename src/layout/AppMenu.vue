<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@/store'
import { UserTypes } from '@/services/api/types'
import AppMenuItem from '@/layout/AppMenuItem.vue'

const user = computed(() => store.getters.getUser)

const adminMenu = [
  {
    label: 'Produtos',
    items: [
      { label: 'Listar Categorias', icon: 'pi pi-hashtag', to: '/product-categories' },
      { label: 'Listar Produtos', icon: 'pi pi-tags', to: '/products' }
    ]
  },
  { separator: true },
  {
    label: 'Parceiros',
    items: [{ label: 'Listar Parceiros', icon: 'pi pi-shopping-bag', to: '/products' }]
  },
  { separator: true },
  {
    label: 'Solicitações',
    items: [{ label: 'Listar Solicitações', icon: 'pi pi-check-square', to: '/product-requests' }]
  }
]

const partnerManu = [
  {
    label: 'Pedidos',
    items: [{ label: 'Listar Pedidos', icon: 'pi pi-shopping-cart', to: '/orders' }]
  },
  { separator: true },
  {
    label: 'Usuários',
    items: [{ label: 'Listar Usuarios', icon: 'pi pi-user', to: '/users' }]
  }
]

const model = computed(() => {
  if (user.value?.type) {
    return user.value.type === UserTypes.Admin ? adminMenu : partnerManu
  }

  return []
})
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <AppMenuItem v-if="!item.separator" :item="item" :index="i"></AppMenuItem>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
