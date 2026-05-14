<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Navbar from '$lib/components/Navbar.svelte'; // <-- Bring in the Navbar
  import SplashScreen from '$lib/components/SplashScreen.svelte'; // <-- Import it here
  import Footer from '$lib/components/Footer.svelte'; // <-- Import the Footer component

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col relative">
  <SplashScreen /> <!-- <-- Add the SplashScreen component here -->
  <Navbar />

  <main class="flex-grow">
    {@render children()}
  </main>

  <Footer /> <!-- <-- Add the Footer component here -->
</div>