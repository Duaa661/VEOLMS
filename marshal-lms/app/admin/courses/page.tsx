import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Ypur Courses</h1>
        <Link className={buttonVariants()} href="/admin/courses/create">Create Course</Link>
      </div>
      <div>
        <h1>Here you will see all of the courses</h1>
      </div>
    </>
  )
}

export default page
