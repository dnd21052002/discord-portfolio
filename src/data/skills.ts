// Tech stack as Discord-style role members.
// `cssVar`  = background color of the role chip
// `onColor` = text color shown on top of the chip (contrast-aware)
export type Skill = {
  name: string
  category: 'language' | 'frontend' | 'backend' | 'mobile' | 'devops' | 'data'
  level: 'expert' | 'proficient' | 'learning'
  cssVar: string
  onColor: string
}

export const skills: Skill[] = [
  // language
  {
    name: 'Java',
    category: 'language',
    level: 'expert',
    cssVar: 'var(--color-role-java)',
    onColor: 'var(--color-on-java)',
  },
  {
    name: 'TypeScript',
    category: 'language',
    level: 'expert',
    cssVar: 'var(--color-role-typescript)',
    onColor: 'var(--color-on-typescript)',
  },

  // backend
  {
    name: 'Spring Boot',
    category: 'backend',
    level: 'expert',
    cssVar: 'var(--color-role-spring)',
    onColor: 'var(--color-on-spring)',
  },
  {
    name: 'Python',
    category: 'data',
    level: 'proficient',
    cssVar: 'var(--color-role-python)',
    onColor: 'var(--color-on-python)',
  },
  {
    name: 'PostgreSQL',
    category: 'data',
    level: 'proficient',
    cssVar: 'var(--color-role-postgres)',
    onColor: 'var(--color-on-postgres)',
  },

  // frontend
  {
    name: 'React',
    category: 'frontend',
    level: 'expert',
    cssVar: 'var(--color-role-react)',
    onColor: 'var(--color-on-react)',
  },
  {
    name: 'Tailwind CSS',
    category: 'frontend',
    level: 'expert',
    cssVar: 'var(--color-role-tailwind)',
    onColor: 'var(--color-on-tailwind)',
  },
  {
    name: 'Next.js',
    category: 'frontend',
    level: 'proficient',
    cssVar: 'var(--color-role-nextjs)',
    onColor: 'var(--color-on-nextjs)',
  },
  {
    name: 'Three.js',
    category: 'frontend',
    level: 'proficient',
    cssVar: 'var(--color-role-threejs)',
    onColor: 'var(--color-on-threejs)',
  },

  // mobile
  {
    name: 'Flutter',
    category: 'mobile',
    level: 'proficient',
    cssVar: 'var(--color-role-flutter)',
    onColor: 'var(--color-on-flutter)',
  },

  // devops
  {
    name: 'Docker',
    category: 'devops',
    level: 'proficient',
    cssVar: 'var(--color-role-docker)',
    onColor: 'var(--color-on-docker)',
  },
]
