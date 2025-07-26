import { prisma } from "./db"
import bcrypt from "bcryptjs"

export async function createUser(email: string, password: string, name: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      settings: {
        create: {}, // Create default settings
      },
    },
    include: {
      settings: true,
    },
  })

  return user
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      settings: true,
    },
  })

  if (!user) {
    return null
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isValidPassword) {
    return null
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  return user
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      settings: true,
      watchlists: {
        include: {
          items: {
            include: {
              symbol: true,
            },
          },
        },
      },
      alerts: {
        include: {
          symbol: true,
        },
      },
    },
  })
}

export async function updateUserSettings(userId: string, settings: any) {
  return await prisma.userSettings.upsert({
    where: { userId },
    update: settings,
    create: {
      userId,
      ...settings,
    },
  })
}
