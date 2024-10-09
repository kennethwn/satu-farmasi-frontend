import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useRouter } from "next/router";
import { useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Loader } from "rsuite";
import useVendorAPI from "@/pages/api/master/vendor";
import { z } from "zod";
import { isRequiredString } from "@/helpers/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const vendorSchema = z.object({
  name: isRequiredString(),
  phoneNum: isRequiredString(),
  address: isRequiredString(),
  city: isRequiredString(),
});

const createVendorField = [
  {
    label: "Nama Vendor",
    type: "text",
    name: "name",
    placeholder: "Nama Vendor",
  },
  {
    label: "No Handphone",
    type: "number",
    name: "phoneNum",
    placeholder: "628XXXXXXXXX",
  },
  {
    label: "Alamat",
    type: "text",
    name: "address",
    placeholder: "Alamat",
  },
  {
    label: "Kota",
    type: "text",
    name: "city",
    placeholder: "Kota",
  },
];

export default function create() {
  const router = useRouter();
  const { isLoading, CreateVendor } = useVendorAPI();
  const formRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(vendorSchema) });

  const createHandler = async (data) => {
    try {
      const res = await CreateVendor(data);
      if (res.code !== 200)
        return toast.error(res.message, {
          autoClose: 2000,
          position: "top-center",
        });
      toast.success(res.message, { autoClose: 2000, position: "top-center" });
      router.push("/master/vendor");
    } catch (error) {
      console.error(error);
    }
  };

  const submitForm = () => formRef.current.requestSubmit();

  return (
    <Layout active="master-vendor">
      <ContentLayout
        title="Tambah Vendor"
        type="child"
        backpageUrl="/master/vendor"
      >
        <form id="form" onSubmit={handleSubmit(createHandler)} ref={formRef}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            {createVendorField.map((input) => {
              return (
                <div className="sm:col-span-6">
                  <Input
                    label={input.label}
                    register={register}
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    error={errors[input.name]?.message}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-2 my-6 lg:justify-end">
            {isLoading ? (
              <Button
                appearance="primary"
                isDisabled={true}
                isLoading={isLoading}
              >
                Simpan
              </Button>
            ) : (
              <Button appearance="primary" isLoading={isLoading} onClick={() => submitForm()}>
                Simpan
              </Button>
            )}
          </div>
        </form>
      </ContentLayout>

      <ToastContainer />
      {isLoading && <Loader />}
    </Layout>
  );
}
