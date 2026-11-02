import { Composition } from 'remotion';
import { Launch, launchFrames } from './Launch';

export function Root() {
  return <Composition id="Launch" component={Launch} durationInFrames={launchFrames} fps={30} width={1920} height={1080} />;
}
