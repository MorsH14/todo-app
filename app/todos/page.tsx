"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getUserTodos, saveUserTodos, type Todo } from "@/lib/todos"

export default function TodoApp() {
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
    } else {
      setUserId(user.id)
      const userTodos = getUserTodos(user.id)
      setTodos(userTodos)
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (userId) {
      saveUserTodos(userId, todos)
    }
  }, [todos, userId])

  const addTodo = () => {
    if (inputValue.trim() === "") return

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    }

    setTodos([...todos, newTodo])
    setInputValue("")
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">My Todo List</CardTitle>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Stay organized and productive</p>
        </CardHeader>

        <CardContent className="space-y-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base"
            />
            <Button onClick={addTodo} size="lg" className="px-6 w-full sm:w-auto">
              Add Todo
            </Button>
          </div>

          {/* Todo List Display */}
          <div className="space-y-3 min-h-[200px]">
            <AnimatePresence mode="popLayout">
              {todos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 text-muted-foreground"
                >
                  <p className="text-base sm:text-lg">No todos yet. Add one to get started!</p>
                </motion.div>
              ) : (
                todos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-ring cursor-pointer flex-shrink-0"
                    />

                    <span
                      className={`flex-1 text-base sm:text-lg transition-all break-words ${
                        todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {todos.some((todo) => todo.completed) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                {todos.filter((t) => !t.completed).length} of {todos.length} tasks remaining
              </p>
              <Button
                variant="outline"
                onClick={clearCompleted}
                className="text-destructive hover:text-destructive bg-transparent w-full sm:w-auto"
                size="sm"
              >
                Clear Completed
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
