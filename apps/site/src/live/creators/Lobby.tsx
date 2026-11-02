// The waiting room before a call: check your mic and camera, then join. It has no menu, so nothing gets in the way.
import { useState } from 'react';
import { Avatar, Badge, Button, CompactButton, QRCode, SelectField, Tooltip, useToast } from '@halo-ds/react';
import { Clock, Microphone, MicrophoneSlash, SpeakerHigh, SpeakerSlash, VideoCamera, VideoCameraSlash } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { calls, me, naira } from './data';
import { Logo } from './Shell';
import '../shared/app.css';
import './creators.css';

export default function Lobby() {
  const go = useNav();
  const { toast } = useToast();
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [sound, setSound] = useState(true);
  const kofi = calls[0]!;
  const state = [mic ? 'mic' : '', cam ? 'camera' : ''].filter(Boolean);

  return (
    <div className="s-lobby-page">
      <div className="s-lobby-top">
        <Logo />
      </div>
      <div className="s-lobby">
        <div>
          <div className="s-video" aria-label={cam ? 'Your camera preview' : 'Camera off'}>
            {cam ? <span style={{ zoom: 2 }}><Avatar src={me.src} name={me.name} size="xl" /></span> : <span style={{ color: '#bbb' }}>Camera off</span>}
          </div>
          <div className="s-controls">
            <Tooltip content={mic ? 'Mute' : 'Unmute'}>
              <CompactButton variant="stroke" size="lg" round aria-label={mic ? 'Mute microphone' : 'Unmute microphone'} selected={!mic} onClick={() => setMic(!mic)}>
                {mic ? <Microphone /> : <MicrophoneSlash />}
              </CompactButton>
            </Tooltip>
            <Tooltip content={cam ? 'Turn camera off' : 'Turn camera on'}>
              <CompactButton variant="stroke" size="lg" round aria-label={cam ? 'Turn camera off' : 'Turn camera on'} selected={!cam} onClick={() => setCam(!cam)}>
                {cam ? <VideoCamera /> : <VideoCameraSlash />}
              </CompactButton>
            </Tooltip>
            <Tooltip content={sound ? 'Mute speaker' : 'Unmute speaker'}>
              <CompactButton variant="stroke" size="lg" round aria-label={sound ? 'Mute speaker' : 'Unmute speaker'} selected={!sound} onClick={() => setSound(!sound)}>
                {sound ? <SpeakerHigh /> : <SpeakerSlash />}
              </CompactButton>
            </Tooltip>
            <span className="t-muted">{state.length ? `Your ${state.join(' and ')} ${state.length > 1 ? 'are' : 'is'} on` : 'Your mic and camera are off'}</span>
          </div>
        </div>

        <div className="s-lobby-side">
          <span>
            <Badge size="sm" color="warning" icon={<Clock />}>
              Starts in 10 minutes
            </Badge>
          </span>
          <div>
            <h1>Portfolio review</h1>
            <p className="t-sub">
              With {kofi.who} · 45 minutes · paid {naira(25000)}
            </p>
          </div>
          <div className="s-card t-person">
            <Avatar src={kofi.src} name={kofi.who} size="md" status="online" />
            <span className="t-two-lines">
              <strong>{kofi.who}</strong>
              <span>Joined the waiting room</span>
            </span>
          </div>
          <SelectField label="Microphone" icon={<Microphone />} defaultValue="mac" options={[{ value: 'mac', label: 'MacBook Pro microphone' }, { value: 'airpods', label: 'AirPods Pro' }]} />
          <SelectField label="Camera" icon={<VideoCamera />} defaultValue="facetime" options={[{ value: 'facetime', label: 'FaceTime HD camera' }, { value: 'iphone', label: 'iPhone camera' }]} />
          <Button
            size="lg"
            onClick={() => {
              toast({ type: 'success', title: 'You joined the call', description: `${kofi.who} is here too.` });
              go('home');
            }}
          >
            Join call
          </Button>
          <div className="s-card t-person">
            <QRCode value="https://example.com/call/portfolio-review" size={72} label="Join from your phone" />
            <span className="t-two-lines">
              <strong>Join from your phone</strong>
              <span>Scan with your camera to join this call on mobile.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
