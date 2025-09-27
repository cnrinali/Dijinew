import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CardCreationModal from '../components/CardCreationModal';
import EmailWizardModal from '../components/EmailWizardModal';
import { useNotification } from '../context/NotificationContext';

const CardCreationChoicePage = () => {
    const [modalOpen, setModalOpen] = useState(true);
    const [wizardModalOpen, setWizardModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showNotification } = useNotification();

    const handleSelectMethod = async (method) => {
        setModalOpen(false);
        
        if (method === 'manual') {
            // Manuel oluşturma sayfasına yönlendir
            navigate('/cards/new-manual');
        } else if (method === 'wizard') {
            // Sihirbaz modal'ını aç
            setWizardModalOpen(true);
        }
    };

    const handleClose = () => {
        setModalOpen(false);
        // Geri dön - kullanıcı rolüne göre
        if (user?.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (user?.role === 'corporate') {
            navigate('/corporate/dashboard');
        } else {
            navigate('/cards');
        }
    };

    const handleWizardModalClose = () => {
        setWizardModalOpen(false);
        // Sihirbaz modal'ı kapatıldığında ana sayfaya dön
        handleClose();
    };

    // Sayfa yüklendiğinde eğer modal kapalıysa, geri yönlendir
    useEffect(() => {
        if (!modalOpen && !wizardModalOpen) {
            const timer = setTimeout(() => {
                handleClose();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [modalOpen, wizardModalOpen]);

    return (
        <>
            <CardCreationModal 
                open={modalOpen}
                onClose={handleClose}
                onSelectMethod={handleSelectMethod}
            />
            <EmailWizardModal 
                open={wizardModalOpen}
                onClose={handleWizardModalClose}
                wizardType={user?.role === 'corporate' ? 'corporate' : 'admin'}
            />
        </>
    );
};

export default CardCreationChoicePage;
