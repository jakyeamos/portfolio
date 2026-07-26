# Definition of done

A portfolio change is complete only when the relevant source and evidence are
reviewed and:

1. public claims are supported by a declared source or explicit manual owner;
2. no private paths, prompts, code, diffs, transcripts, credentials, or
   unreviewed media enter the public projection;
3. `pnpm format:check`, `pnpm architecture:check`,
   `pnpm environment:check`, `pnpm typecheck`, and `pnpm test` pass;
4. `pnpm secret:scan` passes and dependency verification is passed or explicitly
   reported unavailable;
5. `pnpm build` succeeds and generated output is not mistaken for source;
6. tracker/evidence changes are intentional, reviewable, and limited to
   public-safe fields;
7. deployment or publication evidence is recorded separately from local build
   success.

For a release, also verify the expected commit on the configured Netlify site
with `pnpm deploy:status` when credentials are available. A missing live check
remains an unresolved release condition.
