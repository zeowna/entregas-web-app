<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'
import { onMounted } from 'vue'
import AppLogo from '@/layout/AppLogo.vue'
import { useSignIn } from '@/composables'
import FieldError from '@/components/FieldError.vue'

const { layoutConfig, changeThemeSettings } = useLayout()

const { signIn, forgotPassword, disableSubmitButton, v$ } = useSignIn()

const onChangeTheme = (theme: string, mode: string) => {
  const elementId = 'theme-css'
  const linkElement = document.getElementById(elementId)

  if (linkElement) {
    const cloneLinkElement = linkElement.cloneNode(true) as Element
    const newThemeUrl = linkElement.getAttribute('href')!.replace(layoutConfig.theme.value, theme)
    cloneLinkElement!.setAttribute('id', elementId + '-clone')
    cloneLinkElement!.setAttribute('href', newThemeUrl)
    cloneLinkElement!.addEventListener('load', () => {
      linkElement!.remove()
      cloneLinkElement!.setAttribute('id', elementId)
      changeThemeSettings(theme, mode === 'dark')
    })
    linkElement.parentNode!.insertBefore(cloneLinkElement, linkElement!.nextSibling)
  }
}

onMounted(() => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (isDark) {
    onChangeTheme('md-dark-indigo', 'dark')
  } else {
    onChangeTheme('md-light-indigo', 'light')
  }
})
</script>

<template>
  <div
    class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <form @submit.prevent="signIn">
      <div class="flex flex-column align-items-center justify-content-center">
        <div>
          <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
            <div class="text-center mb-5">
              <div class="text-900 text-3xl font-medium mb-3">
                <AppLogo />
              </div>
            </div>

            <div>
              <label for="email1" class="block text-900 font-medium text-xl mb-2">E-mail</label>
              <InputText
                id="email1"
                type="text"
                placeholder="Insira seu E-mail"
                class="w-full md:w-30rem mb-3"
                style="padding: 1rem"
                :class="v$.email.$error ? 'p-invalid' : ''"
                v-model="v$.email.$model"
              />
              <br />
              <FieldError :errors="v$.email.$errors" />

              <label for="password1" class="block text-900 font-medium text-xl mt-3 mb-2"
                >Senha</label
              >
              <InputText
                id="password1"
                v-model="v$.password.$model"
                placeholder="Insira sua Senha"
                :toggleMask="true"
                class="w-full mb-3 w-full padding:1rem"
                :class="v$.password.$error ? 'p-invalid' : ''"
                type="password"
              />
              <br />
              <FieldError :errors="v$.password.$errors" />
              <br />

              <div class="flex align-items-center justify-content-between mb-5 gap-5">
                <div class="flex align-items-center"></div>
                <a
                  class="font-medium no-underline ml-2 text-right cursor-pointer"
                  style="color: var(--primary-color)"
                  @click="forgotPassword"
                >
                  Esqueceu a Senha?
                </a>
              </div>
              <Button
                label="Entrar"
                type="submit"
                class="w-full p-3 text-xl"
                :disabled="disableSubmitButton"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
  <Toast position="top-center" />
</template>

<style scoped>
small {
  color: #d32f2f;
}
</style>
