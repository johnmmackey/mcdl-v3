'use client'

import { signIn } from "@/lib/auth-client"

export default function SignIn() {
  return (

        <div >
          <button onClick={() => signIn.social({ provider: 'cognito', callbackURL: '/' })}>
            Sign In
          </button>
        </div>

  )
}
