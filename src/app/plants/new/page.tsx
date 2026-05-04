import Form from 'next/form'
import prisma from '@/../lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default function NewPlant() {
  async function createPlant(formData: FormData) {
    'use server'

    const name = formData.get('name') as string

    await prisma.plant.create({
      data: {
        name,
      },
    })

    revalidatePath('/')
    redirect('/')
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Add New Plant</h1>
      <Form action={createPlant} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-lg">
            Title
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your plant name"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 py-3 text-white hover:bg-green-700"
        >
          Create Plant
        </button>
      </Form>
    </div>
  )
}
