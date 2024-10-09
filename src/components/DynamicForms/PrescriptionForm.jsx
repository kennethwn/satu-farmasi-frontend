import React, { useEffect, useState } from "react";
import InputField from "../Input";
import Button from "../Button";
import { SelectPicker } from "rsuite";
import { IoIosAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import useMedicineDropdownOption from "@/pages/api/medicineDropdownOption";
import { formatRupiah } from "@/helpers/currency";

function PrescriptionForm(props) {
  const { formFields, setFormFields } = props;

  const { getMedicineDropdownOptions } = useMedicineDropdownOption();
  const [medicineDropdownOptions, setMedicineDropdownOptions] = useState([])

  const data = Object.entries(medicineDropdownOptions).map(([key, item]) => ({
    label: item.name,
    value: key,
  }));

  useEffect(() => {
    async function fetchMedicineDropdownOptionsData(){
        try {
            const response = await getMedicineDropdownOptions()
            setMedicineDropdownOptions(response)
        } catch (error) {
            console.log("error #getMedicineOptions")
        }
    }
    fetchMedicineDropdownOptionsData()
  }, [])

  useEffect(() => {
    console.log(formFields)
  }, [formFields])

  const handleMedicineChange = (formFieldId, medicineId) => {
    let updatedData = {
      medicineId: medicineId,
      medicineName: medicineDropdownOptions[medicineId].name,
      quantity: 0,
      price: medicineDropdownOptions[medicineId].price,
      totalPrice: 0,
    };
    let temp = [...formFields];

    temp.forEach((item, index) => {
      if (index === formFieldId) {
        item.medicineId = updatedData.medicineId;
        item.medicineName = updatedData.medicineName;
        item.quantity = 0;
        item.price = updatedData.price;
        item.totalPrice = 0;
      }
    });

    setFormFields(temp);
  };

  const handleAddFormFieldRow = () => {
    const newFormField = {
      medicineId: -1,
      medicineName: "",
      quantity: 0,
      price: 0,
      totalPrice: 0,
      instruction: "",
      insufficientStock: false
    };
    setFormFields([...formFields, newFormField]);
  };

  const handleMedicineQuantity = (formFieldId, quantity) => {
    const medicineId = formFields[formFieldId].medicineId;
    const checkIfStockIsInsufficient = (medicineDropdownOption, quantity) => {
      return medicineDropdownOption.currStock - quantity < medicineDropdownOption.minStock
    }

    let updatedData = {
      id: formFieldId,
      medicineId: medicineId,
      medicineName: medicineDropdownOptions[medicineId].name,
      quantity: quantity,
      price: medicineDropdownOptions[medicineId].price,
      totalPrice: medicineDropdownOptions[medicineId].price * quantity,
      insufficientStock: checkIfStockIsInsufficient(medicineDropdownOptions[medicineId], quantity)
    };
    let temp = [...formFields];

    temp.forEach((item, index) => {
      if (index === formFieldId) {
        item.medicineId = updatedData.medicineId;
        item.medicineName = updatedData.medicineName;
        item.quantity = updatedData.quantity;
        item.price = updatedData.price;
        item.totalPrice = updatedData.totalPrice;
        item.insufficientStock = updatedData.insufficientStock
      }
    });

    setFormFields(temp);
  };

  const handleRemoveFormFieldRow = (formFieldId) => {
    if (formFields.length > 1) {
      setFormFields((formFields) =>
        formFields.filter((formField, index) => index !== formFieldId)
      );
    }
  };

  const handleInstructionField = (formFieldId, instruction) => {
    const temp = [...formFields];
    temp.forEach((item, index) => {
      if (index === formFieldId) {
        item.instruction = instruction;
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-10 gap-4 text-center font-bold">
        <div> </div>
        <div className="col-span-2">Nama Obat</div>
        <div className="col-span-2">Jumlah</div>
        <div className="col-span-2">Harga per Obat</div>
        <div className="col-span-2">Total Sub Harga</div>
        <div> Action </div>
      </div>
      {formFields &&
        formFields.map((formField, index) => (
          <div className="flex flex-col gap-2">
            <div key={index} className="grid grid-cols-1 w-full lg:grid-cols-10 gap-4 mb-2">
              <div className="flex max-lg:w-full justify-center">
                {index == formFields.length - 1 && (
                  <Button size="small" onClick={(e) => handleAddFormFieldRow()}>
                    <IoIosAdd size={"1.6rem"} />
                  </Button>
                )}
              </div>
              <div className="col-span-2">
                <SelectPicker
                  id="name"
                  // appearance="subtle"
                  size="lg"
                  name="name"
                  data={data}
                  onChange={(value) => handleMedicineChange(index, value)}
                  value={formField.medicineId}
                  renderValue={formField.medicineId != -1 ? (value) => <div className="text-sm">{medicineDropdownOptions[value].name}</div> : null}
                  block
                  style={{ }}
                  // cleanable={false}
                />
              </div>
              <div className="col-span-2">
                <InputField
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder="Jumlah"
                  value={formField.quantity}
                  onChange={(e) =>
                    handleMedicineQuantity(index, e.target.value)
                  }
                />
              </div>
              <div className="col-span-2">
                <InputField
                  type="text"
                  id="price"
                  name="price"
                  placeholder="Harga Obat"
                  value={formatRupiah(formField.price)}
                  disabled
                  currency="true"
                />
              </div>
              <div className="col-span-2">
                <InputField
                  type="text"
                  id="subtotal"
                  name="subtotal"
                  placeholder="Total Harga Obat"
                  value={formatRupiah(formField.totalPrice)}
                  disabled
                  currency="true"
                />
              </div>
              <div className="flex justify-center">
                {/* <Button
                  type="button"
                  id="action"
                  name="action"
                  placeholder="action"
                  size="medium"
                  onClick={(e) => handleRemoveFormFieldRow(index)}
                >
                  <MdDeleteOutline size={"1.6rem"} color="maroon" />
                </Button> */}
                <button
                    className={`flex justify-center w-full rounded-md py-1.5 stroke-2 shadow-sm ${formFields.length > 1 ? 'stroke-white' : 'lg:stroke-gray-300 stroke-white'} lg:shadow-none lg:border-0 border-2 border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                    disabled={formFields?.length > 1 ? false : true}
                    onClick={(e) => handleRemoveFormFieldRow(index)}
                >
                    <MdDeleteOutline size={"1.6rem"} color="maroon" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-10 gap-4 mb-6">
              <div className="col-span-1 max-lg:hidden"></div> 
              <div className="lg:col-span-8">
                <InputField
                  type="text"
                  id="instruction"
                  name="instruction"
                  value={formField?.instruction} // TODO: fix handle change
                  placeholder="Instruction"
                  onChange={(e) => handleInstructionField(index, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default PrescriptionForm;
