'use client'

import ShowError from '@/components/shared/ShowError'

const error = ({ error }: { error: Error & { digest?: string } }) => {
  return (
    <div>
      <ShowError error={error} reset={() => window.location.reload()} />
    </div>
  )
}

export default error
