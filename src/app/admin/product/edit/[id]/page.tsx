import EditProductForm from "@/app/admin/_components/EditProductForm";

const EditProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <>
      <EditProductForm productId={id} />
    </>
  );
};

export default EditProductPage;
