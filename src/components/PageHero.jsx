import { useId } from 'react'

function PageHero({ title, description, children }) {
  const titleId = useId()

  return (
    <section className="page-hero" aria-labelledby={titleId}>
      <div className="d-flex flex-column flex-lg-row align-items-lg-start justify-content-between gap-3">
        <div>
          <h1 id={titleId}>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {children ? <div className="flex-shrink-0">{children}</div> : null}
      </div>
    </section>
  )
}

export default PageHero
