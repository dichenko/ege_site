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
          : 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed'
        }
        transition-all duration-300
      `}
    >
      <div className={`absolute top-4 right-4 text-4xl opacity-20 ${!isActive ? 'text-gray-400' : ''}`}>{icon}</div>
      <h2 className={`text-3xl font-bold mb-2 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>#{number}</h2>
      <h3 className={`text-xl font-semibold mb-2 ${isActive ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>{title}</h3>
      <p className={`text-sm ${isActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>{description}</p>
    </CardWrapper>
  )
} 