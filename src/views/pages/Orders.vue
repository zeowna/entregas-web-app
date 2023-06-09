<script lang="ts" setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { onBeforeMount, ref } from 'vue';

const customers = ref([]);
const filters = ref({});
const loading = ref(false);
const products = ref(null);
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = ref([
  { name: 'Amy Elsner', image: 'amyelsner.png' },
  { name: 'Anna Fali', image: 'annafali.png' },
  { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
  { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
  { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
  { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
  { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
  { name: 'Onyama Limba', image: 'onyamalimba.png' },
  { name: 'Stephen Shaw', image: 'stephenshaw.png' },
  { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const customerService = new CustomerService();
const productService = new ProductService();

onBeforeMount(async () => {
  productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
  const data = await customerService.getCustomersLarge()
  customers.value = data;
  loading.value = false;
  customers.value.forEach((customer) => (customer.date = new Date(customer.date)));
  
  initFilters();
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'country.name': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
  };
};

const clearFilter = () => {
  initFilters();
};
const formatCurrency = (value: string) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (value: Date) => {
  return value.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Pedidos</h5>
        <DataTable
            :value="customers"
            :paginator="true"
            class="p-datatable-gridlines"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            v-model:filters="filters"
            filterDisplay="menu"
            :loading="loading"
            :filters="filters"
            responsiveLayout="scroll"
            :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
        >
          <template #header>
            <div class="flex justify-content-between flex-column sm:flex-row">
              <Button type="button" icon="pi pi-filter-slash" label="Limpar" class="p-button-outlined mb-2"
                      @click="clearFilter()"/>
              <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search"/>
                                <InputText v-model="filters['global'].value" placeholder="Buscar por Palavra-Chave"
                                           style="width: 100%"/>
                            </span>
            </div>
          </template>
          <template #empty>Nenhum pedido encontrado.</template>
          <template #loading> Loading customers data. Please wait.</template>
          <Column field="name" header="Nome" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.name }}
            </template>
            <template #filter="{ filterModel }">
              <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por Nome"/>
            </template>
          </Column>
          <Column header="País" filterField="country.name" style="min-width: 12rem">
            <template #body="{ data }">
              <img src="/demo/images/flag/flag_placeholder.png" :alt="data.country.name"
                   :class="'flag flag-' + data.country.code" width="30"/>
              <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.country.name }}</span>
            </template>
            <template #filter="{ filterModel }">
              <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                         placeholder="Buscar por País"/>
            </template>
            <template #filterclear="{ filterCallback }">
              <Button type="button" icon="pi pi-times" @click="filterCallback()" class="p-button-secondary"></Button>
            </template>
            <template #filterapply="{ filterCallback }">
              <Button type="button" icon="pi pi-check" @click="filterCallback()" class="p-button-success"></Button>
            </template>
          </Column>
          <Column header="Agente" filterField="representative" :showFilterMatchModes="false"
                  :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
            <template #body="{ data }">
              <img :alt="data.representative.name" :src="'demo/images/avatar/' + data.representative.image" width="32"
                   style="vertical-align: middle"/>
              <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                  data.representative.name
                }}</span>
            </template>
            <template #filter="{ filterModel }">
              <div class="mb-3 text-bold">Agent Picker</div>
              <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any"
                           class="p-column-filter">
                <template #option="slotProps">
                  <div class="p-multiselect-representative-option">
                    <img :alt="slotProps.option.name" :src="'demo/images/avatar/' + slotProps.option.image" width="32"
                         style="vertical-align: middle"/>
                    <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                        slotProps.option.name
                      }}</span>
                  </div>
                </template>
              </MultiSelect>
            </template>
          </Column>
          <Column header="Data" filterField="date" dataType="date" style="min-width: 10rem">
            <template #body="{ data }">
              {{ formatDate(data.date) }}
            </template>
            <template #filter="{ filterModel }">
              <Calendar v-model="filterModel.value" dateFormat="dd/mm/yyyy" placeholder="dd/mm/aaaa"/>
            </template>
          </Column>
          <Column header="Saldo" filterField="balance" dataType="numeric" style="min-width: 10rem">
            <template #body="{ data }">
              {{ formatCurrency(data.balance) }}
            </template>
            <template #filter="{ filterModel }">
              <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US"/>
            </template>
          </Column>
          <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
            <template #body="{ data }">
              <span :class="'customer-badge status-' + data.status">{{ data.status }}</span>
            </template>
            <template #filter="{ filterModel }">
              <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter"
                        :showClear="true">
                <template #value="slotProps">
                  <span :class="'customer-badge status-' + slotProps.value" v-if="slotProps.value">{{
                      slotProps.value
                    }}</span>
                  <span v-else>{{ slotProps.placeholder }}</span>
                </template>
                <template #option="slotProps">
                  <span :class="'customer-badge status-' + slotProps.option">{{ slotProps.option }}</span>
                </template>
              </Dropdown>
            </template>
          </Column>
          <Column field="activity" header="Atividade" :showFilterMatchModes="false" style="min-width: 12rem">
            <template #body="{ data }">
              <ProgressBar :value="data.activity" :showValue="false" style="height: 0.5rem"></ProgressBar>
            </template>
            <template #filter="{ filterModel }">
              <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
              <div class="flex align-items-center justify-content-between px-2">
                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
              </div>
            </template>
          </Column>
          <Column field="verified" header="Verificado" dataType="boolean" bodyClass="text-center"
                  style="min-width: 8rem">
            <template #body="{ data }">
              <i class="pi"
                 :class="{ 'text-green-500 pi-check-circle': data.verified, 'text-pink-500 pi-times-circle': !data.verified }"></i>
            </template>
            <template #filter="{ filterModel }">
              <TriStateCheckbox v-model="filterModel.value"/>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
