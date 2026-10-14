import { Composition } from "remotion";
import { Video, totalFrames, FPS } from "./Video";
import { GuideBook, guideFrames } from "./Guide";
import { PromoReel, reelFrames } from "./Reel";
import { Test3D } from "./Test3D";
import { StartYT, StartReel, startYtFrames, startReelFrames } from "./Start";

export const Root = () => (
  <>
    <Composition id="DustFarm" component={Video} durationInFrames={totalFrames()} fps={FPS} width={1920} height={1080} />
    <Composition id="GuideBook" component={GuideBook} durationInFrames={guideFrames()} fps={FPS} width={1920} height={1080} />
    <Composition id="PromoReel" component={PromoReel} durationInFrames={reelFrames()} fps={FPS} width={1080} height={1920} />
    <Composition id="Test3D" component={Test3D} durationInFrames={120} fps={FPS} width={1920} height={1080} />
    <Composition id="StartYT" component={StartYT} durationInFrames={startYtFrames()} fps={FPS} width={1920} height={1080} />
    <Composition id="StartReel" component={StartReel} durationInFrames={startReelFrames()} fps={FPS} width={1080} height={1920} />
  </>
);
