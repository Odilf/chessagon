<script lang="ts">
  import { page } from "$app/stores";
</script>

<!-- TODO: Maybe just redirect? -->
<h1 class="h1 pt-8">Whoops!</h1>
<p>The requested game seems to not exist</p>

<a class="anchor text-xl py-4" href="/play"> Go back to available games </a>

<p class="opacity-20">
  {$page.error?.message}
</p>
