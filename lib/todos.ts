// User-specific todo storage utilities

export type Todo = {
  id: number
  text: string
  completed: boolean
}

// Get todos for a specific user
export function getUserTodos(userId: string): Todo[] {
  if (typeof window === "undefined") return []
  const allTodos = localStorage.getItem("userTodos")
  const todosMap = allTodos ? JSON.parse(allTodos) : {}
  return todosMap[userId] || []
}

// Save todos for a specific user
export function saveUserTodos(userId: string, todos: Todo[]) {
  const allTodos = localStorage.getItem("userTodos")
  const todosMap = allTodos ? JSON.parse(allTodos) : {}
  todosMap[userId] = todos
  localStorage.setItem("userTodos", JSON.stringify(todosMap))
}
