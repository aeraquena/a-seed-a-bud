import Form from "next/form";
import prisma from "@/../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function NewPlant() {
  async function createPlant(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;

    await prisma.plant.create({
      data: {
        name,
      },
    });

    revalidatePath("/");
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Plant</h1>
      <Form action={createPlant} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg mb-2">
            Title
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your plant name"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Create Plant
        </button>
      </Form>
    </div>
  );
}
