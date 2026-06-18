// Experience entries. `from` and `to` are year strings, or 'now' for the
// current period (translates to "nay" / "present" depending on locale).
export type Experience = {
  id: 'vnpt' | 'personal'
  companyKey: string
  roleKey: string
  from: string
  to: string | 'now'
  descriptionKey: string
  isCurrent?: boolean
}

export const experiences: Experience[] = [
  {
    id: 'vnpt',
    companyKey: 'VNPT Media',
    roleKey: 'exp.vnpt.role',
    from: '2023',
    to: '2025',
    descriptionKey: 'exp.vnpt.desc',
    isCurrent: true,
  },
  {
    id: 'personal',
    companyKey: 'Personal / Side projects',
    roleKey: 'exp.personal.role',
    from: '2024',
    to: 'now',
    descriptionKey: 'exp.personal.desc',
  },
]
