import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Define the API base URL
const API_URL = 'https://your-api-url.com/api/items';

export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  createdAt: Date;
}

// Dummy data to use as fallback
const dummyItems: Item[] = [
  {
    id: 1,
    name: 'Laptop',
    description: 'High-performance laptop for developers',
    category: 'Electronics',
    price: 1299.99,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 2,
    name: 'Smartphone',
    description: 'Latest model with advanced camera',
    category: 'Electronics',
    price: 899.99,
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 3,
    name: 'Desk Chair',
    description: 'Ergonomic chair for home office',
    category: 'Furniture',
    price: 249.99,
    createdAt: new Date('2023-03-10'),
  },
  {
    id: 4,
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with built-in grinder',
    category: 'Kitchen',
    price: 129.99,
    createdAt: new Date('2023-04-05'),
  },
  {
    id: 5,
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones',
    category: 'Electronics',
    price: 199.99,
    createdAt: new Date('2023-05-12'),
  },
];

export const useItemStore = defineStore('items', () => {

  const items = ref<Item[]>([]);
  const loading = ref(false);
  const error: any = ref(null);
  const isUsingDummyData = ref(false);
  const nextId = ref(6);
  const getItemById = computed(() => {
    return (id: number) => items.value.find(item => item.id === id);
  });

  const getItemsByCategory = computed(() => {
    return (category: string) => items.value.filter(item => item.category === category);
  });

  async function fetchItems() {
    loading.value = true;
    error.value = null;
    isUsingDummyData.value = false;

    try {
      const response = await axios.get(API_URL);
      items.value = response.data;

      if (items.value.length > 0) {
        const maxId = Math.max(...items.value.map(item => item.id));
        nextId.value = maxId + 1;
      }

      console.log('Successfully fetched data from API');
    } catch (err) {
      console.error('Failed to fetch from API, using dummy data instead', err);
      error.value = 'Failed to fetch items from API, using local data instead';
      items.value = [...dummyItems];
      isUsingDummyData.value = true;
    } finally {
      loading.value = false;
    }
  }

  async function fetchItemById(id: number) {
    loading.value = true;
    error.value = null;

    try {
      if (isUsingDummyData.value) {
        const item = dummyItems.find(item => item.id === id);
        loading.value = false;
        return item || null;
      }

      const response = await axios.get(`${API_URL}/${id}`);
      loading.value = false;
      return response.data;
    } catch (err) {
      error.value = 'Failed to fetch item';
      console.error(err);

      const item = dummyItems.find(item => item.id === id);
      loading.value = false;
      return item || null;
    }
  }

  async function addItem(item: Omit<Item, 'id' | 'createdAt'>) {
    loading.value = true;
    error.value = null;

    const newItem: Item = {
      id: nextId.value++,
      ...item,
      createdAt: new Date(),
    };

    try {
      if (isUsingDummyData.value) {
        items.value.push(newItem);
        loading.value = false;
        return newItem;
      }

      const response = await axios.post(API_URL, item);
      const apiItem = response.data;
      items.value.push(apiItem);

      if (apiItem.id >= nextId.value) {
        nextId.value = apiItem.id + 1;
      }

      loading.value = false;
      return apiItem;
    } catch (err) {
      error.value = 'Failed to add item to API, added locally instead';
      console.error(err);

      items.value.push(newItem);
      isUsingDummyData.value = true;
      loading.value = false;
      return newItem;
    }
  }

  async function updateItem(id: number, updates: Partial<Omit<Item, 'id' | 'createdAt'>>) {
    loading.value = true;
    error.value = null;

    try {
      if (isUsingDummyData.value) {
        const index = items.value.findIndex(item => item.id === id);
        if (index !== -1) {
          items.value[index] = { ...items.value[index], ...updates };
          loading.value = false;
          return items.value[index];
        }
        loading.value = false;
        return null;
      }

      const response = await axios.put(`${API_URL}/${id}`, updates);
      const updatedItem = response.data;

      const index = items.value.findIndex(item => item.id === id);
      if (index !== -1) {
        items.value[index] = updatedItem;
      }

      loading.value = false;
      return updatedItem;
    } catch (err) {
      error.value = 'Failed to update item on API, updated locally instead';
      console.error(err);

      const index = items.value.findIndex(item => item.id === id);
      if (index !== -1) {
        items.value[index] = { ...items.value[index], ...updates };
        isUsingDummyData.value = true;
        loading.value = false;
        return items.value[index];
      }

      loading.value = false;
      return null;
    }
  }

  async function deleteItem(id: number) {
    loading.value = true;
    error.value = null;

    try {
      if (isUsingDummyData.value) {
        const index = items.value.findIndex(item => item.id === id);
        if (index !== -1) {
          const deletedItem = items.value[index];
          items.value.splice(index, 1);
          loading.value = false;
          return deletedItem;
        }
        loading.value = false;
        return null;
      }

      await axios.delete(`${API_URL}/${id}`);

      const index = items.value.findIndex(item => item.id === id);
      if (index !== -1) {
        const deletedItem = items.value[index];
        items.value.splice(index, 1);
        loading.value = false;
        return deletedItem;
      }

      loading.value = false;
      return null;
    } catch (err) {
      error.value = 'Failed to delete item from API, deleted locally instead';
      console.error(err);

      const index = items.value.findIndex(item => item.id === id);
      if (index !== -1) {
        const deletedItem = items.value[index];
        items.value.splice(index, 1);
        isUsingDummyData.value = true;
        loading.value = false;
        return deletedItem;
      }

      loading.value = false;
      return null;
    }
  }
  function initializeStore() {
    fetchItems();
  }

  return {
    items,
    loading,
    error,
    isUsingDummyData,
    getItemById,
    getItemsByCategory,
    fetchItems,
    fetchItemById,
    addItem,
    updateItem,
    deleteItem,
    initializeStore
  };
});