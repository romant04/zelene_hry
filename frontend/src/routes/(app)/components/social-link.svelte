<script lang="ts">
	export let href: string;
</script>

<a
	target="_blank"
	class="flex h-10 w-10 items-center justify-center rounded-full bg-white hover:bg-success-500"
	href="{href}"
>
	<slot />
</a>
