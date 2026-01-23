/**
 * Utility to extract a poster frame from a video file or URL
 */

/**
 * Generates a poster image (thumbnail) from a video file
 * @param videoFile - The video file to extract a frame from
 * @returns Promise that resolves to a blob URL of the poster image
 */
export async function generateVideoPoster(videoFile: File | string): Promise<string> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;

        // Set video source
        if (typeof videoFile === 'string') {
            video.src = videoFile;
        } else {
            video.src = URL.createObjectURL(videoFile);
        }

        video.addEventListener('loadeddata', () => {
            // Seek to 1 second or 10% of duration, whichever is smaller
            const seekTime = Math.min(1, video.duration * 0.1);
            video.currentTime = seekTime;
        });

        video.addEventListener('seeked', () => {
            try {
                // Create canvas and draw video frame
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert canvas to blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        const posterUrl = URL.createObjectURL(blob);
                        resolve(posterUrl);
                    } else {
                        reject(new Error('Failed to create blob from canvas'));
                    }

                    // Clean up
                    if (typeof videoFile !== 'string') {
                        URL.revokeObjectURL(video.src);
                    }
                }, 'image/jpeg', 0.8);
            } catch (error) {
                reject(error);
            }
        });

        video.addEventListener('error', (e) => {
            reject(new Error(`Video loading failed: ${e}`));
            if (typeof videoFile !== 'string') {
                URL.revokeObjectURL(video.src);
            }
        });
    });
}

/**
 * Checks if a URL is a blob URL
 */
export function isBlobUrl(url: string): boolean {
    return url.startsWith('blob:');
}

/**
 * Checks if a URL is a data URL
 */
export function isDataUrl(url: string): boolean {
    return url.startsWith('data:');
}
