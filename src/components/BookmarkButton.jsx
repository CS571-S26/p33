import { Button } from 'react-bootstrap'
import { BsStar, BsStarFill } from 'react-icons/bs'

function BookmarkButton({ bookmarked, onToggle, ariaLabel = 'Toggle bookmark' }) {
  return (
    <Button
      type="button"
      variant="link"
      className="p-0 text-warning"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={bookmarked}
    >
      {bookmarked ? (
        <BsStarFill size={18} aria-hidden />
      ) : (
        <BsStar size={18} className="text-muted" aria-hidden />
      )}
    </Button>
  )
}

export default BookmarkButton
