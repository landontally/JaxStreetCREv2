<script lang="ts">
    import { page } from '$app/stores';
    import { magnetic } from '$lib/magnetic';
</script>

<svelte:head>
    <title>Page Not Found | Jax Street CRE</title>
</svelte:head>

<div class="min-h-[85vh] flex flex-col items-center justify-center bg-zinc-950 text-center px-6 relative overflow-hidden">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="relative z-10 flex flex-col items-center">
        <span class="text-teal-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
            {#if $page.status === 404} 404 Error {:else} Error {$page.status} {/if}
        </span>
        
        <h1 class="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6 leading-none">
            Dead <span class="text-transparent inline-block" style="-webkit-text-stroke: 2px white;">End.</span>
        </h1>
        
        <p class="text-zinc-400 text-lg md:text-xl font-medium max-w-lg mb-12">
            {#if $page.status === 404}
                Looks like this property isn't on the market anymore, or the link you followed is broken.
            {:else}
                Looks like we hit a slight snag: {$page.error?.message}
            {/if}
        </p>

        <a 
            href="/" 
            use:magnetic 
            class="transition-transform duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase tracking-widest text-xs px-10 py-5 rounded-sm shadow-xl hover:shadow-teal-600/20 group flex items-center gap-3"
        >
            <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Homepage
        </a>
    </div>
</div>