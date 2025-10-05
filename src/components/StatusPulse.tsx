import { useEffect, useState } from 'react';
import { Radio, PackageCheck, Sparkles, Truck, Box, CheckCircle2 } from 'lucide-react';

const stages = [
  {
    label: 'Lab Assembly',
    headline: 'Hand-built in the Eclipse Lab',
    description:
      'Circuit etching, plasma polishing, and firmware tuning in progress. Our artisans are calibrating luminous responses.',
    stats: [
      { label: 'Quality checks', value: '18' },
      { label: 'Lead artist', value: 'Nova Team' },
      { label: 'Completion', value: '72%' }
    ]
  },
  {
    label: 'Aurora Sync',
    headline: 'Digital Assets Linked',
    description:
      'Your downloadable skins, presets, and AR overlays are being sealed to the hardware with secure Aurora signatures.',
    stats: [
      { label: 'Files packaged', value: '42' },
      { label: 'Checksum', value: 'Verified' },
      { label: 'Cloud handoff', value: 'Ready' }
    ]
  },
  {
    label: 'Launch Prep',
    headline: 'Packaging in Progress',
    description:
      'Neon-safe casing, holographic certificates, and climate-controlled shipping modules are being assembled.',
    stats: [
      { label: 'Packaging team', value: 'Orbit Crew' },
      { label: 'Temperature', value: '18°C' },
      { label: 'Estimated ship', value: 'Tonight' }
    ]
  },
  {
    label: 'En Route',
    headline: 'En Route to You',
    description:
      'Our carbon-neutral couriers are gliding toward your city. Particle trails update the moment a scan hits the network.',
    stats: [
      { label: 'Current hub', value: 'Lumen Gate 3' },
      { label: 'Next update', value: '12m' },
      { label: 'Arrival window', value: '48h' }
    ]
  }
];

const liveFeed = [
  {
    time: 'Just now',
    message: 'Drop #057 synced with Aurora Vault',
    detail: 'Limited Astral Drop orders secured with blockchain provenance.'
  },
  {
    time: '3 min ago',
    message: 'Creator Kit batches cleared QA',
    detail: 'Reactive lighting calibration hit 99.97% resonance.'
  },
  {
    time: '12 min ago',
    message: 'Glow Club members granted early shipping lane',
    detail: 'Hyper Shipping Network assigned priority drones.'
  },
  {
    time: '26 min ago',
    message: 'Digital skins vault refreshed',
    detail: '12 new shader presets added to your download library.'
  }
];

const orbitIcons = [Sparkles, Radio, Box, PackageCheck];

export default function StatusPulse() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StageIcon = [Radio, Sparkles, PackageCheck, Truck][activeStage];

  return (
    <section id="status" className="py-20 px-6 bg-gradient-to-b from-[#050013] via-[#110135] to-[#050013] relative overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full border border-fuchsia-500/30 animate-orbit" />
        <div className="absolute bottom-16 right-1/3 w-80 h-80 rounded-full border border-sky-400/20 animate-orbit-slow" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur animate-fade-glow">
            <Radio className="w-4 h-4 text-sky-300" />
            <span className="text-sm text-violet-100/90 font-medium">Aurora Status — live marketplace telemetry</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Follow Your <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">Order Constellation</span>
          </h2>
          <p className="text-violet-100/80 text-lg max-w-3xl mx-auto mt-4">
            Track the journey from neon lab to your door. Our status engine paints every milestone with motion graphics, sound cues,
            and proactive updates so you never miss a beat.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/15 rounded-3xl p-10 shadow-[0_35px_90px_rgba(124,58,237,0.35)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-sky-400/10 opacity-60" />
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-fuchsia-500/30 blur-[140px]" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-sky-400/20 blur-[120px]" />

            <div className="relative z-10 space-y-6 animate-panel-float">
              <div className="flex items-center gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-sky-400">
                  <StageIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-violet-100/60">{stages[activeStage].label}</p>
                  <h3 className="text-2xl font-semibold">{stages[activeStage].headline}</h3>
                </div>
              </div>

              <p className="text-violet-100/80 leading-relaxed">{stages[activeStage].description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stages[activeStage].stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-md transition-all duration-500 hover:bg-fuchsia-500/10 hover:border-fuchsia-400/40"
                  >
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                    <div className="text-xs text-violet-100/70 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 text-sm text-violet-100/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Auto-refreshing every 5 seconds • Tap to pin your favorite theme inside Aurora Vision.</span>
              </div>

              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-400 transition-all duration-700"
                  style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur shadow-[0_25px_60px_rgba(56,189,248,0.2)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Live Updates Feed</h3>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-violet-100/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Streaming</span>
                </div>
              </div>

              <div className="space-y-4">
                {liveFeed.map((item, index) => (
                  <div
                    key={index}
                    className="group border border-white/10 rounded-2xl p-4 hover:border-fuchsia-400/40 transition-all bg-white/5 animate-fade-in"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <p className="text-xs uppercase tracking-widest text-violet-100/60">{item.time}</p>
                    <p className="text-lg font-semibold text-white mt-1">{item.message}</p>
                    <p className="text-sm text-violet-100/80 mt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-sky-400/20 border border-white/10 rounded-3xl p-6 flex items-center gap-4 backdrop-blur">
              {orbitIcons.map((Icon, index) => (
                <div key={index} className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center animate-glow-pulse" style={{ animationDelay: `${index * 0.2}s` }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
              <div>
                <p className="text-sm uppercase tracking-widest text-violet-100/60">Status themes</p>
                <p className="text-lg font-semibold text-white">Choose Aurora Vision styles to match your vibe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
