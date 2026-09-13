<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageOptimizer
{
    /**
     * Store an uploaded image as an optimized WebP file.
     *
     * @param UploadedFile $file
     * @param string $directory (e.g. 'projects', 'certificates', 'experiences')
     * @param string $disk (default: 'public')
     * @param int $quality (default: 85)
     * @return string Relative stored path
     */
    public static function storeAsWebp(UploadedFile $file, string $directory, string $disk = 'public', int $quality = 85): string
    {
        $mime = $file->getMimeType();
        $realPath = $file->getRealPath();

        $image = null;
        if ($mime === 'image/png') {
            $image = @imagecreatefrompng($realPath);
            if ($image) {
                imagepalettetotruecolor($image);
                imagealphablending($image, true);
                imagesavealpha($image, true);
            }
        } elseif ($mime === 'image/jpeg' || $mime === 'image/jpg') {
            $image = @imagecreatefromjpeg($realPath);
        } elseif ($mime === 'image/webp') {
            // Already WebP, store directly
            return $file->store($directory, $disk);
        }

        // If GD cannot convert, fallback to normal store
        if (!$image) {
            return $file->store($directory, $disk);
        }

        // Generate unique filename
        $filename = Str::random(40) . '.webp';
        $relativeFolder = trim($directory, '/');
        $fullDirPath = Storage::disk($disk)->path($relativeFolder);

        if (!is_dir($fullDirPath)) {
            mkdir($fullDirPath, 0755, true);
        }

        $fullPath = $fullDirPath . DIRECTORY_SEPARATOR . $filename;
        imagewebp($image, $fullPath, $quality);
        imagedestroy($image);

        return $relativeFolder . '/' . $filename;
    }
}
