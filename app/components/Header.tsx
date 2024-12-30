import { Bell, Search, User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Calendar</h1>
          <div className="flex-1 min-w-0">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                type="text"
                name="search"
                id="search"
                className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <Button variant="ghost" size="icon">
              <Bell className="h-6 w-6" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
