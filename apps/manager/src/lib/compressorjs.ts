import Compressor from 'compressorjs'

type CompressOptions = Compressor.Options

export function compressImage(
  file: File | Blob,
  options: CompressOptions,
): Promise<File | Blob> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(file, {
      ...options,
      success: resolve,
      error: reject,
    })
  })
}
