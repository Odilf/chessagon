<script lang="ts">
  let classes = "";
  export { classes as class };
</script>

<span class="loader {classes}" />

<style>
  :root {
    --size: 200px;
    --thickness: 10px;
  }
  .loader {
    width: var(--size);
    height: var(--size);
    display: inline-block;
    position: relative;
  }
  .loader::after,
  .loader::before {
    content: "";
    box-sizing: border-box;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    border: var(--thickness) solid #fff;
    position: absolute;
    left: 0;
    top: 0;
    animation: animloader 2s linear infinite;
  }
  .loader::after {
    animation-delay: -0.8s;
  }

  @keyframes animloader {
    0% {
      transform: scale(0.2);
      opacity: 0;
    }
    50% {
      transform: scale(0.6);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>
