<script lang="ts">
    import brokenRobot from "../../../assets/images/broken-robot.png"
    import {onMount} from "svelte";

    onMount(() => {
        localStorage.setItem("out-of-service", "y")
    })
</script>

<svelte:head>
    <title>Duelovky | služba mimo provoz</title>
</svelte:head>

<div class="container h-full justify-center flex flex-col gap-16 items-center">
    <h1 class="text-5xl font-bold text-center leading-[4rem]">Služba je mimo provoz, <br> zkuste to později.</h1>
    <img src={brokenRobot} alt="broken robot">
</div>