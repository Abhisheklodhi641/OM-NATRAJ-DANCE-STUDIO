import React, { useState } from 'react';
import { ShoppingBag, MessageSquare, Check, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';

export const ProductsShowcase = ({ products = [] }) => {
  const { getProductWhatsAppUrl } = useStudio();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});

  const productList = products.length > 0
    ? products
    : [
        {
          _id: '1',
          name: 'Handcrafted Navratri Garba Chaniya Choli Set',
          price: 3499,
          originalPrice: 4999,
          description: 'Exclusive artisanal Garba outfit featuring authentic Kutchi embroidery, real glass mirror accents, heavy flare ghagra, matching blouse, and embroidered dupatta.',
          images: ['/images/garba-dress.jpg'],
          sizes: ['S', 'M', 'L', 'XL', 'Free Size'],
          stockStatus: 'in_stock'
        },
        {
          _id: '2',
          name: 'Professional Brass Ghungroo Dance Bells (100 Bells)',
          price: 1299,
          originalPrice: 1799,
          description: 'Heavy resonant brass bells woven onto premium velvet and leather padded cords, delivering rich acoustic clarity for classical and folk dance practice.',
          images: ['/images/garba-dress.jpg'],
          sizes: ['Standard Pair (100 Bells)', 'Master Pair (150 Bells)'],
          stockStatus: 'in_stock'
        },
        {
          _id: '3',
          name: 'Carved Lacquer Folk Dandiya Sticks (Pair)',
          price: 499,
          originalPrice: 799,
          description: 'Solid wood hand-carved dandiya sticks with balanced grip and vibrant festival lacquer finish, designed for high-energy Garba nights.',
          images: ['/images/garba-dance.jpg'],
          sizes: ['15-inch standard'],
          stockStatus: 'in_stock'
        }
      ];

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleQtyChange = (productId, delta) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  return (
    <section className="section-spacer" style={{ background: 'var(--bg-primary)', position: 'relative' }}>
      
      {/* Background Glow */}
      <div className="spotlight-glow spotlight-ember" style={{ width: '450px', height: '450px', bottom: '10%', right: '10%' }} />

      <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', gap: '20px' }}>
          <div>
            <span className="section-eyebrow">Studio Boutique</span>
            <h2 className="editorial-section-title">
              Garba Couture & <span className="editorial-italic">Dance Essentials</span>
            </h2>
          </div>
          <Link to="/products" className="btn btn-outline" data-cursor="ALL">
            View Collection
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)'
        }}>
          {productList.map((product) => {
            const currentSize = selectedSizes[product._id] || (product.sizes && product.sizes[0]) || 'Free Size';
            const currentQty = quantities[product._id] || 1;
            const primaryImage = (product.images && product.images[0]) || '/images/garba-dress.jpg';

            const whatsAppUrl = getProductWhatsAppUrl({
              productName: product.name,
              price: product.price,
              size: currentSize,
              quantity: currentQty
            });

            return (
              <div
                key={product._id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)'
                }}
                data-cursor="ORDER"
              >
                <div>
                  {/* Product Image */}
                  <div style={{ position: 'relative', height: '340px', overflow: 'hidden', background: '#121218' }}>
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="cinematic-reveal-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: 'rgba(7,7,9,0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border-gold)',
                      color: 'var(--accent-gold)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.1em',
                      padding: '4px 12px',
                      textTransform: 'uppercase'
                    }}>
                      Seasonal Edition
                    </div>

                    {product.stockStatus === 'in_stock' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        background: 'rgba(76, 175, 80, 0.2)',
                        border: '1px solid rgba(76, 175, 80, 0.4)',
                        color: '#81c784',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Check size={12} />
                        In Stock
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '0.75rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: 'var(--accent-gold)'
                      }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1rem',
                          color: 'var(--text-dim)',
                          textDecoration: 'line-through'
                        }}>
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.45rem',
                      color: 'var(--text-main)',
                      marginBottom: '0.75rem',
                      lineHeight: 1.3
                    }}>
                      {product.name}
                    </h3>

                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem'
                    }}>
                      {product.description}
                    </p>

                    {/* Size Selector */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          letterSpacing: '0.12em',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          display: 'block',
                          marginBottom: '8px'
                        }}>
                          Select Size:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {product.sizes.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleSizeSelect(product._id, s)}
                              style={{
                                padding: '6px 12px',
                                background: currentSize === s ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
                                color: currentSize === s ? '#070709' : '#fff',
                                border: '1px solid',
                                borderColor: currentSize === s ? 'var(--accent-gold)' : 'var(--border-subtle)',
                                borderRadius: '2px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                fontWeight: currentSize === s ? 700 : 400,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.12em',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase'
                      }}>
                        Quantity:
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: '2px' }}>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product._id, -1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            fontSize: '1.1rem'
                          }}
                        >
                          -
                        </button>
                        <span style={{
                          width: '32px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.9rem',
                          color: 'var(--accent-gold)'
                        }}>
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product._id, 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            fontSize: '1.1rem'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pre-Filled WhatsApp Enquiry CTA */}
                <div style={{ padding: '0 1.75rem 1.75rem 1.75rem' }}>
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ width: '100%', padding: '14px', fontSize: '0.85rem' }}
                    data-cursor="ORDER"
                  >
                    <MessageSquare size={18} />
                    Enquire On WhatsApp
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
