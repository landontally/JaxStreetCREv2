<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  let scrollY = $state(0);
  let isDrawerOpen = $state(false);

  $effect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });
</script>

<svelte:window bind:scrollY />

<nav class="fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4 flex justify-between items-center {scrollY > 50 ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg border-b border-zinc-800' : 'bg-transparent'}">
  
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-full border-2 border-teal-500 flex items-center justify-center">
      <div class="w-3 h-3 bg-teal-500 rounded-full"></div>
    </div>
    <div class="text-xl md:text-2xl font-bold tracking-widest uppercase text-white drop-shadow-md">
      <a href="/">Jax Street CRE</a>
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
</nav>

{#if isDrawerOpen}
  <div 
    class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
    transition:fade={{ duration: 300 }}
    onclick={() => isDrawerOpen = false}
  ></div>

  <div 
    class="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl z-[101] flex flex-col"
    transition:fly={{ x: 400, duration: 400, opacity: 1 }}
  >
    <div class="flex justify-between items-center p-6 border-b border-zinc-800">
      <h2 class="text-2xl font-bold text-zinc-50">Propose a Deal</h2>
      <button 
        onclick={() => isDrawerOpen = false}
        class="text-zinc-400 hover:text-white transition-colors p-2"
        aria-label="Close"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
      <p class="text-zinc-300 text-sm leading-relaxed">
        Whether you have a property to list, or you're looking for your next commercial space, we're here to help. Reach out directly or fill out the form below.
      </p>

      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800">
            <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </div>
          <div>
            <p class="text-xs text-zinc-500 font-bold uppercase tracking-wider">Call Us</p>
            <p class="text-zinc-100 font-medium">(555) 123-4567</p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800">
            <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p class="text-xs text-zinc-500 font-bold uppercase tracking-wider">Email Us</p>
            <p class="text-zinc-100 font-medium">eric@jaxstreetcre.com</p>
          </div>
        </div>
      </div>

      <hr class="border-zinc-800" />

      <form name="propose-deal" method="POST" data-netlify="true" class="flex flex-col gap-4">
        <input type="hidden" name="form-name" value="propose-deal" />
        
        <div>
          <label for="name" class="block text-sm font-medium text-zinc-400 mb-1">Name</label>
          <input type="text" id="name" name="name" required class="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-2.5 text-zinc-50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors" />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-zinc-400 mb-1">Email</label>
          <input type="email" id="email" name="email" required class="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-2.5 text-zinc-50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors" />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-zinc-400 mb-1">Message Details</label>
          <textarea id="message" name="message" rows="4" required class="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-2.5 text-zinc-50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-none"></textarea>
        </div>

        <button type="submit" class="mt-2 w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 rounded-sm transition-colors duration-300">
          Send Message
        </button>
      </form>
    </div>
  </div>
{/if}