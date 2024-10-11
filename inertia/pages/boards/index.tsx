import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, Link } from '@inertiajs/react'
import BoardsController from '#controllers/boards_controller'
import { Button } from '~/app/components/ui/button'
import { EditIcon } from 'lucide-react'

export default function Boards({ boards }: InferPageProps<BoardsController, 'index'>) {
  return (
    <>
      <Head title="Odjezdové tabule" />

      <div className="bg-slate-100 dark:bg-slate-950 min-h-screen">
        <div className="mx-auto px-4 py-8 flex flex-col gap-4">
          <ul className="flex flex-col gap-2">
            {boards.map((board) => (
              <li
                key={board.id}
                className="flex bg-card text-card-foreground border shadow-lg dark:shadow-none rounded-lg"
              >
                <Link href={`/boards/${board.id}`} className="p-6 flex-1">
                  {board.name}
                </Link>
                <div className="flex items-center justify-center px-4">
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/boards/${board.id}/edit`}>
                      <EditIcon className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
