import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/pages/api/context/UserContext";
import { useState, useEffect } from "react";
import useClassificationsAPI from "@/pages/api/master/classification";
import { z } from "zod";
import { isRequiredString } from "@/helpers/validation";
import { Modal, Pagination, Table } from "rsuite";
import Button from "@/components/Button";
import { IoMdAdd } from "react-icons/io";
import SearchBar from "@/components/SearchBar";
import Input from "@/components/Input";
import Toaster from "@/components/Modal/Toaster";
import { toast } from "react-toastify";
import { MdOutlineEdit } from "react-icons/md";
import { PiTrash } from "react-icons/pi";

const classificationSchema = z.object({
    label: isRequiredString(),
    value: isRequiredString(),
})

export default function index(props) {
  const { user } = useUserContext();
  const { Header, Body, Footer } = Modal;
  const { HeaderCell, Cell, Column } = Table;
  const {
    isLoading,
    GetAllClassification,
    GetClassificationByLabel,
    CreateClassification,
    EditClassification,
    DeleteClassification,
  } = useClassificationsAPI();

  const [data, setData] = useState([]);
  const [editInput, setEditInput] = useState({});
  const [input, setInput] = useState({ label: "", value: "" });
  const [open, setOpen] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const HandleOnChange = (e, action) => {
    console.log("action: ", action);
    switch (action) {
      case "create":
        setInput({
          ...input,
          label: e.target.value,
          value: e.target.value,
        });
        break;
      case "edit":
        setEditInput({
          ...editInput,
          label: e.target.value,
          value: e.target.value,
        });
        break;
    }
  };

  const HandleClear = () => {
    setData([]);
    setEditInput({});
    setPage(1);
    setTotalPage(0);
    setLimit(10);
    setInput({ label: "", value: "" });
    setOpen({
      create: false,
      edit: false,
      delete: false,
    });
  };

  
  // NOTE: Get All
  const HandleFetchClassificationData = async () => {
    try {
      const res = await GetAllClassification(page, limit);
      console.log("result: ", res);
      if (res.code !== 200) {
        toast.error(res.message, { autoClose: 2000, position: "top-center" });
        return;
      }
      setData(res.data.results);
      setTotalPage(res.data.total);
    } catch (error) {
      console.error(error);
    }
  };

  // NOTE: Get By Label
  // TODO: Fix the search function
  const HandleFetchClassificationByLabel = async () => {
    try {
      const res = await GetClassificationByLabel(search);
      console.log(res);
      if (res.code !== 200) {
        toast.error(res.message, { autoClose: 2000, position: "top-center" });
        return;
      }
      setData(res?.data.results);
      setTotalPage(res.total);
    } catch (error) {
      console.error(error);
    }
  };

  const HandleCreateClassification = async () => {
    try {
      const validatedData = classificationSchema.parse(input);
      const res = await CreateClassification(validatedData);
		console.log("create res: ", res);
      if (res.code !== 200) {
        toast.error("Failed to create classification", {
          autoClose: 2000,
          position: "top-center",
        });
        return;
      }
      toast.success("Successfully created classification", {
        autoClose: 2000,
        position: "top-center",
      });
      setOpen({ ...open, create: false, edit: false, delete: false });
      HandleFetchClassificationData();
    } catch (error) {
      console.error(error);
    }
  };

  // NOTE: Edit
  const HandleEditClassification = async (action) => {
    try {
      const res = await EditClassification(editInput);
      if (res.code !== 200) {
        toast.error("Failed to edit Classification", {
          autoClose: 2000,
          position: "top-center",
        });
        return;
      }
      toast.success(
        `${action === "delete" ? "Successfully deleted Classification" : "Successfully edited classification"}`,
        { autoClose: 2000, position: "top-center" },
      );
      setOpen({ ...open, create: false, edit: false, delete: false });
      HandleFetchClassificationData();
    } catch (error) {
      //console.error(error);
      console.log("Error: ", error) 
    }
  };

  // NOTE: Delete
  const HandleDeleteClassification = async (action) => {
    try {
      setEditInput({ ...editInput, is_active: false });
      console.log("input : ", editInput);
      const res = await DeleteClassification(editInput);
      if (res.code !== 200) {
        toast.error("Failed to delete Classification", {
          autoClose: 2000,
          position: "top-center",
        });
        return;
      }
      toast.success("Successfully deleted Classification", {
        autoClose: 2000,
        position: "top-center",
      });
      setOpen({ ...open, create: false, edit: false, delete: false });
      HandleFetchClassificationData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (search === "") {
        await HandleFetchClassificationData();
      } else {
        await HandleFetchClassificationByLabel();
      }
    }
    fetchData();
  }, [page, limit, search]);

  return (
    <Layout active="master-classification" user={user}>
      <ContentLayout title="List Klasifikasi">
        <div className="w-full h-[500px]">
          <div className="flex flex-row justify-between items-center w-full pb-6">
            <Button
              prependIcon={<IoMdAdd size={24} />}
              onClick={() => setOpen({ ...open, create: true })}
            >
              Tambah
            </Button>

            <SearchBar
              size="md"
              className="w-1/4"
              placeholder="Search..."
              onChange={(value) => setSearch(value)}
            />
          </div>
          <Table
            data={data || []}
            bordered
            cellBordered
            shouldUpdateScroll={false}
            affixHorizontalScrollbar
            height={400}
            loading={isLoading}
          >
            <Column width={100} fixed="left">
              <HeaderCell className="text-center text-dark font-bold">
                No
              </HeaderCell>
              <Cell className="text-center text-dark">
                {(rowData, index) => index + 1}
              </Cell>
            </Column>

            <Column width={400}>
              <HeaderCell className="text-dark font-bold">
                ID Klasifikasi
              </HeaderCell>
              <Cell dataKey="label" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell className="text-dark font-bold">
                Nama Klasifikasi
              </HeaderCell>
              <Cell dataKey="value" />
            </Column>

            <Column width={150} fixed="right">
              <HeaderCell className="text-center text-dark font-bold">
                Action
              </HeaderCell>
              <Cell className="text-center">
                {(rowData) => {
                  return (
                    <div className="flex justify-center flex-row gap-6">
                      <button
                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                        onClick={() => {
                          console.log(rowData);
                          setEditInput(rowData);
                          setOpen({ ...open, edit: true });
                        }}
                      >
                        <MdOutlineEdit size="2em" color="#FFD400" />
                      </button>

                      <button
                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                        onClick={() => {
                          console.log(rowData);
                          setEditInput({ ...rowData, is_active: false });
                          setOpen({ ...open, delete: true });
                        }}
                      >
                        <PiTrash size="2em" color="#DC4A43" />
                      </button>
                    </div>
                  );
                }}
              </Cell>
            </Column>
          </Table>
          <div className="pt-4">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={5}
              size="xs"
              layout={["total", "-", "limit", "|", "pager"]}
              total={totalPage || 0}
              limitOptions={[5, 10, 15]}
              limit={limit}
              activePage={page}
              onChangePage={(page) => setPage(page)}
              onChangeLimit={(limit) => setLimit(limit)}
            />
          </div>
        </div>
      </ContentLayout>

      <Modal
        backdrop="static"
        open={open.create}
        onClose={() => setOpen({ ...open, create: false })}
        size="lg"
        centered
      >
        <Header className="text-2xl font-bold">Tambah Klasifikasi</Header>
        <Body className="pt-2">
          <Input
            type="text"
            label="Nama Klasifikasi"
            name="name"
            placeholder="nama Klasifikasi"
            onChange={(e) => HandleOnChange(e, "create")}
          />
        </Body>
        <Footer className="pt-4">
          <Button appearance="primary" isLoading={isLoading} onClick={() => HandleCreateClassification()}>
            Simpan
          </Button>
        </Footer>
      </Modal>

      <Modal
        backdrop="static"
        open={open.edit}
        onClose={() => {
          setOpen({ ...open, edit: false });
        }}
        size="lg"
      >
        <Header className="text-2xl font-bold">Edit Klasifikasi</Header>
        <Body className="pt-2">
          <Input
            type="text"
            label="Nama Klasifikasi"
            name="name"
            placeholder="nama Klasifikasi"
            value={editInput.value}
            onChange={(e) => HandleOnChange(e, "edit")}
          />
        </Body>
        <Footer className="pt-4">
          <Button appearance="primary" isLoading={isLoading} onClick={() => HandleEditClassification("edit")}>
            Simpan
          </Button>
        </Footer>
      </Modal>

      <Toaster
        type="warning"
        open={open.delete}
        onClose={() => setOpen({ ...open, delete: false })}
        body={
          <>
            Apakah anda yakin untuk menghapus data{" "}
            <span className="text-danger">{editInput.label}</span>?
          </>
        }
        btnText="Hapus"
        isLoading={isLoading}
        onClick={() => HandleDeleteClassification("delete")}
      />
    </Layout>
  );
}
