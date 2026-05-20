<script lang="ts">
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
  
  let isHome = $derived($page.url.pathname === '/');
  let show = $state(false);

  // THIS CONTROLS THE AMOUNT OF SPINS
  const spins = Array.from({ length: 7 }, (_, i) => i);

  $effect(() => {
    if (isHome) {
      show = true;
      const timer = setTimeout(() => {
        show = false;
      }, 2800);
      return () => clearTimeout(timer);
    } else {
      show = false;
    }
  });
</script>

{#if show && isHome}
  <div out:fade={{ duration: 800 }} aria-hidden="true" class="fixed inset-0 bg-zinc-950 flex items-center justify-center" style="z-index: 9999;">
    
    <div class="flex gap-6 justify-center overflow-hidden h-20 text-3xl md:text-5xl font-bold tracking-widest text-zinc-50 uppercase">
      
      <div class="flex flex-col gap-4 animate-slot-up">
        {#each spins as spinId (spinId)}
          <div class="h-20 shrink-0 flex items-center justify-center">
            
            <img src="/logo-white.svg" alt="Jax Street Logo" class="w-10 h-10 md:w-14 md:h-14 object-contain" />
            
          </div>
        {/each}
      </div>

      <div class="flex flex-col gap-4 animate-slot-down">
        {#each spins as spinId (spinId)}
          <div class="h-20 shrink-0 flex items-center leading-none">
            Jax Street CRE
          </div>
        {/each}
      </div>

    </div>
  </div>
{/if}

<style>
  @media (prefers-reduced-motion: no-preference) {
    .animate-slot-up {
      animation: slotUp 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-slot-down {
      animation: slotDown 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  }

  @keyframes slotUp {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-576px); }
  }

  @keyframes slotDown {
    0% { transform: translateY(-576px); }
    100% { transform: translateY(0px); }
  }
</style>