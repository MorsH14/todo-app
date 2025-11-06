"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, type User } from "@/lib/auth"
import { UserIcon, Mail, Calendar } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto pt-4 sm:pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">My Profile</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="shadow-2xl">
            <CardHeader className="text-center pb-4 px-4 sm:px-6">
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center mb-4">
                <UserIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">{user.name}</CardTitle>
              <CardDescription className="text-sm sm:text-base">Account Information</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              {/* Email Section */}
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <p className="text-base sm:text-lg font-semibold text-foreground break-words">{user.email}</p>
                </div>
              </div>

              {/* User ID Section */}
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm sm:text-lg font-mono text-foreground break-all">{user.id}</p>
                </div>
              </div>

              {/* Member Since Section */}
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-base sm:text-lg font-semibold text-foreground">{joinedDate}</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> This is a frontend-only demo. All data is stored locally in your browser's
                  localStorage.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
