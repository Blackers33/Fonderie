import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import type { AuthResponse } from '@workspace/shared-utils'
import * as argon2 from 'argon2'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import type { Database } from '../db/client'
import { DB_CLIENT } from '../db/db.module'
import { users } from '../db/schema'
import type { LoginDto } from './dto/login.dto'
import type { RegisterDto } from './dto/register.dto'

const ACCESS_TOKEN_EXPIRY = '180d'

@Injectable()
export class AuthService {
  constructor(@Inject(DB_CLIENT) private readonly db: Database) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const [existing] = await this.db.select().from(users).where(eq(users.email, dto.email)).limit(1)
    if (existing) {
      throw new ConflictException('Email already in use')
    }

    const [existingId] = await this.db.select().from(users).where(eq(users.id, dto.id)).limit(1)
    if (existingId) {
      throw new ConflictException('User id already in use')
    }

    const passwordHash = await argon2.hash(dto.password)

    await this.db.insert(users).values({
      id: dto.id,
      email: dto.email,
      passwordHash,
      createdAt: Date.now(),
    })

    return { accessToken: this.signAccessToken(dto.id), userId: dto.id }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const [user] = await this.db.select().from(users).where(eq(users.email, dto.email)).limit(1)

    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return { accessToken: this.signAccessToken(user.id), userId: user.id }
  }

  private signAccessToken(userId: string): string {
    const secret = process.env['JWT_SECRET']
    if (!secret) {
      throw new Error('JWT_SECRET is not set')
    }

    return jwt.sign({ sub: userId }, secret, { expiresIn: ACCESS_TOKEN_EXPIRY })
  }
}
