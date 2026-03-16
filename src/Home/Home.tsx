import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  GraduationCap,
  LayoutGrid,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Wand2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const bgRemoverTo = user ? '/services/bg-remover' : '/login';
  const watermarkTo = user ? '/services/watermark-remover' : '/login';
  const chatTo = user ? '/services/chat-ai' : '/login';

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* 1) Hero */}
        <section className="relative mb-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-500" />
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-[#2C2C2E]/70 border border-[#E5E5EA] dark:border-[#3A3A3C] backdrop-blur"
            >
              <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-tight text-[#1C1C1E] dark:text-[#F2F2F7]">
                Full Stack Developer & AI Tool Creator
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-[44px] leading-[1.03] sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1C1C1E] dark:text-[#F2F2F7]"
            >
              I build modern web apps and smart AI tools
              <span className="block mt-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                to make digital tasks effortless.
              </span>
            </motion.h1>

            <p className="mt-6 text-[17px] leading-relaxed sm:text-lg text-[#8E8E93] max-w-2xl mx-auto">
              Fast, minimal, and mobile-first experiences designed with clean iOS-like typography and a modern UX.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#projects"
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all inline-flex items-center gap-2 group"
              >
                View My Work
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <Link
                to={bgRemoverTo}
                className="px-8 py-4 bg-white dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#F2F2F7] border border-[#E5E5EA] dark:border-[#3A3A3C] rounded-2xl font-bold hover:bg-[#F2F2F7] dark:hover:bg-[#3A3A3C] transition-all inline-flex items-center gap-2"
              >
                Try AI Tools
                <Wand2 className="w-5 h-5 text-[#8E8E93]" />
              </Link>
              <a
                href="#contact"
                className="px-8 py-4 bg-transparent text-[#1C1C1E] dark:text-[#F2F2F7] border border-transparent rounded-2xl font-bold hover:bg-white/60 dark:hover:bg-[#2C2C2E]/60 transition-all"
              >
                Contact Me
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#8E8E93]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Clean UI. No clutter.</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-[#C7C7CC] dark:bg-[#3A3A3C]" />
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>AI-first features</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-[#C7C7CC] dark:bg-[#3A3A3C]" />
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                <span>Mobile-ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2) About */}
        <section id="about" className="scroll-mt-28 mb-20">
          <SectionHeader
            eyebrow="About"
            title="Hi, I'm Kausar Mia."
            subtitle="A passionate web developer from Bangladesh. I build modern applications and AI-powered tools that solve real-world problems."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <GlassCard className="lg:col-span-2">
              <p className="text-[15px] sm:text-base leading-relaxed text-[#8E8E93]">
                I specialize in building modern web applications with strong UX, solid performance, and clean code. I enjoy turning ideas into
                real products, especially when AI can simplify a workflow.
              </p>
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-[#8E8E93]">
                Currently, I'm studying BSc in Computer Science and Engineering and continuously improving my skills in JavaScript, React, and
                modern web technologies.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Pill icon={<Code2 className="w-4 h-4" />} label="Full Stack" />
                <Pill icon={<Sparkles className="w-4 h-4" />} label="AI Tools" />
                <Pill icon={<ShieldCheck className="w-4 h-4" />} label="Product-minded" />
                <Pill icon={<LayoutGrid className="w-4 h-4" />} label="Responsive UI" />
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-sm font-bold dark:text-white">Quick Info</div>
              <div className="mt-5 space-y-4">
                <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value="Bangladesh" />
                <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Focus" value="Web apps and AI tools" />
                <InfoRow icon={<GraduationCap className="w-4 h-4" />} label="Study" value="BSc in CSE (Running)" />
              </div>
              <div className="mt-7">
                <a
                  href="#contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  Let's work together
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 3) Skills */}
        <section id="skills" className="scroll-mt-28 mb-20">
          <SectionHeader
            eyebrow="Skills"
            title="A practical, modern stack."
            subtitle="I build fast UIs, integrate APIs, and ship polished experiences."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <GlassCard>
              <div className="text-sm font-bold dark:text-white">Frontend</div>
              <ul className="mt-5 space-y-3">
                <SkillItem label="HTML" />
                <SkillItem label="CSS" />
                <SkillItem label="Tailwind CSS" />
                <SkillItem label="JavaScript" />
                <SkillItem label="React" />
              </ul>
            </GlassCard>
            <GlassCard>
              <div className="text-sm font-bold dark:text-white">Tools</div>
              <ul className="mt-5 space-y-3">
                <SkillItem label="Git" />
                <SkillItem label="GitHub" />
                <SkillItem label="VS Code" />
                <SkillItem label="API Integration" />
              </ul>
            </GlassCard>
            <GlassCard>
              <div className="text-sm font-bold dark:text-white">Strengths</div>
              <ul className="mt-5 space-y-3">
                <SkillItem label="Responsive UI" />
                <SkillItem label="Clean UX flows" />
                <SkillItem label="Performance mindset" />
                <SkillItem label="Shipping fast" />
              </ul>
            </GlassCard>
          </div>
        </section>

        {/* 4) Services / AI Tools */}
        <section id="tools" className="scroll-mt-28 mb-20">
          <SectionHeader
            eyebrow="AI Tools"
            title="Tools that save time immediately."
            subtitle={user ? 'You are signed in. Open any tool now.' : 'Sign in once to access the tools.'}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <ToolCard
              icon={<Wand2 className="w-5 h-5" />}
              title="AI Background Remover"
              description="Remove image backgrounds instantly with clean edges."
              to={bgRemoverTo}
              accent="blue"
            />
            <ToolCard
              icon={<Sparkles className="w-5 h-5" />}
              title="AI Watermark Remover"
              description="Clean unwanted watermarks from images using AI."
              to={watermarkTo}
              accent="purple"
            />
            <ToolCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="AI Chatbot"
              description="A smart assistant that answers questions instantly."
              to={chatTo}
              accent="emerald"
            />
          </div>
        </section>

        {/* 5) Featured Projects */}
        <section id="projects" className="scroll-mt-28 mb-20">
          <SectionHeader
            eyebrow="Projects"
            title="Featured work."
            subtitle="A few projects I'm proud of, focused on clean UI and real value."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <ProjectCard title="Postify" subtitle="Social posting experience" tags={['React', 'UX', 'API']} />
            <ProjectCard title="Gadget Heaven" subtitle="E-commerce style UI" tags={['React', 'Tailwind', 'Responsive']} />
            <ProjectCard title="Pet Adoption Website" subtitle="Listing and detail flows" tags={['UI', 'Routing', 'Frontend']} />
          </div>
        </section>

        {/* 6) Work Experience */}
        <section id="experience" className="scroll-mt-28 mb-20">
          <SectionHeader
            eyebrow="Experience"
            title="Work experience."
            subtitle="Hands-on work building modern interfaces and responsive websites."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <GlassCard>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold dark:text-white">Web Developer</div>
                  <div className="text-sm text-[#8E8E93] mt-1">Softvens Agency</div>
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8E8E93]">
                  <Briefcase className="w-4 h-4" />
                  <span>Role</span>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                <Bullet text="Develop web interfaces with modern React patterns." />
                <Bullet text="Work with modern JavaScript tools and best practices." />
                <Bullet text="Build responsive websites with attention to UX." />
              </ul>
            </GlassCard>
            <GlassCard>
              <div className="text-sm font-bold dark:text-white">What I bring</div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MiniFeature icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />} title="Reliable delivery" desc="Clear scope, clean output." />
                <MiniFeature icon={<LayoutGrid className="w-4 h-4 text-blue-500" />} title="UX-first UI" desc="Smooth, modern interactions." />
                <MiniFeature icon={<Cpu className="w-4 h-4 text-purple-500" />} title="AI integration" desc="Smart features with APIs." />
                <MiniFeature icon={<Code2 className="w-4 h-4 text-amber-500" />} title="Maintainable code" desc="Readable, scalable structure." />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 7) Education */}
        <section id="education" className="scroll-mt-28 mb-20">
          <SectionHeader
            eyebrow="Education"
            title="Learning with momentum."
            subtitle="Strong fundamentals with continuous improvement."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <TimelineCard title="BSc in Computer Science and Engineering" subtitle="Running" icon={<GraduationCap className="w-5 h-5" />} />
            <TimelineCard title="Diploma in Computer Technology" subtitle="Completed" icon={<GraduationCap className="w-5 h-5" />} />
            <TimelineCard title="HSC (2021) and SSC (2019)" subtitle="Completed" icon={<GraduationCap className="w-5 h-5" />} />
          </div>
        </section>

        {/* 8) Why Choose My Tools */}
        <section id="why" className="scroll-mt-28 mb-20">
          <SectionHeader
            eyebrow="Why"
            title="Why choose my tools?"
            subtitle="A SaaS-style experience: fast, simple, and designed for real users."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <FeatureTile icon={<Cpu className="w-5 h-5" />} title="Fast processing" desc="Optimized workflows and minimal steps." />
            <FeatureTile icon={<Sparkles className="w-5 h-5" />} title="AI-powered technology" desc="Modern models for clean results." />
            <FeatureTile icon={<LayoutGrid className="w-5 h-5" />} title="Easy to use" desc="No complicated controls or setup." />
            <FeatureTile icon={<ShieldCheck className="w-5 h-5" />} title="No technical skills required" desc="Upload, process, download." />
          </div>
        </section>

        {/* Bonus: Testimonials */}
        <section id="testimonials" className="scroll-mt-28 mb-20">
          <SectionHeader
            eyebrow="Testimonials"
            title="What people say."
            subtitle="Short feedback that highlights the UX and results."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <TestimonialCard name="Client A" role="Freelance client" text="Super clean UI and the results are surprisingly good. The workflow feels instant." />
            <TestimonialCard name="Client B" role="Content creator" text="Background removal is fast and accurate. I love the simple export." />
            <TestimonialCard name="Client C" role="Student" text="The chatbot and tools are easy to use on mobile. Everything feels modern." />
          </div>
        </section>

        {/* Bonus: FAQ */}
        <section id="faq" className="scroll-mt-28 mb-20">
          <SectionHeader
            eyebrow="FAQ"
            title="Quick answers."
            subtitle="Common questions about the tools and workflow."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <FaqItem q="Do I need an account to use the tools?" a="Yes. Tools are behind a simple sign-in flow so your sessions stay consistent." />
            <FaqItem q="What file formats are supported?" a="Most tools work best with PNG and JPG. Export options depend on the tool." />
            <FaqItem q="Is it mobile-friendly?" a="Yes. The UI is designed to feel smooth on modern phones, including iPhone-size screens." />
            <FaqItem q="Can I use it for client work?" a="Yes. If you need custom features or a private deployment, contact me." />
          </div>
        </section>

        {/* Bonus: CTA */}
        <section className="mb-20">
          <div className="rounded-3xl border border-[#E5E5EA] dark:border-[#3A3A3C] bg-white/70 dark:bg-[#2C2C2E]/70 backdrop-blur p-8 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Ready to try it?</div>
                <div className="mt-2 text-2xl md:text-3xl font-bold tracking-tight dark:text-white">
                  Open an AI tool in seconds.
                </div>
                <div className="mt-3 text-[#8E8E93]">
                  Start with background removal, then explore watermark removal and chat.
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={bgRemoverTo}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  Try BG Remover
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to={chatTo}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#3A3A3C] font-bold hover:bg-[#F2F2F7] dark:hover:bg-[#3A3A3C] transition-all"
                >
                  Try Chat AI
                  <MessageSquare className="w-4 h-4 text-[#8E8E93]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 9) Contact */}
        <section id="contact" className="scroll-mt-28 mb-14">
          <SectionHeader
            eyebrow="Contact"
            title="Let's build something."
            subtitle="Feel free to contact me for collaborations, freelance work, or professional opportunities."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <GlassCard>
              <div className="text-sm font-bold dark:text-white">Get in touch</div>
              <div className="mt-5 space-y-4">
                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value="kausar@example.com" />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value="+880 1XXXXXXXXX" />
                <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value="Bangladesh" />
              </div>
              <div className="mt-7 text-xs text-[#8E8E93]">Replace the placeholder email/phone with your real contact info.</div>
            </GlassCard>
            <GlassCard className="lg:col-span-2">
              <div className="text-sm font-bold dark:text-white">Quick links</div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickLink href="#projects" title="Projects" desc="See featured work" />
                <QuickLink href="#tools" title="AI Tools" desc="Try the tools" />
                <QuickLink href="#experience" title="Experience" desc="Work history" />
                <QuickLink href="#faq" title="FAQ" desc="Common questions" />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 10) Footer */}
        <footer className="pt-10 border-t border-[#E5E5EA] dark:border-[#3A3A3C]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="font-bold tracking-tight dark:text-white">Kausar Mia</div>
              <div className="text-sm text-[#8E8E93] mt-1">Full Stack Developer & AI Tool Creator</div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <a href="#about" className="text-[#8E8E93] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
              <a href="#skills" className="text-[#8E8E93] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Skills</a>
              <a href="#tools" className="text-[#8E8E93] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Tools</a>
              <a href="#contact" className="text-[#8E8E93] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-xs text-[#8E8E93]">© 2026 Kausar Mia</div>
        </footer>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-[#2C2C2E]/70 border border-[#E5E5EA] dark:border-[#3A3A3C] backdrop-blur">
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-[11px] font-bold tracking-tight text-[#1C1C1E] dark:text-[#F2F2F7]">{eyebrow}</span>
      </div>
      <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight dark:text-white">{title}</h2>
      <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-[#8E8E93]">{subtitle}</p>
    </div>
  );
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        'bg-white/70 dark:bg-[#2C2C2E]/70 border border-[#E5E5EA] dark:border-[#3A3A3C] rounded-3xl p-8 backdrop-blur shadow-sm',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#3A3A3C] text-sm font-semibold">
      <span className="text-blue-600 dark:text-blue-400">{icon}</span>
      <span className="dark:text-white">{label}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-2xl bg-[#F2F2F7] dark:bg-[#3A3A3C] flex items-center justify-center text-[#1C1C1E] dark:text-[#F2F2F7]">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-[#8E8E93]">{label}</div>
        <div className="text-sm font-semibold dark:text-white">{value}</div>
      </div>
    </div>
  );
}

function SkillItem({ label }: { label: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="text-sm font-semibold dark:text-white">{label}</div>
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    </li>
  );
}

function ToolCard({
  icon,
  title,
  description,
  to,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  accent: 'blue' | 'purple' | 'emerald';
}) {
  const accentClasses =
    accent === 'blue'
      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
      : accent === 'purple'
        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
        : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400';

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Link
        to={to}
        className="block h-full bg-white dark:bg-[#2C2C2E] p-8 rounded-3xl border border-[#E5E5EA] dark:border-[#3A3A3C] shadow-sm hover:shadow-xl transition-all"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accentClasses}`}>{icon}</div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8E8E93]">
            <span className="px-3 py-1 rounded-full bg-[#F2F2F7] dark:bg-[#3A3A3C]">Open</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
        <p className="text-[#8E8E93] leading-relaxed">{description}</p>
      </Link>
    </motion.div>
  );
}

function ProjectCard({ title, subtitle, tags }: { title: string; subtitle: string; tags: string[] }) {
  return (
    <GlassCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-bold dark:text-white">{title}</div>
          <div className="text-sm text-[#8E8E93] mt-1">{subtitle}</div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#F2F2F7] dark:bg-[#3A3A3C] flex items-center justify-center">
          <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#3A3A3C] text-[#8E8E93]"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-7">
        <a href="#contact" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:opacity-90">
          Discuss this project <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </GlassCard>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
      <span className="text-sm leading-relaxed text-[#8E8E93]">{text}</span>
    </li>
  );
}

function MiniFeature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#3A3A3C] p-4">
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm font-bold dark:text-white">{title}</div>
      </div>
      <div className="mt-2 text-xs text-[#8E8E93]">{desc}</div>
    </div>
  );
}

function TimelineCard({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <GlassCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-bold dark:text-white">{title}</div>
          <div className="text-sm text-[#8E8E93] mt-1">{subtitle}</div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#F2F2F7] dark:bg-[#3A3A3C] flex items-center justify-center text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}

function FeatureTile({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white dark:bg-[#2C2C2E] p-7 rounded-3xl border border-[#E5E5EA] dark:border-[#3A3A3C] shadow-sm hover:shadow-xl transition-all">
      <div className="w-12 h-12 bg-[#F2F2F7] dark:bg-[#3A3A3C] rounded-2xl flex items-center justify-center mb-5 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div className="text-base font-bold dark:text-white">{title}</div>
      <div className="mt-2 text-sm text-[#8E8E93] leading-relaxed">{desc}</div>
    </div>
  );
}

function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <GlassCard>
      <div className="flex items-center gap-1 text-amber-500">
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
      </div>
      <div className="mt-4 text-sm leading-relaxed text-[#8E8E93]">"{text}"</div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold dark:text-white">{name}</div>
          <div className="text-xs text-[#8E8E93] mt-1">{role}</div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#F2F2F7] dark:bg-[#3A3A3C] flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </GlassCard>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-white dark:bg-[#2C2C2E] rounded-3xl border border-[#E5E5EA] dark:border-[#3A3A3C] p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="text-base font-bold dark:text-white">{q}</div>
        <div className="w-10 h-10 rounded-2xl bg-[#F2F2F7] dark:bg-[#3A3A3C] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-[#8E8E93]">{a}</div>
    </div>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a
      href={href}
      className="group rounded-3xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#3A3A3C] p-6 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold dark:text-white">{title}</div>
          <div className="text-xs text-[#8E8E93] mt-1">{desc}</div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-[#8E8E93] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
      </div>
    </a>
  );
}

