<script lang="ts">
  import ProfileCard from "./ProfileCard.svelte";

  export let data;
</script>

<main class="main-column py-4">
  <ProfileCard
    username="Odilf"
    rating={1200}
    on:logout={() => {
      data.supabase.auth.signOut();
      console.log("poopop");
    }}
  />
</main>
