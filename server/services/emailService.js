const nodemailer = require('nodemailer');

// Email transporter oluştur
const createTransporter = () => {
    // Gmail kullanarak basit email gönderimi (production'da daha güvenli yöntemler kullanılmalı)
    const port = parseInt(process.env.SMTP_PORT) || 587;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // Gmail adresiniz
            pass: process.env.SMTP_PASS  // Gmail app password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Sihirbaz linki email gönder
const sendWizardLinkEmail = async (toEmail, wizardUrl, senderName = 'DijiCard') => {
    // Email parametrelerini kontrol et
    if (!toEmail || !wizardUrl) {
        return { success: false, message: 'Email adresi veya URL eksik' };
    }
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP bilgileri eksik, email gönderilemiyor');
        return { success: false, message: 'Email yapılandırması eksik' };
    }

    try {
        const transporter = createTransporter();
        
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Kartvizit Oluşturma Linki</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1565C0 0%, #2196F3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">🃏 DijiCard</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Dijital Kartvizit Platformu</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
                <h2 style="color: #1565C0; margin-top: 0;">Kartvizit Oluşturma Linkiniz Hazır!</h2>
                
                <p>Merhaba,</p>
                
                <p><strong>${senderName}</strong> sizin için dijital kartvizit oluşturma linki oluşturdu. Aşağıdaki butona tıklayarak hemen kartvizitinizi oluşturmaya başlayabilirsiniz:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${wizardUrl}" style="background: linear-gradient(135deg, #1565C0 0%, #2196F3 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        🎯 Kartvizitimi Oluştur
                    </a>
                </div>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #856404;"><strong>⚠️ Önemli:</strong></p>
                    <ul style="margin: 10px 0 0 0; color: #856404;">
                        <li>Bu link 30 gün boyunca geçerlidir</li>
                        <li>Link tek kullanımlıktır (bir kez kullanıldıktan sonra geçersiz olur)</li>
                        <li>Kartvizitinizi oluşturduktan sonra istediğiniz zaman düzenleyebilirsiniz</li>
                    </ul>
                </div>
                
                <p>Eğer yukarıdaki buton çalışmıyorsa, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
                <p style="word-break: break-all; background: #f1f3f4; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">${wizardUrl}</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #666; font-size: 14px; text-align: center;">
                    Bu email, DijiCard dijital kartvizit platformu tarafından gönderilmiştir.<br>
                    Herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.
                </p>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `"DijiCard" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: '🃏 Dijital Kartvizit Oluşturma Linkiniz Hazır!',
            html: htmlContent,
            text: `Merhaba,

${senderName} sizin için dijital kartvizit oluşturma linki oluşturdu.

Kartvizitinizi oluşturmak için aşağıdaki linke tıklayın:
${wizardUrl}

Önemli Notlar:
- Bu link 30 gün boyunca geçerlidir
- Link tek kullanımlıktır
- Kartvizitinizi oluşturduktan sonra istediğiniz zaman düzenleyebilirsiniz

DijiCard Ekibi`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email gönderildi:', info.messageId);
        
        return { 
            success: true, 
            messageId: info.messageId,
            message: 'Email başarıyla gönderildi' 
        };
    } catch (error) {
        console.error('Email gönderme hatası:', error);
        return { 
            success: false, 
            message: 'Email gönderilemedi: ' + error.message 
        };
    }
};

// Şifre sıfırlama email gönder
const sendPasswordResetEmail = async (toEmail, resetUrl, userName = '') => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP bilgileri eksik, email gönderilemiyor');
        return { success: false, message: 'Email yapılandırması eksik' };
    }

    try {
        const transporter = createTransporter();
        
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Şifre Sıfırlama</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">🔐 DijiCard</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Şifre Sıfırlama</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
                <h2 style="color: #dc3545; margin-top: 0;">Şifre Sıfırlama Talebi</h2>
                
                <p>Merhaba${userName ? ' ' + userName : ''},</p>
                
                <p>DijiCard hesabınız için şifre sıfırlama talebi aldık. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        🔑 Şifremi Sıfırla
                    </a>
                </div>
                
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #721c24;"><strong>⚠️ Güvenlik Uyarısı:</strong></p>
                    <ul style="margin: 10px 0 0 0; color: #721c24;">
                        <li>Bu link 1 saat boyunca geçerlidir</li>
                        <li>Bu işlemi siz talep etmediyseniz, bu emaili görmezden gelin</li>
                        <li>Şifrenizi kimseyle paylaşmayın</li>
                    </ul>
                </div>
                
                <p>Eğer yukarıdaki buton çalışmıyorsa, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
                <p style="word-break: break-all; background: #f1f3f4; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">${resetUrl}</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #666; font-size: 14px; text-align: center;">
                    Bu email, DijiCard güvenlik sistemi tarafından gönderilmiştir.<br>
                    Bu işlemi siz talep etmediyseniz, hesabınızın güvenliği için bizimle iletişime geçin.
                </p>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `"DijiCard Güvenlik" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: '🔐 DijiCard - Şifre Sıfırlama Talebi',
            html: htmlContent,
            text: `Merhaba${userName ? ' ' + userName : ''},

DijiCard hesabınız için şifre sıfırlama talebi aldık.

Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:
${resetUrl}

Güvenlik Notları:
- Bu link 1 saat boyunca geçerlidir
- Bu işlemi siz talep etmediyseniz, bu emaili görmezden gelin
- Şifrenizi kimseyle paylaşmayın

DijiCard Güvenlik Ekibi`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Şifre sıfırlama emaili gönderildi:', info.messageId);
        
        return { 
            success: true, 
            messageId: info.messageId,
            message: 'Şifre sıfırlama emaili başarıyla gönderildi' 
        };
    } catch (error) {
        console.error('Şifre sıfırlama emaili gönderme hatası:', error);
        return { 
            success: false, 
            message: 'Email gönderilemedi: ' + error.message 
        };
    }
};

// Kullanıcı hoş geldin emaili gönder
const sendWelcomeEmail = async (toEmail, userName, loginUrl) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP bilgileri eksik, email gönderilemiyor');
        return { success: false, message: 'Email yapılandırması eksik' };
    }

    try {
        const transporter = createTransporter();
        
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>DijiCard'a Hoş Geldiniz</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">🎉 DijiCard</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Hoş Geldiniz!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
                <h2 style="color: #28a745; margin-top: 0;">Hesabınız Başarıyla Oluşturuldu!</h2>
                
                <p>Merhaba <strong>${userName}</strong>,</p>
                
                <p>DijiCard'a hoş geldiniz! Hesabınız başarıyla oluşturuldu ve artık dijital kartvizit dünyanın kapıları sizin için açık.</p>
                
                <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #155724; margin-top: 0;">🚀 Şimdi Ne Yapabilirsiniz?</h3>
                    <ul style="color: #155724; margin: 10px 0;">
                        <li>Kişisel bilgilerinizi düzenleyebilirsiniz</li>
                        <li>Dijital kartvizitinizi görüntüleyip paylaşabilirsiniz</li>
                        <li>QR kodunuzu indirebilir ve yazdırabilirsiniz</li>
                        <li>Kartvizit istatistiklerinizi takip edebilirsiniz</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${loginUrl}" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        🏠 Panelime Git
                    </a>
                </div>
                
                <p>Herhangi bir sorunuzla karşılaştığınızda bizimle iletişime geçmekten çekinmeyin. Size yardımcı olmaktan mutluluk duyarız!</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #666; font-size: 14px; text-align: center;">
                    DijiCard ailesi olarak sizleri aramızda görmekten büyük mutluluk duyuyoruz!<br>
                    İyi dijital kartvizitler dileriz 🃏
                </p>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `"DijiCard" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: '🎉 DijiCard\'a Hoş Geldiniz! Hesabınız Hazır',
            html: htmlContent,
            text: `Merhaba ${userName},

DijiCard'a hoş geldiniz! Hesabınız başarıyla oluşturuldu.

Şimdi Ne Yapabilirsiniz?
- Kişisel bilgilerinizi düzenleyebilirsiniz
- Dijital kartvizitinizi görüntüleyip paylaşabilirsiniz
- QR kodunuzu indirebilir ve yazdırabilirsiniz
- Kartvizit istatistiklerinizi takip edebilirsiniz

Panele gitmek için: ${loginUrl}

DijiCard Ekibi`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Hoş geldin emaili gönderildi:', info.messageId);
        
        return { 
            success: true, 
            messageId: info.messageId,
            message: 'Hoş geldin emaili başarıyla gönderildi' 
        };
    } catch (error) {
        console.error('Hoş geldin emaili gönderme hatası:', error);
        return { 
            success: false, 
            message: 'Email gönderilemedi: ' + error.message 
        };
    }
};

// Kurumsal kullanıcı bilgileri emaili gönder
const sendCorporateUserCredentials = async (toEmail, userName, userEmail, temporaryPassword, companyName, loginUrl) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP bilgileri eksik, email gönderilemiyor');
        return { success: false, message: 'Email yapılandırması eksik' };
    }

    try {
        const transporter = createTransporter();
        
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Kurumsal Hesap Bilgileriniz</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">🏢 DijiCard Kurumsal</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Hesap Bilgileriniz</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
                <h2 style="color: #1E3A8A; margin-top: 0;">Kurumsal Hesabınız Oluşturuldu!</h2>
                
                <p>Merhaba <strong>${userName}</strong>,</p>
                
                <p><strong>${companyName}</strong> şirketi için DijiCard kurumsal hesabınız oluşturuldu. Aşağıda giriş bilgilerinizi bulabilirsiniz:</p>
                
                <div style="background: #e3f2fd; border: 2px solid #1E3A8A; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #1E3A8A; margin-top: 0;">🔑 Giriş Bilgileriniz</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #1E3A8A; font-weight: bold;">Email:</td>
                            <td style="padding: 8px 0; color: #333;">${userEmail}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #1E3A8A; font-weight: bold;">Geçici Şifre:</td>
                            <td style="padding: 8px 0;"><code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-size: 16px; color: #d32f2f;">${temporaryPassword}</code></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #1E3A8A; font-weight: bold;">Şirket:</td>
                            <td style="padding: 8px 0; color: #333;">${companyName}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #856404;"><strong>⚠️ Önemli Güvenlik Notları:</strong></p>
                    <ul style="margin: 10px 0 0 0; color: #856404;">
                        <li>İlk girişte şifrenizi mutlaka değiştirin</li>
                        <li>Şifrenizi kimseyle paylaşmayın</li>
                        <li>Bu emaili güvenli bir yerde saklayın</li>
                        <li>Giriş yaptıktan sonra bu emaili silebilirsiniz</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${loginUrl}" style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        🚀 Kurumsal Panele Giriş Yap
                    </a>
                </div>
                
                <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #155724; margin-top: 0;">📋 Yapabilecekleriniz:</h3>
                    <ul style="color: #155724; margin: 10px 0;">
                        <li>Şirket kartvizitlerini yönetebilirsiniz</li>
                        <li>Şirket kullanıcılarını görüntüleyebilirsiniz</li>
                        <li>Detaylı istatistiklere erişebilirsiniz</li>
                        <li>Toplu kartvizit işlemleri yapabilirsiniz</li>
                    </ul>
                </div>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #666; font-size: 14px; text-align: center;">
                    Bu email, ${companyName} yöneticisi tarafından oluşturulan hesabınız için gönderilmiştir.<br>
                    Herhangi bir sorunuz varsa şirket yöneticinizle iletişime geçebilirsiniz.
                </p>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `"DijiCard Kurumsal" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: `🏢 ${companyName} - DijiCard Kurumsal Hesap Bilgileriniz`,
            html: htmlContent,
            text: `Merhaba ${userName},

${companyName} şirketi için DijiCard kurumsal hesabınız oluşturuldu.

Giriş Bilgileriniz:
Email: ${userEmail}
Geçici Şifre: ${temporaryPassword}
Şirket: ${companyName}

Önemli Güvenlik Notları:
- İlk girişte şifrenizi mutlaka değiştirin
- Şifrenizi kimseyle paylaşmayın
- Bu emaili güvenli bir yerde saklayın

Giriş için: ${loginUrl}

Yapabilecekleriniz:
- Şirket kartvizitlerini yönetebilirsiniz
- Şirket kullanıcılarını görüntüleyebilirsiniz
- Detaylı istatistiklere erişebilirsiniz
- Toplu kartvizit işlemleri yapabilirsiniz

DijiCard Kurumsal Ekibi`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Kurumsal kullanıcı bilgileri emaili gönderildi:', info.messageId);
        
        return { 
            success: true, 
            messageId: info.messageId,
            message: 'Kullanıcı bilgileri emaili başarıyla gönderildi' 
        };
    } catch (error) {
        console.error('Kurumsal kullanıcı emaili gönderme hatası:', error);
        return { 
            success: false, 
            message: 'Email gönderilemedi: ' + error.message 
        };
    }
};

module.exports = {
    sendWizardLinkEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendCorporateUserCredentials
};
