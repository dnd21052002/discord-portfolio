// Tech stack as Discord-style role members.
export type Skill = {
  name: string
  category: 'language' | 'frontend' | 'backend' | 'mobile' | 'devops' | 'data'
  level: 'expert' | 'proficient' | 'learning'
  cssVar: string // color role var
}

export const skills: Skill[] = [
  { name: 'Java', category: 'language', level: 'expert', cssVar: 'var(--color-role-java)' },
  { name: 'Spring Boot', category: 'backend', level: 'expert', cssVar: 'var(--color-role-spring)' },
  { name: 'TypeScript', category: 'language', level: 'expert', cssVar: 'var(--color-role-typescript)' },
  { name: 'React', category: 'frontend', level: 'expert', cssVar: 'var(--color-role-react)' },
  { name: 'Next.js', category: 'frontend', level: 'proficient', cssVar: 'var(--color-role-nextjs)' },
  { name: 'Three.js', category: 'frontend', level: 'proficient', cssVar: 'var(--color-role-threejs)' },
  { name: 'Tailwind CSS', category: 'frontend', level: 'expert', cssVar: 'var(--color-role-tailwind)' },
  { name: 'Flutter', category: 'mobile', level: 'proficient', cssVar: 'var(--color-role-flutter)' },
  { name: 'Python', category: 'data', level: 'proficient', cssVar: 'var(--color-role-python)' },
  { name: 'Docker', category: 'devops', level: 'proficient', cssVar: 'var(--color-role-docker)' },
  { name: 'PostgreSQL', category: 'data', level: 'proficient', cssVar: 'var(--color-role-postgres)' },
]
