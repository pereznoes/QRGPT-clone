import axios from 'axios';

export default async function downloadQRCodeImage(qrCodeUrl: string, saveAsFilename: string) {
  try {
    const qrCodeResponse = await axios.get(qrCodeUrl, {
      headers: {
        Origin: location.origin,
      },
      responseType: 'blob',
    });

    verifyHttpStatus(qrCodeResponse.status);

    const qrCodeBlobUrl = window.URL.createObjectURL(qrCodeResponse.data);
    initiateFileDownload(qrCodeBlobUrl, saveAsFilename);
  } catch (error) {
    console.error('Error downloading QR code image:', error);
  }
}

function verifyHttpStatus(httpStatus: number): void {
  if (httpStatus !== 200) {
    throw new Error(`HTTP error! status: ${httpStatus}`);
  }
}

function initiateFileDownload(blobUrl: string, filename: string): void {
  const downloadAnchor = createDownloadAnchorElement(blobUrl, filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  window.URL.revokeObjectURL(blobUrl);
}

function createDownloadAnchorElement(blobUrl: string, filename: string): HTMLAnchorElement {
  const anchorElement = document.createElement('a');
  anchorElement.href = blobUrl;
  anchorElement.download = filename;
  return anchorElement;
}
