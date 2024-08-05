import { Inter } from "next/font/google";
import Layouts from "@/components/Layouts";
import Input from "@/components/Input";
import { useState } from "react";
import PrescribeIcon from "@/components/Icons/PrescribeIcon";
import ContentLayout from "@/components/Layouts/Content";
import { IoMdArrowDropleft as ArrowLeftIcon } from "react-icons/io";
import { useUserContext } from "./api/context/UserContext";
import Button from "@/components/Button";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [input, setInput] = useState("");
  const { user } = useUserContext();
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
          {/* <Button appearance="primary" color="violet" onClick={() => alert(input)}>Dimas</Button>  */}
        </div>
      </ContentLayout>
    </Layouts>
  );
}
