<template>
  <div class="layout-wrapper" :class="containerClass">
    <app-topbar></app-topbar>
    <div class="layout-sidebar">
      <app-sidebar></app-sidebar>
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <app-footer></app-footer>
    </div>
    <div class="layout-mask"></div>
  </div>
  <Toast position="top-center" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AppTopbar from './AppTopbar.vue'
import AppFooter from './AppFooter.vue'
import AppSidebar from './AppSidebar.vue'
import { useLayout } from '@/layout/composables/layout'

const { layoutConfig, layoutState, isSidebarActive, changeThemeSettings } = useLayout()

const outsideClickListener = ref(null)

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener()
  } else {
    unbindOutsideClickListener()
  }
})

const onChangeTheme = (theme, mode) => {
  const elementId = 'theme-css'
  const linkElement = document.getElementById(elementId)
  const cloneLinkElement = linkElement.cloneNode(true)
  const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, theme)
  cloneLinkElement.setAttribute('id', elementId + '-clone')
  cloneLinkElement.setAttribute('href', newThemeUrl)
  cloneLinkElement.addEventListener('load', () => {
    linkElement.remove()
    cloneLinkElement.setAttribute('id', elementId)
    changeThemeSettings(theme, mode === 'dark')
  })
  linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling)
}

onMounted(() => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (isDark) {
    onChangeTheme('md-dark-indigo', 'dark')
  } else {
    onChangeTheme('md-light-indigo', 'light')
  }
})

const containerClass = computed(() => {
  return {
    'layout-theme-light': layoutConfig.darkTheme.value === 'light',
    'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
    'layout-overlay': layoutConfig.menuMode.value === 'overlay',
    'layout-static': layoutConfig.menuMode.value === 'static',
    'layout-static-inactive':
      layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive.value,
    'layout-mobile-active': layoutState.staticMenuMobileActive.value,
    'p-input-filled': layoutConfig.inputStyle.value === 'filled',
    'p-ripple-disabled': !layoutConfig.ripple.value
  }
})
const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive.value = false
        layoutState.staticMenuMobileActive.value = false
        layoutState.menuHoverActive.value = false
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
const isOutsideClicked = (event) => {
  const sidebarEl = document.querySelector('.layout-sidebar')
  const topbarEl = document.querySelector('.layout-menu-button')

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  )
}
</script>

<style lang="scss" scoped></style>
