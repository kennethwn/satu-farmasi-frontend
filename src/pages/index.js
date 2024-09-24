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
  const { user } = useUserContext();

  return (
    <Layouts user={user}>
      <ContentLayout type="child" title="Home">
        <p>hello world</p>
      </ContentLayout>
    </Layouts>
  );
}
