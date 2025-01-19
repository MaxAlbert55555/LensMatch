import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue'; // Haupt-App
import ThreeScene from '@/components/ThreeScene.vue'; // ThreeScene-Komponente

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App, // App.vue wird für die Startseite verwendet
  },
  {
    path: '/three-scene',
    name: 'ThreeScene',
    component: ThreeScene, // ThreeScene.vue wird für die URL /three-scene verwendet
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
