import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import BoardsController from '#controllers/boards_controller'

export default function Boards({ boards }: InferPageProps<BoardsController, 'index'>) {
  console.log(boards)

  return (
    <>
      <Head title="Odjezdové tabule" />

      <div className="bg-slate-100 dark:bg-slate-950 min-h-screen">
        <div className="mx-auto px-4 py-8 flex flex-col gap-4">
          <ul className="flex flex-col gap-2">
            {boards.map((board) => {
              return <li key={board.id}>{board.name}</li>
            })}
          </ul>
        </div>
      </div>
    </>
  )
}
