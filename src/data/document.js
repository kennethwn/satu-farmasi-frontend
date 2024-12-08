import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Inter } from "next/font/google";
import formatDate from "@/helpers/dayHelper";

const inter = Inter({ subsets: ["latin"] });
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateOrderBasicMedicine = (input, formField) => {
    const headers = [{ text: 'No', bold: true }, { text: 'Nama Sediaan Farmasi', bold: true, alignment: 'center' }, { text: 'Jumlah', bold: true, alignment: 'center' }, { text: 'Keterangan', bold: true, alignment: 'center' }]
    
    const body = [
        headers,
        ...formField.map((item, index) => [
            { text: ++index },
            { text: item.medicine },
            { text: item.quantity },
            { text: item.remark },
        ])
    ]

    let dd = {
        content: [
            { text: 'SURAT PESANAN SEDIAAN FARMASI', style: 'header'},
            {
                table: {
                    widths: [120, '*'],
                    body: [
                        ['NAMA APOTEK', { text: `: ${input?.pharmacy}` }],
                        ['NOMOR SIA', { text: `: ${input?.siaNumber}` }],
                        ['ALAMAT', { text: `: ${input?.addressPharmacy}` }],
                        ['NAMA APOTEKER', { text: `: ${input?.pharmacist}` }],
                        ['NOMOR SIPA', { text: `: ${input?.sipaNumber}` }],
                    ],
                },
                margin: [0, 0, 0, 10],
                layout: 'noBorders'
            },
            {
                table: {
                    widths: ['*', '*'],
                    body: [
                        [`Yth. ${input?.vendor}`, { text: `${formatDate(new Date())}`, alignment: 'right' }],
                        [`\ndi ${input?.cityPharmacy}`, ''],
                    ],
                },
                margin: [0, 30, 0, 10],
                layout: 'noBorders'
            },
            {
                text: `SURAT PESANAN\nNOMOR ${input?.leftNum}/${input?.middleNum}/${input?.rightNum}`,
                alignment: 'center',
                fontSize: 14,
                margin: [0, 36, 0, 0],
                style: 'paragraph'
            },
            {
                table: {
                    widths: ['auto', '*', 'auto', '*'],
                    body: body,
                },
                margin: [0, 0, 0, 10],
            },
            {
                table: {
                widths: ['*'],
                body: [
                    [{ text: 'Hormat saya', bold: false, alignment: 'right' }],
                    [{ text: `\n\n\n\n\n${input?.pharmacist}\n(Apoteker)`, bold: true, alignment: 'right' }],
                ],
            },
                margin: [0, 94, 0, 10],
                layout: 'noBorders'
            },
        ],
        styles: {
            paragraph: {
                fontSize: 12,
                lineHeight: 1.5,
            },
            header: {
                fontSize: 14,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 36]
            }
        },
        defaultStyle: {
            font: 'Roboto',
        },
    }
  
    pdfMake.createPdf(dd).open();
}

