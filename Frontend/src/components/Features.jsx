import { motion } from 'framer-motion';

const features = [
  {
    title: 'Meme Speed',
    description: 'Built for the fast-paced world. Get your morning briefing through viral memes in under a minute.',
    icon: '⚡',
  },
  {
    title: 'Viral Logic',
    description: 'Noise-free news delivery. Every major headline is transformed into a relatable meme.',
    icon: '🎯',
  },
  {
    title: 'Smart Consumption',
    description: 'Curated by intelligence. From tech to startups, we focus on what matters.',
    icon: '🧠',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-dark-bg/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Why BuzzWhizz?</h2>
          <p className="text-light-muted dark:text-dark-muted">
            The next generation of news is here. We've redesigned the news experience for clarity and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white dark:bg-dark-bg border border-gray-100 dark:border-dark-border hover:border-orange-primary/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-light-muted dark:text-dark-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
