"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-10 text-red-500">
      Something went wrong: {error.message}
    </div>
  );
}
