<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Navbar from '$lib/components/Navbar.svelte';
  import SplashScreen from '$lib/components/SplashScreen.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  import { onNavigate } from '$app/navigation';

  let { children } = $props();

  // Trigger the Native Browser View Transitions for a butter-smooth crossfade!
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col relative">
  <SplashScreen />
  <Navbar />

  <main class="flex-grow">
    {@render children()}
  </main>

  <Footer />
</div>