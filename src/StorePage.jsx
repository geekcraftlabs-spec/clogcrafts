/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './StorePage.css';

// Base colours for plain clogs
const PLAIN_COLORS = [
  { id: 'black', name: 'Black', frontImg: '/images/base/black-front.jpg' },
  { id: 'brown', name: 'Brown', frontImg: '/images/base/brown-front.jpg' },
  { id: 'beige', name: 'Beige', frontImg: '/images/base/beige-front.jpg' },
  { id: 'chantilly', name: 'Chantilly', frontImg: '/images/base/chantilly-front.jpg' },
  { id: 'grey', name: 'Grey', frontImg: '/images/base/grey-arialview.jpg' },
  { id: 'mocha', name: 'Mocha Brown', frontImg: '/images/base/mocha-brown-arial.jpg' },
];

// Fur products – place images in public/images/fur/
const FUR_PRODUCTS = [
  { id: 'fur-darkgreen', name: 'Dark Green Fur', price: 390, image: '/images/fur/fur-darkgreen2.png', description: 'Luxurious dark green fur clog – cosy and stylish.' },
  { id: 'fur-black', name: 'Black Fur', price: 390, image: '/images/fur/fur-black1.png', description: 'Classic black fur clog – warm and versatile.' },
  { id: 'fur-beige', name: 'Beige Fur', price: 390, image: '/images/fur/fur-beige.png', description: 'Elegant beige fur clog – soft and neutral.' },
  { id: 'fur-coffee', name: 'Coffee Fur', price: 390, image: '/images/fur/fur-coffee.png', description: 'Rich coffee-coloured fur – a cozy favourite.' },
  { id: 'fur-mocha', name: 'Mocha Brown Fur', price: 390, image: '/images/fur/fur-mochabrown.png', description: 'Deep mocha brown fur – warm and inviting.' },
];

// Signature designs – place images in public/images/signatures/
const SIGNATURE_PRODUCTS = [
  { id: 'sig-1', name: 'Cross & Bow', price: 350, image: '/images/signatures/signature1-crossandbow.png', description: 'Two crosses with a pink bow – elegant and bold.' },
  { id: 'sig-2', name: 'Name & Cross', price: 350, image: '/images/signatures/signature2-nameandcross.png', description: 'Personalised with a name and a classic cross.' },
  { id: 'sig-3', name: 'Name & Two Crosses', price: 350, image: '/images/signatures/signature3-nameand2crosses.png', description: 'Double cross design with custom name lettering.' },
  { id: 'sig-4', name: 'Spider‑Man & Numbers', price: 350, image: '/images/signatures/signature4-spidermanwithnumber.png', description: 'Spider‑Man baby patch with bold numbers.' },
  { id: 'sig-5', name: 'Stitch Waving', price: 350, image: '/images/signatures/signature5-stitchwaving.png', description: 'Stitch waving – playful and full of personality.' },
];

// Plain products (R240)
const plainProducts = PLAIN_COLORS.map(c => ({
  id: `plain-${c.id}`,
  type: 'plain',
  name: `${c.name} Clog`,
  price: 240,
  image: c.frontImg,
  description: `Classic ${c.name.toLowerCase()} clog – a timeless staple.`,
}));

// Combine all products
const allProducts = [
  ...plainProducts,
  ...FUR_PRODUCTS.map(p => ({ ...p, type: 'fur' })),
  ...SIGNATURE_PRODUCTS.map(p => ({ ...p, type: 'signature' })),
];

function StorePage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? allProducts : allProducts.filter(p => p.type === filter);

  return (
    <>
      {/* ---- Nav Bar (same as studio) ---- */}
      <nav>
        <a href="/" className="logo">CLOG CRAFTS</a>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/store" style={{color:'#ff4f98', fontWeight:600}}>Store</a></li>
          <li><a href="/studio">Design Studio</a></li>
          <li><a href="/staff">Staff</a></li>
        </ul>
      </nav>

      <div className="store-page">
        <div className="store-header">
          <h1>🛍️ Clog Crafts Store</h1>
          <p>Explore our collection of plain, fur, and signature clogs.</p>
        </div>

        {/* Filter Bar – Nice design with active state */}
        <div className="filter-bar">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'plain' ? 'active' : ''} onClick={() => setFilter('plain')}>Plain</button>
          <button className={filter === 'fur' ? 'active' : ''} onClick={() => setFilter('fur')}>Fur</button>
          <button className={filter === 'signature' ? 'active' : ''} onClick={() => setFilter('signature')}>Signature</button>
        </div>

        <div className="product-grid">
          {filtered.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.type === 'fur' && <span className="badge fur">Fur</span>}
                {product.type === 'signature' && <span className="badge signature">Signature</span>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-price">R {product.price}</div>
                <button className="btn-primary" onClick={() => alert(`Added ${product.name} to cart!`)}>
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="no-products">No products found in this category.</p>
        )}
      </div>
    </>
  );
}

export default StorePage;