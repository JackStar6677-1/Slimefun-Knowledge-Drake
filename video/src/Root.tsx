import { Composition } from "remotion";
import { Video, totalFrames, FPS } from "./Video";
import { GuideBook, guideFrames } from "./Guide";
import { PromoReel, reelFrames } from "./Reel";

export const Root = () => (
  <>
    <Composition id="DustFarm" component={Video} durationInFrames={totalFrames()} fps={FPS} width={1920} height={1080} />
    <Composition id="GuideBook" component={GuideBook} durationInFrames={guideFrames()} fps={FPS} width={1920} height={1080} />
    <Composition id="PromoReel" component={PromoReel} durationInFrames={reelFrames()} fps={FPS} width={1080} height={1920} />
  </>
);
