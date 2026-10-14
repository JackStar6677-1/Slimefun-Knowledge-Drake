# Video pipeline — how an AI makes a tutorial or a reel from the knowledge base

Videos here are **code**: a storyboard (JSON) built from the dump, a voice track, and a Remotion (React) project that renders it. No editor,
no stock footage. This page is the instruction set for any AI agent (Claude, Codex, Antigravity, OpenCode…).

## 0. Interview the owner first (do not skip)

Ask these before writing a single scene. Offer the default in brackets and keep the questions short.

1. **Topic:** what should the viewer be able to *do* after watching? (one sentence)
2. **Format:** horizontal tutorial 16:9 [≤ 3 min] or vertical reel/short 9:16 [30–60 s, hook in the first 3 seconds]?
3. **Language and voice:** Spanish first, then other languages? Female voice [Chilean Spanish `es-CL-CatalinaNeural`, English `en-US-AvaNeural`].
4. **Audience:** brand-new player or someone who already knows the basics? (decides what must be explained)
5. **Visuals:** data cards and the Guide GUI renderer [default], or will the owner provide real in-game footage to overlay?
6. **Call to action:** server IP `mc.drakescraft.cl` (Java and Bedrock, port 25565), Discord, link in bio?
7. **Scope:** player-facing only. Anything marked `staff` in `knowledge/audience.json` is excluded.
8. **Approval:** who reviews it, and where it will be published. **The agent never publishes.**

Retention rules from the community: long tutorials lose people. Prefer a series of short episodes; open with the most surprising fact; keep
something moving on screen every few seconds (the shared `Bg.tsx` background and scene zoom already do this).

## 1. Facts only

Every number, recipe, cost and rule in a video must come from `data/slimefun-dump.json.gz` (use `python tools/kb.py …`) or from a cited line of
source code. If you cannot find it, **do not state it**: add the question to `knowledge/topics.json` / the study queue. Put the citation as a comment
next to the narration in the storyboard script (see the header of `tools/storyboard_dust_farm.py`).

## 2. Setup (once per machine)

```bash
pip install edge-tts mutagen pillow
cd video && npm install                       # Remotion + React (+ Three.js bindings)
# icons need: the community pack cloned next to this repo (Slimefun-Texture-Drake) and internet for the official Mojang client jar
```

Never commit Mojang textures, the pack's textures, jars, audio or rendered video (`.gitignore` already blocks them).

## 3. Build a video

1. **Pick the data.** Find items with `kb.py buscar|receta|arbol|produce|usos`; read the mechanics page in `knowledge/mechanics/` if it exists, otherwise read the
   source (see `python tools/study_queue.py brief <topic>`).
2. **Write the storyboard script** `tools/storyboard_<name>.py` (copy `storyboard_dust_farm.py` for 16:9, `reel_promo.py` for 9:16). Each scene has an `id`, a `kind`
   (which React component draws it), the data it needs and a `narration` / `text`. Keep icon references as `{"key": ITEM_ID_OR_MATERIAL, "sf": true|false}`.
3. **Narrate:** `python tools/tts_scenes.py <voice> <storyboard.json> <prefix>` (16:9, measures real audio length so scenes fit the voice) or the reel script
   (it also stores word-by-word timings for the captions).
4. **Icons:** `python tools/icons.py` (reads every JSON in `video/public/` and extracts Slimefun and vanilla icons; items the pack has no texture for fall back to their
   base material, which is what players see). Then `cp video/public/icons/index.json video/src/icons-index.json` and copy the storyboard/guide JSON into `video/src/`.
5. **Register** the composition in `video/src/Root.tsx` (1920×1080 for tutorials, 1080×1920 for reels).
6. **Preview a still before rendering:**
   `cd video && npx remotion still src/index.ts <CompositionId> ../out/check.png --frame=<n>` — look for overlaps, cut-off text, missing icons.
7. **Render:** `npx remotion render src/index.ts <CompositionId> ../out/<name>.mp4 --concurrency=6` (a 4-minute video takes ~10 minutes; run it in the background).
8. **Report to the owner** with the file path, length, the facts used and anything uncertain. Wait for approval.

## 4. Components you can reuse (`video/src/`)

| File | What it gives you |
|---|---|
| `Bg.tsx` | animated background: breathing gradient, moving grid, floating real Slimefun icons |
| `Video.tsx` | tutorial scenes: title, guide/stats counters, bars, routes (several ways to get something), power, recipe 3×3, cargo chain, layout flow, outro |
| `Guide.tsx` | the Slimefun Guide as a Minecraft chest GUI (54 slots, exact layout from the core), pages, locked categories, categories with research cost, recipe view |
| `Reel.tsx` | vertical reel: word-by-word captions, hook counter, chips, call to action, and a procedural "satisfying" dust-pile loop at the bottom |

## 5. Gotchas

- Re-running a storyboard script wipes the audio durations (`NaN` composition length): run the narration step again.
- Do not use gameplay of third-party games (Subway Surfers etc.) as background: it is copyrighted. The procedural loop in `Reel.tsx` is ours.
- `PLAYER_HEAD` icons have no flat texture; they are drawn as the default skin's face.
- On Windows prefer writing files with an editor tool instead of shell heredocs with embedded Python.
- Keep player-facing text in English unless the owner asks for a specific language version.

## 6. Output and approval

Videos go to `out/` (git-ignored). Tell the owner where they are and offer to copy them to Star/Drive. Publishing, thumbnails and titles are the owner's decision;
the optional skills in `Jakeschincariol/youtube-agent-skill` (MIT) can help with hook scoring, title/thumbnail linting and SEO once a video is approved.
