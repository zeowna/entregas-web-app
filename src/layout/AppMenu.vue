<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@/store'
import { PartnerUser, UserTypes } from '@/services/api/types'
import AppMenuItem from '@/layout/AppMenuItem.vue'

const user = computed(() => store.getters.getUser)

const adminMenu = [
  {
    label: 'Admin',
    items: [{ label: 'Listar Usuários Admin', icon: 'pi pi-user', to: '/admin/users' }]
  },
  { separator: true },
  {
    label: 'Produtos',
    items: [
      { label: 'Listar Categorias/Tamanhos', icon: 'pi pi-hashtag', to: '/product-categories' },
      { label: 'Listar Produtos', icon: 'pi pi-tags', to: '/products' }
    ]
  },
  { separator: true },
  {
    label: 'Parceiros',
    items: [{ label: 'Listar Parceiros', icon: 'pi pi-shopping-bag', to: '/partners' }]
  }
]

const partnerMenu = [
  {
    label: 'Usuários',
    items: [
      {
        label: 'Listar Usuarios',
        icon: 'pi pi-user',
        to: `/partners/${(user.value as PartnerUser).partner?.id}/users`
      }
    ]
  },
  { separator: true },
  {
    label: 'Estoque',
    items: [
      {
        label: 'Listar Produtos',
        icon: 'pi pi-tags',
        to: `/partners/${(user.value as PartnerUser).partner?.id}/products`
      }
    ]
  },
  { separator: true },
  {
    label: 'Pedidos',
    items: [
      {
        label: 'Listar Pedidos',
        icon: 'pi pi-shopping-cart',
        to: `/partners/${(user.value as PartnerUser).partner?.id}/orders`
      }
    ]
  }
]

const menu = computed(() => {
  switch (user.value?.type) {
    case UserTypes.Admin:
      return adminMenu
    case UserTypes.Partner:
      return partnerMenu
    default:
      return []
  }
})
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menu" :key="item">
      <AppMenuItem v-if="!item.separator" :item="item" :index="i"></AppMenuItem>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
