<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { magnetic } from '$lib/magnetic';

	let { data } = $props();
	let properties = data?.properties || [];
	let heroImages = data?.heroImages || [];

	// --- Add these variables inside your <script> tag ---
	let scrollY = $state(0);
	let innerHeight = $state(0);
	// --- SCATTER TO GRID ANIMATION MATH (SNAPPY VERSION) ---
	let aboutSection = $state<HTMLElement>();

	let aboutProgress = $derived.by(() => {
		if (!aboutSection || !innerHeight) return 0;
		const start = aboutSection.offsetTop; 
        
		// ULTRA-COMPRESSED: The animation now finishes in 60% of one screen height
		const distance = innerHeight * 0.6; 
		
		if (scrollY < start) return 0;
		if (scrollY > start + distance) return 1;
		return (scrollY - start) / distance;
	});

	// Phase 1 (0.0 to 0.3): Initial text gets out of the way faster
	let textFadeProgress = $derived(Math.min(aboutProgress / 0.3, 1));
	
	// Phase 2 (0.1 to 0.7): The Raw linear progress of the snap
	let rawSnap = $derived(Math.max(0, Math.min((aboutProgress - 0.1) / 0.6, 1))); 
	
	// THE FRAMER SECRET: "Ease-Out Cubic" Math
	// This makes the cards fly in super fast, then gently magnetic-snap into place.
	let snapProgress = $derived(1 - Math.pow(1 - rawSnap, 3)); 
	
	// Phase 3 (0.5 to 1.0): New text reveals slightly earlier
	let revealProgress = $derived(Math.max(0, Math.min((aboutProgress - 0.5) / 0.5, 1)));

	// --- MOUSE TRACKING FOR GRID ---
	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	// --- HERO CAROUSEL LOGIC ---
	let currentHeroIndex = $state(0);
	onMount(() => {
		if (heroImages && heroImages.length > 1) {
			const interval = setInterval(() => {
				currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
			}, 8000); 
			return () => clearInterval(interval);
		}
	});

	// --- PROPERTIES CAROUSEL LOGIC ---
	let currentIndex = $state(0);
	let startX = 0;
	let isDragging = $state(false);
	let dragOffset = $state(0); 

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

	function handlePointerDown(e: PointerEvent) {
		isDragging = true;
		startX = e.clientX;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;
		dragOffset = e.clientX - startX;
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		
		if (dragOffset > 75) {
			prev();
		} else if (dragOffset < -75) {
			next();
		}
		
		isDragging = false;
		dragOffset = 0;
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	}

	// --- CUSTOM REVEAL ACTION ---
	function reveal(node: HTMLElement) {
		node.classList.add('opacity-0', 'translate-y-16', 'transition-all', 'duration-[1200ms]', 'ease-out');
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					node.classList.remove('opacity-0', 'translate-y-16');
					node.classList.add('opacity-100', 'translate-y-0', 'is-revealed');
					observer.unobserve(node);
				}
			});
		}, { threshold: 0.15 });

		observer.observe(node);
		return { destroy() { observer.disconnect(); } };
	}
</script>

<svelte:window onmousemove={handleMouseMove} bind:scrollY bind:innerHeight />

