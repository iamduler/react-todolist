import { ChangeEvent } from 'react'
import { Todo } from '../../@types/todo.type'
import styles from './taskList.module.scss'

interface TaskListProps {
  todos: Todo[]
  handleDoneTodo: (id: string, done: boolean) => void
  doneTaskList?: boolean
  startEditingTodo: (id: string) => void,
  deleteTodo: (id: string) => void
}

export default function TaskList(props: TaskListProps) {
  const { doneTaskList, todos, handleDoneTodo, startEditingTodo, deleteTodo } = props

  const onchangeCheckbox = (idTodo: string) => (event: ChangeEvent<HTMLInputElement>) => {
    handleDoneTodo(idTodo, event.target.checked)
  }

  return (
    <div className='mb-2'>
      <h2 className={styles.title}>{doneTaskList ? 'Hoàn thành' : 'Chưa hoàn thành'}</h2>
      <div className={styles.tasks}>
        {todos.map((todo) => (
          <div className={styles.task} key={todo.id}>
            <input
              type='checkbox'
              className={styles.taskCheckbox}
              checked={todo.done}
              onChange={onchangeCheckbox(todo.id)}
            />
            <span className={`${styles.taskName} ${todo.done ? styles.taskNameDone : ''}`}>{todo.name}</span>
            <div className={styles.taskActions}>
              <button className={styles.taskBtn} onClick={() => startEditingTodo(todo.id)}>🖊️</button>
              <button className={styles.taskBtn} onClick={() => deleteTodo(todo.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
