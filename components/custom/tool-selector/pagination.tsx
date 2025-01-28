import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-4 flex flex-col items-center space-y-2">
      <div className="join space-x-1">
        <Button className="join-item px-2 sm:px-4" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          «
        </Button>
        <Button
          className="join-item px-2 sm:px-4"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNumber = currentPage - 2 + i
          if (pageNumber > 0 && pageNumber <= totalPages) {
            return (
              <Button
                key={pageNumber}
                className={`join-item px-3 sm:px-4 ${pageNumber === currentPage ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            )
          }
          return null
        })}
        <Button
          className="join-item px-2 sm:px-4"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </Button>
        <Button
          className="join-item px-2 sm:px-4"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

