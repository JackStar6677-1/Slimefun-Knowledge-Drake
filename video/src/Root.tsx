import { Composition } from "remotion";
import { Video, totalFrames, FPS } from "./Video";
import { GuideBook, guideFrames } from "./Guide";
import { PromoReel, reelFrames } from "./Reel";
import { Test3D } from "./Test3D";
import { TestRing } from "./TestRing";
import { PromoV2, promoFrames } from "./Promo";
import { StartYT, StartReel, startYtFrames, startReelFrames } from "./Start";
import { NetworksEpisode } from "./NetworksEpisode";
import { NetworksReel } from "./NetworksReel";
import { PresentationShort } from "./PresentationShort";
import { PresentationLong, TOTAL_LONG_FRAMES } from "./PresentationLong";
import { Capitulo1, TOTAL_CAPITULO1_FRAMES } from "./Capitulo1";
import { Capitulo2, TOTAL_CAPITULO2_FRAMES } from "./Capitulo2";

export const Root = () => (
  <>
    <Composition id="DustFarm" component={Video} durationInFrames={totalFrames()} fps={FPS} width={1920} height={1080} />
    <Composition id="GuideBook" component={GuideBook} durationInFrames={guideFrames()} fps={FPS} width={1920} height={1080} />
    <Composition id="PromoReel" component={PromoReel} durationInFrames={reelFrames()} fps={FPS} width={1080} height={1920} />
    <Composition id="Test3D" component={Test3D} durationInFrames={120} fps={FPS} width={1920} height={1080} />
    <Composition id="StartYT" component={StartYT} durationInFrames={startYtFrames()} fps={FPS} width={1920} height={1080} />
    <Composition id="StartReel" component={StartReel} durationInFrames={startReelFrames()} fps={FPS} width={1080} height={1920} />
    <Composition id="TestRing" component={TestRing} durationInFrames={900} fps={FPS} width={1080} height={1920} />
    <Composition id="PromoV2" component={PromoV2} durationInFrames={promoFrames()} fps={FPS} width={1080} height={1920} />
    <Composition id="NetworksTutorial" component={NetworksEpisode} durationInFrames={900} fps={30} width={1920} height={1080} />
    <Composition id="NetworksReel" component={NetworksReel} durationInFrames={900} fps={30} width={1080} height={1920} />
    <Composition id="PresentationShort" component={PresentationShort} durationInFrames={1440} fps={30} width={1080} height={1920} />
    <Composition id="PresentationLong" component={PresentationLong} durationInFrames={TOTAL_LONG_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Capitulo1" component={Capitulo1} durationInFrames={TOTAL_CAPITULO1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Capitulo2" component={Capitulo2} durationInFrames={TOTAL_CAPITULO2_FRAMES} fps={30} width={1280} height={720} />
  </>
);
