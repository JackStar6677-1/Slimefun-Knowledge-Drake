import { Composition } from "remotion";
import { Video, totalFrames, FPS } from "./Video";
import { GuideBook, guideFrames } from "./Guide";

export const Root = () => (
  <>
    <Composition id="DustFarm" component={Video} durationInFrames={totalFrames()} fps={FPS} width={1920} height={1080} />
    <Composition id="GuideBook" component={GuideBook} durationInFrames={guideFrames()} fps={FPS} width={1920} height={1080} />
  </>
);
