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
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: '/product-categories',
          name: 'product-categories',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductCategoriesPage.vue')
        },
        {
          path: '/create-product-category',
          name: 'product-category',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductCategoryPage.vue')
        },
        {
          path: '/edit-product-category/:id',
          name: 'edit-product-category',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductCategoryPage.vue')
        },
        {
          path: '/products',
          name: 'products',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductsPage.vue')
        },
        {
          path: '/products/:id',
          name: 'product-detail',
          meta: { requiresAuth: true },
          component: () => import('@/views/pages/ProductPage.vue')
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
})

export default router
