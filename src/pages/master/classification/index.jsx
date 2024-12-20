import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/pages/api/context/UserContext";
import { useState, useEffect, useRef } from "react";
import useClassificationsAPI from "@/pages/api/master/classification";
import { z } from "zod";
import { isRequiredString } from "@/helpers/validation";
import { Checkbox, Modal, Pagination, Table, Tooltip, Whisper } from "rsuite";
import Button from "@/components/Button";
import { IoMdAdd } from "react-icons/io";
import SearchBar from "@/components/SearchBar";
import Input from "@/components/Input";
import Toaster from "@/components/Modal/Toaster";
import { toast } from "react-toastify";
import { MdOutlineEdit } from "react-icons/md";
import { PiTrash } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const classificationSchema = z.object({
	label: isRequiredString(),
})

export default function index() {
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
	const createFormRef = useRef();
	const editFormRef = useRef();

	const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
		resolver: zodResolver(classificationSchema), defaultValues: {
			id: "",
			label: "",
			value: ""
		}
	});

	const HandleOnChange = (e, action) => {
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

	const HandleFetchClassificationData = async () => {
		try {
			const res = await GetAllClassification(page, limit);
			if (res.code !== 200) {
				toast.error(res.message, { autoClose: 2000, position: "top-right" });
				return;
			}
			setData(res.data.results);
			setTotalPage(res.data.total);
		} catch (error) {
			console.error(error);
		}
	};

	const HandleFetchClassificationByLabel = async () => {
		try {
			const res = await GetClassificationByLabel(search);
			if (res.code !== 200) {
				toast.error(res.message, { autoClose: 2000, position: "top-right" });
				return;
			}
			setData(res?.data.results);
			setTotalPage(res.data.total);
		} catch (error) {
			console.error(error);
		}
	};

	const HandleCreateClassification = async (data) => {
		try {
			data = { ...data, value: data.label };
			const res = await CreateClassification(data);
			if (res.code !== 200) {
				toast.error(res.message, {
					autoClose: 2000,
					position: "top-right",
				});
				return;
			}
			toast.success(res.message, {
				autoClose: 2000,
				position: "top-right",
			});
			setOpen({ ...open, create: false, edit: false, delete: false });
			HandleFetchClassificationData();
		} catch (error) {
			console.error(error);
		}
	};

	const HandleEditClassification = async (data) => {
		try {
			data = { ...data, id: editInput.id, value: data.label };
			const res = await EditClassification(data);
			if (res.code !== 200) {
				toast.error(res.message, {
					autoClose: 2000,
					position: "top-right",
				});
				return;
			}
			toast.success(res.message, {
				autoClose: 2000,
				position: "top-right",
			});
			setOpen({ ...open, create: false, edit: false, delete: false });
			HandleFetchClassificationData();
		} catch (error) {
			console.error(error);
		}
	};

	const HandleDeleteClassification = async (rowData, index) => {
		try {
            rowData = { ...rowData, isActive: rowData.is_active };
			const res = await DeleteClassification(rowData);
			if (res.code !== 200) {
				toast.error(res.message, {
					autoClose: 2000,
					position: "top-right",
				});
				return;
			}
			toast.success(res.message, {
				autoClose: 2000,
				position: "top-right",
			});
			setOpen({ ...open, create: false, edit: false, delete: false });
            setData(prevData => prevData.map((item, idx) => idx === index ? { ...item, is_active: !item.is_active } : item))
		} catch (error) {
			console.error(error);
		}
	};

	const renderTooltip = (content) => (
		<Tooltip>
			{content}
		</Tooltip>
	)

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

	const submitcreateform = () => createFormRef.current.requestSubmit();
	const submitEditForm = () => editFormRef.current.requestSubmit();

    useEffect(() => {
        setPage(1)
    }, [search, limit])

	return (
		<Layout active="master-classification" user={user}>
			<ContentLayout title="List Klasifikasi">
				<div className="w-full h-[500px]">
					<div className="flex flex-row justify-between items-center w-full pb-6">
						<Button
							prependIcon={<IoMdAdd size={24} />}
							onClick={() => {
								setOpen({ ...open, create: true });
								setValue("id", "");
								setValue("label", "");
								setValue("value", "");
							}}
						>
							Tambah
						</Button>

						<SearchBar
							size="md"
							className="w-1/4"
							placeholder="Cari Klasifikasi ..."
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

						<Column flexGrow={1}>
							<HeaderCell className="text-dark font-bold">
								Nama Klasifikasi
							</HeaderCell>
							<Cell dataKey="value" />
						</Column>

                        <Column width={100} fixed="right">
                            <HeaderCell className="text-center text-dark font-bold">Status Aktif</HeaderCell>
                            <Cell className="text-center">
                                {
                                    (rowData, index) => {
                                        return (
                                            <div className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg">
                                                <Checkbox
                                                    checked={rowData?.is_active} 
                                                    onChange={() => {
                                                        HandleDeleteClassification({ ...rowData, is_active: !rowData.is_active, id: parseInt(rowData.id) }, index);
                                                    }}
                                                />
                                            </div>
                                        )
                                    }
                                }
                            </Cell>
                        </Column>

						<Column width={150} fixed="right">
							<HeaderCell className="text-center text-dark font-bold">
								Aksi
							</HeaderCell>
							<Cell className="text-center">
								{(rowData) => {
									return (
										<div className="flex justify-center flex-row gap-6">
											<Whisper speaker={renderTooltip("Edit")} placement="top" controlId="control-id-hover" trigger="hover">
												<button
													className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
													onClick={() => {
														setEditInput(rowData);
														setValue("id", rowData.id);
														setValue("label", rowData.label);
														setValue("value", rowData.value);
														setOpen({ ...open, edit: true });
													}}
												>
													<MdOutlineEdit size="2em" color="#FFD400" />
												</button>
											</Whisper>
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
				onClose={() => {
					reset();
					setOpen({ ...open, create: false });
				}}
				size="lg"
				centered
			>
				<Header className="text-2xl font-bold">Tambah Klasifikasi</Header>
				<form onSubmit={handleSubmit(HandleCreateClassification)} ref={createFormRef}>
					<Body className="pt-2">
						<Input
							type="text"
							label="Nama Klasifikasi"
							name="label"
							placeholder="Nama Klasifikasi"
							autofocus={true}
							register={register}
							error={errors["label"]?.message}
							onChange={(e) => HandleOnChange(e, "create")}
						/>
					</Body>
					<Footer className="pt-4">
						<Button type="button" appearance="primary" isLoading={isLoading} onClick={submitcreateform}>
							Simpan
						</Button>
					</Footer>
				</form>
			</Modal>

			<Modal
				backdrop="static"
				open={open.edit}
				onClose={() => {
					reset();
					setOpen({ ...open, edit: false });
				}}
				size="lg"
			>
				<Header className="text-2xl font-bold">Ubah Klasifikasi</Header>
				<form onSubmit={handleSubmit(HandleEditClassification)} ref={editFormRef}>
					<Body className="pt-2">
						<Input
							type="text"
							label="Nama Klasifikasi"
							name="label"
							autofocus={true}
							placeholder="Nama Klasifikasi"
							register={register}
							error={errors["label"]?.message}
							onChange={(e) => HandleOnChange(e, "edit")}
						/>
					</Body>
					<Footer className="pt-4">
						<Button type="button" appearance="primary" isLoading={isLoading} onClick={submitEditForm}>
							Simpan
						</Button>
					</Footer>
				</form>
			</Modal>
		</Layout>
	);
}
