import bcrypt from 'bcrypt'

export const createPasswordHash = async (password) => 
    bcrypt.hash(password, 12)

export const checkPassword = async (user, password) => 
    bcrypt.compare(password, user.password)