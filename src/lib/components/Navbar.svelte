<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  let scrollY = $state(0);
  let isDrawerOpen = $state(false);
  let isMobileMenuOpen = $state(false);

  // Lock scrolling if either the drawer OR the mobile menu is open
  $effect(() => {
    if (isDrawerOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });
</script>

<svelte:window bind:scrollY />

<nav class="fixed top-0 left-0 w-full z-[60] transition-all duration-300 px-6 py-4 flex justify-between items-center {scrollY > 50 || isMobileMenuOpen ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg border-b border-zinc-800' : 'bg-transparent'}">
  
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-full border-2 border-teal-500 flex items-center justify-center">
      <div class="w-3 h-3 bg-teal-500 rounded-full"></div>
    </div>
    <div class="text-xl md:text-2xl font-bold tracking-widest uppercase text-white drop-shadow-md">
      <a href="/" onclick={() => isMobileMenuOpen = false}>Jax Street CRE</a>
    </div>
  </div>

  <div class="hidden lg:flex items-center gap-8 text-sm font-bold text-zinc-100 uppercase tracking-wider">
    <a href="/" class="relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:text-teal-400 transition-colors">Home</a>
    <a href="/about" class="relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:text-teal-400 transition-colors">About Us</a>
    <a href="/properties/available" class="relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:text-teal-400 transition-colors">Available</a>
    <a href="/properties/leased" class="relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right hover:after:origin-left hover:text-teal-400 transition-colors">Leased</a>

    <button onclick={() => isDrawerOpen = true} class="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-sm transition-colors duration-300 ml-4 shadow-lg">
      Propose a Deal
    </button>
  </div>

  <button 
    class="lg:hidden text-white p-2 transition-colors hover:text-teal-400"
    onclick={() => {
      isMobileMenuOpen = !isMobileMenuOpen;
      if (isMobileMenuOpen) isDrawerOpen = false; // close drawer if mobile menu opens
    }}
    aria-label="Toggle Menu"
  >
    {#if isMobileMenuOpen}
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
    {:else}
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
    {/if}
  </button>
</nav>

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
          setTimeout(() => isDrawerOpen = true, 250); // Small delay allows menu to fade out before drawer slides in
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
            <a href="tel:5551234567" class="text-sm font-bold text-zinc-950 hover:text-teal-600 transition-colors">(555) 123-4567</a>
          </div>
        </div>
        
        <div class="flex items-center gap-4 group">
          <div class="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-teal-600 shrink-0 group-hover:bg-teal-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Email Us</p>
            <a href="mailto:e@email.com" class="text-sm font-bold text-zinc-950 hover:text-teal-600 transition-colors">e@email.com</a>
          </div>
        </div>
      </div>

      <form name="propose-deal" method="POST" data-netlify="true" class="flex flex-col gap-5">
        <input type="hidden" name="form-name" value="propose-deal" />
        <div class="flex flex-col gap-1.5">
          <label for="name" class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Name</label>
          <input type="text" id="name" name="name" required class="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-4 py-3.5 text-sm text-zinc-950 placeholder-zinc-400 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all shadow-sm" placeholder="John Doe" />
        </div>
        
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Email</label>
          <input type="email" id="email" name="email" required class="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-4 py-3.5 text-sm text-zinc-950 placeholder-zinc-400 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all shadow-sm" placeholder="john@example.com" />
        </div>
        
        <div class="flex flex-col gap-1.5">
          <label for="message" class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Message Details</label>
          <textarea id="message" name="message" rows="4" required class="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-4 py-3 text-sm text-zinc-950 placeholder-zinc-400 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all shadow-sm resize-none custom-scrollbar" placeholder="Tell us about your needs..."></textarea>
        </div>

        <button type="submit" class="mt-4 w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-sm uppercase tracking-widest text-xs transition-colors shadow-md hover:shadow-lg flex justify-center items-center gap-2">
          Send Message
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </form>
    </div>
  </div>
{/if}

<style>
  /* Light mode scrollbar for the textarea and drawer body */
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