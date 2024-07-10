import { useState } from 'react';

export default function Pos() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [invoice, setInvoice] = useState([]);

    const handleSearch = async (event) => {
        setQuery(event.target.value);

        const response = await fetch(`http://localhost:4000/api/product/search?searchTerm=${event.target.value}`);
        const data = await response.json();
        setProducts(data);
    };

    const addToInvoice = (product) => {
        setInvoice((prevInvoice) => {
            const existingProductIndex = prevInvoice.findIndex(item => item._id === product._id);

            if (existingProductIndex !== -1) {
                const updatedInvoice = [...prevInvoice];
                updatedInvoice[existingProductIndex].quantity += 1;
                return updatedInvoice;
            } else {
                return [...prevInvoice, { ...product, quantity: 1 }];
            }
        });
    };

    const handlePrintInvoice = async () => {
        try {
            const invoicePayload = {
                products: invoice.map(item => ({ productId: item._id, quantity: item.quantity }))
            };
    
            console.log('Invoice Payload:', invoicePayload); // Log the payload
    
            const response = await fetch(`http://localhost:4000/api/invoices/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoicePayload)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to add invoice:', errorData); // Log error details
                throw new Error('Failed to add invoice');
            }
    
            const data = await response.json();
            console.log('Invoice data:', data); // Logging the response data for debugging
    
            if (data._id) {
                window.open(`http://localhost:3000/invoice/${data._id}`, '_blank');
            } else {
                console.error('No invoice ID found in response');
            }
        } catch (error) {
            console.error('Error printing invoice:', error);
        }
    };
    

    return (
        <div className="flex h-screen">
        <main className="flex-1 flex flex-col p-4">
            <nav className="text-black text-center mb-4">
                <h1 className="text-3xl font-bold">POS System</h1>
            </nav>
            <div className="flex flex-col flex-1 overflow-y-auto">
                <input 
                    type="text" 
                    value={query} 
                    onChange={handleSearch} 
                    placeholder="Search for products..." 
                    className="p-3 border border-gray-300 rounded mb-4"
                />
                <div className="flex-1 overflow-y-auto">
                    {products.length > 0 ? (
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="w-full bg-gray-100">
                                    <th className="w-1/3 border border-gray-300 p-2 text-left">Product Name</th>
                                    <th className="w-1/3 border border-gray-300 p-2 text-left">Price</th>
                                    <th className="w-1/3 border border-gray-300 p-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id} className="w-full">
                                        <td className="border border-gray-300 p-2">{product.name}</td>
                                        <td className="border border-gray-300 p-2">N{product.price}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button 
                                                onClick={() => addToInvoice(product)} 
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Add to Invoice
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No products found</p>
                    )}
                </div>
                <div className="mt-4">
                    <h2 className="text-2xl font-semibold">Invoice</h2>
                    <ul className="list-disc list-inside mt-2">
                        {invoice.map((item, index) => (
                            <li key={index} className="p-2">
                                {item.name} - N{item.price} x {item.quantity}
                            </li>
                        ))}
                    </ul>
                    <button 
                        onClick={handlePrintInvoice} 
                        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
                    >
                        Print Invoice
                    </button>
                </div>
            </div>
        </main>
    </div>
    );
}
