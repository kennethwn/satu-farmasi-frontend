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
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts";

const inter = Inter({ subsets: ["latin"] });
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Home() {
  const { user } = useUserContext();

  function printPDF() {
    var docDefinition = {
      info: {
        title: 'awesome Document',
        author: 'john doe',
        subject: 'subject of document',
        keywords: 'keywords for document',
      },
      content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', 'auto', 100, '*' ],
    
            body: [
              [ 'First', 'Second', 'Third', 'The last one' ],
              [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
              [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
            ]
          }
        }
      ]
    };

    pdfMake.createPdf(docDefinition).open();
  }

  return (
    <Layouts user={user}>
      <ContentLayout type="child" title="Home">
        <p>hello world</p>
        <Button onClick={printPDF}>PDF</Button>
      </ContentLayout>
    </Layouts>
  );
}
