<script lang="ts">
  import { onMount } from 'svelte';

  // Grab all our dynamic data from the server
  let { data } = $props();
  
  // Guarantee these variables are arrays so Svelte never crashes
  let properties = data?.properties || [];
  let heroImages = data?.heroImages || [];

  // --- HERO CAROUSEL LOGIC ---
  let currentHeroIndex = $state(0);

  onMount(() => {
    // Safely check length before starting the interval
    if (heroImages && heroImages.length > 1) {
      const interval = setInterval(() => {
        currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
      }, 12000); 
      return () => clearInterval(interval);
    }
  });

  // --- PROPERTIES CAROUSEL LOGIC ---
  let currentIndex = $state(0);

  function next() {
    currentIndex = (currentIndex + 1) % properties.length;
  }

  function prev() {
    currentIndex = (currentIndex - 1 + properties.length) % properties.length;
  }

  function getOffset(index: number) {
    const length = properties.length;
    let offset = (index - currentIndex) % length;
    if (offset > Math.floor(length / 2)) offset -= length;
    if (offset < -Math.floor(length / 2)) offset += length;
    return offset;
  }

  let startX = 0;
  let isDragging = false;

  function handlePointerDown(e: PointerEvent) {
    isDragging = true;
    startX = e.clientX;
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    
    if (diff > 50) {
      prev();
    } else if (diff < -50) {
      next();
    }
    isDragging = false;
  }

  function handlePointerLeave() {
    isDragging = false;
  }
</script>

<svelte:head>
  <title>Jax Street CRE | Commercial Real Estate</title>
</svelte:head>

