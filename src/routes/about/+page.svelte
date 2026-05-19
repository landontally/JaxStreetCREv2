<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	// Pull in the data from the +page.server.ts file
	let { data } = $props();
	
	// Use the image from Sanity, or fallback to the Unsplash URL if Sanity is empty
	let heroImage = data?.aboutPage?.heroImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070';

	// --- Mouse Tracking for the Global Grid ---
	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}

	// --- Rotating Words Logic ---
	const rotatingWords = ['excellence.', 'perfection.', 'partnerships.', 'growth.'];
	let currentWordIndex = $state(0);

	// --- Scroll Scrubbing Logic ---
	let textSection = $state<HTMLElement>();
	let revealProgress = $state(0); // 0 to 1

	let p1 = $derived(Math.min(Math.max(revealProgress * 3, 0), 1) * 100);
	let p2 = $derived(Math.min(Math.max((revealProgress - 0.33) * 3, 0), 1) * 100);
	let p3 = $derived(Math.min(Math.max((revealProgress - 0.66) * 3, 0), 1) * 100);

	// --- Custom Reveal Action ---
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
		}, { threshold: 0.15 });

		observer.observe(node);
		return { destroy() { observer.disconnect(); } };
	}

	onMount(() => {
		const interval = setInterval(() => {
			currentWordIndex = (currentWordIndex + 1) % rotatingWords.length;
		}, 2500);

		const handleScroll = () => {
			if (!textSection) return;
			const rect = textSection.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const start = windowHeight * 0.6; 
			const end = windowHeight * 0.2; 
			const current = start - rect.top;
			const total = start - end;
			let progress = current / total;
			revealProgress = Math.max(0, Math.min(1, progress)); 
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); 

		return () => {
			clearInterval(interval);
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// --- TEAM ARRAY (Updated to use local static images) ---
	const team = [
		{
			name: 'E, MBA',
			role: 'Founder & Principal',
			bio: "Replacement text for E's bio. This should be updated with the actual content that describes E's background, experience, and role at Jax Street CRE.",
			// Make sure 'placeholder.jpg' is exactly what you named the file in your static folder
			image: '/placeholder.jpg' 
		},
		{
			name: 'L',
			role: 'Digital Strategist & Development',
			bio: 'Bridging the gap between engineering precision and real estate execution. L ensures Jax Street CRE stays at the absolute forefront of the industry.',
			// Make sure 'placeholder.jpg' is exactly what you named the file in your static folder
			image: '/placeholder.jpg' 
		}
	];
</script>

<svelte:window onmousemove={handleMouseMove} />

<svelte:head>
	<title>About Us | Jax Street CRE</title>
	<meta name="description" content="Jax Street CRE is an Indiana-based commercial real estate firm focused on retail and light industrial properties." />
</svelte:head>

<div class="fixed inset-0 z-0 pointer-events-none bg-zinc-950">
	<div class="absolute inset-0 opacity-[0.15]" 
		 style="background-image: linear-gradient(to right, #71717a 1px, transparent 1px), linear-gradient(to bottom, #71717a 1px, transparent 1px); background-size: 60px 60px;">
	</div>
	<div class="absolute inset-0 transition-opacity duration-300 ease-out" 
		 style="background: radial-gradient(600px circle at {mouseX}px {mouseY}px, rgba(20, 184, 166, 0.25), transparent 40%);">
	</div>
</div>

<div class="relative z-10 text-white min-h-screen font-sans selection:bg-teal-500 overflow-hidden">
	
    <section class="relative h-screen w-full flex flex-col justify-center">
		<div class="absolute inset-0 z-0 bg-zinc-950">
			<div 
				class="absolute inset-0 bg-cover bg-center bg-fixed opacity-40"
				style="background-image: url('{heroImage}');"
			></div>
			<div class="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-zinc-950"></div>
		</div>

		<div class="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col">
			<div class="flex items-center gap-4 mb-8" in:fly={{ y: 20, duration: 1000, delay: 200 }}>
				<div class="h-px w-12 bg-teal-500"></div>
				<span class="text-teal-400 text-xs font-black uppercase tracking-[0.4em]">Est. 2025</span>
			</div>
			
			<h1 class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight" in:fly={{ y: 30, duration: 1000, delay: 400 }}>
				We are driven by <br/>
				the pursuit of <br/>
				<span class="relative inline-block h-[1.3em] overflow-hidden align-bottom min-w-[300px] md:min-w-[500px]">
					{#key currentWordIndex}
						<span 
							class="absolute top-0 left-0 text-teal-400 pr-4 pb-4"
							in:fly={{ y: 60, duration: 600, opacity: 0 }}
							out:fly={{ y: -60, duration: 600, opacity: 0 }}
						>
							{rotatingWords[currentWordIndex]}
						</span>
					{/key}
				</span>
			</h1>
		</div>
	</section>

	<section bind:this={textSection} class="relative py-40 bg-white text-zinc-950 border-y border-zinc-200">
		<div class="max-w-7xl mx-auto px-6 md:px-12">
			
			<p 
				class="md:hidden text-4xl font-bold tracking-tight leading-[1.2]"
				style="background: linear-gradient(to right, #09090b {revealProgress * 100}%, #e4e4e7 {revealProgress * 100}%); -webkit-background-clip: text; color: transparent;"
			>
				We focus on retail and light industrial properties in the markets we know best.
			</p>

			<div class="hidden md:flex flex-col md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
				<span class="w-fit" style="background: linear-gradient(to right, #09090b {p1}%, #e4e4e7 {p1}%); -webkit-background-clip: text; color: transparent;">
					We focus on retail and light
				</span>
				<span class="w-fit" style="background: linear-gradient(to right, #09090b {p2}%, #e4e4e7 {p2}%); -webkit-background-clip: text; color: transparent;">
					industrial properties in the
				</span>
				<span class="w-fit" style="background: linear-gradient(to right, #09090b {p3}%, #e4e4e7 {p3}%); -webkit-background-clip: text; color: transparent;">
					markets we know best.
				</span>
			</div>
			
			<div class="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-200 pt-12">
				<div use:reveal class="flex flex-col gap-4">
					<span class="text-teal-600 font-black uppercase tracking-widest text-xs">Our Strategy</span>
					<p class="text-zinc-600 font-medium leading-relaxed max-w-md">
						Although founded in 2025, Jax Street CRE has ties to commercial real estate since 1984. These markets allow us to operate our buildings using our vertically integrated strategy.
					</p>
				</div>
				<div use:reveal class="flex flex-col gap-4">
					<span class="text-teal-600 font-black uppercase tracking-widest text-xs">The Goal</span>
					<p class="text-zinc-600 font-medium leading-relaxed max-w-md">
						Being a hands-on property owner, we strive for Landlord perfection while being opportunistic in our growth path.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="relative py-32 px-6 md:px-12 max-w-7xl mx-auto">
		<div class="mb-32">
			<h2 use:reveal class="text-4xl font-bold tracking-tight text-white">The Minds Behind Jax Street</h2>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-32">
			{#each team as member, i}
				<div use:reveal class="flex flex-col gap-8 {i % 2 !== 0 ? 'lg:mt-48' : ''}">
					
					<div class="w-full aspect-[4/5] overflow-hidden rounded-sm bg-zinc-900 ring-1 ring-white/10 relative group shadow-2xl">
						<div class="absolute inset-0 bg-teal-500 mix-blend-multiply opacity-20 group-hover:opacity-0 transition-opacity duration-700 z-10 pointer-events-none"></div>
						<img 
							src={member.image} 
							alt={member.name} 
							class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms] ease-out" 
						/>
					</div>
					
					<div>
						<h3 class="text-3xl font-bold text-white mb-2">{member.name}</h3>
						<span class="text-teal-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 block">{member.role}</span>
						<p class="text-zinc-400 leading-relaxed font-light">{member.bio}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

</div>