export const generateOrderNarcoticsMedicine = (input, formField) => {
    const headers = [{ text: 'No', bold: true }, { text: 'Nama Sediaan Farmasi', bold: true, alignment: 'center' }, { text: 'Jumlah', bold: true, alignment: 'center' }, { text: 'Keterangan', bold: true, alignment: 'center' }]
    
    const body = [
        headers,
        ...formField.map((item, index) => [
            { text: ++index },
            { text: item.medicine },
            { text: item.quantity },
            { text: item.remark },
        ])
    ]

    const resolveRole = (input) => {
        switch (input) {
            case 'pharmacist':
                return 'Apoteker';
            case 'doctor':
                return 'Dokter';
            case 'admin':
                return 'Admin'
            default:
                return 'Apoteker'
        }
    }
    
    let dd = {
        content: [
            { text: 'SURAT PESANAN NARKOTIKA', style: 'header', lineHeight: 1.5},
            { text: `Nomor: ${input?.leftNum}/${input.middleNum}/${input?.rightNum}`, alignment: 'center', margin: [0, 0, 0, 36], fontSize: 14},
            { text: 'Yang bertanda tangan di bawah ini:', style: 'paragraph'},
            {
              table: {
                widths: [120, '*'],
                body: [
                  ['Nama', { text: `: ${input?.pharmacist}` }],
                  ['Jabatan', { text: `: ${resolveRole(input?.role)}` }],
                ],
              },
              margin: [0, 0, 0, 24],
              layout: 'noBorders'
            },
            { text: 'Mengajukan pesanan narkotika kepada:', style: 'paragraph'},
            {
              table: {
                widths: [120, '*'],
                body: [
                  ['Nama Distributor', { text: `: ${input?.vendor}` }],
                  ['Alamat', { text: `: ${input?.cityVendor}` }],
                  ['Telp', { text: `: ${input?.phoneVendor}` }],
                ],
              },
              margin: [0, 0, 0, 24],
              layout: 'noBorders'
            },
            { text: 'Dengan narkotika yang dipesan adalah:', style: 'paragraph'},
            {
              table: {
                widths: ['auto', '*', 'auto', '*'],
                body: body,
              },
              margin: [0, 0, 0, 24],
            },
            { text: 'Narkotika tersebut akan dipergunakan untuk:', style: 'paragraph'},
            {
              table: {
                widths: [120, '*'],
                body: [
                  ['Nama Apotek', { text: `: ${input?.pharmacy}` }],
                  ['Alamat', { text: `: ${input?.addressPharmacy}` }],
                ],
              },
              margin: [0, 0, 0, 10],
              layout: 'noBorders'
            },
            {
              table: {
                widths: ['*', '*'],
                body: [
                  ['', { text: `${formatDate(new Date())}\n`, alignment: 'right' }],
                  ['', { text: `\n\n\n\n\n${input?.pharmacist}`, bold: true, alignment: 'right'}],
                ],
              },
              margin: [0, 30, 0, 10],
              layout: 'noBorders'
            },
            { text: '*) coret yang tidak perlu', margin: [0, 24, 0, 0], style: 'paragraph'},
            { text: 'Catatan:\n- Satu surat pesanan hanya berlaku untuk satu jenis Narkotika\n- Surat Pesanan dibuat sekurang-kurangnya 3(tiga) rangkap', style: 'paragraph'}
        ],
        styles: {
            paragraph: {
                fontSize: 12,
                lineHeight: 1.5,
            },
            header: {
                fontSize: 14,
                bold: true,
                alignment: 'center',
            }
          },
        defaultStyle: {
            font: 'Roboto',
        },
    }

    pdfMake.createPdf(dd).open();
}

