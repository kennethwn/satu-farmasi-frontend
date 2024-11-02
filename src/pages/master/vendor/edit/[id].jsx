import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
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

export default function index() {
  const router = useRouter();
  const id = router.query.id;
	console.log("id: ", id);
  const { isLoading, GetVendorById, EditVendor } = useVendorAPI();
  const formRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(vendorSchema) });

  const handleFetchVendorById = async () => {
    try {
      const res = await GetVendorById(id);
      if (res.code !== 200)
        return toast.error(res.message, {
          autoClose: 2000,
          position: "top-center",
        });
      setInput(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editHandler = async (data) => {
    try {
      const res = await EditVendor(data);
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

  useEffect(() => {
    const fetchData = async () => await handleFetchVendorById();
    if (router.isReady) fetchData();
  }, [id]);

  useEffect(() => {
	  console.log("input: ", input);
  }, [input]);

  return (
    <Layout active="master-vendor">
      <ContentLayout
        title="Ubah Vendor"
        type="child"
        backpageUrl="/master/vendor"
      >
        <form id="form" onSubmit={handleSubmit(editHandler)} ref={formRef}>
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
