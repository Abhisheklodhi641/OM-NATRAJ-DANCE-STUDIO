import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageSquare, Check, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useStudio } from '../context/StudioContext';

export const ProductsPage = () => {
  const { getProductWhatsAppUrl } = useStudio();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.getProducts();
        if (res.success && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.warn('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filtered = category === 'All' ? products : products.filter(p => p.category === category);

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
    <div style={{ paddingTop: 'calc(var(--navbar-height) + 2rem)' }}>
      
      {/* Header */}
      <section className="section-spacer" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="site-container">
          <span className="section-eyebrow">Festival & Dance Couture</span>
          <h1 className="editorial-hero-title" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Garba Dresses & <br />
            <span className="editorial-italic" style={{ color: 'var(--accent-gold)' }}>
              Studio Accessories
            </span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--text-main)',
            maxWidth: '820px',
            lineHeight: 1.5,
            fontWeight: 300
          }}>
            Handcrafted traditional attire, authentic brass ghungroos, carved dandiya sticks, and dance rehearsal essentials available in Indore.
          </p>

          {/* Customer Name Customizer Input */}
          <div style={{
            marginTop: '2rem',
            maxWidth: '480px',
            background: 'rgba(255,255,255,0.03)',
            padding: '16px 20px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)'
          }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              marginBottom: '6px'
            }}>
              Your Name (Optional - auto-includes in WhatsApp enquiry):
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Priyanshi Mehta"
              className="form-input"
              style={{ padding: '10px 14px', fontSize: '0.9rem' }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '2rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '2px',
                  background: category === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
                  color: category === cat ? '#070709' : '#fff',
                  border: '1px solid',
                  borderColor: category === cat ? 'var(--accent-gold)' : 'var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: category === cat ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="section-spacer" style={{ background: 'var(--bg-secondary)', paddingTop: '4rem' }}>
        <div className="site-container">
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}>
            {filtered.map((product) => {
              const currentSize = selectedSizes[product._id] || (product.sizes && product.sizes[0]) || 'Free Size';
              const currentQty = quantities[product._id] || 1;
              const primaryImage = (product.images && product.images[0]) || '/images/garba-dress.jpg';

              const whatsAppUrl = getProductWhatsAppUrl({
                productName: product.name,
                price: product.price,
                size: currentSize,
                quantity: currentQty,
                userName: customerName
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
                    overflow: 'hidden'
                  }}
                  data-cursor="ORDER"
                >
                  <div>
                    <div style={{ position: 'relative', height: '360px', overflow: 'hidden', background: '#121218' }}>
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
                        {product.category || 'Dance Couture'}
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

                    <div style={{ padding: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '0.75rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.85rem',
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
                        fontSize: '1.5rem',
                        color: 'var(--text-main)',
                        marginBottom: '0.75rem',
                        lineHeight: 1.3
                      }}>
                        {product.name}
                      </h3>

                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.92rem',
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
                                  fontWeight: currentSize === s ? 700 : 400
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

                  {/* Pre-Filled WhatsApp Button */}
                  <div style={{ padding: '0 2rem 2rem 2rem' }}>
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                      style={{ width: '100%', padding: '14px', fontSize: '0.85rem' }}
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

    </div>
  );
};
