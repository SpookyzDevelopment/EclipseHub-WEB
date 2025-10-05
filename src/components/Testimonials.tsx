import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Nia Rivers',
    role: 'Visual DJ & Performer',
    content: 'The Aurora Synth kit is unreal. Reactive lights pulse perfectly with my sets and the status tracker makes every delivery feel like an event.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Arjun Patel',
    role: 'Metaverse Architect',
    content: 'From custom skins to NFC verification, every Eclipse product oozes quality. My clients love unboxing the neon experience.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Lena Morales',
    role: 'Immersive Studio Founder',
    content: 'Glow Club early access is addictive. Limited drops arrive fast, perfectly tuned, and ready to plug into our XR stages.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#050013] via-[#0a0127] to-[#050013]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">Creative Collectives</span>
          </h2>
          <p className="text-xl text-violet-100/80">
            Hear how artists, gamers, and designers craft brighter worlds with eclipcestore.digital
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/15 p-8 rounded-2xl hover:border-fuchsia-400/40 transition-all group relative shadow-[0_25px_60px_rgba(56,189,248,0.25)]"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-fuchsia-500/40 group-hover:text-sky-400/60 transition-colors" />

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-violet-100/80 mb-6 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-fuchsia-400/30"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-violet-100/70">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
