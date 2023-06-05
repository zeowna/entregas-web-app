<script lang="ts" setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Pedidos',
        items: [{ label: 'Listar Pedidos', icon: 'pi pi-money-bill', to: '/orders' }]
    },
    {
        label: 'Usuários',
        items: [{ label: 'Listar Usuarios', icon: 'pi pi-user', to: '/users' }]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
