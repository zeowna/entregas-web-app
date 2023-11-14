import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'
import { store } from '@/store'
import { ActionTypes } from '@/store/actions'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          meta: { requiresAuth: true },
          redirect(to) {
            return { name: 'my-data', params: to.params, query: to.query }
          }
        },
        {
          path: '/my-data',
          name: 'my-data',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/MyDataPage.vue')
        },
        {
          path: '/admin/users',
          name: 'list-admin-users',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/AdminUsersPage.vue')
        },
        {
          path: '/admin/users/create',
          name: 'create-admin-user',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/AdminUserPage.vue')
        },
        {
          path: '/admin/users/update/:id',
          name: 'edit-admin-user',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/AdminUserPage.vue')
        },

        {
          path: '/product-categories',
          name: 'list-product-categories',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductCategoriesPage.vue')
        },
        {
          path: '/product-category/update/:id',
          name: 'edit-product-category',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductCategoryPage.vue')
        },
        {
          path: '/product-categories/create',
          name: 'create-product-category',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductCategoryPage.vue')
        },
        {
          path: '/products',
          name: 'list-products',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductsPage.vue')
        },
        {
          path: '/products/create',
          name: 'create-product',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductPage.vue')
        },
        {
          path: '/products/update/:id',
          name: 'edit-product',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductPage.vue')
        },
        {
          path: '/partners',
          name: 'list-partners',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/PartnersPage.vue')
        },
        {
          path: '/partners/create',
          name: 'create-partner',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/PartnerPage.vue')
        },
        {
          path: '/partners/update/:id',
          name: 'edit-partner',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/PartnerPage.vue')
        },
        {
          path: '/partners/:partnerId/users',
          name: 'list-partner-users',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/PartnerUsersPage.vue')
        },
        {
          path: '/partners/:partnerId/users/create',
          name: 'create-partner-user',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/PartnerUserPage.vue')
        },
        {
          path: '/partners/:partnerId/users/update/:id',
          name: 'edit-partner-user',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/PartnerUserPage.vue')
        },
        {
          path: '/orders',
          name: 'orders',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/OrdersPage.vue')
        },
        {
          path: '/order',
          name: 'order',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/OrderPage.vue')
        },
        {
          path: '/users',
          name: 'users',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/OrderPage.vue')
        }
      ]
    },
    {
      path: '/pages/notfound',
      name: 'notfound',
      component: () => import('@/views/pages/NotFound.vue')
    },

    {
      path: '/auth/signIn',
      name: 'signIn',
      component: () => import('@/views/pages/auth/SigninPage.vue')
    },
    {
      path: '/auth/access',
      name: 'accessDenied',
      component: () => import('@/views/pages/auth/Access.vue')
    },
    {
      path: '/auth/error',
      name: 'error',
      component: () => import('@/views/pages/auth/Error.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  try {
    await store.dispatch(ActionTypes.REFRESH_TOKEN)

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (store.getters.getUser) {
        next()
        return
      }
    }

    if (to.name !== 'signIn') {
      next({ name: 'signIn' })
      return
    }

    next()
  } catch (err) {
    console.error(err)
    next({ name: 'signIn' })
  }
})

export default router
