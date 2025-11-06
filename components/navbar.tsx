"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser, logoutUser } from "@/lib/auth"
import { UserIcon, ListTodo, LogOut, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUserName(user.name)
    }
  }, [])

  const handleLogout = () => {
    logoutUser()
    setIsMobileMenuOpen(false)
    router.push("/login")
  }

  // Don't show navbar on login/signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/todos" className="flex items-center gap-2 font-bold text-lg sm:text-xl text-foreground">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ListTodo className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden xs:inline">TodoApp</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/todos">
              <Button variant={pathname === "/todos" ? "default" : "ghost"} size="sm" className="gap-2">
                <ListTodo className="h-4 w-4" />
                Todos
              </Button>
            </Link>

            <Link href="/profile">
              <Button variant={pathname === "/profile" ? "default" : "ghost"} size="sm" className="gap-2">
                <UserIcon className="h-4 w-4" />
                Profile
              </Button>
            </Link>

            <div className="h-6 w-px bg-border" />

            <span className="text-sm text-muted-foreground">{userName}</span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-3">
              <Link href="/todos" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant={pathname === "/todos" ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  size="lg"
                >
                  <ListTodo className="h-5 w-5" />
                  Todos
                </Button>
              </Link>

              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant={pathname === "/profile" ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  size="lg"
                >
                  <UserIcon className="h-5 w-5" />
                  Profile
                </Button>
              </Link>

              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3 px-3">Signed in as {userName}</p>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  size="lg"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
