import React, { useEffect, useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { SelectPicker } from "rsuite";
import { IoIosAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import useMedicineDropdownOption from "@/pages/api/medicineDropdownOption";

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
            <div key={index} className="grid grid-cols-10 gap-4">
              <div className="flex justify-center">
                {index == formFields.length - 1 && (
                  <Button onClick={(e) => handleAddFormFieldRow()}>
                    <IoIosAdd size={"1.6rem"} />
                  </Button>
                )}
              </div>
              <div className="col-span-2">
                <SelectPicker
                  id="name"
                  appearance="subtle"
                  size="small"
                  name="name"
                  data={data}
                  onChange={(value) => handleMedicineChange(index, value)}
                  value={formField.medicineId}
                  renderValue={formField.medicineId != -1 ? (value) => <div className="text-sm">{medicineDropdownOptions[value].name}</div> : null}
                  block
                  cleanable={false}
                />
              </div>
              <div className="col-span-2">
                <Input
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
                <Input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Harga Obat"
                  value={formField.price}
                  disabled
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  id="subtotal"
                  name="subtotal"
                  placeholder="Total Harga Obat"
                  value={formField.totalPrice}
                  disabled
                />
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  id="action"
                  name="action"
                  placeholder="action"
                  size="medium"
                  onClick={(e) => handleRemoveFormFieldRow(index)}
                >
                  <MdDeleteOutline size={"1.6rem"} color="maroon" />
                </Button>
              </div>
            </div>
            <Input
              className="col-span-10"
              type="text"
              id="instruction"
              name="instruction"
              placeholder="Instruction"
              onChange={(e) => handleInstructionField(index, e.target.value)}
            />
          </div>
        ))}
    </div>
  );
}

export default PrescriptionForm;
