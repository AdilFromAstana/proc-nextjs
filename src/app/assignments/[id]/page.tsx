"use server";
import { notFound } from "next/navigation";
import AssignmentPage from "./components/AssignmentPage";

export default async function AssignmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    notFound();
  }

  return <AssignmentPage assignmentId={id} />;
}
