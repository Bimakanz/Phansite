import React, { useState, useRef, useEffect } from 'react';

export default function P5Select({
    value,
    onChange,
    options = [],
    placeholder = 'Select an option...',
    label,
    error,
    style = {},
    className = '',
    id,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Normalize options into { value, label }
    const normalizedOptions = options.map(opt => {
        if (typeof opt === 'object' && opt !== null) {
            return {
                value: opt.value ?? opt.id ?? '',
                label: opt.label ?? opt.name ?? String(opt.value),
            };
        }
        return { value: opt, label: String(opt) };
    });

    const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value));

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (val) => {
        if (typeof onChange === 'function') {
            // Support both direct value and standard synthetic event
            onChange({ target: { value: val, name: id } });
        }
        setIsOpen(false);
    };

    return (
        <div
            ref={containerRef}
            className={`p5-custom-select-wrap ${className}`}
            style={{ position: 'relative', width: '100%', ...style }}
        >
            {label && <label className="p5-admin-label">{label}</label>}

            {/* Select Trigger */}
            <button
                type="button"
                id={id}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    backgroundColor: '#0a0a0a',
                    color: selectedOption ? '#ffffff' : '#888888',
                    border: isOpen ? '2px solid var(--p5-red)' : '1.5px solid #ffffff',
                    boxShadow: isOpen ? '4px 4px 0 var(--p5-red)' : '3px 3px 0 #000000',
                    padding: '0.65rem 1rem',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-p5-sans)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                    outline: 'none',
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span
                    style={{
                        marginLeft: '0.5rem',
                        color: 'var(--p5-red)',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                    }}
                >
                    ▼
                </span>
            </button>

            {/* Dropdown Options List */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 99999,
                        backgroundColor: '#000000',
                        border: '2px solid #ffffff',
                        boxShadow: '6px 6px 0 var(--p5-red)',
                        maxHeight: '260px',
                        overflowY: 'auto',
                        padding: '0.25rem 0',
                    }}
                >
                    {normalizedOptions.length === 0 ? (
                        <div style={{ padding: '0.6rem 1rem', color: '#888', fontSize: '0.85rem' }}>
                            No options available
                        </div>
                    ) : (
                        normalizedOptions.map(opt => {
                            const isSelected = String(opt.value) === String(value);
                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? '#1c1c1c' : 'transparent',
                                        color: isSelected ? 'var(--p5-yellow)' : '#ffffff',
                                        borderLeft: isSelected ? '4px solid var(--p5-red)' : '4px solid transparent',
                                        fontFamily: 'var(--font-p5-sans)',
                                        fontSize: '0.9rem',
                                        fontWeight: isSelected ? 'bold' : '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'background-color 0.12s ease, color 0.12s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = 'var(--p5-red)';
                                        e.currentTarget.style.color = '#ffffff';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = isSelected ? '#1c1c1c' : 'transparent';
                                        e.currentTarget.style.color = isSelected ? 'var(--p5-yellow)' : '#ffffff';
                                    }}
                                >
                                    <span>{opt.label}</span>
                                    {isSelected && (
                                        <span style={{ color: 'var(--p5-yellow)', fontSize: '0.8rem' }}>★</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {error && (
                <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'bold' }}>
                    {error}
                </p>
            )}
        </div>
    );
}
