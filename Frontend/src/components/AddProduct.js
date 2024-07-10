import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";

export default function AddProduct({
  addProductModalSetting,
  handlePageUpdate,
}) {
  const authContext = useContext(AuthContext);
  const [product, setProduct] = useState({
    userId: authContext.user,
    name: "",
    price: "",
    stock: "",
    manufacturer: "",
    description: "",
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const addProduct = () => {
    fetch("http://localhost:4000/api/product/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: authContext.user,
        name: product.name,
        price: parseFloat(product.price), // Ensure price is converted to float
        stock: parseInt(product.stock),   // Ensure stock is converted to integer
        manufacturer: product.manufacturer,
        description: product.description,
      }),
      
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add product");
        }
        return response.json();
      })
      .then((data) => {
        alert("Product added successfully");
        handlePageUpdate();
        addProductModalSetting();
        setProduct({
          ...product,
          name: "",
          price: "",
          stock: "",
          manufacturer: "",
          description: "",
        });
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        alert("Failed to add product. Please try again later.");
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
        initialFocus={cancelButtonRef}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Panel className="relative p-4 sm:p-6 bg-white shadow-xl rounded-lg w-full max-w-lg">
              <div className="flex items-center justify-center mb-4">
                <PlusIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                <Dialog.Title className="ml-2 text-lg font-semibold text-gray-900">
                  Add Product
                </Dialog.Title>
              </div>
              <form>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Product Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="manufacturer" className="block mb-2 text-sm font-medium text-gray-900">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={product.manufacturer}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Manufacturer"
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">
                      Price
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Price"
                    />
                  </div>
                  <div>
                    <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-900">
                      Stock
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={product.stock}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Stock"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={product.description}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 resize-none"
                      placeholder="Product Description"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={addProduct}
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleClose}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
