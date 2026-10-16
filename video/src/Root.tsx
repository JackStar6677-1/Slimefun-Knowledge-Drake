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
import { ShortSaori, SAORI_FRAMES } from "./ShortSaori";
import { ShortNetworksDupe, NETWORKS_FRAMES } from "./ShortNetworksDupe";
import { ShortCustomGui, CUSTOMGUI_FRAMES } from "./ShortCustomGui";
import { ShortArchitecture, ARCH_FRAMES } from "./ShortArchitecture";
import { ShortSfStart, SF_START_FRAMES } from "./ShortSfStart";
import { ShortSfEnergyRule, SF_ENERGY_RULE_FRAMES } from "./ShortSfEnergyRule";
import { ShortSfNoHoppers, SF_NO_HOPPERS_FRAMES } from "./ShortSfNoHoppers";
import { ShortSfCargoRules, SF_CARGO_RULES_FRAMES } from "./ShortSfCargoRules";
import { ShortSfReactorSafety, SF_REACTOR_SAFETY_FRAMES } from "./ShortSfReactorSafety";
import { ShortSfMemoryPointers, SF_MEMORY_POINTERS_FRAMES } from "./ShortSfMemoryPointers";
import { Capitulo3, TOTAL_CAPITULO3_FRAMES } from "./Capitulo3";
import { Capitulo4, TOTAL_CAPITULO4_FRAMES } from "./Capitulo4";
import { SlimefunCapitulo1, TOTAL_SF_CAPITULO1_FRAMES } from "./SlimefunCapitulo1";
import { SlimefunCapitulo2, TOTAL_SF_CAPITULO2_FRAMES } from "./SlimefunCapitulo2";
import { SlimefunCapitulo3, TOTAL_SF_CAPITULO3_FRAMES } from "./SlimefunCapitulo3";
import { SlimefunCapitulo4, TOTAL_SF_CAPITULO4_FRAMES } from "./SlimefunCapitulo4";
import { SlimefunCapitulo5, TOTAL_SF_CAPITULO5_FRAMES } from "./SlimefunCapitulo5";
import { SlimefunCapitulo6, TOTAL_SF_CAPITULO6_FRAMES } from "./SlimefunCapitulo6";
import { SlimefunCapitulo7, TOTAL_SF_CAPITULO7_FRAMES } from "./SlimefunCapitulo7";

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
    <Composition id="Capitulo3" component={Capitulo3} durationInFrames={TOTAL_CAPITULO3_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="Capitulo4" component={Capitulo4} durationInFrames={TOTAL_CAPITULO4_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="SlimefunCapitulo1" component={SlimefunCapitulo1} durationInFrames={TOTAL_SF_CAPITULO1_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="SlimefunCapitulo2" component={SlimefunCapitulo2} durationInFrames={TOTAL_SF_CAPITULO2_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="SlimefunCapitulo3" component={SlimefunCapitulo3} durationInFrames={TOTAL_SF_CAPITULO3_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="SlimefunCapitulo4" component={SlimefunCapitulo4} durationInFrames={TOTAL_SF_CAPITULO4_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="SlimefunCapitulo5" component={SlimefunCapitulo5} durationInFrames={TOTAL_SF_CAPITULO5_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="SlimefunCapitulo6" component={SlimefunCapitulo6} durationInFrames={TOTAL_SF_CAPITULO6_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="SlimefunCapitulo7" component={SlimefunCapitulo7} durationInFrames={TOTAL_SF_CAPITULO7_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="ShortSaori" component={ShortSaori} durationInFrames={SAORI_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ShortNetworksDupe" component={ShortNetworksDupe} durationInFrames={NETWORKS_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ShortCustomGui" component={ShortCustomGui} durationInFrames={CUSTOMGUI_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ShortArchitecture" component={ShortArchitecture} durationInFrames={ARCH_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ShortSfStart" component={ShortSfStart} durationInFrames={SF_START_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ShortSfEnergyRule" component={ShortSfEnergyRule} durationInFrames={SF_ENERGY_RULE_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ShortSfNoHoppers" component={ShortSfNoHoppers} durationInFrames={SF_NO_HOPPERS_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ShortSfCargoRules" component={ShortSfCargoRules} durationInFrames={SF_CARGO_RULES_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ShortSfReactorSafety" component={ShortSfReactorSafety} durationInFrames={SF_REACTOR_SAFETY_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ShortSfMemoryPointers" component={ShortSfMemoryPointers} durationInFrames={SF_MEMORY_POINTERS_FRAMES} fps={30} width={1080} height={1920} />
  </>
);


