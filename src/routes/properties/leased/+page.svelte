<script lang="ts">
	import { fly } from 'svelte/transition';
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';

	let { data } = $props();
	let properties = data?.properties || []; 

	// State to handle clicking "Focus Map" on a specific property
	let activeLocation = $state<any>(null);
	
	// State for the mobile map modal
	let isMobileMapOpen = $state(false);

	// Lock background scrolling when the mobile map is open
	$effect(() => {
		if (isMobileMapOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	});
</script>

<svelte:head>
	<title>Leased Properties | Jax Street CRE</title>
	<meta name="description" content="Browse our portfolio of fully leased retail and light industrial properties in Indiana." />
</svelte:head>

<div class="bg-white min-h-screen text-zinc-950 flex flex-col overflow-hidden relative">
    
    <div class="w-full border-b border-zinc-800 bg-zinc-950 relative overflow-hidden px-6 md:px-12 pt-32 pb-8 shrink-0">
        <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span class="text-teal-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Active Listings</span>
                <h1 class="text-3xl md:text-5xl font-bold tracking-tighter uppercase flex flex-col sm:flex-row sm:gap-3 text-white">
                    Leased <span>Properties.</span>
                </h1>
            </div>
            <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                <span class="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                    {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
                </span>
            </div>
        </div>
    </div>

    <div class="flex flex-col lg:flex-row flex-grow h-[800px] max-h-[75vh]">
        
        <div class="w-full lg:w-[450px] xl:w-[500px] h-full overflow-y-auto bg-white p-4 md:p-6 flex flex-col gap-4 custom-scrollbar shrink-0 relative z-10">
            
            {#if properties.length > 0}
                {#each properties as property}
					<div class="group flex shrink-0 h-auto bg-white border border-zinc-200 hover:border-teal-500/50 rounded-sm overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg">                        
                        <div class="w-2/5 md:w-1/3 min-h-[160px] h-full relative overflow-hidden bg-zinc-100 shrink-0">
                            <img 
                                src={property.image} 
                                alt={property.title}
                                class="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            />
                        </div>
                        
                        <div class="w-3/5 md:w-2/3 p-4 py-5 flex flex-col justify-between flex-grow">
                            <div class="mb-4">
                                <span class="text-teal-600 text-[9px] font-black uppercase tracking-widest block mb-1">
                                    {property.type || 'Retail'}
                                </span>
                                <h3 class="text-lg font-bold text-zinc-950 leading-tight mb-2 line-clamp-2">
                                    {property.title}
                                </h3>
                                <p class="text-zinc-500 text-xs flex items-center gap-1.5 line-clamp-1">
                                    <svg class="w-3 h-3 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    {property.location}
                                </p>
                            </div>
                            
                            <div class="flex flex-wrap items-center justify-between gap-4 mt-auto pt-3 border-t border-zinc-100">
                                <button 
                                    onclick={() => {
                                        activeLocation = property;
                                        if (window.innerWidth < 1024) isMobileMapOpen = true;
                                    }}
                                    class="text-[10px] font-bold uppercase text-zinc-500 hover:text-teal-600 transition-colors tracking-widest"
                                >
                                    Focus Map
                                </button>
                                
                                <a 
                                    href="/properties/{property.slug}" 
                                    class="text-[10px] font-bold uppercase text-zinc-500 hover:text-zinc-950 transition-colors flex items-center gap-1 tracking-widest ml-auto"
                                >
                                    Full Details
                                    <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center opacity-70 p-6">
                    <svg class="w-10 h-10 text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <p class="text-zinc-500 font-medium">No properties currently available.</p>
                </div>
            {/if}

        </div>

        <div class="hidden lg:block flex-grow h-full bg-zinc-100 relative z-0 border-l border-zinc-200">
            <InteractiveMap 
                properties={properties} 
                activeLocation={activeLocation} 
            />
        </div>

    </div>

    <button 
        class="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-950 text-white border border-zinc-700 font-bold uppercase tracking-widest text-[10px] px-8 py-4 rounded-full shadow-2xl z-40 flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        onclick={() => isMobileMapOpen = true}
    >
        <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
        Map View
    </button>

    {#if isMobileMapOpen}
        <div 
            class="fixed inset-0 z-[100] bg-zinc-100 flex flex-col lg:hidden"
            transition:fly={{ y: 800, duration: 350, opacity: 1 }}
        >
            <div class="bg-zinc-950 px-6 py-5 flex justify-between items-center shrink-0 border-b border-zinc-800 shadow-lg">
                <span class="text-white font-bold uppercase tracking-widest text-xs">Property Map</span>
                <button 
                    onclick={() => { isMobileMapOpen = false; activeLocation = null; }}
                    class="text-zinc-400 hover:text-white p-2 transition-colors"
                    aria-label="Close map"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="flex-grow relative z-0">
                <InteractiveMap properties={properties} activeLocation={activeLocation} />
            </div>
        </div>
    {/if}

</div>

<style>
	/* Sleek, light-mode scrollbar for the property list */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: #fafafa; /* zinc-50 */
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #d4d4d8; /* zinc-300 */
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #14b8a6; /* teal-500 */
	}
</style>