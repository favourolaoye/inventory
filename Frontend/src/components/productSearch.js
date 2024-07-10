import React, { useState } from 'react';

const ProductSearch = ({ onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  const searchProducts = async () => {
    const response = await fetch(`/api/products?searchTerm=${searchTerm}`);
    const data = await response.json();
    setProducts(data);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products"
      />
      <button onClick={searchProducts}>Search</button>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price}
            <button onClick={() => onSelectProduct(product)}>Add to Invoice</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSearch;
