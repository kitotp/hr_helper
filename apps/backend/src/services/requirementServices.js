import { prisma } from '../prisma.js'

export async function getRejectData() {
  const result = await prisma.requirements.findUnique({
    where: { id: '1' },
  })
  if (!result) {
    throw new Error('Requirements not found')
  }

  return {
    company_name: result.company_name,
    position: result.job,
  }
}
