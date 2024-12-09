import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Inter } from "next/font/google";
import formatDate from "@/helpers/dayHelper";
import { formatRupiah } from "@/helpers/currency";

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

export const generateInvoiceTransaction = (pharmacy, pharmacist, patient, input, formField, totalPrice) => {
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
        table: {
            widths: [50, '*'],
            body: [
                ['Alamat', { text: `: ${pharmacy.address}` }],
                ['Email', { text: `: ${pharmacy.email}` }],
                ['No. Telp', { text: `: ${pharmacy.phoneNum}` }],
            ],
        },
        style: "smallText",
        layout: 'noBorders',
        margin: [0, 0, 0, 10]
      },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
      {
        columns: [
          // Patient Info
          {
            width: "50%",
            stack: [
              { text: "Data Pasien", style: "sectionHeader", margin: [0, 10, 0, 5] },
              { text: `Nama: ${patient.name}`, style: "smallText" },
              { text: `NIK: ${patient.credentialNumber}`, style: "smallText" },
            ],
          },
          // Pharmacist Info
          {
            width: "50%",
            stack: [
              { text: "Data Apoteker", style: "sectionHeader", margin: [0, 10, 0, 5], alignment: "right" },
              { text: `Nama: ${pharmacist.name}`, style: "smallText", alignment: "right" },
              { text: "SIPA: 9876543210", style: "smallText", alignment: "right" },
            ],
          },
        ],
        margin: [0, 10, 0, 30]
      },
      {
        text: "Detail Obat",
        style: "sectionHeader",
        margin: [0, 20, 0, 10],
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
            ...formField.map((list) => [
              list.medicine.name,
              { text: list.quantity, alignment: "right" },
              { text: formatRupiah(list.medicine.price), alignment: "right" },
              { text: formatRupiah(list.totalPrice), alignment: "right" },
            ]),
            [
              { text: "Total", colSpan: 3, alignment: "right", style: "tableHeader" },
              {},
              {},
              { text: formatRupiah(totalPrice), alignment: "right", style: "tableHeader" },
            ],
          ],
        },
        layout: "lightHorizontalLines",
      },
      {
        text: `\n\nTanggal: ${formatDate(input.created_at)}\n`,
        style: "smallText",
      },
      {
        columns: [
          { text: "", width: "75%" },
          {
            text: `Tanda Tangan\n\n\n\n\n___________________\n${pharmacist.name}`,
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
      sectionHeader: {
        fontSize: 12,
        bold: true,
        decoration: "underline",
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake.createPdf(dd).open();
}

export const generateOutputMedicine = (input, formField, reasonOfDispose) => {
  const witnessesHeader = [{ text: 'No', bold: true }, { text: 'Nama', bold: true }, { text: 'NIP', bold: true }, { text: 'Jabatan', bold: true }];

  const witnesses = [
    witnessesHeader,
    ...input.witnesses.map((item, index) => [
        { text: ++index },
        { text: item.name },
        { text: item.nip },
        { text: item.role },
    ])
  ]

  const witnessesSignatures = input.witnesses.map((item, index) => [
    `${index + 1}. ${item.name}\nNo. NIP: ${item.nip}`,
    '\n\n\n\n',
  ])

  const witnessesSignatures2 = input.witnesses.map((item, index) => [
    `${index + 1}. ${item.name}\nNo. NIP: ${item.nip}`,
    '\n\n\n\n\n',
  ])

  const medicineHeader = [{ text: 'No', bold: true }, { text: 'Nama Obat', bold: true }, { text: 'Jumlah', bold: true }, { text: 'Alasan Pemusnahan', bold: true }]
    
  const medicineBody = [
      medicineHeader,
      ...formField.map((item, index) => [
          { text: ++index },
          { text: item.medicine || item.name },
          { text: item.quantity || item.currStock },
          { text: item.remark || reasonOfDispose },
      ])
  ]

  let dd = {
    content: [
      { text: 'BERITA ACARA PEMUSNAHAN OBAT KEDALUWARSA/RUSAK', style: 'header'},
      {
        text: `Pada hari ini ${formatDate(input?.created_at)}`,
        style: 'paragraph',
      },
      {
        text: 'sesuai dengan Peraturan Menteri Kesehatan Republik Indonesia Nomor 73 Tahun 2016 tentang Standar Pelayanan Kefarmasian di Apotek, kami yang bertanda tangan di bawah ini:',
        style: 'paragraph',
      },
      {
        table: {
            widths: [200, '*'],
            body: [
                ['Nama Apoteker Pengelola Apotek', { text: `: ${input?.pharmacist}` }],
                ['Nomor SIPA', { text: `: ${input?.sipaNumber}` }],
                ['Nama Apotek', { text: `: ${input?.pharmacy}` }],
                ['Alamat Apotek', { text: `: ${input?.addressPharmacy}` }],
            ],
        },
        margin: [0, 10, 0, 10],
        layout: 'noBorders'
      },
      {
        text: 'Dengan disaksikan oleh:',
        style: 'paragraph',
      },
      {
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: witnesses,
        },
        margin: [0, 10, 0, 10],
      },
      {
        text: 'Telah melakukan pemusnahan obat sebagaimana tercantum dalam daftar terlampir.',
        style: 'paragraph',
      },
      {
        text: `Tempat dilakukan pemusnahan obat: ${input?.addressPharmacy}`,
        style: 'paragraph',
      },
      {
        text: [
          'Demikianlah berita acara ini kami buat sesungguhnya dengan penuh tanggung jawab.\n',
          'Berita acara ini dibuat rangkap 4 (empat) dan dikirim kepada:\n',
          '1. Kepala Dinas Kesehatan Kabupaten/Kota\n',
          '2. Kepala Balai Pemeriksaan Obat dan Makanan\n',
          '3. Kepala Dinas Kesehatan Provinsi\n',
          '4. Arsip di Apotek\n',
        ],
        style: 'paragraph',
      },
      {
        text: formatDate(input?.created_at),
        alignment: 'right',
        margin: [0, 20, 0, 20],
      },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'Saksi - saksi :', bold: true, margin: [0, 5] },
              { text: `Yang membuat berita acara,\n\n\n\n(${input?.pharmacist})\nNo. SIPA: ${input?.sipaNumber}`, alignment: 'center', margin: [0, 5] }
            ],
            ...witnessesSignatures
          ],
        },
        layout: 'noBorders'
      },
      { text: 'DAFTAR OBAT YANG DIMUSNAHKAN', style: 'header'},
      {
        table: {
          widths: ['auto', '*', 'auto', '*'],
          body: medicineBody
        },
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'Saksi - saksi :', bold: true, margin: [0, 5] },
              { text: `Yang membuat berita acara,\n\n\n\n(${input?.pharmacist})\nNo. SIPA: ${input?.sipaNumber}`, alignment: 'center', margin: [0, 5] }
            ],
            ...witnessesSignatures2
          ],
        },
        layout: 'noBorders',
        margin: [0, 36, 0 ,0]
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
  };

  pdfMake.createPdf(dd).open();
}