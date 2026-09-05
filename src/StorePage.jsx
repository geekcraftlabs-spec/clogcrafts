/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './StorePage.css';

// Reuse COLORS from App? We'll import from App or define here.
// For simplicity, define a smaller set for the store.
const COLORS = [
  { id: 'black', name: 'Black', price: 240, img: '/images/base/black-front.jpg' },
  { id: 'brown', name: 'Brown', price: 240, img: '/images/base/brown-front.jpg' },
  { id: 'beige', name: 'Beige', price: 240, img: '/images/base/beige-front.jpg' },
  { id: 'chantilly', name: 'Chantilly', price: 240, img: '/images/base/chantilly-front.jpg' },
  { id: 'grey', name: 'Grey', price: 240, img: '/images/base/grey-arialview.jpg' },
  { id: 'mocha', name: 'Mocha Brown', price: 240, img: '/images/base/mocha-brown-arial.jpg' },
];

// Fur clogs (higher price, same images)
const FUR_COLORS = COLORS.map(c => ({ ...c, price: 390, id: `fur-${c.id}`, name: `${c.name} (Fur)` }));

// Signature collection (pre-designed)
const SIGNATURES = [
  { id: 'classic-cross', name: 'Classic Cross', price: 420, img: '/images/base/black-front.jpg' },
  { id: 'spider-set', name: 'Spider Set', price: 480, img: '/images/base/grey-arialview.jpg' },
  { id: 'stitch-love', name: 'Stitch Love', price: 460, img: '/images/base/chantilly-front.jpg' },
];

function StorePage() {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'plain', 'fur', 'signature'

  const getProducts = () => {
    let products = [];
    if (activeFilter === 'all' || activeFilter === 'plain') {
      products = products.concat(COLORS.map(c => ({ ...c, type: 'plain' })));
    }
    if (activeFilter === 'all' || activeFilter === 'fur') {
      products = products.concat(FUR_COLORS.map(c => ({ ...c, type: 'fur' })));
    }
    if (activeFilter === 'all' || activeFilter === 'signature') {
      products = products.concat(SIGNATURES.map(c => ({ ...c, type: 'signature' })));
    }
    return products;
  };

  const products = getProducts();

  return (
    <div className="store-page">
      <div className="store-header">
        <h1>🛍️ Clog Crafts – Store</h1>
        <p>Choose your style – plain, fur, or signature designs.</p>
      </div>

      <div className="filter-bar">
        <button className={activeFilter === 'all' ? 'filter-btn active' : 'filter-btn'} onClick={() => setActiveFilter('all')}>All</button>
        <button className={activeFilter === 'plain' ? 'filter-btn active' : 'filter-btn'} onClick={() => setActiveFilter('plain')}>Plain</button>
        <button className={activeFilter === 'fur' ? 'filter-btn active' : 'filter-btn'} onClick={() => setActiveFilter('fur')}>Fur</button>
        <button className={activeFilter === 'signature' ? 'filter-btn active' : 'filter-btn'} onClick={() => setActiveFilter('signature')}>Signature</button>
      </div>

      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.img} alt={product.name} />
              {product.type === 'fur' && <span className="badge-fur">Fur</span>}
              {product.type === 'signature' && <span className="badge-signature">Signature</span>}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">R {product.price}</p>
              <button className="btn-primary">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StorePage;