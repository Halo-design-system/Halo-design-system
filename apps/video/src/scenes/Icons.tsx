// A field of Phosphor icons that pops in as a wave from the centre, around the count.
import { useCurrentFrame } from 'remotion';
import type { Icon } from '@phosphor-icons/react';
import {
  Airplane,
  Bell,
  BookmarkSimple,
  Calendar,
  Camera,
  ChartBar,
  ChatCircle,
  Check,
  Cloud,
  Code,
  Coffee,
  CreditCard,
  Envelope,
  Eye,
  File,
  Fire,
  Flag,
  Folder,
  Gear,
  Gift,
  Globe,
  Heart,
  House,
  Image,
  Key,
  Lightning,
  Link,
  Lock,
  MagnifyingGlass,
  MapPin,
  Microphone,
  Moon,
  MusicNote,
  PaperPlaneTilt,
  Phone,
  Play,
  Plus,
  PushPin,
  Rocket,
  ShoppingCart,
  Sparkle,
  Star,
  Sun,
  Tag,
  Trash,
  Trophy,
  User,
  Users,
  VideoCamera,
  Wallet,
  WifiHigh,
} from '@phosphor-icons/react';
import { Count, Scene, Title, progress } from '../ui';

const icons: Icon[] = [
  House, MagnifyingGlass, Bell, Gear, User, Users, Heart, Star, Envelope, ChatCircle, Calendar, Camera, Image, Folder, File, Lock, Key,
  Cloud, Globe, MapPin, Phone, VideoCamera, Microphone, MusicNote, Play, ShoppingCart, CreditCard, Wallet, Gift, Trophy, Rocket, Lightning,
  Fire, Sparkle, Sun, Moon, Coffee, Airplane, PaperPlaneTilt, Link, Code, ChartBar, Check, Plus, Trash, Tag, Flag, BookmarkSimple, PushPin,
  Eye, WifiHigh,
];

const COLS = 14;
const ROWS = 7;
const CELL = 128;

export function Icons() {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gridAutoRows: CELL }}>
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const c = i % COLS;
            const r = Math.floor(i / COLS);
            const dist = Math.hypot(c - (COLS - 1) / 2, (r - (ROWS - 1) / 2) * 1.4);
            // Leave room in the middle for the count
            if (dist < 2.6) return <span key={i} />;
            const at = 4 + dist * 3;
            const p = progress(frame, at, at + 14);
            const Glyph = icons[(i * 7) % icons.length]!;
            const filled = (i * 5) % 3 === 0;
            return (
              <span key={i} style={{ display: 'grid', placeItems: 'center', opacity: p * (1 - dist / 14), transform: `scale(${0.4 + p * 0.6}) rotate(${(1 - p) * -40}deg)`, color: 'var(--halo-icon-primary)' }}>
                <Glyph size={56} weight={filled ? 'fill' : 'regular'} />
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <Title value={<Count to={1512} start={4} />} label="Phosphor icons" />
      </div>
    </Scene>
  );
}
