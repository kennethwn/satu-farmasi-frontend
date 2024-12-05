import Button from "@/components/Button";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import SearchBar from "@/components/SearchBar";
import { useUserContext } from "@/pages/api/context/UserContext";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";
import { Pagination, SelectPicker, Table, Modal, Checkbox } from "rsuite";
import { MdOutlineEdit } from "react-icons/md";
import { PiTrash } from "react-icons/pi";
import { toast } from "react-toastify";
import { z } from "zod";
import { isRequiredString } from "@/helpers/validation";
import Input from "@/components/Input";
import useGenericAPI from "@/pages/api/master/generic";
import Toaster from "@/components/Modal/Toaster";
import { zodResolver } from "@hookform/resolvers/zod";

const genericSchema = z.object({
	label: isRequiredString(),
})

export default function index(props) {
	const { user } = useUserContext();
	const { Header, Body, Footer } = Modal;
	const { HeaderCell, Cell, Column } = Table;
	const { isLoading, GetAllGeneric, GetGenericByLabel, CreateGeneric, EditGeneric, DeleteGeneric } = useGenericAPI();
	const createFormRef = useRef();
	const editFormRef = useRef();

	const [data, setData] = useState([]);
	const [editInput, setEditInput] = useState({});
	const [input, setInput] = useState({ label: "", value: "" });
	const [open, setOpen] = useState({
		create: false,
		edit: false,
		delete: false,
	});

	const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
		resolver: zodResolver(genericSchema), defaultValues: {
			id: "",
			label: "",
			value: ""
		}
	})
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(0);
	const [limit, setLimit] = useState(10);

	const HandleOnChange = (e, action) => {
		switch (action) {
			case "create":
				setInput({
					...input,
					label: e.target.value,
					value: e.target.value
				});
				break;
			case "edit":
				setEditInput({
					...editInput,
					label: e.target.value,
					value: e.target.value
				});
				break;
		}
	}

	const HandeFetchGenericData = async () => {
		try {
			const res = await GetAllGeneric(page, limit);
			if (res.code !== 200) {
				toast.error("Failed to fetch generic data", { autoClose: 2000, position: "top-right" });
				return;
			}
			setData(res.data.results);
			setTotalPage(res.data.total);
		} catch (error) {
			console.error(error);
		}
	}

	const HandleFetchGenericByLabel = async () => {
		try {
			const res = await GetGenericByLabel(search);
			if (res.code !== 200) {
				toast.error("Failed to fetch generic data", { autoClose: 2000, position: "top-right" });
				return;
			}
			setData(res.data.results);
			setTotalPage(res.data.total);
		} catch (error) {
			console.error(error);
		}
	}

	const HandleCreateGeneric = async (data) => {
		try {
			data = { ...data, value: data.label };
			const res = await CreateGeneric(data);
			if (res.code !== 200) {
				toast.error(res.message, { autoClose: 2000, position: "top-right" });
				return;
			}
			toast.success(res.message, { autoClose: 2000, position: "top-right" });
			setOpen({ ...open, create: false });
            reset();
			HandeFetchGenericData();
		} catch (error) {
			console.error(error);
		}
	}

	const HandleEditGeneric = async (data) => {
		try {
			data = { ...data, id: editInput.id, value: data.label };
			const res = await EditGeneric(data);
			if (res.code !== 200) {
				toast.error(res.message, { autoClose: 2000, position: "top-right" });
				return;
			}
			toast.success(res.message, { autoClose: 2000, position: "top-right" });
			setOpen({ ...open, edit: false, delete: false });
            reset();
			HandeFetchGenericData();
		} catch (error) {
			console.error(error);
		}
	}

	const handledeletegeneric = async (rowData) => {
		try {
            rowData = { ...rowData, isActive: rowData.is_active };
			const res = await DeleteGeneric(rowData);
			if (res.code !== 200) {
				toast.error(res.message, { autoClose: 2000, position: "top-right" });
				return;
			}
			toast.success(res.message, { autoClose: 2000, position: "top-right" });
			setOpen({ ...open, delete: false });
			         reset();
			HandeFetchGenericData();
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		async function fetchData() {
			if (search === '') {
				await HandeFetchGenericData();
			} else {
				await HandleFetchGenericByLabel();
			}
		}
		fetchData();
	}, [page, limit, search]);

	const submitcreateform = () => createFormRef.current.requestSubmit();
	const submitEditForm = () => editFormRef.current.requestSubmit();

	return (
		<Layout active="master-generic" user={user}>
			<ContentLayout title="List Generik Obat">
				<div className="flex flex-row justify-between w-full pb-6">
					<Button
						prependIcon={<IoMdAdd size={24} />}
						onClick={() => {
							setOpen({ ...open, create: true });
							setValue("id", "");
							setValue("label", "");
							setValue("value", "");
						}}>
						Tambah
					</Button>

					<SearchBar
						size="md"
						className="w-1/4"
						placeholder="Cari Generik Obat ..."
						onChange={(value) => setSearch(value)}
					/>
				</div>
				<div className="w-full h-[500px]">
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
							<HeaderCell className="text-center text-dark font-bold">No</HeaderCell>
							<Cell className="text-center text-dark">
								{(rowData, index) => index + 1}
							</Cell>
						</Column>

						<Column flexGrow={1}>
							<HeaderCell className="text-dark font-bold">Nama Generik</HeaderCell>
							<Cell dataKey='value' />
						</Column>

                        <Column width={100} fixed="right">
                            <HeaderCell className="text-center text-dark">Status Aktif</HeaderCell>
                            <Cell className="text-center">
                                {
                                    rowData => {
                                        return (
                                            <div className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg">
                                                <Checkbox
                                                    checked={rowData?.is_active} 
                                                    onChange={() => {
                                                        handledeletegeneric({ ...rowData, is_active: !rowData.is_active, id: parseInt(rowData.id) });
                                                    }}
                                                />
                                            </div>
                                        )
                                    }
                                }
                            </Cell>
                        </Column>

						<Column width={150} fixed="right">
							<HeaderCell className="text-center text-dark font-bold">Aksi</HeaderCell>
							<Cell className="text-center">
								{
									rowData => {
										return (
											<div className="flex justify-center flex-row gap-6">
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
													<MdOutlineEdit
														size="2em"
														color="#FFD400"
													/>
												</button>
											</div>
										)
									}
								}
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
							onChangePage={page => setPage(page)}
							onChangeLimit={limit => setLimit(limit)}
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
			>
				<Header className="text-2xl font-bold">Tambah Generik Obat</Header>
				<form onSubmit={handleSubmit(HandleCreateGeneric)} ref={createFormRef}>
					<Body className="pt-2">
						<Input
							type="text"
							label="Nama Generik"
							name="label"
							autofocus={true}
							placeholder="Nama Generik"
							register={register}
							error={errors["label"]?.message}
							onChange={e => HandleOnChange(e, "create")}
						/>
					</Body>
					<Footer className="pt-4">
						<Button
							isLoading={isLoading}
							type="button"
							appearance="primary"
							onClick={submitcreateform}
						>
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
					setOpen({ ...open, edit: false })
				}}
				size="lg"
			>
				<Header className="text-2xl font-bold">Ubah Generik Obat</Header>
				<form onSubmit={handleSubmit(HandleEditGeneric)} ref={editFormRef}>
					<Body className="pt-2">
						<Input
							type="text"
							label="Nama Generik"
							autofocus={true}
							name="label"
							placeholder="Nama Generik"
							register={register}
							error={errors["label"]?.message}
							onChange={e => HandleOnChange(e, "edit")}
						/>
					</Body>
					<Footer className="pt-4">
						<Button
							isLoading={isLoading}
							type="button"
							appearance="primary"
							onClick={submitEditForm}
						>
							Simpan
						</Button>
					</Footer>
				</form>
			</Modal>
		</Layout>
	)
}
