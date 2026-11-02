// The launch video, scene by scene. Each scene fades into the next.
import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/geist/600.css';
import '@fontsource/geist/700.css';
import '@fontsource/geist-mono/400.css';
import '@halo-ds/tokens/css';
import '@halo-ds/react/styles.css';
import './video.css';
import { AbsoluteFill, Audio, Series, continueRender, delayRender, staticFile } from 'remotion';
import timeline from './timeline.json';
import { Apps } from './scenes/Apps';
import { Assets } from './scenes/Assets';
import { Cli } from './scenes/Cli';
import { Components } from './scenes/Components';
import { DarkMode } from './scenes/DarkMode';
import { Figma } from './scenes/Figma';
import { Icons } from './scenes/Icons';
import { Illustrations } from './scenes/Illustrations';
import { Interact } from './scenes/Interact';
import { Intro } from './scenes/Intro';
import { Mcp } from './scenes/Mcp';
import { Outro } from './scenes/Outro';
import { Tokens } from './scenes/Tokens';

// Fonts load only when text first uses them, so ask for every weight before any frame is drawn
const fonts = delayRender('Loading fonts');
Promise.all([...['400', '500', '600', '700'].map((w) => document.fonts.load(`${w} 16px Geist`)), document.fonts.load('400 16px "Geist Mono"')]).then(() => continueRender(fonts));

// The order of the video. Each scene's length is in timeline.json, which the music reads too.
const scenes = [
  [Intro, timeline.intro],
  [Interact, timeline.interact],
  [DarkMode, timeline.dark],
  [Components, timeline.components],
  [Tokens, timeline.tokens],
  [Icons, timeline.icons],
  [Illustrations, timeline.illustrations],
  [Assets, timeline.assets],
  [Apps, timeline.apps],
  [Cli, timeline.cli],
  [Mcp, timeline.mcp],
  [Figma, timeline.figma],
  [Outro, timeline.outro],
] as const;

export const launchFrames = scenes.reduce((n, [, f]) => n + f, 0);

export function Launch() {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('music.wav')} volume={0.7} />
      <Series>
      {scenes.map(([Scene, frames], i) => (
        <Series.Sequence key={i} durationInFrames={frames}>
          <Scene />
        </Series.Sequence>
      ))}
      </Series>
    </AbsoluteFill>
  );
}
