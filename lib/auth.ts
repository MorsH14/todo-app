// Frontend-only authentication utilities using localStorage

export type User = {
  id: string
  email: string
  name: string
  createdAt: string
}

// Get all users from localStorage
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
function saveUsers(users: User[]) {
  localStorage.setItem("users", JSON.stringify(users))
}

// Register a new user
export function registerUser(email: string, password: string, name: string): { success: boolean; error?: string } {
  const users = getUsers()

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "User with this email already exists" }
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Store password separately (in real app, this would be hashed on backend)
  const passwords = JSON.parse(localStorage.getItem("passwords") || "{}")
  passwords[email] = password
  localStorage.setItem("passwords", JSON.stringify(passwords))

  return { success: true }
}

// Login user
export function loginUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  const passwords = JSON.parse(localStorage.getItem("passwords") || "{}")

  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  if (passwords[email] !== password) {
    return { success: false, error: "Incorrect password" }
  }

  // Set current user session
  localStorage.setItem("currentUser", JSON.stringify(user))

  return { success: true, user }
}

// Get current logged-in user
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("currentUser")
  return user ? JSON.parse(user) : null
}

// Logout user
export function logoutUser() {
  localStorage.removeItem("currentUser")
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
