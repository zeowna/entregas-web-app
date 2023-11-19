import { ref } from 'vue'
import { AdminUser, FindEntitiesPaging, FindEntitiesResponse } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import router from '@/router'

export const useListAdminUsers = () => {
  const data = ref<FindEntitiesResponse<AdminUser>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const params = ref<FindEntitiesPaging>({
    conditions: {},
    skip: 0,
    limit: 25
  })
  const userName = ref<string | null>()
  const isLoading = ref(false)

  const findAdminUsers = async () => {
    isLoading.value = true
    data.value = await Api.admin.users.find(params.value)
    isLoading.value = false
  }

  const onSort = async (e: DataTableSortEvent) => {
    params.value.sort = {
      [e.sortField as string]: e.sortOrder
    }
    await findAdminUsers()
  }

  const onSearch = async () => {
    params.value.conditions = {
      name: { contains: (userName.value || '').trim() }
    }

    await findAdminUsers()
  }

  const onPage = async (e: DataTablePageEvent) => {
    params.value.skip = data.value.limit * e.page

    await findAdminUsers()
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
    userName,
    isLoading,
    findAdminUsers,
    onSort,
    onSearch,
    onPage,
    goToAdminUser
  }
}
