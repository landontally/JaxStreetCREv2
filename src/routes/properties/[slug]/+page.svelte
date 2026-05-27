<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let property = data.property || {};

	let selectedImage = $state<string | null>(null);
	let activeLocation = $state<any>(null);

	// Duplicate surrounding area items to ensure seamless looping for the marquee
	let surroundingArea = property.surroundingArea || [];
	let marqueeItems = [...surroundingArea, ...surroundingArea, ...surroundingArea, ...surroundingArea];

	// --- CUSTOM REVEAL ACTION ---
	function reveal(node: HTMLElement) {
		node.classList.add('opacity-0', 'translate-y-16', 'transition-all', 'duration-[1200ms]', 'ease-out');
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					node.classList.remove('opacity-0', 'translate-y-16');
					node.classList.add('opacity-100', 'translate-y-0');
					observer.unobserve(node);
				}
			});
		}, { threshold: 0.1 });

		observer.observe(node);
		return { destroy() { observer.disconnect(); } };
	}
</script>

<svelte:head>
	<title>{property.title || 'Property Details'} | Jax Street CRE</title>
	<meta name="description" content="Commercial real estate listing for {property.title} located in {property.location}." />
</svelte:head>

<section class="relative h-[70vh] flex flex-col justify-end px-6 md:px-12 pb-24 z-10 overflow-hidden bg-zinc-950">
	<div class="absolute inset-0 z-0 bg-zinc-950">
		<div 
			class="absolute inset-0 bg-cover bg-center bg-fixed opacity-70"
			style="background-image: url('{property.image}');"
		></div>
		<div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/10"></div>
	</div>

	<div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-5" use:reveal>
		<div class="flex items-center gap-3">
			<span class="px-3 py-1.5 bg-teal-500/90 text-white text-[10px] font-black uppercase tracking-widest rounded-sm backdrop-blur-md shadow-lg">
				{property.status || 'Available'}
			</span>
			<span class="text-zinc-200 font-bold uppercase tracking-[0.2em] text-[10px] bg-black/30 px-3 py-1.5 rounded-sm backdrop-blur-md">
				{property.type || 'Commercial Space'}
			</span>
		</div>
		
		<h1 class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] drop-shadow-2xl max-w-5xl mb-2">
			{property.title || 'Untitled Property'}
		</h1>
		
		<p class="text-teal-300 font-bold text-lg md:text-xl flex items-center gap-2 drop-shadow-md">
			<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
			{property.location || 'Location upon request'}
		</p>

		{#if property.tenants && property.tenants.length > 0}
			<p class="text-white font-bold text-xl drop-shadow-md flex items-center gap-3 mt-3">
				<span class="px-2 py-1 bg-white/10 text-teal-300 text-[10px] font-bold uppercase tracking-widest rounded-sm backdrop-blur-sm">Tenants</span>
				{property.tenants.join(', ')}
			</p>
		{/if}
	</div>
</section>

<section class="pt-32 pb-12 bg-white relative z-20">
	<div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
		
		<div class="lg:col-span-8 flex flex-col gap-24">
			
			<div use:reveal>
				<h2 class="text-3xl font-bold text-zinc-950 mb-8 tracking-tight flex items-center gap-4">
					<div class="h-1 w-8 bg-teal-500"></div>
					About the Property
				</h2>
				<p class="text-zinc-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
					{property.description || `This premium ${(property.type || 'commercial').toLowerCase()} space represents an exceptional opportunity in the heart of ${property.location || 'the area'}.`}
				</p>
			</div>

			{#if property.highlights && property.highlights.length > 0}
				<div use:reveal>
					<h3 class="text-2xl font-bold text-zinc-950 mb-8 tracking-tight">Property Highlights</h3>
					<ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each property.highlights as highlight}
							<li class="flex items-start gap-4 text-zinc-700 bg-zinc-50 p-6 rounded-sm border border-zinc-100 shadow-sm">
								<svg class="w-6 h-6 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
								<span class="pt-0.5 font-medium">{highlight}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if property.brochureUrl}
				<div use:reveal class="bg-zinc-950 text-white border border-zinc-800 p-10 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 shadow-2xl relative overflow-hidden">
					<div class="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/20 blur-3xl rounded-full"></div>
					<div class="relative z-10">
						<h3 class="text-2xl font-bold mb-2">Property Brochure</h3>
						<p class="text-zinc-400">Download the full PDF prospectus for more information.</p>
					</div>
					<a href={property.brochureUrl} target="_blank" class="relative z-10 shrink-0 bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 px-8 rounded-sm transition-colors flex items-center gap-3 uppercase tracking-widest text-xs">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
						Download PDF
					</a>
				</div>
			{/if}

			{#if property.gallery && property.gallery.length > 0}
				<div use:reveal>
					<h3 class="text-2xl font-bold text-zinc-950 mb-8 tracking-tight">Gallery</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each property.gallery as img}
							<button 
								onclick={() => selectedImage = img} 
								class="w-full aspect-[4/3] overflow-hidden rounded-sm bg-zinc-200 cursor-zoom-in group relative shadow-md"
								aria-label="Enlarge image"
							>
								<div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
								<img src={img} alt="Property view" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
							</button>
						{/each}
					</div>
				</div>
			{/if}

		</div>

		<div class="lg:col-span-4 relative">
			<div class="sticky top-32 flex flex-col gap-8">
				
				{#if property.status === 'Available' || !property.status}
					<div use:reveal class="bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 p-8 rounded-sm shadow-2xl flex flex-col gap-8 relative overflow-hidden">
						<div class="absolute -top-16 -left-16 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full pointer-events-none"></div>

						<div class="relative z-10">
							<h3 class="text-2xl font-bold text-white mb-2 tracking-tight">Interested in this space?</h3>
							<p class="text-zinc-400 text-sm leading-relaxed">Reach out directly to schedule a tour or request more detailed floorplans.</p>
						</div>
						
						<div class="flex flex-col gap-4 relative z-10">
							<a href="mailto:e@email.com" class="w-full bg-teal-600 hover:bg-teal-500 text-white text-center font-bold py-4 rounded-sm transition-colors flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
								Email Eric
							</a>
							<a href="tel:5551234567" class="w-full text-center border border-white/20 hover:border-white hover:bg-white hover:text-zinc-950 text-white font-bold py-4 rounded-sm transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
								Call Eric
							</a>
						</div>
					</div>
				{/if}

			</div>
		</div>

	</div>
</section>

<section class="bg-zinc-50 border-t border-zinc-200 pt-12 pb-24 md:pb-32 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 relative z-10">
        
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12" use:reveal>
            <div>
                <h3 class="text-3xl font-bold text-zinc-950 tracking-tight mb-2">Property Map</h3>
                <p class="text-zinc-500 font-medium">Explore the local market and click a business to see its location.</p>
            </div>
            {#if activeLocation}
                <button onclick={() => activeLocation = null} class="text-[10px] font-bold text-teal-600 hover:text-teal-700 uppercase tracking-widest flex items-center gap-1 transition-colors shrink-0">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Reset Map
                </button>
            {/if}
        </div>

        {#if surroundingArea.length > 0}
            <div use:reveal class="mb-4">
                <div class="flex items-center gap-3 mb-3 pl-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    <span class="text-teal-600 font-bold uppercase tracking-widest text-[10px]">Surrounding Businesses</span>
                </div>
                
                <div class="w-full border border-zinc-200 bg-white rounded-sm overflow-hidden py-4 flex items-center relative z-20 shadow-sm">
                    <div class="absolute left-0 w-12 md:w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div class="absolute right-0 w-12 md:w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                    
                    <div class="flex animate-marquee-fast pause-on-hover w-max">
                        {#each marqueeItems as business}
                            <button 
                                onclick={() => activeLocation = business}
                                class="flex items-center gap-3 mx-8 text-sm md:text-base font-bold text-zinc-400 hover:text-teal-600 transition-colors uppercase tracking-widest cursor-pointer whitespace-nowrap"
                            >
                                {business.name}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
        
		<div class="w-full h-[400px] md:h-[500px] bg-zinc-100 rounded-sm border border-zinc-200 flex items-center justify-center overflow-hidden shadow-xl relative">
            {#if property.coordinates && property.coordinates.lat && property.coordinates.lng}
                <InteractiveMap 
                    propertyCoords={property.coordinates} 
                    
                    surroundingArea={property.surroundingArea || []} 
                    
                    activeLocation={activeLocation}
                    propertyTitle={property.title} 
                />
            {:else}
                <div class="text-zinc-400 font-medium flex flex-col items-center gap-3">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    <span>Map coordinates not yet provided.</span>
                </div>
            {/if}
        </div>
    </div>
</section>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape' && selectedImage) selectedImage = null; }} />

{#if selectedImage}
	<div 
		class="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
		transition:fade={{ duration: 200 }}
		onclick={() => selectedImage = null}
	>
		<button 
			class="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors bg-black/50 p-3 rounded-full"
			onclick={() => selectedImage = null}
			aria-label="Close image"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
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

	@keyframes marquee-fast {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}

	@media (prefers-reduced-motion: no-preference) {
		/* Fast speed for seamless scrolling */
		.animate-marquee-fast {
			animation: marquee-fast 12s linear infinite;
		}
	}
</style>