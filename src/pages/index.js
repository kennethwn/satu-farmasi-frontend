import { Inter } from "next/font/google";
import Layouts from "@/components/Layouts";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import PrescribeIcon from "@/components/Icons/PrescribeIcon";
import ContentLayout from "@/components/Layouts/Content";
import { IoMdArrowDropleft as ArrowLeftIcon } from "react-icons/io";
import { useUserContext } from "./api/context/UserContext";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import Toaster from "@/components/Modal/Toaster";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useUserContext();

  useEffect(() => {
    // toaster for notification
    toast.success("hello world", { autoClose: 2000, position: "top-center" });

    setTimeout(() => {
      toast.error("hello world", { autoClose: 2000, position: "top-center" });
    }, 2000);
  }, []);

  return (
    <Layouts user={user}>
      <ContentLayout type="child" title="Home">
        <p>hello world</p>
        <div className="mt-2">
          <Input type="text" id="name" name="name" onChange={(e) => setInput(e.target.value)} placeholder="name" />
        </div>
        <div className="w-1/4 mt-2">
          <Button appearance='primary' className='w-1 mr-9'>{<ArrowLeftIcon size={'24px'} />}</Button>
          <Button appearance="primary" onClick={() => alert(input)} appendIcon={<PrescribeIcon stroke="white" />}>Dimas</Button>
          
          {/* Button for open toaster component */}
          <Button appearance="danger" onClick={() => setOpen(true)}>Delete</Button> 
        </div>
      </ContentLayout>

      <Toaster
          type="warning"
          open={open} 
          onClose={() => setOpen(false)}
          body={`Apakah anda yakin untuk menghapus data ini?`}
          btnText="Hapus"
          onClick={() => setOpen(false)}
      />
    </Layouts>
  );
}
