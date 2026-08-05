<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Navbar from '$lib/components/Navbar.svelte';
  import SplashScreen from '$lib/components/SplashScreen.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  import { onNavigate } from '$app/navigation';
  import { fade } from 'svelte/transition';
  
  import { onMount } from 'svelte';
  import Lenis from 'lenis';
  import { page } from '$app/stores';

  let { children } = $props();
  let scrollY = $state(0);

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  onMount(() => {
    const lenis = new Lenis({
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  });
  
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="canonical" href="https://jaxstreetcre.com{$page.url.pathname}" />
  
  {@html `<script type="application/ld+json">${JSON.stringify({
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
  })}</script>`}
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
      class="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[90] bg-teal-600/90 hover:bg-teal-500 text-white p-3 md:p-4 rounded-full shadow-2xl backdrop-blur-sm transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      aria-label="Back to top"
    >
      <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"></path></svg>
    </button>
  {/if}
</div>