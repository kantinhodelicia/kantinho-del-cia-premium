import { Product, Category, DeliveryZone, User, SaleRecord, AppSettings } from './types';

// Absolute URL required for Android APK (file:// origin)
const API_URL = 'https://painel.djuntemon.com/api';

export const api = {
    // Categories
    getCategories: () => fetch(`${API_URL}/categories`).then(res => res.json()),
    addCategory: (category: { id: string; name: string }) =>
        fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        }).then(res => res.json()),

    // Products
    getProducts: () => fetch(`${API_URL}/products`).then(res => res.json()),
    addProduct: (product: Product) =>
        fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        }).then(res => res.json()),
    updateProduct: (id: string, updates: Partial<Product>) =>
        fetch(`${API_URL}/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        }).then(res => res.json()),

    // Zones
    getZones: () => fetch(`${API_URL}/zones`).then(res => res.json()),
    addZone: (zone: DeliveryZone) =>
        fetch(`${API_URL}/zones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(zone)
        }).then(res => res.json()),

    // Orders
    getOrders: () => fetch(`${API_URL}/orders`).then(res => res.json()),
    createOrder: (order: SaleRecord) =>
        fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        }).then(res => res.json()),
    updateOrderStatus: (id: string, status: string) =>
        fetch(`${API_URL}/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        }).then(res => res.json()),

    // Users
    getUser: (phone: string) => fetch(`${API_URL}/users/${phone}`).then(res => res.json()),
    saveUser: (user: User) =>
        fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(res => res.json()),

    // Settings
    getSettings: () => fetch(`${API_URL}/settings?t=${Date.now()}`).then(res => res.json()),
    updateSetting: (key: string, value: string) =>
        fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value })
        }).then(res => res.json()),
};
