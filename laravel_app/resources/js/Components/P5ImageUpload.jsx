import React, { useRef, useState, useEffect } from 'react';

export default function P5ImageUpload({
    file,
    onFileChange,
    currentImageUrl = null,
    label = 'TARGET VISUAL / IMAGE FILE',
    error,
    style = {},
}) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Update preview when file changes
    useEffect(() => {
        if (file instanceof File) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [file]);

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            onFileChange(selectedFile);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        if (inputRef.current) inputRef.current.value = '';
        onFileChange(null);
    };

    const formatSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div style={{ ...style }}>
            {label && <label className="p5-admin-label">{label}</label>}

            {/* Hidden Input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                        handleFile(e.target.files[0]);
                    }
                }}
                style={{ display: 'none' }}
            />

            {/* Drop / Trigger Area */}
            <div
                onClick={() => inputRef.current && inputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    backgroundColor: isDragging ? 'rgba(230,0,0,0.1)' : '#0a0a0a',
                    border: isDragging ? '2px dashed var(--p5-red)' : '2px dashed rgba(255,255,255,0.5)',
                    boxShadow: isDragging ? '0 0 12px var(--p5-red)' : '3px 3px 0 #000000',
                    padding: '1.2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--p5-red)';
                    e.currentTarget.style.boxShadow = '4px 4px 0 var(--p5-red)';
                }}
                onMouseLeave={e => {
                    if (!isDragging) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                        e.currentTarget.style.boxShadow = '3px 3px 0 #000000';
                    }
                }}
            >
                {previewUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div
                            style={{
                                width: '70px',
                                height: '70px',
                                border: '2px solid #ffffff',
                                boxShadow: '3px 3px 0 var(--p5-red)',
                                overflow: 'hidden',
                                flexShrink: 0,
                                backgroundColor: '#000',
                            }}
                        >
                            <img
                                src={previewUrl}
                                alt="Selected preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left', minWidth: '160px' }}>
                            <div style={{ color: '#00E676', fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'var(--font-p5-menu)' }}>
                                ★ NEW FILE ATTACHED
                            </div>
                            <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem', wordBreak: 'break-all' }}>
                                {file.name}
                            </div>
                            <div style={{ color: '#888', fontSize: '0.8rem' }}>
                                {formatSize(file.size)}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClear}
                            style={{
                                background: 'var(--p5-red)',
                                color: '#ffffff',
                                border: '1px solid #ffffff',
                                padding: '0.4rem 0.8rem',
                                fontFamily: 'var(--font-p5-menu)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            ✕ CANCEL
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span
                                style={{
                                    display: 'inline-block',
                                    background: 'var(--p5-red)',
                                    color: '#ffffff',
                                    padding: '0.35rem 1rem',
                                    fontFamily: 'var(--font-p5-menu)',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    border: '1.5px solid #ffffff',
                                    boxShadow: '3px 3px 0 #000000',
                                    transform: 'skewX(-4deg)',
                                }}
                            >
                                ⚡ BROWSE IMAGE FILE
                            </span>
                        </div>
                        <p style={{ color: '#aaa', fontSize: '0.82rem', margin: 0, fontFamily: 'var(--font-p5-sans)' }}>
                            or drag and drop visual file here (PNG, JPG, WEBP, GIF)
                        </p>
                        {currentImageUrl && (
                            <p style={{ color: '#00E676', fontSize: '0.75rem', margin: 0, fontFamily: 'var(--font-p5-sans)' }}>
                                ✓ Current visual already exists (click to replace)
                            </p>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'bold' }}>
                    {error}
                </p>
            )}
        </div>
    );
}
