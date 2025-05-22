import Link from 'next/link'

type TaskCardProps = {
  number: number
  title: string
  icon: string
  description: string
  isActive?: boolean
}

export default function TaskCard({ number, title, icon, description, isActive = false }: TaskCardProps) {
  const CardWrapper = isActive ? Link : 'div'
  
  return (
    <CardWrapper
      href={isActive ? `/task/${number}` : '#'}
      className={`
        relative p-6 rounded-xl shadow-lg 
        ${isActive 
          ? 'bg-white dark:bg-gray-800 hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
          : 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-70'
        }
        transition-all duration-300
      `}
    >
      <div className="absolute top-4 right-4 text-4xl opacity-20">{icon}</div>
      <h2 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">#{number}</h2>
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      {!isActive && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Скоро</span>
        </div>
      )}
    </CardWrapper>
  )
} 