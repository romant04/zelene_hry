<script lang="ts">
    import "../app.postcss"
    import "../main.css"
    import brokenRobot from "../assets/images/broken-robot.png"
</script>

<svelte:head>
    <title>Duelovky | 404</title>
</svelte:head>

<main class="main container flex flex-col gap-16 h-full justify-center items-center">
    <h1 class="text-5xl font-bold">Tady nic není...</h1>
    <img src={brokenRobot} alt="broken robot">
</main>