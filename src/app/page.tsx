import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to dashboard as the public landing page
  redirect('/dashboard')
}
