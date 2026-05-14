<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import InteractiveMap from '$lib/components/InteractiveMap.svelte'; // Import the new map

  let { data } = $props();
  let property = data.property || {};

  // Lightbox & Map State
  let selectedImage = $state<string | null>(null);
  let activeLocation = $state<any>(null); // Tracks which business is clicked

  // Create our seamless loop from Sanity data (fallback to empty array if none)
  let surroundingArea = property.surroundingArea || [];
  let marqueeItems = [...surroundingArea, ...surroundingArea];
</script>

<svelte:head>
  <title>{property.title || 'Property Details'} | Jax Street CRE</title>
</svelte:head>

<section class="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 flex items-end min-h-[60vh] md:min-h-[70vh]">
  <div class="absolute inset-0 z-0 bg-zinc-900">
    {#if property.image}
      <img src={property.image} alt={property.title} class="w-full h-full object-cover opacity-60" />
    {/if}
    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
  </div>

  <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <span class="px-3 py-1 bg-teal-500/20 border border-teal-500/50 text-teal-400 text-xs font-bold uppercase tracking-widest rounded-full">
        {property.status || 'Available'}
      </span>
      <span class="text-zinc-300 font-bold uppercase tracking-widest text-xs">
        {property.type || 'Commercial Space'}
      </span>
    </div>
    
    <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight max-w-4xl drop-shadow-lg">
      {property.title || 'Untitled Property'}
    </h1>
    
    <p class="text-teal-400 font-medium text-lg md:text-xl flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      {property.location || 'Location upon request'}
    </p>
  </div>
</section>

<section class="py-24 bg-white">
  <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
    
    <div class="lg:col-span-2 flex flex-col gap-16">
      
      <div>
        <h2 class="text-3xl font-bold text-zinc-950 mb-6">About the Property</h2>
        <p class="text-zinc-700 leading-relaxed text-lg whitespace-pre-wrap">
          {property.description || `This premium ${(property.type || 'commercial').toLowerCase()} space represents an exceptional opportunity in the heart of ${property.location || 'the area'}.`}
        </p>
      </div>

      {#if property.highlights && property.highlights.length > 0}
        <div>
          <h3 class="text-2xl font-bold text-zinc-950 mb-6">Property Highlights</h3>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each property.highlights as highlight}
              <li class="flex items-start gap-3 text-zinc-700">
                <svg class="w-6 h-6 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span class="pt-0.5">{highlight}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if property.brochureUrl}
        <div class="bg-zinc-50 border border-zinc-200 p-8 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm">
          <div>
            <h3 class="text-xl font-bold text-zinc-950 mb-1">Property Brochure</h3>
            <p class="text-zinc-600 text-sm">Download the full PDF prospectus for more information.</p>
          </div>
          <a href={property.brochureUrl} target="_blank" class="shrink-0 bg-zinc-950 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-sm transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download PDF
          </a>
        </div>
      {/if}

      {#if property.gallery && property.gallery.length > 0}
        <div>
          <h3 class="text-2xl font-bold text-zinc-950 mb-6">Gallery</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each property.gallery as img}
              <button 
                onclick={() => selectedImage = img} 
                class="w-full h-64 overflow-hidden rounded-sm border border-zinc-200 shadow-sm cursor-zoom-in group"
                aria-label="Enlarge image"
              >
                <img src={img} alt="Property view" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </button>
            {/each}
          </div>
        </div>
      {/if}

      {#if property.coordinates}
        <div>
          <div class="flex justify-between items-end mb-6">
            <h3 class="text-2xl font-bold text-zinc-950">Location</h3>
            {#if activeLocation}
              <button onclick={() => activeLocation = null} class="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
                Reset to Property
              </button>
            {/if}
          </div>
          <div class="w-full h-[400px] bg-zinc-100 rounded-sm border border-zinc-200 flex items-center justify-center overflow-hidden shadow-sm relative z-0">
            <InteractiveMap 
              propertyCoords={property.coordinates} 
              surroundingArea={property.surroundingArea}
              activeLocation={activeLocation}
              propertyTitle={property.title} 
            />
          </div>
        </div>
      {/if}

      {#if surroundingArea.length > 0}
        <div class="border-y border-zinc-200 py-12 overflow-hidden relative bg-zinc-50/50 group">
          <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8 text-center">Surrounding Area Highlights (Click to View on Map)</h3>
          <div class="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          <div class="flex w-max animate-scroll pause-on-hover">
            {#each marqueeItems as business}
              <button 
                onclick={() => activeLocation = business}
                class="px-12 text-2xl md:text-4xl font-bold text-zinc-300 hover:text-teal-600 transition-colors uppercase tracking-tighter whitespace-nowrap cursor-pointer"
              >
                {business.name}
              </button>
            {/each}
          </div>
        </div>
      {/if}

    </div>

    <div class="relative">
      {#if property.status === 'Available' || !property.status}
        <div class="sticky top-32 bg-zinc-50 border border-zinc-200 p-8 rounded-sm shadow-xl flex flex-col gap-8">
          <div>
            <h3 class="text-xl font-bold text-zinc-950 mb-2">Interested in this space?</h3>
            <p class="text-zinc-600 text-sm">Reach out directly to schedule a tour or request more information.</p>
          </div>
          
          <div class="flex flex-col gap-4">
            <a href="mailto:eric@jaxstreetcre.com" class="w-full bg-teal-600 hover:bg-teal-500 text-white text-center font-bold py-4 rounded-sm transition-colors shadow-md flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Email Eric
            </a>
            <a href="tel:5551234567" class="w-full text-center border-2 border-zinc-950 hover:bg-zinc-950 hover:text-white text-zinc-950 font-bold py-4 rounded-sm transition-colors flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              Call Eric
            </a>
          </div>
        </div>
      {/if}
    </div>

  </div>
</section>

{#if selectedImage}
  <div 
    class="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
    transition:fade={{ duration: 200 }}
    onclick={() => selectedImage = null}
  >
    <button 
      class="absolute top-6 right-6 text-white hover:text-teal-400 transition-colors bg-black/50 p-2 rounded-full"
      onclick={() => selectedImage = null}
      aria-label="Close image"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    
    <img 
      src={selectedImage} 
      alt="Enlarged property view" 
      class="max-w-full max-h-full object-contain rounded-sm shadow-2xl cursor-zoom-out"
      transition:scale={{ duration: 300, start: 0.95 }}
      onclick={(e) => e.stopPropagation()}
    />
  </div>
{/if}

<style>
  .pause-on-hover:hover {
    animation-play-state: paused;
  }

  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: no-preference) {
    .animate-scroll {
      animation: scroll 25s linear infinite;
    }
  }
  
</style>