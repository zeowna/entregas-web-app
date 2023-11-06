import { ref } from 'vue'
import { AdminUser, FindEntitiesPaging, FindEntitiesResponse } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent } from 'primevue/datatable'
import router from '@/router'
import { useRoute } from 'vue-router'

export const useListAdminUsers = () => {
  const route = useRoute()
  const limit = 25

  const data = ref<FindEntitiesResponse<AdminUser>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const isLoading = ref(false)

  const findAdminUsers = async (params: FindEntitiesPaging = { limit }) => {
    isLoading.value = true
    data.value = await Api.admin.users.find(params)
    isLoading.value = false
  }

  const onPage = async (e: DataTablePageEvent) => {
    await findAdminUsers({
      skip: data.value.limit * e.page,
      limit
    })
  }

  const goToAdminUser = async (id?: number) => {
    if (id) {
      await router.push({
        name: 'edit-admin-user',
        params: { id }
      })

      return
    }

    await router.push({
      name: 'create-admin-user'
    })
  }

  return {
    data,
    isLoading,
    findAdminUsers,
    onPage,
    goToAdminUser
  }
}
