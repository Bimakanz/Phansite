<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'title',
        'organization',
        'type',
        'description',
        'date_start',
        'date_end',
        'image_url',
        'image_path',
        'credential_url',
        'order',
    ];

    protected $casts = [
        'date_start' => 'date',
        'date_end' => 'date',
    ];

    public function getImageAttribute(): ?string
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        return $this->image_url;
    }

    protected $appends = ['image'];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderByDesc('date_start');
    }
}
