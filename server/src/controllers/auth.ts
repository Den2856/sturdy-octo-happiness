import { RequestHandler } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET!

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) {
      res.status(400).json({ message: 'Email и пароль обязательны' })
      return
    }
    if (await User.exists({ email })) {
      res.status(409).json({ message: 'Email уже зарегистрирован' })
      return
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email, passwordHash, name })
    res.status(201).json({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
    })
    return
  } catch (err) {
    next(err)
  }
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ message: 'Email и пароль обязательны' })
      return
    }
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ message: 'Неверные учетные данные' })
      return
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      res.status(401).json({ message: 'Неверные учетные данные' })
      return
    }
    const token = jwt.sign({ id: user.id.toString() }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token })
    return
  } catch (err) {
    next(err)
  }
}

export const me: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId
    if (!userId) {
      res.status(401).json({ message: 'Нет авторизации' })
      return
    }
    const user = await User.findById(userId).lean()
    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' })
      return
    }
    res.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    })
    return
  } catch (err) {
    next(err)
  }
}
