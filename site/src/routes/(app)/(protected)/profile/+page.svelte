<script lang="ts">
  import ProfileCard from "./ProfileCard.svelte";

  export let data;

  $: ({ user } = data.session);
</script>

<main class="main-column py-4">
  <ProfileCard
    username={user?.name ?? "Uknown user"}
    rating={user?.rating}
    img={user?.image ?? null}
    on:logout={() => fetch("/login?/logout", { method: "post", body: "" })}
  />
</main>
