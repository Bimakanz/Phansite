import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ExperienceEdit({ experience }) {
    const { data, setData, put, processing, errors } = useForm({
        title: experience.title ?? '', organization: experience.organization ?? '',
        type: experience.type ?? 'certificate', description: experience.description ?? '',
        date_start: experience.date_start ? experience.date_start.slice(0,10) : '',
        date_end: experience.date_end ? experience.date_end.slice(0,10) : '',
        image_url: experience.image_url ?? '', image_file: null,
        credential_url: experience.credential_url ?? '', order: experience.order ?? 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/experiences/${experience.id}`, { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title={`Edit: ${experience.title} — Admin`} />
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
                <Link href="/admin/experiences" className="p5-btn p5-btn-sm p5-btn-outline">← Back</Link>
                <h1 className="font-p5-display" style={{ fontSize:'2rem', color:'var(--p5-white)', letterSpacing:'0.08em' }}>EDIT EXPERIENCE</h1>
            </div>
            <div style={{ maxWidth:'800px' }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div style={{ background:'var(--p5-dark)', border:'2px solid rgba(232,0,61,0.2)', padding:'2rem', display:'grid', gap:'1.5rem' }}>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                            <div><label className="p5-label">Title *</label><input className="p5-input" value={data.title} onChange={e=>setData('title',e.target.value)} />{errors.title&&<p style={{color:'var(--p5-red)',fontSize:'0.85rem',marginTop:'0.25rem'}}>{errors.title}</p>}</div>
                            <div><label className="p5-label">Organization *</label><input className="p5-input" value={data.organization} onChange={e=>setData('organization',e.target.value)} />{errors.organization&&<p style={{color:'var(--p5-red)',fontSize:'0.85rem',marginTop:'0.25rem'}}>{errors.organization}</p>}</div>
                        </div>
                        <div>
                            <label className="p5-label">Type *</label>
                            <select className="p5-input" value={data.type} onChange={e=>setData('type',e.target.value)}>
                                <option value="certificate">Certificate</option>
                                <option value="work">Work Experience</option>
                                <option value="education">Education</option>
                            </select>
                        </div>
                        <div><label className="p5-label">Description</label><textarea className="p5-input" rows={3} value={data.description} onChange={e=>setData('description',e.target.value)} style={{resize:'vertical'}} /></div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                            <div><label className="p5-label">Start Date</label><input type="date" className="p5-input" value={data.date_start} onChange={e=>setData('date_start',e.target.value)} style={{colorScheme:'dark'}} /></div>
                            <div><label className="p5-label">End Date</label><input type="date" className="p5-input" value={data.date_end} onChange={e=>setData('date_end',e.target.value)} style={{colorScheme:'dark'}} /></div>
                        </div>
                        {experience.image && <div><p className="p5-label">Current Image</p><img src={experience.image} alt="" style={{maxHeight:'60px',maxWidth:'120px',objectFit:'contain',background:'rgba(255,255,255,0.08)',padding:'4px'}} /></div>}
                        <div><label className="p5-label">Image URL</label><input className="p5-input" value={data.image_url} onChange={e=>setData('image_url',e.target.value)} placeholder="https://..." /></div>
                        <div><label className="p5-label">Or Replace with New Image</label><input type="file" accept="image/*" className="p5-input" style={{padding:'0.4rem',cursor:'pointer'}} onChange={e=>setData('image_file',e.target.files[0])} /></div>
                        <div><label className="p5-label">Credential URL</label><input className="p5-input" value={data.credential_url} onChange={e=>setData('credential_url',e.target.value)} /></div>
                        <div><label className="p5-label">Display Order</label><input className="p5-input" type="number" value={data.order} onChange={e=>setData('order',parseInt(e.target.value)||0)} min="0" /></div>
                        <div style={{display:'flex',gap:'1rem'}}>
                            <button type="submit" disabled={processing} className="p5-btn">{processing?'Saving...':'◉ Update Experience'}</button>
                            <Link href="/admin/experiences" className="p5-btn p5-btn-outline">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}