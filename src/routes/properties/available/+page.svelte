<script lang="ts">
  let { data } = $props();
  let properties = data.properties || [];
</script>

<svelte:head>
  <title>Available Properties | Jax Street CRE</title>
</svelte:head>

<section class="pt-32 pb-16 bg-zinc-950 border-b border-zinc-900">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
      <span class="text-teal-400 font-bold uppercase tracking-widest text-sm">Portfolio Directory</span>
    </div>
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
      Available Properties
    </h1>
    <p class="text-zinc-400 text-lg max-w-2xl">
      Explore our current inventory of premium retail and light industrial spaces. We partner with our tenants to provide foundational real estate for long-term growth.
    </p>
  </div>
</section>

<section class="w-full h-[40vh] bg-zinc-100 border-b border-zinc-200 flex items-center justify-center relative z-0">
  <p class="text-zinc-500 font-bold tracking-widest uppercase">Master Interactive Map Will Go Here</p>
</section>

<section class="py-24 bg-white">
  <div class="max-w-7xl mx-auto px-6">
    
    {#if properties.length > 0}
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each properties as property}
          <div 
            onmouseenter={() => activeLocation = property}
            onmouseleave={() => activeLocation = null}
            class="group flex flex-col bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div class="relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden">
              {#if property.image}
                <img src={property.image} alt={property.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {/if}
              <div class="absolute top-4 left-4 bg-teal-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md">
                {property.status || 'Available'}
              </div>
            </div>

            <div class="p-6 flex flex-col flex-grow">
              <span class="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
                {property.type || 'Commercial Space'}
              </span>
              <h3 class="text-xl font-bold text-zinc-950 leading-tight mb-2 line-clamp-2">
                {property.title || 'Untitled Property'}
              </h3>
              <p class="text-teal-600 font-medium text-sm flex items-center gap-1.5 mb-6">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {property.location || 'Location upon request'}
              </p>
              
              <div class="mt-auto">
                <a href="/properties/{property.slug}" class="flex items-center gap-2 text-zinc-950 font-bold hover:text-teal-600 transition-colors group/btn">
                  View Details
                  <div class="w-6 h-6 rounded-full bg-zinc-200 text-zinc-950 flex items-center justify-center group-hover/btn:bg-teal-600 group-hover/btn:text-white transition-all duration-300">
                    <svg class="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="w-full py-20 flex flex-col items-center justify-center text-center bg-zinc-50 border border-dashed border-zinc-300 rounded-sm">
        <div class="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-zinc-950 mb-2">No Available Properties</h3>
        <p class="text-zinc-500">We currently have zero vacancies. Check back soon or contact us to join the waitlist.</p>
      </div>
    {/if}

  </div>
</section>