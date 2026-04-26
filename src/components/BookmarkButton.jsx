import { Button } from 'react-bootstrap'
import { BsStar, BsStarFill } from 'react-icons/bs'

function BookmarkButton({ bookmarked, onToggle, ariaLabel }) {
  const label = ariaLabel || (bookmarked ? 'Remove bookmark' : 'Bookmark application')

  return (
    <Button
      type="button"
      variant="link"
      className={`bookmark-button p-0 ${bookmarked ? 'is-active' : ''}`}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={bookmarked}
    >
      {bookmarked ? (
        <BsStarFill size={18} aria-hidden />
      ) : (
        <BsStar size={18} aria-hidden />
      )}
    </Button>
  )
}

export default BookmarkButton
