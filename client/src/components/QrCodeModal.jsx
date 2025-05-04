import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';

// MUI Imports
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';

function QrCodeModal({ open, onClose, url }) {
    const qrRef = useRef(null);

    const handleDownload = () => {
        if (!qrRef.current) {
            console.error('QR Kod referansı bulunamadı.');
            return;
        }

        const svgElement = qrRef.current.querySelector('svg');
        if (!svgElement) {
            console.error('SVG elementi bulunamadı.');
            return;
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;

        const img = new Image();
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scaleFactor = 2;
            canvas.width = img.width * scaleFactor;
            canvas.height = img.height * scaleFactor;
            
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const pngUrl = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'qrcode.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        img.onerror = (error) => {
            console.error('QR kod resmi yüklenirken hata oluştu:', error);
        };

        img.src = svgDataUrl;
    };

    return (
        <Dialog onClose={onClose} open={open} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Kartvizit QR Kodu
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                {url ? (
                    <div ref={qrRef}>
                         <QRCodeSVG value={url} size={256} includeMargin={true} /> 
                    </div>
                ) : (
                    <Box sx={{ height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                        QR Kodu için URL bulunamadı.
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                    variant="contained" 
                    onClick={handleDownload} 
                    disabled={!url}
                    startIcon={<DownloadIcon />}
                >
                    İndir (PNG)
                </Button>
            </DialogActions>
        </Dialog>
    );
}

QrCodeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default QrCodeModal; 