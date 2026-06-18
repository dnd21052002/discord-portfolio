// Featured projects. Pulled from ~/Developer/.
// `descriptionKey` / `highlightKey` are i18n keys (see src/i18n/dict.ts).
export type Project = {
  id: string
  name: string
  emoji: string
  descriptionKey: string
  stack: string[]
  path: string
  highlightKey?: string
  link?: string
}

export const projects: Project[] = [
  {
    id: 'v-xr-backend',
    name: 'v-xr-backend',
    emoji: '🛠️',
    descriptionKey: 'project.v-xr-backend.desc',
    stack: ['Java', 'Spring Boot', 'Gradle', 'PostgreSQL'],
    path: '~/Developer/v-xr-backend',
    highlightKey: 'project.v-xr-backend.highlight',
    link: 'http://10.144.13.140:8888/api-collections',
  },
  {
    id: 'vxr-shopping',
    name: 'Immervex',
    emoji: '🛋️',
    descriptionKey: 'project.vxr-shopping.desc',
    stack: ['Next.js 15', 'Three.js', 'Socket.io', 'PostgreSQL', 'Prisma'],
    path: '~/Developer/vxr_shopping',
    highlightKey: 'project.vxr-shopping.highlight',
  },
  {
    id: 'digital-twin',
    name: 'digital-twin',
    emoji: '🏭',
    descriptionKey: 'project.digital-twin.desc',
    stack: ['React', 'TypeScript', 'Vite', 'Three.js', 'WebSocket'],
    path: '~/Developer/digital-twin',
    highlightKey: 'project.digital-twin.highlight',
  },
  {
    id: 'autonomus-crypto',
    name: 'autonomus_crypto_trading',
    emoji: '📈',
    descriptionKey: 'project.autonomus-crypto.desc',
    stack: ['Python', 'Multi-agent', 'LLM'],
    path: '~/Developer/autonomus_crypto_trading_multi_agent_system',
  },
  {
    id: 'vietnam-food-landing',
    name: 'vietnam-food-landing',
    emoji: '🍜',
    descriptionKey: 'project.vietnam-food-landing.desc',
    stack: ['Next.js', 'TypeScript', 'Tailwind'],
    path: '~/Developer/vietnam-food-landing',
  },
  {
    id: 'vxr-mobile',
    name: 'vxr-mobile-flutter',
    emoji: '📱',
    descriptionKey: 'project.vxr-mobile.desc',
    stack: ['Flutter', 'Dart'],
    path: '~/Developer/vxr-mobile-flutter',
  },
]
