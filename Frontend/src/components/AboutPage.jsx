import { motion } from 'framer-motion';
import { useNewsContext } from '../context/NewsContext';

export default function AboutPage() {
  const { t } = useNewsContext();

  const stats = [
    { label: t('about.stat_insights_label'), value: t('about.stat_insights_value') },
    { label: t('about.stat_complexity_label'), value: t('about.stat_complexity_value') },
    { label: t('about.stat_value_label'), value: t('about.stat_value_value') },
    { label: t('about.stat_edge_label'), value: t('about.stat_edge_value') },
  ];

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="py-12 bg-white dark:bg-dark-bg overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-1/2 lg:w-7/12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-primary text-xs font-bold uppercase tracking-widest mb-4">
                {t('about.badge')}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
                {t('about.hero_title_1')} <span className="text-gradient">{t('about.hero_title_gradient')}</span>
              </h1>
              <div className="space-y-3 text-sm md:text-base text-light-muted dark:text-dark-muted mb-6 leading-relaxed">
                <p>{t('about.hero_p1')}</p>
                <p>{t('about.hero_p2')}</p>
                <p>{t('about.hero_p3')}</p>
                <p>{t('about.hero_p4')}</p>
                <p className="font-black text-orange-primary text-base md:text-lg mt-4">
                  {t('about.hero_tagline')}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-dark-card/40">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl md:text-2xl font-black text-orange-primary">{stat.value}</p>
                    <p className="text-[11px] font-semibold opacity-70 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-full md:w-1/2 lg:w-5/12 relative flex justify-center md:justify-end mt-8 md:mt-0"
            >
              <div className="w-full max-w-[380px] md:max-w-[440px] aspect-[4/4.8] rounded-[2rem] overflow-hidden shadow-2xl border-6 border-white dark:border-dark-card group relative">
                <img 
                  src="/about-hero.png" 
                  alt="BuzzWhizz - Marketing & News Platform" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="absolute -bottom-6 -left-2 lg:-left-6 w-36 h-36 bg-orange-primary rounded-2xl flex items-center justify-center p-4 text-white font-black leading-tight text-xs md:text-sm text-center shadow-xl shadow-orange-primary/30 -rotate-6 z-10">
                {t('about.floating_badge')}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start gap-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full md:w-5/12 flex justify-center"
            >
              <div className="w-full max-w-[280px] md:max-w-[300px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-2 ring-orange-primary ring-offset-4 ring-offset-gray-50 dark:ring-offset-dark-bg">
                <img 
                  src="/founder.jpg" 
                  alt="Founder" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-7/12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-primary text-xs font-bold uppercase tracking-widest mb-4">
                {t('about.founder_badge')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
                <span className="text-gradient">{t('about.founder_name')}</span>
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-primary mb-4">{t('about.founder_role')}</p>
              <p className="text-base text-light-muted dark:text-dark-muted mb-4 leading-relaxed">
                {t('about.founder_p1')}
              </p>
              <blockquote className="border-l-4 border-orange-primary pl-4 py-2 mb-4 italic text-light-muted dark:text-dark-muted text-base">
                {t('about.founder_quote')}
              </blockquote>
              <p className="text-base text-light-muted dark:text-dark-muted mb-4 leading-relaxed">
                {t('about.founder_p2')}
              </p>
              <p className="text-base text-light-muted dark:text-dark-muted mb-6 leading-relaxed">
                {t('about.founder_p3')}
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-orange-100 dark:bg-dark-bg/50 flex items-center justify-center text-orange-primary hover:bg-orange-primary hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-orange-100 dark:bg-dark-bg/50 flex items-center justify-center text-orange-primary hover:bg-orange-primary hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-orange-100 dark:bg-dark-bg/50 flex items-center justify-center text-orange-primary hover:bg-orange-primary hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-7/12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-primary text-xs font-bold uppercase tracking-widest mb-4">
                {t('about.dev_badge')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
                <span className="text-gradient">{t('about.dev_name')}</span>
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-primary mb-4">{t('about.dev_role')}</p>
              <p className="text-base text-light-muted dark:text-dark-muted mb-4 leading-relaxed">
                {t('about.dev_p1')}
              </p>
              <p className="text-base text-light-muted dark:text-dark-muted mb-4 leading-relaxed">
                {t('about.dev_p2')}
              </p>
              <blockquote className="border-l-4 border-orange-primary pl-4 py-2 mb-4 italic text-light-muted dark:text-dark-muted text-base">
                {t('about.dev_quote')}
              </blockquote>
              <p className="text-base text-light-muted dark:text-dark-muted mb-6 leading-relaxed">
                {t('about.dev_p3')}
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-orange-100 dark:bg-dark-bg/50 flex items-center justify-center text-orange-primary hover:bg-orange-primary hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-orange-100 dark:bg-dark-bg/50 flex items-center justify-center text-orange-primary hover:bg-orange-primary hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-orange-100 dark:bg-dark-bg/50 flex items-center justify-center text-orange-primary hover:bg-orange-primary hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full md:w-5/12 flex justify-center"
            >
              <div className="w-full max-w-[280px] md:max-w-[300px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-2 ring-orange-primary ring-offset-4 ring-offset-white dark:ring-offset-dark-bg">
                <img 
                  src="/developer.jpg" 
                  alt="Lakshya Mathur" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-bg/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-black mb-3">{t('about.philosophy_title')}</h2>
            <p className="text-sm text-light-muted dark:text-dark-muted">
              {t('about.philosophy_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-3xl">⚡</div>
              <h3 className="text-lg font-bold">{t('about.value_speed_title')}</h3>
              <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                {t('about.value_speed_desc')}
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl">🎯</div>
              <h3 className="text-lg font-bold">{t('about.value_meme_title')}</h3>
              <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                {t('about.value_meme_desc')}
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl">🧠</div>
              <h3 className="text-lg font-bold">{t('about.value_smart_title')}</h3>
              <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                {t('about.value_smart_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="max-w-xl mx-auto text-sm text-light-muted dark:text-dark-muted mb-8">
            {t('about.cta_text')}
          </p>
          <a 
            href="https://share.google/4HcPdspTr7ijmDfCU"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-orange-primary text-white font-bold text-sm hover:shadow-xl hover:shadow-orange-primary/20 transition-all active:scale-95"
          >
            {t('about.cta_button')}
          </a>
        </div>
      </section>
    </div>
  );
}
