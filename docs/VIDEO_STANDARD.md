# Video standard — DrakesCraft

One look, one set of rules, for every tutorial and reel. Tokens live in `video/src/std/theme.ts`; change them there and every new video follows.

## Formats

| | YouTube | Reel / Short |
|---|---|---|
| Canvas | 1920×1080 (16:9) | 1080×1920 (9:16) |
| Length | ≤ 3 min per episode (a series, not one giant video) | 30–60 s |
| Hook | the surprising fact in the first 10 s | **first 3 s**: a big number, a command or a question |
| Voice | female, Spanish first (`es-CL-CatalinaNeural`), then other languages | same, ~8 % faster |
| On-screen text | headline + 3–4 short points per scene | karaoke captions, 3 words at a time, active word in gold |
| Bottom area | none | bottom 37 % (y ≥ 1230): looping visual |
| Safe zone | 80 px margins | keep text between y = 140 and y = 1200 (IG/TikTok UI covers the rest) |

Retention rules (from the community): nothing static for more than ~3 s, one idea per scene, show the thing before explaining it, end with one clear action
(IP `mc.drakescraft.cl`, Java and Bedrock, port 25565 / "link en la bio").

## Visual language

- Background `MovingBg` (`Bg.tsx`): breathing teal gradient, moving gold grid, real Slimefun icons floating up. Always on.
- Every scene fades in/out and slowly zooms (~3 %).
- Palette: `#071712` base, `#d8b65a` gold, `#ffd24a` highlight, `#f4efdf` text, `#12352a` panels.
- Real game assets only: Slimefun icons from the community pack, vanilla textures from the official client jar, GUIs rebuilt to the core's exact layout.
- **3D models** (`std/Cube3D.tsx` → `Voxels3D`): multiblock patterns from the dump, built block by block and slowly rotating. Pixel-art textures (nearest filter).
  Non-cube blocks (fences, iron bars, anvils, slabs, cauldrons) are approximations. Render with `--gl=angle`.
- Text in the game's own language: item and GUI names stay in English; explanations in the video's language.

## Bottom loops (reels) — `std/Loops.tsx`, `BottomLoop name=…`

| name | what | source |
|---|---|---|
| `dust` | metal dust falling and piling up (resets every 11 s) | procedural, ours |
| `ring` | **RingLab**: one ball bounces between 4–6 concentric rings and eats them segment by segment; live HUD with speed, kinetic energy, impact angle, v·n and the reflection formula v′ = v − 2(v·n)n, plus the predicted trajectory of the next two impacts. Deterministic physics seeded from the video title (`seed` prop), so every reel gets a different simulation; the seed search guarantees the ball survives ≥ 800 frames so the loop is never empty | procedural, ours |
| `video:<file>` | any clip in `video/public/bg/<file>` (muted, looped, cover) | external, see below |

Add a new procedural loop: write a component in `Loops.tsx`, compute its physics once at module load (deterministic seeds so renders are repeatable) and add its name to `LoopName`.

### External background clips

- **Do not use gameplay of commercial games** (Subway Surfers, etc.): copyrighted.
- Safe sources with free commercial licenses and no attribution: **Pexels** and **Pixabay** (check each license page before using; both forbid reselling the clip unaltered).
  Mixkit varies per clip. Pexels' API (free key) can search and download programmatically; its guidelines ask for a credit link when using the API.
  The agent cannot create accounts or API keys: the owner gets the key and puts it in an environment variable.
- Put downloaded clips in `video/public/bg/` (git-ignored) and keep a note of the source URL and license in `video/public/bg/SOURCES.md`.

## Audio

- Voice only (no background music yet). Keep the voice at the default level; leave ~0.4 s of silence at the end of each scene (`tts_*` scripts add it).
- If music is added later, use royalty-free tracks with a license note and duck it under the voice.

## Naming and output

- Storyboards: `tools/<topic>_videos.py` (facts + narration) → `video/public/<name>.json`.
- Compositions: register in `video/src/Root.tsx`; id `Start<YT|Reel>`, `GuideBook`, …
- Files in `out/` (git-ignored): `<topic>-youtube.mp4`, `<topic>-reel.mp4`.
- Always preview stills (`npx remotion still …`) for overlaps, cut-off text and missing icons before rendering.

## Making a change to the standard

Edit `theme.ts` / `Bg.tsx` / `std/*`, re-render one still of each format, then update this page. Old videos are not re-rendered automatically.
