import { Card } from "@/components/ui/Card";

export function EditarLivroSkeleton() {
  return (
    <div className="animate-pulse">
      <Card className="mb-6">
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
        <div className="h-3 w-64 bg-gray-100 dark:bg-gray-700 rounded mb-2" />
        <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
          <div className="h-2.5 bg-gray-300 dark:bg-gray-600 rounded-full w-1/3 animate-pulse" />
        </div>
        <div className="h-3 w-32 bg-gray-100 dark:bg-gray-700 rounded" />
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </Card>
          <Card>
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </Card>
          <Card>
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded" />
              <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded" />
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
            <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded mb-4" />
            <div className="h-48 w-full bg-gray-100 dark:bg-gray-700 rounded" />
          </Card>
          <div className="flex flex-col gap-2">
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
