import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

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
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: '/product-categories',
          name: 'product-categories',
          component: () => import('@/views/pages/ProductCategoriesPage.vue')
        },
        {
          path: '/create-product-category',
          name: 'product-category',
          component: () => import('@/views/pages/ProductCategoryPage.vue')
        },
        {
          path: '/edit-product-category/:id',
          name: 'edit-product-category',
          component: () => import('@/views/pages/ProductCategoryPage.vue')
        },
        {
          path: '/products',
          name: 'products',
          component: () => import('@/views/pages/ProductsPage.vue')
        },
        {
          path: '/products/:id',
          name: 'product-detail',
          component: () => import('@/views/pages/ProductPage.vue')
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('@/views/pages/OrdersPage.vue')
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/views/pages/OrderPage.vue')
        },
        {
          path: '/users',
          name: 'users',
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
      path: '/auth/login',
      name: 'login',
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

export default router
