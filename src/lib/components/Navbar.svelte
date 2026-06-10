<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import InteractiveMap from '$lib/components/InteractiveMap.svelte'; // <-- Add this import

  let scrollY = $state(0);
  let isDrawerOpen = $state(false);
  let isMobileMenuOpen = $state(false);
  
  // --- SEARCH STATE ---
  let isSearchOpen = $state(false);
  let searchQuery = $state('');

  let searchResults = $derived.by(() => {
      if (!searchQuery.trim()) return [];
      const query = searchQuery.toLowerCase();
      
      return ($page.data.allProperties || []).filter((p: any) => {
          const matchTitle = (p.title || '').toLowerCase().includes(query);
          const matchLocation = (p.location || '').toLowerCase().includes(query);
          const matchStatus = (p.status || '').toLowerCase().includes(query);
          const matchTenants = (p.tenants || []).some((t: string) => t.toLowerCase().includes(query));
          
          return matchTitle || matchLocation || matchStatus || matchTenants;
      });
  });

  // Lock scrolling if ANY overlay is open
  $effect(() => {
    if (isDrawerOpen || isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });
</script>

<svelte:window 
  bind:scrollY 
  onkeydown={(e) => { if (e.key === 'Escape') isSearchOpen = false; }} 
/>

<nav class="fixed top-0 left-0 w-full z-[60] transition-all duration-300 px-6 py-4 flex justify-between items-center {scrollY > 50 || isMobileMenuOpen || isSearchOpen ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg border-b border-zinc-800' : 'bg-transparent'}">
  
  <div class="flex items-center gap-3">
    <a href="/" onclick={() => {isMobileMenuOpen = false; isSearchOpen = false;}} class="flex items-center gap-3 group hover:opacity-80 transition-opacity">
      <img src="/logo-white.svg" alt="Jax Street Logo" class="w-8 h-8 md:w-9 md:h-9 object-contain shrink-0 group-hover:scale-105 transition-transform" />
      <span class="text-xl md:text-2xl font-bold tracking-widest uppercase text-white drop-shadow-md">
        Jax Street CRE
      </span>
    </a>
  </div>

  <div class="hidden lg:flex items-center gap-8 text-sm font-bold text-zinc-100 uppercase tracking-wider">
    <a href="/" class="relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:text-teal-400 transition-colors">Home</a>
    <a href="/about" class="relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:text-teal-400 transition-colors">About Us</a>
    <a href="/properties/available" class="relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:text-teal-400 transition-colors">Available</a>
    <a href="/properties/leased" class="relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:text-teal-400 transition-colors">Leased</a>

    <button onclick={() => isSearchOpen = true} class="hover:text-teal-400 transition-colors ml-2" aria-label="Search Properties">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </button>

    <button onclick={() => isDrawerOpen = true} class="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-sm transition-colors duration-300 shadow-lg">
      Propose a Deal
    </button>
  </div>

  <div class="flex items-center gap-4 lg:hidden">
    <button onclick={() => {isSearchOpen = true; isMobileMenuOpen = false;}} class="text-white hover:text-teal-400 transition-colors p-2" aria-label="Search Properties">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </button>

    <button 
      class="text-white p-2 transition-colors hover:text-teal-400"
      onclick={() => {
        isMobileMenuOpen = !isMobileMenuOpen;
        if (isMobileMenuOpen) { isDrawerOpen = false; isSearchOpen = false; }
      }}
      aria-label="Toggle Menu"
    >
      {#if isMobileMenuOpen}
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
      {:else}
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      {/if}
    </button>
  </div>
</nav>

{#if isSearchOpen}
  <div 
    class="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-xl flex flex-col pt-28 px-6 md:px-12 pb-12"
    transition:fade={{ duration: 250 }}
  >
    <button 
      onclick={() => {isSearchOpen = false; searchQuery = '';}}
      class="absolute top-6 right-6 md:top-8 md:right-12 text-zinc-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
      aria-label="Close search"
    >
      <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>

    <div class="max-w-4xl mx-auto w-full flex flex-col gap-8 h-full">
        <input 
            type="text" 
            bind:value={searchQuery} 
            placeholder="Search cities, tenants, or status..." 
            class="w-full bg-transparent border-b-2 border-zinc-700 focus:border-teal-500 text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white placeholder-zinc-700 outline-none pb-4 transition-colors"
            autofocus
        />

        <div class="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
            {#if searchQuery.trim() !== '' && searchResults.length === 0}
                <p class="text-zinc-500 font-medium text-lg mt-8">No properties found matching "{searchQuery}"</p>
            {/if}

            {#each searchResults as result}
                <a 
                    href="/properties/{result.slug}" 
                    onclick={() => { isSearchOpen = false; searchQuery = ''; }}
                    class="flex items-center gap-6 p-4 rounded-sm hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800 group"
                >
                    <img src={result.image} alt={result.title} class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-sm shrink-0 shadow-md" />
                    <div class="flex flex-col">
                        <span class="text-teal-500 text-[10px] font-bold uppercase tracking-widest mb-1">{result.status} • {result.type}</span>
                        <h3 class="text-xl md:text-2xl font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-1">{result.title}</h3>
                        <p class="text-zinc-400 text-sm md:text-base mt-1">{result.location}</p>
                    </div>
                </a>
            {/each}
        </div>
    </div>
  </div>
{/if}


{#if isMobileMenuOpen}
  <div 
    class="fixed inset-0 z-[50] bg-zinc-950/95 backdrop-blur-md flex flex-col justify-center items-center gap-10"
    transition:fade={{ duration: 250 }}
  >
    <div class="flex flex-col items-center gap-8 text-xl md:text-2xl font-bold text-zinc-100 uppercase tracking-widest text-center">
      <a href="/" onclick={() => isMobileMenuOpen = false} class="hover:text-teal-400 transition-colors">Home</a>
      <a href="/about" onclick={() => isMobileMenuOpen = false} class="hover:text-teal-400 transition-colors">About Us</a>
      <a href="/properties/available" onclick={() => isMobileMenuOpen = false} class="hover:text-teal-400 transition-colors">Available Properties</a>
      <a href="/properties/leased" onclick={() => isMobileMenuOpen = false} class="hover:text-teal-400 transition-colors">Leased Properties</a>
      
      <button 
        onclick={() => {
          isMobileMenuOpen = false;
          setTimeout(() => isDrawerOpen = true, 250);
        }} 
        class="mt-4 bg-teal-600 hover:bg-teal-500 text-white px-10 py-4 rounded-sm transition-colors duration-300 shadow-lg text-sm md:text-base"
      >
        Propose a Deal
      </button>
    </div>
  </div>
{/if}


{#if isDrawerOpen}
  <div 
    class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
    transition:fade={{ duration: 300 }}
    onclick={() => isDrawerOpen = false}
  ></div>

  <div 
    class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
    transition:fly={{ x: 400, duration: 400, opacity: 1 }}
  >
    <div class="bg-zinc-950 px-6 py-6 flex justify-between items-center shrink-0 border-b border-teal-500/20">
      <h2 class="text-xl font-bold text-white tracking-tight">Propose a Deal</h2>
      <button 
        onclick={() => isDrawerOpen = false}
        class="text-zinc-400 hover:text-white transition-colors p-2"
        aria-label="Close"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <div class="px-6 py-10 flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-10 bg-white">
      <p class="text-zinc-600 text-sm leading-relaxed font-medium">
        Whether you have a property to list, or you're looking for your next commercial space, we're here to help. Reach out directly or fill out the form below.
      </p>

      <div class="flex flex-col gap-6 border-b border-zinc-100 pb-8">
        <div class="flex items-center gap-4 group">
          <div class="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-teal-600 shrink-0 group-hover:bg-teal-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </div>
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Call Us</p>
            <a href="tel:8123451663" class="text-sm font-bold text-zinc-950 hover:text-teal-600 transition-colors">(812) 345-1663</a>
          </div>
        </div>
        
        <div class="flex items-center gap-4 group">
          <div class="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-teal-600 shrink-0 group-hover:bg-teal-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Email Us</p>
            <a href="mailto:eric@jaxstreetcre.com" class="text-sm font-bold text-zinc-950 hover:text-teal-600 transition-colors">eric@jaxstreetcre.com</a>
          </div>
        </div>
      </div>

    <div class="flex flex-col gap-3 mt-2 pb-8 flex-grow">
        <h3 class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Our Indiana Footprint</h3>
        <div class="w-full min-h-[300px] flex-grow bg-zinc-100 rounded-sm border border-zinc-200 overflow-hidden relative z-0 shadow-inner">
            <InteractiveMap properties={$page.data.allProperties || []} />
        </div>
        <p class="text-[10px] text-zinc-400 font-medium mt-1 text-center uppercase tracking-widest">
            Serving the greater Indiana markets
        </p>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Light mode scrollbar for the textarea, drawer body, and search results */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e4e4e7; /* zinc-200 */
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #14b8a6; /* teal-500 */
  }
</style>