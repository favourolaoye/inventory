import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

export default function InvoicePage() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const invoiceRef = useRef();

    useEffect(() => {
        if (id) {
            console.log(`Fetching invoice with id: ${id}`); 
            fetch(`http://localhost:4000/api/invoices/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched invoice data:', data); 
                    setInvoice(data);
                })
                .catch(error => {
                    console.error('Error fetching invoice:', error); 
                });
        }
    }, [id]);

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });

    if (!invoice) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6" ref={invoiceRef}>
                <h1 className="text-3xl font-bold mb-4">Invoice</h1>
                <div className="mb-4">
                    {invoice.products.map((item, index) => (
                        <div key={index} className="flex justify-between border-b py-2">
                            <span>{item.productId.name}</span>
                            <span>N{item.productId.price} x {item.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="text-right font-semibold">
                    <strong>Total: N{invoice.total}</strong>
                </div>
            </div>
            <div className="text-center mt-4">
                <button 
                    onClick={handlePrint}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Download Invoice
                </button>
            </div>
        </div>
    );
}