export const generateOrderPsychotropicMedicine = (input, formField) => {
    const headers = [{ text: 'No', bold: true }, { text: 'Nama Sediaan Farmasi', bold: true, alignment: 'center' }, { text: 'Jumlah', bold: true, alignment: 'center' }, { text: 'Keterangan', bold: true, alignment: 'center' }]
    
    const body = [
        headers,
        ...formField.map((item, index) => [
            { text: ++index },
            { text: item.medicine },
            { text: item.quantity },
            { text: item.remark },
        ])
    ]

    const resolveRole = (input) => {
        switch (input) {
            case 'pharmacist':
                return 'Apoteker';
            case 'doctor':
                return 'Dokter';
            case 'admin':
                return 'Admin'
            default:
                return 'Apoteker'
        }
    }
    
    let dd = {
        content: [
            { text: 'SURAT PESANAN PSIKOTROPIKA', style: 'header', lineHeight: 1.5},
            { text: `Nomor: ${input?.leftNum}/${input.middleNum}/${input?.rightNum}`, alignment: 'center', margin: [0, 0, 0, 36], fontSize: 14},
            { text: 'Yang bertanda tangan di bawah ini:', style: 'paragraph'},
            {
              table: {
                widths: [120, '*'],
                body: [
                  ['Nama', { text: `: ${input?.pharmacist}` }],
                  ['Jabatan', { text: `: ${resolveRole(input?.role)}` }],
                ],
              },
              margin: [0, 0, 0, 24],
              layout: 'noBorders'
            },
            { text: 'Mengajukan pesanan psikotropika kepada:', style: 'paragraph'},
            {
              table: {
                widths: [120, '*'],
                body: [
                  ['Nama Distributor', { text: `: ${input?.vendor}` }],
                  ['Alamat', { text: `: ${input?.cityVendor}` }],
                  ['Telp', { text: `: ${input?.phoneVendor}` }],
                ],
              },
              margin: [0, 0, 0, 24],
              layout: 'noBorders'
            },
            { text: 'Dengan psikotropika yang dipesan adalah:', style: 'paragraph'},
            {
              table: {
                widths: ['auto', '*', 'auto', '*'],
                body: body,
              },
              margin: [0, 0, 0, 24],
            },
            { text: 'Psikotropika tersebut akan dipergunakan untuk:', style: 'paragraph'},
            {
              table: {
                widths: [120, '*'],
                body: [
                  ['Nama Apotek', { text: `: ${input?.pharmacy}` }],
                  ['Alamat', { text: `: ${input?.addressPharmacy}` }],
                ],
              },
              margin: [0, 0, 0, 10],
              layout: 'noBorders'
            },
            {
              table: {
                widths: ['*', '*'],
                body: [
                  ['', { text: `${formatDate(new Date())}\n`, alignment: 'right' }],
                  ['', { text: `\n\n\n\n\n${input?.pharmacist}`, bold: true, alignment: 'right'}],
                ],
              },
              margin: [0, 30, 0, 10],
              layout: 'noBorders'
            },
            { text: 'Catatan: Surat Pesanan dibuat sekurang-kurangnya 3(tiga) rangkap',  margin: [0, 72, 0, 0], style: 'paragraph'}
        ],
        styles: {
            paragraph: {
                fontSize: 12,
                lineHeight: 1.5,
            },
            header: {
                fontSize: 14,
                bold: true,
                alignment: 'center',
            }
          },
        defaultStyle: {
            font: 'Roboto',
        },
    }

    pdfMake.createPdf(dd).open();
}

export const generateInvoiceTransaction = (pharmacy, input, formField) => {
  let dd = {
    content: [
      {
        text: "INVOICE TRANSAKSI",
        style: "header",
        alignment: "center",
      },
      {
        text: `\n${pharmacy.name}`,
        style: "subheader",
      },
      {
        text: `Alamat: ${pharmacy.address}\nEmail: ${pharmacy.email}\nNo. Telp: ${pharmacy.phone}\n\n`,
        style: "smallText",
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto"],
          body: [
            [
              { text: "Nama Obat", style: "tableHeader" },
              { text: "Jumlah", style: "tableHeader", alignment: "right" },
              { text: "Harga Satuan (Rp)", style: "tableHeader", alignment: "right" },
              { text: "Subtotal (Rp)", style: "tableHeader", alignment: "right" },
            ],
            ...medicines.map((med) => [
              med.name,
              { text: med.quantity, alignment: "right" },
              { text: med.price.toLocaleString(), alignment: "right" },
              { text: (med.quantity * med.price).toLocaleString(), alignment: "right" },
            ]),
            [
              { text: "Total", colSpan: 3, alignment: "right", style: "tableHeader" },
              {},
              {},
              { text: total.toLocaleString(), alignment: "right", style: "tableHeader" },
            ],
          ],
        },
        layout: "lightHorizontalLines",
      },
      {
        text: `\n\nTanggal: ${currentDate}\nTempat: Jakarta`,
        style: "smallText",
      },
      {
        columns: [
          { text: "", width: "75%" },
          {
            text: "Tanda Tangan\n\n\n___________________",
            alignment: "center",
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      smallText: {
        fontSize: 10,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake.createPdf(dd).open();
}