<svelte:head>
	<title>Jax Street CRE | Indiana Commercial Real Estate</title>
	<meta name="description" content="Jax Street CRE is an owner-operated commercial real estate firm in central Indiana, specializing in high-demand retail and light industrial properties." />

	<meta property="og:title" content="Jax Street CRE | Bloomington & Central IN Commercial Real Estate" />
	<meta property="og:description" content="Jax Street CRE is an owner-operated commercial real estate firm in central Indiana, specializing in high-demand retail and light industrial properties." />
	<meta property="og:type" content="website" />
	
	{#if heroImages && heroImages.length > 0}
		<meta property="og:image" content="/logo-white.svg" />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content="/logo-white.svg" />
	{/if}
</svelte:head>

<div class="bg-zinc-950 min-h-screen text-white selection:bg-teal-500 overflow-x-clip">
	<h1 class="sr-only">Jax Street CRE: Premium Commercial Real Estate in Bloomington and Central Indiana</h1>
	
	<section class="relative h-screen flex flex-col justify-center px-6 md:px-12 z-10 overflow-hidden bg-zinc-950">
		
		<div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
			<div class="absolute inset-0 opacity-[0.15]" 
				 style="background-image: linear-gradient(to right, #71717a 1px, transparent 1px), linear-gradient(to bottom, #71717a 1px, transparent 1px); background-size: 60px 60px;">
			</div>
			</div>

		{#each heroImages as img, i}
			<div 
				class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out opacity-40 mix-blend-luminosity"
				style="background-image: url('{img}'); opacity: {i === currentHeroIndex ? 0.4 : 0};"
			></div>
		{/each}

		{#each heroImages as img, i}
			<div 
				class="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out pointer-events-none"
				style="
					background-image: url('{img}'); 
					opacity: {i === currentHeroIndex ? 0.85 : 0};
					mask-image: radial-gradient(600px circle at {mouseX}px {mouseY}px, black 0%, transparent 80%);
					-webkit-mask-image: radial-gradient(600px circle at {mouseX}px {mouseY}px, black 0%, transparent 80%);
				"
			></div>
		{/each}

		<div class="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none"></div>
		
		<div class="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-start mt-20">
			
			<div use:reveal class="w-full flex items-center justify-center gap-4 mb-12">
				<div class="hidden sm:block h-px w-8 md:w-12 bg-teal-500"></div>
				<span class="text-teal-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] drop-shadow-md text-center">Indiana Commercial Real Estate</span>
				<div class="hidden sm:block h-px w-8 md:w-12 bg-teal-500"></div>
			</div>

			<h1 class="text-4xl md:text-6xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] uppercase mb-8">
				<span use:reveal class="block text-white">Structure.</span>
				<span use:reveal class="block text-zinc-300">Vision.</span>
				<span use:reveal class="block text-zinc-600">Execution.</span>
			</h1>
			
			<p use:reveal class="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed font-light">
				Rooted in Indiana commercial real estate, we are hands-on owners specializing in retail and light industrial properties. We partner with our tenants for long-term success.
			</p>
			
			<div use:reveal class="flex flex-col sm:flex-row gap-6">
				<a href="/properties/available" class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 group relative bg-teal-600 hover:bg-teal-500 text-white font-bold uppercase tracking-widest text-xs py-5 px-10 rounded-sm transition-all duration-300 shadow-xl hover:shadow-teal-500/20 overflow-hidden">
					<span class="relative z-10">View Properties</span>
					<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
				</a>
				<a href="/about" class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 bg-transparent border border-zinc-700 hover:border-zinc-300 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-xs py-5 px-10 rounded-sm transition-all duration-300 text-center">
					Our Story
				</a>
			</div>
		</div>

		<div use:reveal class="absolute bottom-12 right-6 md:right-12 flex flex-col items-center gap-4 z-20">
			<span class="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600 rotate-180" style="writing-mode: vertical-rl;">Scroll</span>
			<div class="w-px h-16 bg-gradient-to-b from-zinc-500 to-transparent"></div>
		</div>
	</section>

	<section class="relative py-32 md:py-48 z-20 flex flex-col justify-center border-t border-white/5 bg-zinc-950 overflow-hidden">
		
		{#if properties.length > 0}
			<div class="absolute inset-0 z-0 opacity-80">
				{#key currentIndex}
					<img 
						src={properties[currentIndex]?.image} 
						alt="" 
            aria-hidden="true"
						class="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
						in:fade={{ duration: 800 }}
					/>
				{/key}
				<div class="absolute inset-0 bg-zinc-950/40"></div>
			</div>

			<div class="relative z-10 w-full max-w-[1800px] mx-auto px-6 h-[70vh] flex flex-col">
				
				<div use:reveal class="text-center mb-16 flex flex-col items-center">
					<h2 class="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-md">Featured Properties</h2>
				</div>

				<div 
					class="relative flex-grow flex items-center justify-center w-full cursor-grab active:cursor-grabbing touch-none"
					onpointerdown={handlePointerDown}
					onpointermove={handlePointerMove}
					onpointerup={handlePointerUp}
					onpointercancel={handlePointerUp}
				>
					{#each properties as property, i}
						{@const offset = getOffset(i)}
						
						<div 
							class="absolute h-full flex flex-col justify-center select-none"
							style="
								transform: translateX(calc({offset * 115}% + {dragOffset}px)); 
								opacity: {offset === 0 ? 1 : 0.3}; 
								scale: {offset === 0 ? 1 : 0.8}; 
								z-index: {offset === 0 ? 20 : 10};
								pointer-events: {offset === 0 ? 'auto' : 'none'};
								width: {offset === 0 ? 'max(75vw, 85vw)' : 'max(55vw, 65vw)'}; 
								max-width: {offset === 0 ? '1000px' : '750px'};
								transition: {isDragging ? 'none' : 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'};
							"
						>
							<div class="relative w-full aspect-square sm:aspect-[16/9] md:aspect-[21/9] bg-zinc-900 overflow-hidden rounded-sm ring-1 ring-white/10 shadow-2xl">
								<img draggable="false" src={property.image} alt={property.title} class="w-full h-full object-cover grayscale opacity-80 {offset === 0 ? 'grayscale-0 opacity-100' : ''} transition-all duration-1000" />
								
								<div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90"></div>
								
								<div class="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
									<div class="flex-grow">
										<div class="flex flex-wrap items-center gap-2 mb-2 sm:mb-4">
											<span class="inline-block bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm backdrop-blur-md">
												{property.status}
											</span>
											
											{#if property.squareFootage}
												<span class="inline-block bg-zinc-900/80 text-zinc-300 border border-zinc-700/50 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm backdrop-blur-md">
													{property.squareFootage}
												</span>
											{/if}
										</div>
										
										<h3 class="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-1 sm:mb-2 line-clamp-2">
											{property.title}
										</h3>
										
										<p class="text-zinc-300 font-medium text-sm sm:text-base flex items-center gap-2 mb-2 sm:mb-3">
											<svg class="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
											<span class="truncate">{property.location}</span>
										</p>

										{#if property.tenants && property.tenants.length > 0}
											<p class="text-white font-bold text-sm sm:text-base line-clamp-1">
												<span class="text-teal-400/80 mr-1 text-[10px] uppercase tracking-widest font-bold">Tenants:</span> 
												{property.tenants.join(', ')}
											</p>
										{/if}
									</div>
									
									<a href="/properties/{property.slug}" onclick={(e) => { if(isDragging) e.preventDefault(); e.stopPropagation(); }} class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 shrink-0 flex justify-center items-center gap-4 group/btn bg-white/10 hover:bg-white border border-white/20 hover:border-white backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-sm transition-all duration-300 cursor-pointer mt-2 md:mt-0">
										<span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white group-hover/btn:text-zinc-950 transition-colors">View Listing</span>
										<div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-500 text-white flex items-center justify-center group-hover/btn:bg-zinc-950 transition-colors">
											<svg class="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
										</div>
									</a>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<div class="flex justify-center gap-3 mt-12">
					{#each properties as _, i}
						<button 
							onclick={() => currentIndex = i}
							class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 h-1.5 rounded-full transition-all duration-500 shadow-md {i === currentIndex ? 'bg-teal-500 w-8' : 'bg-zinc-400 w-2 hover:bg-zinc-200' }"
							aria-label="Go to slide {i + 1}"
						></button>
					{/each}
				</div>
			</div>
		{:else}
			<div class="text-center py-32 text-zinc-600">Building Our Portfolio...</div>
		{/if}
	</section>

<!-- SCATTER TO GRID SECTION (LIGHT THEME) -->
<section bind:this={aboutSection} class="relative bg-white" style="height: 170vh;">
    <div class="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-white border-t border-b border-zinc-200">

        <!-- INITIAL TEXT -->
        <div class="absolute flex flex-col items-center text-center px-6"
             style="opacity: {1 - textFadeProgress}; transform: translateY({textFadeProgress * -30}px); pointer-events: {textFadeProgress > 0 ? 'none' : 'auto'};">
            <h2 class="text-4xl md:text-6xl font-bold text-zinc-950 tracking-tighter max-w-4xl leading-tight">
                Our buildings set up our tenants for long-term success.
            </h2>
        </div>

        <!-- THE CARDS -->
        <div class="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 pointer-events-none"
             style="transform: translateY({(revealProgress * -15)}vh);">

            <!-- Left Card -->
            <div class="aspect-[4/3] md:aspect-[3/4] rounded-sm overflow-hidden shadow-2xl bg-zinc-100 border border-zinc-200 will-change-transform"
                 style="transform: translate({(1 - snapProgress) * -30}vw, {(1 - snapProgress) * 30}vh) rotate({(1 - snapProgress) * -25}deg) scale({0.8 + (snapProgress * 0.2)}); opacity: {0.3 + (snapProgress * 0.7)};">
                 {#if properties[0]}<img src={properties[0].image} alt="" class="w-full h-full object-cover" style="filter: grayscale({(1 - snapProgress) * 100}%);" />{/if}
            </div>

            <!-- Center Card -->
            <div class="hidden md:block aspect-[3/4] rounded-sm overflow-hidden shadow-2xl bg-zinc-100 border border-zinc-200 will-change-transform"
                 style="transform: translate(0px, {(1 - snapProgress) * 40}vh) rotate({(1 - snapProgress) * 15}deg) scale({1.1 - (snapProgress * 0.1)}); opacity: {0.3 + (snapProgress * 0.7)};">
                 {#if properties[1]}<img src={properties[1].image} alt="" class="w-full h-full object-cover" style="filter: grayscale({(1 - snapProgress) * 100}%);" />{/if}
            </div>

            <!-- Right Card -->
            <div class="hidden md:block aspect-[3/4] rounded-sm overflow-hidden shadow-2xl bg-zinc-100 border border-zinc-200 will-change-transform"
                 style="transform: translate({(1 - snapProgress) * 30}vw, {(1 - snapProgress) * 20}vh) rotate({(1 - snapProgress) * 20}deg) scale({0.9 + (snapProgress * 0.1)}); opacity: {0.3 + (snapProgress * 0.7)};">
                 {#if properties[2]}<img src={properties[2].image} alt="" class="w-full h-full object-cover" style="filter: grayscale({(1 - snapProgress) * 100}%);" />{/if}
            </div>

        </div>

        <!-- REVEALED TEXT & BUTTON -->
        <div class="z-20 absolute bottom-[10%] md:bottom-[15%] max-w-3xl mx-auto flex flex-col items-center text-center px-6"
             style="opacity: {revealProgress}; transform: translateY({30 - (revealProgress * 30)}px); pointer-events: {revealProgress > 0.8 ? 'auto' : 'none'};">
            
            <h3 class="text-3xl md:text-5xl font-bold text-zinc-950 mb-6 tracking-tighter leading-tight">
                We operate high demand <span class="text-transparent inline-block" style="-webkit-text-stroke: 1px #09090b;">real estate</span><br/> 
                and treat our tenants <span class="text-teal-600 italic font-light">like family.</span>
            </h3>
            
			<a href="/about" use:magnetic class="transition-transform duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase tracking-widest text-xs px-10 py-5 rounded-sm shadow-xl hover:shadow-teal-600/20 group flex items-center gap-3">
				Discover Our Story
				<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
			</a>
        </div>

    </div>
</section>

</div>

<style>
	/* Custom class for outline text on dark backgrounds */
	.webkit-text-stroke {
		-webkit-text-stroke: 2px #f4f4f5; /* zinc-100 */
		color: transparent;
	}

	/* Custom class for outline text on white backgrounds */
	.webkit-text-stroke-dark {
		-webkit-text-stroke: 2px #09090b; /* zinc-950 */
		color: transparent;
	}

	.webkit-text-stroke-light {
		-webkit-text-stroke: 2px #e4e4e7; /* zinc-200 */
		color: transparent;
	}

	@keyframes shimmer {
		100% { transform: translateX(100%); }
	}

	/* --- SVG BLUEPRINT DRAWING ANIMATIONS --- */
	.path-draw {
		stroke-dasharray: 4000;
		stroke-dashoffset: 4000;
	}
	
	:global(.is-revealed) .path-draw {
		animation: drawBlueprint 4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.path-delay-1 { animation-delay: 0.1s; }
	.path-delay-2 { animation-delay: 0.4s; }
	.path-delay-3 { animation-delay: 0.7s; }
	.path-delay-4 { animation-delay: 0.9s; }
	.path-delay-5 { animation-delay: 1.2s; }
	.path-delay-6 { animation-delay: 1.5s; }

	@keyframes drawBlueprint {
		to { stroke-dashoffset: 0; }
	}
</style>