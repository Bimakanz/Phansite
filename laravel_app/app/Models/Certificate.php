<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'title',
        'issuer',
        'year',
        'arcana',
        'credential_url',
        'description',
        'image_url',
        'image_path',
        'order',
    ];

    public function getImageAttribute(): ?string
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        if ($this->image_url) {
            return $this->image_url;
        }
        return '/assets/img/p5_certificate_sample.jpg';
    }

    protected $appends = ['image'];
}
