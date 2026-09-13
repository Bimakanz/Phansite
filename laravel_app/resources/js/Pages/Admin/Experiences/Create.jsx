import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ExperienceCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '', organization: '', type: 'certificate', description: '',
        date_start: '', date_end: '', image_url: '', image_file: null,
        credential_url: '', order: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/experiences', { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title="Create Experience — Admin" />
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
                <Link href="/admin/experiences" className="p5-btn p5-btn-sm p5-btn-outline">← Back</Link>
                <h1 className="font-p5-display" style={{ fontSize:'2rem', color:'var(--p5-white)', letterSpacing:'0.08em' }}>CREATE EXPERIENCE</h1>
            </div>
            <div style={{ maxWidth:'800px' }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div style={{ background:'var(--p5-dark)', border:'2px solid rgba(232,0,61,0.2)', padding:'2rem', display:'grid', gap:'1.5rem' }}>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                            <div><label className="p5-label">Title *</label><input className="p5-input" value={data.title} onChange={e=>setData('title',e.target.value)} placeholder="e.g. Web Dev Certificate" />{errors.title&&<p style={{color:'var(--p5-red)',fontSize:'0.85rem',marginTop:'0.25rem'}}>{errors.title}</p>}</div>
                            <div><label className="p5-label">Organization *</label><input className="p5-input" value={data.organization} onChange={e=>setData('organization',e.target.value)} placeholder="e.g. Udemy, Google..." />{errors.organization&&<p style={{color:'var(--p5-red)',fontSize:'0.85rem',marginTop:'0.25rem'}}>{errors.organization}</p>}</div>
                        </div>
                        <div>
                            <label className="p5-label">Type *</label>
                            <select className="p5-input" value={data.type} onChange={e=>setData('type',e.target.value)}>
                                <option value="certificate">Certificate</option>
                                <option value="work">Work Experience</option>
                                <option value="education">Education</option>
                            </select>
                        </div>
                        <div><label className="p5-label">Description</label><textarea className="p5-input" rows={3} value={data.description} onChange={e=>setData('description',e.target.value)} placeholder="Brief description..." style={{resize:'vertical'}} /></div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                            <div><label className="p5-label">Start Date</label><input type="date" className="p5-input" value={data.date_start} onChange={e=>setData('date_start',e.target.value)} style={{colorScheme:'dark'}} /></div>
                            <div><label className="p5-label">End Date (leave blank = Present)</label><input type="date" className="p5-input" value={data.date_end} onChange={e=>setData('date_end',e.target.value)} style={{colorScheme:'dark'}} /></div>
                        </div>
                        <div><label className="p5-label">Badge/Logo Image URL</label><input className="p5-input" value={data.image_url} onChange={e=>setData('image_url',e.target.value)} placeholder="https://..." /></div>
                        <div><label className="p5-label">Or Upload Image</label><input type="file" accept="image/*" className="p5-input" style={{padding:'0.4rem',cursor:'pointer'}} onChange={e=>setData('image_file',e.target.files[0])} /></div>
                        <div><label className="p5-label">Credential / Verification URL</label><input className="p5-input" value={data.credential_url} onChange={e=>setData('credential_url',e.target.value)} placeholder="https://..." /></div>
                        <div><label className="p5-label">Display Order</label><input className="p5-input" type="number" value={data.order} onChange={e=>setData('order',parseInt(e.target.value)||0)} min="0" /></div>
                        <div style={{display:'flex',gap:'1rem'}}>
                            <button type="submit" disabled={processing} className="p5-btn">{processing?'Creating...':'◉ Create Experience'}</button>
                            <Link href="/admin/experiences" className="p5-btn p5-btn-outline">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}