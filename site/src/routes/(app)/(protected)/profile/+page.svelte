<script lang="ts">
  import ProfileCard from "./ProfileCard.svelte";

  export let data;

  $: ({ profile } = data);
</script>

<main class="main-column py-4">
  <ProfileCard
    username={profile.username}
    rating={profile.rating}
    id={profile.id}
    on:logout={() => data.supabase.auth.signOut()}
  />
</main>
