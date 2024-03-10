'use client'

import { signIn } from "next-auth/react"

export default function SignIn() {
  return (

        <div >
          <button onClick={() => signIn('cognito')}>
            Sign In
          </button>
        </div>

  )
}
