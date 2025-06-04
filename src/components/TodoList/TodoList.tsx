import { useEffect, useState } from 'react'
import TaskInput from '../TaskInput/TaskInput'
import TaskList from '../TaskList/TaskList'
import styles from './todoList.module.scss'
import { Todo } from '../../@types/todo.type'

interface HandleNewTodo {
  (todoObj: Todo[]): Todo[] // Function that takes an array of todos and returns an array of todos
}

// type HandleNewTodo = (todoObj: Todo[]) => Todo[]

const syncLocalStorage = (handleNewTodo: HandleNewTodo) => {
  const todoString = localStorage.getItem('todos')
  const todoObj: Todo[] = JSON.parse(todoString || '[]')
  const newToDoObj = handleNewTodo(todoObj)
  localStorage.setItem('todos', JSON.stringify(newToDoObj))
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
  const doneTodos = todos.filter((todo) => todo.done)
  const notDoneTodos = todos.filter((todo) => !todo.done)

  useEffect(() => {
    const todoString = localStorage.getItem('todos')
    const todoObj: Todo[] = JSON.parse(todoString || '[]')
    setTodos(todoObj)
  }, [])

  const addTodo = (name: string) => {
    const newTodo: Todo = {
      id: new Date().toISOString(),
      name,
      done: false
    }

    const handler = (todoObj: Todo[]) => {
      return [...todoObj, newTodo]
    }
    setTodos(handler)

    // Save to local storage
    syncLocalStorage(handler)
  }

  const handleDoneTodo = (id: string, done: boolean) => {
    const handler = (todoObj: Todo[]) => {
      return todoObj.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    }
    setTodos(handler)

    // Save to local storage
    syncLocalStorage(handler)
  }

  const startEditingTodo = (id: string) => {
    const todo = todos.find((todo) => todo.id === id)
    if (todo) {
      setCurrentTodo(todo)
    }
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return null
    })
  }

  const finishEditTodo = () => {
    const handler = (todoObj: Todo[]) => {
      return todoObj.map((todo) => {
        if (todo.id === currentTodo?.id) {
          return currentTodo as Todo
        }
        return todo
      })
    }
    setTodos(handler)
    setCurrentTodo(null)

    // Save to local storage
    syncLocalStorage(handler)
  }

  const deleteTodo = (id: string) => {
    if (currentTodo?.id === id) {
      setCurrentTodo(null)
    }
    const handler = (todoObj: Todo[]) => {
      return todoObj.filter((todo) => todo.id !== id)
    }
    setTodos(handler)

    // Save to local storage
    syncLocalStorage(handler)
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput
          addTodo={addTodo}
          currentTodo={currentTodo}
          editTodo={editTodo}
          startEditingTodo={startEditingTodo}
          finishEditTodo={finishEditTodo}
        />
        <TaskList
          todos={notDoneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditingTodo={startEditingTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList
          todos={doneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditingTodo={startEditingTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}
