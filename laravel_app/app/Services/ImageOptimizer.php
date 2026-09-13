<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageOptimizer
{
    /**
     * Store an uploaded image as an optimized WebP file if supported,
     * otherwise safely fall back to default storage without throwing 500.
     *
     * @param UploadedFile $file
     * @param string $directory (e.g. 'projects', 'certificates', 'experiences')
     * @param string $disk (default: 'public')
     * @param int $quality (default: 85)
     * @return string Relative stored path
     */
    public static function storeAsWebp(UploadedFile $file, string $directory, string $disk = 'public', int $quality = 85): string
    {
        try {
            $mime = $file->getMimeType();

            // Already WebP, store directly
            if ($mime === 'image/webp') {
                return $file->store($directory, $disk);
            }

            // Check if GD and imagewebp are available
            if (!extension_loaded('gd') || !function_exists('imagewebp')) {
                return $file->store($directory, $disk);
            }

            $realPath = $file->getRealPath();
            $image = null;

            if ($mime === 'image/png' && function_exists('imagecreatefrompng')) {
                $image = @imagecreatefrompng($realPath);
                if ($image) {
                    if (function_exists('imagepalettetotruecolor')) {
                        @imagepalettetotruecolor($image);
                    }
                    if (function_exists('imagealphablending')) {
                        @imagealphablending($image, true);
                    }
                    if (function_exists('imagesavealpha')) {
                        @imagesavealpha($image, true);
                    }
                }
            } elseif (($mime === 'image/jpeg' || $mime === 'image/jpg') && function_exists('imagecreatefromjpeg')) {
                $image = @imagecreatefromjpeg($realPath);
            }

            // If GD cannot convert, fallback to normal store
            if (!$image) {
                return $file->store($directory, $disk);
            }

            // Capture WebP binary stream
            ob_start();
            $success = @imagewebp($image, null, $quality);
            $rawContent = ob_get_clean();

            if (function_exists('imagedestroy')) {
                @imagedestroy($image);
            }

            if ($success && !empty($rawContent)) {
                $filename = Str::random(40) . '.webp';
                $relativeFolder = trim($directory, '/');
                $relativePath = $relativeFolder . '/' . $filename;

                Storage::disk($disk)->put($relativePath, $rawContent);

                return $relativePath;
            }

            return $file->store($directory, $disk);
        } catch (\Throwable $e) {
            Log::warning('ImageOptimizer fallback triggered: ' . $e->getMessage());
            return $file->store($directory, $disk);
        }
    }
}

