<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Navbar from '$lib/components/Navbar.svelte';
  import SplashScreen from '$lib/components/SplashScreen.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  import { onNavigate } from '$app/navigation';
  import { fade } from 'svelte/transition'; // <-- 1. Import fade for the button

  let { children } = $props();
  let scrollY = $state(0); // <-- 2. Track the user's scroll position

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
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Jax Street CRE",
      "image": "https://jaxstreetcre.com/logo-white.svg",
      "url": "https://jaxstreetcre.com",
      "telephone": "(812) 345-1663",
      "email": "eric@jaxstreetcre.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bloomington",
        "addressRegion": "IN",
        "addressCountry": "US"
      },
      "areaServed": "Indiana",
      "priceRange": "$$"
    })}
  </script>
</svelte:head>

<svelte:window bind:scrollY />

<div class="min-h-screen flex flex-col relative">
  <SplashScreen />
  <Navbar />

  <main class="flex-grow">
    {@render children()}
  </main>

  <Footer />

  {#if scrollY > 800}
    <button
      transition:fade={{ duration: 200 }}
      onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      class="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[90] bg-teal-600/90 hover:bg-teal-500 text-white p-3 md:p-4 rounded-full shadow-2xl backdrop-blur-sm transition-all hover:-translate-y-1"
      aria-label="Back to top"
    >
      <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"></path></svg>
    </button>
  {/if}
</div>