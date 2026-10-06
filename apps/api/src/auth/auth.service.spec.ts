import { ConflictException, UnauthorizedException } from '@nestjs/common'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Database } from '../db/client'
import { AuthService } from './auth.service'

function createMockDb() {
  return {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn(),
  }
}

describe('AuthService', () => {
  let db: ReturnType<typeof createMockDb>
  let service: AuthService

  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'test-secret')
    db = createMockDb()
    service = new AuthService(db as unknown as Database)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('register', () => {
    it('creates the user and returns a token and a userId', async () => {
      db.limit.mockResolvedValue([]) // aucun utilisateur existant avec cet email
      db.values.mockResolvedValue(undefined)

      const result = await service.register({
        id: 'user-1',
        email: 'a@test.com',
        password: 'password123',
      })

      const payload = jwt.decode(result.accessToken) as { sub: string }
      expect(payload.sub).toBe('user-1')
      expect(result.userId).toBe('user-1')
      expect(db.insert).toHaveBeenCalled()
    })

    it('throws ConflictException when the email is already used', async () => {
      db.limit.mockResolvedValue([
        { id: 'existing', email: 'a@test.com', passwordHash: 'x', createdAt: 0 },
      ])

      await expect(
        service.register({ id: 'user-1', email: 'a@test.com', password: 'password123' }),
      ).rejects.toThrow(ConflictException)
    })

    it('throws ConflictException when the id is already used', async () => {
      db.limit
        .mockResolvedValueOnce([]) // 1er select (email) : libre
        .mockResolvedValueOnce([
          { id: 'user-1', email: 'other@test.com', passwordHash: 'x', createdAt: 0 },
        ]) // 2e select (id) : déjà pris

      await expect(
        service.register({ id: 'user-1', email: 'a@test.com', password: 'password123' }),
      ).rejects.toThrow('User id already in use')
      expect(db.insert).not.toHaveBeenCalled()
    })
  })

  describe('login', () => {
    it('returns a token and the userId for valid credentials', async () => {
      const passwordHash = await argon2.hash('password123')
      db.limit.mockResolvedValue([
        { id: 'user-1', email: 'a@test.com', passwordHash, createdAt: 0 },
      ])

      const result = await service.login({ email: 'a@test.com', password: 'password123' })

      const payload = jwt.decode(result.accessToken) as { sub: string }
      expect(payload.sub).toBe('user-1')
      expect(result.userId).toBe('user-1')
    })

    it('throws UnauthorizedException when the email is unknown', async () => {
      db.limit.mockResolvedValue([])

      await expect(
        service.login({ email: 'unknown@test.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException when the password is wrong', async () => {
      const passwordHash = await argon2.hash('password123')
      db.limit.mockResolvedValue([
        { id: 'user-1', email: 'a@test.com', passwordHash, createdAt: 0 },
      ])

      await expect(
        service.login({ email: 'a@test.com', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('throws when JWT_SECRET is not set', async () => {
      vi.stubEnv('JWT_SECRET', '') // chaîne vide = falsy, déclenche le même chemin que "non défini"
      const passwordHash = await argon2.hash('password123')
      db.limit.mockResolvedValue([
        { id: 'user-1', email: 'a@test.com', passwordHash, createdAt: 0 },
      ])

      await expect(service.login({ email: 'a@test.com', password: 'password123' })).rejects.toThrow(
        'JWT_SECRET is not set',
      )
    })
  })
})