<section class="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
  
  {#each heroImages as img, i}
    <div 
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out"
      style="background-image: url('{img}'); opacity: {i === currentHeroIndex ? 1 : 0};"
    ></div>
  {/each}

  <div class="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950"></div>
  
  <div class="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-start mt-12 md:mt-0">
    <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-zinc-50 leading-tight max-w-4xl mb-6 drop-shadow-lg">
      Structure. Vision.<br/>
      <span class="text-zinc-300">Execution.</span>
    </h1>
    <p class="text-lg md:text-xl text-zinc-200 max-w-2xl mb-10 leading-relaxed drop-shadow-md font-medium">
      Rooted in Indiana commercial real estate, we are hands-on owners specializing in retail and light industrial properties. We don't just lease space - we partner with our tenants for long-term success.
    </p>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="/properties" class="bg-teal-600 hover:bg-teal-500 text-zinc-50 font-semibold py-4 px-8 rounded-sm transition-colors duration-300 text-center shadow-lg">
        View Properties
      </a>
      <a href="/about" class="bg-transparent border border-zinc-300 hover:bg-zinc-800/80 text-zinc-50 font-semibold py-4 px-8 rounded-sm transition-all duration-300 text-center shadow-lg">
        Our Story
      </a>
    </div>
  </div>
</section>

<section class="relative min-h-screen py-24 bg-zinc-950 flex flex-col justify-center border-t border-zinc-900 overflow-hidden">
  
  {#if properties.length > 0}
    <div class="absolute inset-0 z-0 transition-all duration-1000 ease-in-out opacity-60">
      <img 
        src={properties[currentIndex]?.image} 
        alt="Background Mood" 
        class="w-full h-full object-cover blur-sm scale-110"
      />
      <div class="absolute inset-0 bg-zinc-950/60"></div>
    </div>

    <div class="relative z-10 w-full max-w-[1700px] mx-auto px-6 h-[80vh] flex flex-col">
      <div class="text-center mb-16 flex flex-col items-center">
        <div class="flex items-center justify-center gap-4 text-zinc-50 uppercase mb-6">
          <div class="w-3.5 h-3.5 rounded-full bg-teal-400 animate-heartbeat"></div>
          <h2 class="text-3xl md:text-5xl font-bold tracking-tight">Latest Properties</h2>
        </div>

        <div class="flex gap-2.5">
          {#each properties as _, i}
            <button 
              onclick={() => currentIndex = i}
              class="w-3 h-3 rounded-full transition-all duration-500 {i === currentIndex ? 'bg-zinc-50 w-7' : 'bg-zinc-600'}"
              aria-label="Go to slide {i + 1}"
            ></button>
          {/each}
        </div>
      </div>

      <div 
        class="relative flex-grow flex items-center justify-center w-full cursor-grab active:cursor-grabbing touch-pan-y"
        onpointerdown={handlePointerDown}
        onpointerup={handlePointerUp}
        onpointerleave={handlePointerLeave}
        onpointercancel={handlePointerLeave}
      >
        {#each properties as property, i}
          {@const offset = getOffset(i)}
          
          <div 
            class="absolute h-full flex flex-col justify-center transition-all duration-700 ease-out"
            style="
              transform: translateX({offset * 125}%); 
              opacity: {offset === 0 ? 1 : 0.25}; 
              scale: {offset === 0 ? 1.05 : 0.7}; 
              z-index: {offset === 0 ? 20 : 10};
              pointer-events: {offset === 0 ? 'auto' : 'none'};
              width: {offset === 0 ? '75vw' : '55vw'};
              max-width: {offset === 0 ? '900px' : '750px'};
            "
          >
            <div class="relative w-full aspect-[16/9] bg-zinc-900 overflow-hidden rounded-sm shadow-2xl border border-zinc-800">
              <img draggable="false" src={property.image} alt={property.title} class="w-full h-full object-cover select-none" />
              
              <div class="absolute top-6 left-6 max-w-[85%] bg-black/60 backdrop-blur-md border border-white/10 p-4 md:p-5 rounded-sm z-20">
                <h3 class="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-50 leading-tight mb-2">
                  {property.title}
                </h3>
                <p class="text-teal-400 font-medium text-sm md:text-base flex items-center gap-1.5">
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {property.location}
                </p>
              </div>

              <div class="absolute bottom-6 right-6 border border-zinc-50 text-zinc-50 backdrop-blur-md bg-black/30 text-sm font-semibold uppercase tracking-widest px-4 py-2 rounded-full">
                {property.status}
              </div>
            </div>

            <div class="flex justify-between items-center mt-6 px-2">
              <a href="/properties/{property.slug}" onclick={(e) => e.stopPropagation()} class="flex items-center gap-2 text-zinc-50 font-bold hover:text-teal-400 transition-colors group">
                <div class="w-6 h-6 rounded-full bg-zinc-50 text-zinc-950 flex items-center justify-center group-hover:bg-teal-400 group-hover:scale-110 group-hover:translate-x-1.5 transition-all duration-300">
                  <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </a>
              <span class="text-zinc-300 font-medium">{property.type}</span>
            </div>
          </div>
        {/each}

        {#if properties.length > 1}
          <button onclick={(e) => { e.stopPropagation(); prev(); }} class="absolute left-2 md:left-[5%] z-30 w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-110 transition-transform shadow-xl">            
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button onclick={(e) => { e.stopPropagation(); next(); }} class="absolute right-2 md:right-[5%] z-30 w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
          </button>
        {/if}
      </div>
    </div>

  {:else}
    <div class="relative z-10 w-full max-w-3xl mx-auto px-6 h-[50vh] flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 rounded-full border border-dashed border-zinc-700 flex items-center justify-center mb-6">
        <svg class="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
      </div>
      <h2 class="text-2xl font-bold text-zinc-50 mb-2">Building Our Portfolio</h2>
      <p class="text-zinc-400">Featured properties will appear here once they are added and marked as "Featured" in Sanity Studio.</p>
    </div>
  {/if}

</section>

<section class="py-24 bg-white border-t border-zinc-200 relative flex items-center">
  
  <div class="absolute inset-0 z-0 bg-grain opacity-[0.03]"></div>
  
  <div class="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
    
    <div class="w-full md:w-1/2 flex items-center justify-center aspect-square md:aspect-auto">
      <div class="relative w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] flex items-center justify-center">
        
        <div class="relative w-1/2 h-1/2 rounded-full bg-zinc-950 flex items-center justify-center shadow-xl z-20">
          <div class="w-6 h-6 bg-zinc-50 rounded-full"></div>
          <span class="absolute text-[10px] md:text-xs text-zinc-50 font-bold uppercase tracking-wider bottom-1/4"></span>
        </div>
        
        <div class="absolute inset-0 rounded-full border border-teal-600/40 animate-orbit-a"></div>
        <div class="absolute inset-[15%] rounded-full border border-dashed border-teal-600/60 animate-orbit-b"></div>
        <div class="absolute inset-[30%] rounded-full border border-teal-600/40 animate-orbit-c"></div>
        <div class="absolute inset-[-10%] rounded-full border border-zinc-600/10 scale-[1.1]"></div>
      </div>
    </div>
    
    <div class="w-full md:w-1/2 flex flex-col gap-6">
      
      <div>
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 leading-tight mb-8 max-w-xl">
          Our Philosophy
        </h2>
        
        <blockquote class="text-lg md:text-xl text-teal-600 font-medium italic mb-6 border-l-4 border-teal-600 pl-4">
          "Operate high demand real estate and treat our tenants like family."
        </blockquote>

        <p class="text-zinc-700 max-w-lg mb-8 leading-relaxed text-sm md:text-base">
          At Jax Street CRE, we like to start with our tenants, and work our way backwards. This means our buildings must set up our tenants for long-term success. That's why buying real estate correctly is crucial: "no Landlord has ever had a pleasant experience charging their tenant more rent than they can afford." So, our long-term mission is to buy high demand real estate, charge our tenants a rent that makes sense, and operate our buildings at a high standard.
        </p>
      </div>

      <a href="/about" class="self-start text-teal-600 hover:text-teal-700 font-bold flex items-center gap-2.5 group transition-colors mt-4">
        Discover Our Story
        <div class="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center group-hover:bg-teal-500 group-hover:scale-110 group-hover:translate-x-1.5 transition-all duration-300">
          <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
        </div>
      </a>
    </div>

  </div>
</section>

<style>
  @media (prefers-reduced-motion: no-preference) {
    .animate-heartbeat {
      animation: heartbeat 4s ease-in-out infinite; 
    }
  }

  @keyframes heartbeat {
    0% { transform: scale(1); opacity: 0.6; }
    30% { transform: scale(1.4); opacity: 1; }
    50% { transform: scale(1); opacity: 0.6; }
    80% { transform: scale(1.4); opacity: 1; }
    100% { transform: scale(1); opacity: 0.6; }
  }

  @media (prefers-reduced-motion: no-preference) {
    .animate-orbit-a { animation: rotate 20s linear infinite; }
    .animate-orbit-b { animation: rotate-reverse 15s linear infinite; }
    .animate-orbit-c { animation: rotate 10s linear infinite; }
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes rotate-reverse {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
</style>