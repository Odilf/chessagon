<div class="max-w-xl py-8 px-2">
  <h1 class="h1 text-center mb-8">About</h1>

  <p class="mb-2">
    Chessagon is a project that has both a performant engine written in Rust,
    and a web frontend (which is where you are right now) in Svelte
  </p>

  <p class="mb-2">
    The most interesting part about this project is probably the architecture.
    The engine that processes all moves is written in Rust. Then, it is compiled
    to wasm so it can be used in the frontend. However, SvelteKit uses js for
    the backend so instead of doing FFI bullshit I just use wasm in the backend
    too, even though the server could run native code compiled by Rust.
  </p>

  <p class="mb-2">
    Part of the raison d'etre of this proejct is to explore this architecture
    and it worked mostly great, but there are a few papercut and annoyances to
    be dealt. I hoped I would be able to drop in Rust for every moderately
    complex piece of logic but that doesn't seem feasiable, unfortunetaly.
  </p>

  <p class="mb-2">
    You can check out more info on the <a
      href="https://github.com/Odilf/chessagon"
      class="anchor"
    >
      GitHub page
    </a>
  </p>
</div>
