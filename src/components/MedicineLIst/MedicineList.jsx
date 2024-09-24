import Input from "../Input";

export default function MedicineList(props) {
    const {medicineList} = props;

    return(<div className="flex flex-col gap-4">
        <div className="grid grid-cols-6 gap-4 text-center font-bold">
          <div className="col-span-3">Nama Obat</div>
          <div className="col-span-1">Jumlah</div>
          <div className="col-span-1">Harga per Obat</div>
          <div className="col-span-1">Total Sub Harga</div>
        </div>
        {medicineList &&
          medicineList?.map((medicineData, index) => (
            <div className="flex flex-col gap-2">
                <div key={index} className="grid grid-cols-6 gap-4">

                <div className="col-span-3">
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        disabled={true}
                        placeholder="Medicine Name"
                        value={medicineData.medicine.code + " - " + medicineData.medicine.name}
                    />
                </div>

                <div className="col-span-1">
                    <Input
                        type="number"
                        id="quantity"
                        name="quantity"
                        disabled={true}
                        placeholder="Medicine Quantity"
                        value={medicineData.quantity}
                    />
                </div>

                <div className="col-span-1">
                    <Input
                        type="number"
                        id="price"
                        name="price"
                        disabled={true}
                        placeholder="Medicine Price"
                        value={medicineData.medicine.price}
                    />
                </div>

                <div className="col-span-1">
                    <Input
                        type="number"
                        id="subTotalPrice"
                        name="subTotalPrice"
                        disabled={true}
                        placeholder="Subtotal Price"
                        value={medicineData.totalPrice}
                    />
                </div>

              </div>
              <Input
                className="col-span-10"
                type="text"
                id="instruction"
                name="instruction"
                disabled={true}
                placeholder="Instruction"
                value={medicineData.instruction}
              />
            </div>
          ))}
      </div>
    )
};
