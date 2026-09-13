<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'tech_stack',
        'image_url',
        'image_path',
        'repo_url',
        'live_url',
        'status',
        'order',
    ];

    protected $casts = [
        'tech_stack' => 'array',
    ];

    public function getImageAttribute(): ?string
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        return $this->image_url;
    }

    protected $appends = ['image'];

    public function scopeActive($query)
    {
        return $query->where('status', 'active')->orderBy('order');
    }
}
