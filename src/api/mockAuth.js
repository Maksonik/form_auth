export const CODE_LENGTH = 6

export async function loginPayload(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { email, password } = payload

      if (email === 'test@example.com' && password === 'password') {
        resolve({ success: true, userId: 'user-1' })
        return
      }

      const error = new Error('Wrong password or email')
      error.status = 401
      reject(error)
    }, 1000)
  })
}

export async function verifyCodePayload(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { code } = payload

      if (code === '131311') {
        resolve({ success: true, message: 'Code verified' })
        return
      }

      const error = new Error('Invalid code')
      error.status = 400
      reject(error)
    }, 1000)
  })
}
