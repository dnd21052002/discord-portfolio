import type { SectionId } from '../App'
import { Welcome } from '../sections/Welcome'
import { About } from '../sections/About'
import { Projects } from '../sections/Projects'
import { TechStack } from '../sections/TechStack'
import { Experience } from '../sections/Experience'
import { Contact } from '../sections/Contact'

export function MainArea({ active }: { active: SectionId }) {
  switch (active) {
    case 'welcome':
      return <Welcome />
    case 'about':
      return <About />
    case 'projects':
      return <Projects />
    case 'tech':
      return <TechStack />
    case 'experience':
      return <Experience />
    case 'contact':
      return <Contact />
  }
}
