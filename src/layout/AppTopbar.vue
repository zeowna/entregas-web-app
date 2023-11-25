<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <AppLogo />
    </router-link>

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      @click="onTopBarMenuButton()"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <Button
        v-if="user.type === UserTypes.Partner"
        v-tooltip.bottom="`Ver dados do Parceiro`"
        @click="goToPartner(user.partner.id)"
        :label="user.partner.name"
      />

      <button
        @click="goToMyData"
        class="p-link layout-topbar-button"
        v-tooltip.bottom="'Meus dados'"
      >
        <i class="pi pi-user" v-if="!user.profilePictureURI"></i>
        <img v-if="user.profilePictureURI" :src="user.profilePictureURI" class="profile-picture" />
        <span>Meus dados</span>
      </button>
      <button @click="signOut" class="p-link layout-topbar-button" v-tooltip.bottom="'Sair'">
        <i class="pi pi-power-off"></i>
        <span>Sair</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLayout } from '@/layout/composables/layout'
import { useRouter } from 'vue-router'
import AppLogo from '@/layout/AppLogo.vue'
import { useListPartners, useSignOut } from '@/composables'
import { store } from '@/store'
import { UserTypes } from '@/services/api/types'

const { onMenuToggle } = useLayout()
const { goToPartner } = useListPartners()
const user = computed(() => store.getters.getUser)

const outsideClickListener = ref<any>(null)
const topbarMenuActive = ref(false)
const router = useRouter()

const { signOut } = useSignOut()

onMounted(() => {
  bindOutsideClickListener()
})

onBeforeUnmount(() => {
  unbindOutsideClickListener()
})

const goToMyData = async () => {
  await router.push({ name: 'my-data' })
}

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value
}
const onSettingsClick = () => {
  topbarMenuActive.value = false
  router.push('/documentation')
}
const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value
  }
})

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event: any) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false
      }
    }
    document.addEventListener('click', outsideClickListener.value)
  }
}
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener)
    outsideClickListener.value = null
  }
}
const isOutsideClicked = (event: any) => {
  if (!topbarMenuActive.value) return

  const sidebarEl = document.querySelector('.layout-topbar-menu')
  const topbarEl = document.querySelector('.layout-topbar-menu-button')

  return !(
    sidebarEl!.isSameNode(event.target) ||
    sidebarEl!.contains(event.target) ||
    topbarEl!.isSameNode(event.target) ||
    topbarEl!.contains(event.target)
  )
}
</script>

<style lang="scss" scoped>
.profile-picture {
  border-radius: 50%;
  width: 25px;
}
</style>
