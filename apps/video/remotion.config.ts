// Sharp frames: lossless PNG screenshots, drawn at twice the size (4K), and a high-quality encode,
// so thin borders and small text stay crisp on any screen.
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setScale(2);
Config.setCrf(16);
