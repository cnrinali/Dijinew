const { getPool, sql } = require("../../config/db");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const emailService = require("../../services/emailService");
const qrcode = require("qrcode");

// Helper function to generate QR code for card
const generateCardQRCode = async (cardData) => {
  try {
    // QR kod yolunu oluştur
    const cardPath = cardData.customSlug
      ? `/card/${cardData.customSlug}`
      : `/card/${cardData.id}`;

    // QR kodu oluştur (Data URL formatında)
    const qrCodeDataURL = await qrcode.toDataURL(cardPath);

    return {
      success: true,
      cardPath,
      qrCodeDataURL,
    };
  } catch (error) {
    console.error("QR kod oluşturma hatası:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Basit Sihirbaz Token Oluştur (Sadece email ile)
const createSimpleWizard = async (req, res) => {
  const { email } = req.body; // Email isteğe bağlı
  const userId = req.user.id;
  const userRole = req.user.role;
  const companyId = req.user.companyId;

  // Yetki kontrolü
  if (!["admin", "corporate"].includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: "Bu işlem için yetkiniz yok.",
    });
  }

  try {
    const pool = await getPool();

    // Benzersiz token oluştur
    const token = crypto.randomBytes(16).toString("hex"); // Daha kısa token

    // Geçerlilik süresi 30 gün
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Önce Cards tablosunun mevcut kolonlarını kontrol edelim
    // Sadece kesinlikle var olan kolonları kullanarak kart oluşturalım
    // GUID ile unique slug oluştur
    const uniqueSlug = uuidv4();
    console.log("🏷️ Generated UUID slug:", uniqueSlug);

    // Kurumsal kullanıcı için companyId kontrolü
    let companyId = null;
    let companyName = null;

    if (userRole === "corporate") {
      // Kullanıcının şirket bilgilerini al
      const companyResult = await pool
        .request()
        .input("userId", sql.Int, userId).query(`
                    SELECT u.companyId, c.name as companyName 
                    FROM Users u 
                    LEFT JOIN Companies c ON u.companyId = c.id 
                    WHERE u.id = @userId
                `);

      if (
        companyResult.recordset.length > 0 &&
        companyResult.recordset[0].companyId
      ) {
        companyId = companyResult.recordset[0].companyId;
        companyName = companyResult.recordset[0].companyName;
      }

      const limitCheck = await pool
        .request()
        .input("companyId", sql.Int, companyId).query(`
            SELECT 
                c.cardLimit, 
                COUNT(cr.id) AS existingCards
            FROM Companies c
            LEFT JOIN Cards cr ON cr.companyId = c.id
            WHERE c.id = @companyId
            GROUP BY c.cardLimit
        `);

      const limitData = limitCheck.recordset[0];

      if (limitData && limitData.existingCards >= limitData.cardLimit) {
        return res.status(400).json({
          success: false,
          message: `Kart oluşturulamadı. Şirketinizin kart limiti (${limitData.cardLimit}) dolmuş durumda.`,
        });
      }
    }

    // Önce Cards tablosunda companyId kolonu var mı kontrol et
    const columnCheckResult = await pool.request().query(`
                SELECT 
                    SUM(CASE WHEN COLUMN_NAME = 'companyId' THEN 1 ELSE 0 END) as hasCompanyId,
                    SUM(CASE WHEN COLUMN_NAME = 'permanentSlug' THEN 1 ELSE 0 END) as hasPermanentSlug
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME IN ('companyId', 'permanentSlug')
            `);

    const hasCompanyIdColumn = columnCheckResult.recordset[0].hasCompanyId > 0;
    const hasPermanentSlugColumn =
      columnCheckResult.recordset[0].hasPermanentSlug > 0;

    let cardResult;
    if (hasCompanyIdColumn && userRole === "corporate" && companyId) {
      // CompanyId kolonu varsa ve kurumsal kullanıcıysa company bilgisi ile oluştur
      const request = pool
        .request()
        .input("cardName", sql.NVarChar(255), "Yeni Kartvizit")
        .input("customSlug", sql.NVarChar(255), uniqueSlug)
        .input("name", sql.NVarChar(255), "Henüz Belirtilmedi")
        .input("email", sql.NVarChar(255), email || "")
        .input("userId", sql.Int, userId)
        .input("companyId", sql.Int, companyId)
        .input("isActive", sql.Bit, true);

      if (hasPermanentSlugColumn) {
        request.input("permanentSlug", sql.NVarChar(255), uniqueSlug);
        cardResult = await request.query(`
                    INSERT INTO Cards (cardName, customSlug, name, email, userId, companyId, permanentSlug, isActive)
                    OUTPUT INSERTED.id, INSERTED.customSlug, INSERTED.permanentSlug
                    VALUES (@cardName, @customSlug, @name, @email, @userId, @companyId, @permanentSlug, @isActive)
                `);
      } else {
        cardResult = await request.query(`
                    INSERT INTO Cards (cardName, customSlug, name, email, userId, companyId, isActive)
                    OUTPUT INSERTED.id, INSERTED.customSlug
                    VALUES (@cardName, @customSlug, @name, @email, @userId, @companyId, @isActive)
                `);
      }
    } else {
      // CompanyId kolonu yoksa veya bireysel kullanıcıysa normal oluştur
      const request = pool
        .request()
        .input("cardName", sql.NVarChar(255), "Yeni Kartvizit")
        .input("customSlug", sql.NVarChar(255), uniqueSlug)
        .input("name", sql.NVarChar(255), "Henüz Belirtilmedi")
        .input("email", sql.NVarChar(255), email || "")
        .input("userId", sql.Int, userId)
        .input("isActive", sql.Bit, true);

      if (hasPermanentSlugColumn) {
        request.input("permanentSlug", sql.NVarChar(255), uniqueSlug);
        cardResult = await request.query(`
                    INSERT INTO Cards (cardName, customSlug, name, email, userId, permanentSlug, isActive)
                    OUTPUT INSERTED.id, INSERTED.customSlug, INSERTED.permanentSlug
                    VALUES (@cardName, @customSlug, @name, @email, @userId, @permanentSlug, @isActive)
                `);
      } else {
        cardResult = await request.query(`
                    INSERT INTO Cards (cardName, customSlug, name, email, userId, isActive)
                    OUTPUT INSERTED.id, INSERTED.customSlug
                    VALUES (@cardName, @customSlug, @name, @email, @userId, @isActive)
                `);
      }
    }

    const card = cardResult.recordset[0];
    console.log("💳 Card creation result:", card);

    // Token'ı veritabanına kaydet
    const tokenResult = await pool
      .request()
      .input("token", sql.NVarChar, token)
      .input("email", sql.NVarChar, email)
      .input("createdBy", sql.Int, userId)
      .input("createdByType", sql.NVarChar, userRole)
      .input("companyId", sql.Int, userRole === "corporate" ? companyId : null)
      .input("cardId", sql.Int, card.id)
      .input("expiresAt", sql.DateTime2, expiresAt).query(`
                INSERT INTO SimpleWizardTokens (token, email, createdBy, createdByType, companyId, cardId, expiresAt)
                OUTPUT INSERTED.id, INSERTED.token, INSERTED.email, INSERTED.expiresAt, INSERTED.createdAt
                VALUES (@token, @email, @createdBy, @createdByType, @companyId, @cardId, @expiresAt)
            `);

    const wizardToken = tokenResult.recordset[0];

    // Wizard URL oluştur (CLIENT tarafında - port 5173)
    const clientBaseUrl = req.get("host").includes("localhost")
      ? `https://app.dijinew.com`
      : `https://app.dijinew.com`;
    const wizardUrl = `${clientBaseUrl}/wizard/${card.customSlug}?token=${token}`;

    // Kart için QR kod oluştur
    const qrResult = await generateCardQRCode(card);
    let qrCodeUrl = null;

    if (qrResult.success) {
      qrCodeUrl = `${clientBaseUrl}/qr/${card.customSlug}`;
      console.log("QR kod başarıyla oluşturuldu:", qrResult.cardPath);
    } else {
      console.error("QR kod oluşturulamadı:", qrResult.error);
    }

    // Email göndermeyi dene (opsiyonel - sadece geçerli email varsa)
    let emailResult = { success: false, message: "Email belirtilmedi" };

    // Email kontrolü: boş değil, @ içeriyor ve en az 5 karakter
    const isValidEmail =
      email &&
      typeof email === "string" &&
      email.trim().length > 4 &&
      email.includes("@") &&
      email.includes(".");

    if (isValidEmail) {
      try {
        console.log("Email gönderme işlemi başlatılıyor:", email);

        const user = await pool
          .request()
          .input("userId", sql.Int, userId)
          .query("SELECT name FROM Users WHERE id = @userId");

        const senderName = user.recordset[0]?.name || "Dijinew Ekibi";

        emailResult = await emailService.sendWizardLinkEmail(
          email.trim(),
          wizardUrl,
          senderName
        );
        console.log("Email gönderim sonucu:", emailResult);
      } catch (emailErr) {
        console.error(
          "Email gönderim hatası (ana işlemi etkilemez):",
          emailErr
        );
        emailResult = {
          success: false,
          message:
            "Email gönderilemedi: " + (emailErr.message || "Bilinmeyen hata"),
        };
        // Email hatası ana işlemi ETKİLEMEZ
      }
    } else {
      console.log("Email gönderilmiyor - geçersiz veya boş email:", email);
    }

    res.status(201).json({
      success: true,
      data: {
        ...wizardToken,
        cardId: card.id,
        cardSlug: card.customSlug,
        permanentSlug: card.permanentSlug || card.customSlug, // Fallback to customSlug if permanentSlug doesn't exist yet
        wizardUrl,
        qrCodeUrl,
        qrCodeDataURL: qrResult.success ? qrResult.qrCodeDataURL : null,
        cardPath: qrResult.success ? qrResult.cardPath : null,
        emailSent: emailResult?.success || false,
        emailMessage: emailResult?.message,
      },
      message:
        "Sihirbaz linki başarıyla oluşturuldu." +
        (emailResult?.success ? " Email gönderildi." : "") +
        (qrResult.success ? " QR kod hazırlandı." : ""),
    });
  } catch (error) {
    console.error("Basit sihirbaz token oluşturma hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

// Token ile kart bilgilerini getir
// Token doğrulama
const validateSimpleWizardToken = async (req, res) => {
  try {
    const { token } = req.params;
    const pool = await getPool();

    const result = await pool.request().input("token", sql.NVarChar, token)
      .query(`
                SELECT swt.token, swt.email, swt.isUsed, swt.expiresAt, swt.cardId,
                       c.cardName, c.customSlug,
                       CASE 
                           WHEN swt.expiresAt < GETDATE() THEN 1 
                           ELSE 0 
                       END as isExpired
                FROM SimpleWizardTokens swt
                INNER JOIN Cards c ON swt.cardId = c.id
                WHERE swt.token = @token
            `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Geçersiz token.",
      });
    }

    const data = result.recordset[0];

    // Token süresi dolmuş mu?
    if (data.isExpired) {
      return res.status(410).json({
        success: false,
        message: "Token süresi dolmuş.",
      });
    }

    // Token daha önce kullanılmış mı?
    if (data.isUsed) {
      return res.status(409).json({
        success: false,
        message: "Bu token daha önce kullanılmış.",
      });
    }

    res.json({
      success: true,
      message: "Token geçerli.",
      data: {
        token: data.token,
        cardId: data.cardId,
        cardSlug: data.customSlug,
        cardName: data.cardName,
        email: data.email,
      },
    });
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

const getCardByToken = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token parametresi gerekli.",
    });
  }

  try {
    const pool = await getPool();

    const result = await pool.request().input("token", sql.NVarChar, token)
      .query(`
                SELECT 
                    swt.id as tokenId,
                    swt.token,
                    swt.email as tokenEmail,
                    swt.isUsed,
                    swt.expiresAt,
                    swt.createdByType,
                    c.id as cardId,
                    c.name,
                    c.title,
                    c.email,
                    c.phone,
                    c.website,
                    c.address,
                    c.bio,
                    c.customSlug,
                    c.isActive,
                    c.profileImageUrl,
                    c.qrCodeData,
                    c.companyId,
                    comp.name as companyName,
                    CASE 
                        WHEN swt.expiresAt < GETDATE() THEN 1 
                        ELSE 0 
                    END as isExpired
                FROM SimpleWizardTokens swt
                INNER JOIN Cards c ON swt.cardId = c.id
                LEFT JOIN Companies comp ON c.companyId = comp.id
                WHERE swt.token = @token
            `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Geçersiz token.",
      });
    }

    const data = result.recordset[0];

    // Token süresi dolmuş mu?
    if (data.isExpired) {
      return res.status(410).json({
        success: false,
        message: "Token süresi dolmuş.",
      });
    }

    res.status(200).json({
      success: true,
      data: data,
      message: "Kart bilgileri başarıyla getirildi.",
    });
  } catch (error) {
    console.error("Token ile kart getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

// Kart bilgilerini güncelle (token ile)
const updateCardByToken = async (req, res) => {
  const { token } = req.params;
  const cardData = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token parametresi gerekli.",
    });
  }

  try {
    const pool = await getPool();

    // Önce token'ı doğrula
    const tokenResult = await pool.request().input("token", sql.NVarChar, token)
      .query(`
                SELECT cardId, isUsed, expiresAt,
                       CASE WHEN expiresAt < GETDATE() THEN 1 ELSE 0 END as isExpired
                FROM SimpleWizardTokens 
                WHERE token = @token
            `);

    if (tokenResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Geçersiz token.",
      });
    }

    const tokenData = tokenResult.recordset[0];

    if (tokenData.isExpired) {
      return res.status(410).json({
        success: false,
        message: "Token süresi dolmuş.",
      });
    }

    // Kartı güncelle - sihirbaz tamamlanırsa otomatik aktif et
    // Eğer cardData'da name var ise sihirbaz dolduruluyor demektir, otomatik aktif et
    const shouldActivate =
      cardData.name &&
      cardData.name.trim() !== "" &&
      cardData.name !== "Henüz Belirtilmedi";
    const isActiveValue = shouldActivate
      ? 1
      : cardData.isActive === true
      ? 1
      : 0;

    const updateResult = await pool
      .request()
      .input("cardId", sql.Int, tokenData.cardId)
      .input("name", sql.NVarChar, cardData.name || "")
      .input("title", sql.NVarChar, cardData.title || "")
      .input("email", sql.NVarChar, cardData.email || "")
      .input("phone", sql.NVarChar, cardData.phone || "")
      .input("website", sql.NVarChar, cardData.website || "")
      .input("address", sql.NVarChar, cardData.address || "")
      .input("bio", sql.NVarChar, cardData.bio || "")
      .input("isActive", sql.Bit, isActiveValue)
      // Yeni sosyal medya alanları
      .input("linkedinUrl", sql.NVarChar, cardData.linkedinUrl || "")
      .input("twitterUrl", sql.NVarChar, cardData.twitterUrl || "")
      .input("instagramUrl", sql.NVarChar, cardData.instagramUrl || "")
      .input("whatsappUrl", sql.NVarChar, cardData.whatsappUrl || "")
      .input("facebookUrl", sql.NVarChar, cardData.facebookUrl || "")
      .input("telegramUrl", sql.NVarChar, cardData.telegramUrl || "")
      .input("youtubeUrl", sql.NVarChar, cardData.youtubeUrl || "")
      .input("skypeUrl", sql.NVarChar, cardData.skypeUrl || "")
      .input("wechatUrl", sql.NVarChar, cardData.wechatUrl || "")
      .input("snapchatUrl", sql.NVarChar, cardData.snapchatUrl || "")
      .input("pinterestUrl", sql.NVarChar, cardData.pinterestUrl || "")
      .input("tiktokUrl", sql.NVarChar, cardData.tiktokUrl || "")
      // Yeni pazaryeri alanları
      .input("trendyolUrl", sql.NVarChar, cardData.trendyolUrl || "")
      .input("hepsiburadaUrl", sql.NVarChar, cardData.hepsiburadaUrl || "")
      .input("ciceksepeti", sql.NVarChar, cardData.ciceksepeti || "")
      .input("sahibindenUrl", sql.NVarChar, cardData.sahibindenUrl || "")
      .input("hepsiemlakUrl", sql.NVarChar, cardData.hepsiemlakUrl || "")
      .input("gittigidiyorUrl", sql.NVarChar, cardData.gittigidiyorUrl || "")
      .input("n11Url", sql.NVarChar, cardData.n11Url || "")
      .input("amazonTrUrl", sql.NVarChar, cardData.amazonTrUrl || "")
      .input("getirUrl", sql.NVarChar, cardData.getirUrl || "")
      .input("yemeksepetiUrl", sql.NVarChar, cardData.yemeksepetiUrl || "")
      .input("arabamUrl", sql.NVarChar, cardData.arabamUrl || "")
      .input("letgoUrl", sql.NVarChar, cardData.letgoUrl || "")
      .input("pttAvmUrl", sql.NVarChar, cardData.pttAvmUrl || "")
      .input("ciceksepetiUrl", sql.NVarChar, cardData.ciceksepetiUrl || "")
      .input("websiteUrl", sql.NVarChar, cardData.websiteUrl || "")
      .input(
        "whatsappBusinessUrl",
        sql.NVarChar,
        cardData.whatsappBusinessUrl || ""
      )
      .input("videoUrl", sql.NVarChar, cardData.videoUrl || "")
      .input(
        "documents",
        sql.NVarChar,
        (() => {
          const documentsJson = JSON.stringify(cardData.documents || []);
          console.log("Documents being saved:", cardData.documents);
          console.log("Documents JSON:", documentsJson);
          return documentsJson;
        })()
      ).query(`
                UPDATE Cards 
                SET name = @name,
                    title = @title,
                    email = @email,
                    phone = @phone,
                    website = @website,
                    address = @address,
                    bio = @bio,
                    isActive = @isActive,
                    linkedinUrl = @linkedinUrl,
                    twitterUrl = @twitterUrl,
                    instagramUrl = @instagramUrl,
                    whatsappUrl = @whatsappUrl,
                    facebookUrl = @facebookUrl,
                    telegramUrl = @telegramUrl,
                    youtubeUrl = @youtubeUrl,
                    skypeUrl = @skypeUrl,
                    wechatUrl = @wechatUrl,
                    snapchatUrl = @snapchatUrl,
                    pinterestUrl = @pinterestUrl,
                    tiktokUrl = @tiktokUrl,
                    trendyolUrl = @trendyolUrl,
                    hepsiburadaUrl = @hepsiburadaUrl,
                    ciceksepeti = @ciceksepeti,
                    sahibindenUrl = @sahibindenUrl,
                    hepsiemlakUrl = @hepsiemlakUrl,
                    gittigidiyorUrl = @gittigidiyorUrl,
                    n11Url = @n11Url,
                    amazonTrUrl = @amazonTrUrl,
                    getirUrl = @getirUrl,
                    yemeksepetiUrl = @yemeksepetiUrl,
                    arabamUrl = @arabamUrl,
                    letgoUrl = @letgoUrl,
                    pttAvmUrl = @pttAvmUrl,
                    ciceksepetiUrl = @ciceksepetiUrl,
                    websiteUrl = @websiteUrl,
                    whatsappBusinessUrl = @whatsappBusinessUrl,
                    videoUrl = @videoUrl,
                    documents = @documents,
                    updatedAt = GETDATE()
                WHERE id = @cardId
            `);

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Kart bulunamadı.",
      });
    }

    // Güncellenmiş kartı al
    const cardResult = await pool
      .request()
      .input("cardId", sql.Int, tokenData.cardId).query(`
                SELECT id, name, customSlug, isActive, documents 
                FROM Cards 
                WHERE id = @cardId
            `);

    // Dökümanları kontrol et
    const savedCard = cardResult.recordset[0];
    console.log("Saved card documents:", savedCard.documents);
    if (savedCard.documents) {
      try {
        const parsedDocs = JSON.parse(savedCard.documents);
        console.log("Parsed documents:", parsedDocs);
      } catch (e) {
        console.error("Documents parse error:", e);
      }
    }

    const updatedCard = cardResult.recordset[0];

    // Eğer ad/soyad güncellendi ise slug'ı güncelle
    if (cardData.name && cardData.name.trim() !== "") {
      const slugBase = cardData.name
        .toLowerCase()
        .replace(/[üğışöç]/g, (match) => {
          const map = { ü: "u", ğ: "g", ı: "i", ş: "s", ö: "o", ç: "c" };
          return map[match];
        })
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const newSlug = slugBase + "-" + Math.random().toString(36).substr(2, 6);

      await pool
        .request()
        .input("cardId", sql.Int, tokenData.cardId)
        .input("customSlug", sql.NVarChar, newSlug)
        .query(`UPDATE Cards SET customSlug = @customSlug WHERE id = @cardId`);

      updatedCard.customSlug = newSlug;
    }

    // Token'ı kullanıldı olarak işaretleme - bu işlem updateCardOwnership'de yapılacak

    res.status(200).json({
      success: true,
      data: updatedCard,
      message: "Kart başarıyla güncellendi.",
    });
  } catch (error) {
    console.error("Token ile kart güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

// Kullanıcının sihirbazlarını listele
// Kartın sahipliğini güncelle (token ile)
const updateCardOwnership = async (req, res) => {
  try {
    const { token } = req.params;
    const { newUserId } = req.body;

    if (!token || !newUserId) {
      return res.status(400).json({
        success: false,
        message: "Token ve yeni kullanıcı ID gerekli.",
      });
    }

    const pool = await getPool();

    // Önce token ile kart ID'sini bul
    const tokenResult = await pool.request().input("token", sql.NVarChar, token)
      .query(`
                SELECT cardId, isUsed FROM SimpleWizardTokens 
                WHERE token = @token
            `);

    if (tokenResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Token bulunamadı veya zaten kullanılmış.",
      });
    }

    const tokenData = tokenResult.recordset[0];
    const cardId = tokenData.cardId;

    // Token zaten kullanılmış olsa bile devam et (çünkü kart güncelleme işlemi tamamlanmış olabilir)
    console.log("🔍 Token durumu:", {
      token,
      isUsed: tokenData.isUsed,
      cardId,
    });

    // Transaction başlat
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Kartın userId'sini güncelle
      const updateResult = await transaction
        .request()
        .input("cardId", sql.Int, cardId)
        .input("newUserId", sql.Int, newUserId).query(`
                    UPDATE Cards 
                    SET userId = @newUserId, updatedAt = GETDATE()
                    WHERE id = @cardId
                `);

      if (updateResult.rowsAffected[0] === 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Kart güncellenemedi.",
        });
      }

      // Token'ı kullanıldı olarak işaretle (eğer henüz işaretlenmemişse)
      if (tokenData.isUsed === 0) {
        await transaction.request().input("token", sql.NVarChar, token).query(`
                        UPDATE SimpleWizardTokens 
                        SET isUsed = 1, usedAt = GETDATE()
                        WHERE token = @token
                    `);
      }

      // Transaction'ı commit et
      await transaction.commit();

      res.json({
        success: true,
        message: "Kart sahipliği başarıyla güncellendi.",
        data: { cardId, newUserId },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Kart sahipliği güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

// Token'ı kullanıldı olarak işaretle
const markSimpleTokenAsUsed = async (req, res) => {
  try {
    const { token } = req.params;
    const { newUserId } = req.body;

    console.log("🔍 markSimpleTokenAsUsed çağrıldı:", { token, newUserId });

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token parametresi gerekli.",
      });
    }

    if (!newUserId) {
      return res.status(400).json({
        success: false,
        message: "Yeni kullanıcı ID gerekli.",
      });
    }

    const pool = await getPool();

    // Önce token ile kart ID'sini bul
    console.log("🔍 Token ile kart ID'sini arıyor:", token);
    const tokenResult = await pool.request().input("token", sql.NVarChar, token)
      .query(`
                SELECT cardId, isUsed FROM SimpleWizardTokens 
                WHERE token = @token
            `);

    console.log("🔍 Token sonucu:", tokenResult.recordset);

    if (tokenResult.recordset.length === 0) {
      console.log("❌ Token bulunamadı");
      return res.status(404).json({
        success: false,
        message: "Token bulunamadı.",
      });
    }

    const tokenData = tokenResult.recordset[0];
    console.log("🔍 Token verisi:", tokenData);

    if (tokenData.isUsed === 1) {
      console.log("⚠️ Token zaten kullanılmış, ama işlem devam ediyor");
      // Token zaten kullanılmış olsa bile işlemi devam ettir
    }

    const cardId = tokenData.cardId;
    console.log("🔍 Kart ID:", cardId);

    // Kartın sahipliğini güncelle
    console.log("🔍 Kart sahipliğini güncelliyor:", { cardId, newUserId });
    const ownershipResult = await pool
      .request()
      .input("cardId", sql.Int, cardId)
      .input("newUserId", sql.Int, newUserId).query(`
                UPDATE Cards 
                SET userId = @newUserId, updatedAt = GETDATE()
                WHERE id = @cardId
            `);

    console.log(
      "🔍 Sahiplik güncelleme sonucu:",
      ownershipResult.rowsAffected[0]
    );

    if (ownershipResult.rowsAffected[0] === 0) {
      console.log("❌ Kart bulunamadı");
      return res.status(404).json({
        success: false,
        message: "Kart bulunamadı.",
      });
    }

    // Token'ı kullanıldı olarak işaretle
    console.log("🔍 Token'ı kullanıldı olarak işaretliyor");
    const result = await pool.request().input("token", sql.NVarChar, token)
      .query(`
                UPDATE SimpleWizardTokens 
                SET isUsed = 1, updatedAt = GETDATE()
                WHERE token = @token AND isUsed = 0
            `);

    console.log("🔍 Token işaretleme sonucu:", result.rowsAffected[0]);

    if (result.rowsAffected[0] > 0) {
      console.log(
        "✅ Token başarıyla kullanıldı ve kart sahipliği güncellendi"
      );
      res.json({
        success: true,
        message: "Token başarıyla kullanıldı ve kart sahipliği güncellendi.",
      });
    } else {
      console.log("❌ Token işaretlenemedi");
      res.status(404).json({
        success: false,
        message: "Token bulunamadı veya zaten kullanılmış.",
      });
    }
  } catch (error) {
    console.error("❌ Token işaretleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

const getUserSimpleWizards = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  if (!["admin", "corporate"].includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: "Bu işlem için yetkiniz yok.",
    });
  }

  try {
    const pool = await getPool();

    const result = await pool.request().input("createdBy", sql.Int, userId)
      .query(`
                SELECT 
                    swt.id,
                    swt.token,
                    swt.email,
                    swt.isUsed,
                    swt.expiresAt,
                    swt.createdAt,
                    c.name as cardName,
                    c.customSlug as cardSlug,
                    c.isActive as cardStatus,
                    CASE 
                        WHEN swt.expiresAt < GETDATE() THEN 1 
                        ELSE 0 
                    END as isExpired,
                    CASE 
                        WHEN swt.isUsed = 1 THEN 'Kullanıldı'
                        WHEN swt.expiresAt < GETDATE() THEN 'Süresi Dolmuş'
                        ELSE 'Aktif'
                    END as status
                FROM SimpleWizardTokens swt
                INNER JOIN Cards c ON swt.cardId = c.id
                WHERE swt.createdBy = @createdBy
                ORDER BY swt.createdAt DESC
            `);

    res.status(200).json({
      success: true,
      data: result.recordset,
      message: "Sihirbaz listesi başarıyla getirildi.",
    });
  } catch (error) {
    console.error("Sihirbaz listesi getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

// Debug/Migration endpoint - Database şemasını kontrol et ve düzelt
const debugDatabaseSchema = async (req, res) => {
  try {
    const pool = await getPool();

    console.log("🔍 Checking database schema...");

    // Cards tablosundaki kolonları listele
    const columnsResult = await pool.request().query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Cards' 
            ORDER BY ORDINAL_POSITION
        `);

    const columns = columnsResult.recordset.map((col) => ({
      name: col.COLUMN_NAME,
      type: col.DATA_TYPE,
      nullable: col.IS_NULLABLE,
    }));

    // CompanyId kolonu var mı kontrol et
    const hasCompanyId = columns.some((col) => col.name === "companyId");
    const hasPermanentSlug = columns.some(
      (col) => col.name === "permanentSlug"
    );

    let migrationResults = [];

    if (!hasCompanyId) {
      console.log("🔧 Adding companyId column...");
      try {
        await pool.request().query(`
                    ALTER TABLE Cards ADD companyId INT NULL;
                `);
        migrationResults.push("CompanyId column added successfully");

        // Foreign key constraint ekle
        try {
          await pool.request().query(`
                        ALTER TABLE Cards ADD CONSTRAINT FK_Cards_Companies 
                        FOREIGN KEY (companyId) REFERENCES Companies(id);
                    `);
          migrationResults.push("Foreign key constraint added");
        } catch (fkError) {
          migrationResults.push(
            `Foreign key constraint failed: ${fkError.message}`
          );
        }
      } catch (error) {
        migrationResults.push(`Column addition failed: ${error.message}`);
      }
    } else {
      migrationResults.push("CompanyId column already exists");
    }

    // PermanentSlug kolonu kontrolü ve ekleme
    if (!hasPermanentSlug) {
      console.log("🔧 Adding permanentSlug column...");
      try {
        await pool.request().query(`
                    ALTER TABLE Cards ADD permanentSlug NVARCHAR(255) NULL;
                `);
        migrationResults.push("PermanentSlug column added successfully");

        // Unique index ekle
        try {
          await pool.request().query(`
                        CREATE UNIQUE INDEX IX_Cards_PermanentSlug 
                        ON Cards(permanentSlug) 
                        WHERE permanentSlug IS NOT NULL;
                    `);
          migrationResults.push("PermanentSlug unique index added");
        } catch (indexError) {
          migrationResults.push(
            `PermanentSlug index failed: ${indexError.message}`
          );
        }
      } catch (error) {
        migrationResults.push(
          `PermanentSlug column addition failed: ${error.message}`
        );
      }
    } else {
      migrationResults.push("PermanentSlug column already exists");
    }

    // Yeni sosyal medya alanlarını ekle
    const newSocialMediaFields = [
      "whatsappUrl",
      "facebookUrl",
      "telegramUrl",
      "youtubeUrl",
      "skypeUrl",
      "wechatUrl",
      "snapchatUrl",
      "pinterestUrl",
      "tiktokUrl",
    ];

    const newMarketplaceFields = [
      "arabamUrl",
      "letgoUrl",
      "pttAvmUrl",
      "ciceksepetiUrl",
      "websiteUrl",
      "whatsappBusinessUrl",
      "videoUrl",
      "documents",
    ];

    const allNewFields = [...newSocialMediaFields, ...newMarketplaceFields];

    for (const field of allNewFields) {
      const hasField = columns.some((col) => col.name === field);
      if (!hasField) {
        console.log(`🔧 Adding ${field} column...`);
        try {
          await pool.request().query(`
                        ALTER TABLE Cards ADD ${field} NVARCHAR(500) NULL;
                    `);
          migrationResults.push(`${field} column added successfully`);
        } catch (error) {
          migrationResults.push(
            `${field} column addition failed: ${error.message}`
          );
        }
      } else {
        migrationResults.push(`${field} column already exists`);
      }
    }

    // Son kartları kontrol et
    const recentCardsResult = await pool.request().query(`
            SELECT TOP 5 id, cardName, name, userId, companyId, customSlug, permanentSlug, isActive, createdAt 
            FROM Cards 
            ORDER BY createdAt DESC
        `);

    res.json({
      success: true,
      data: {
        columns,
        hasCompanyId,
        hasPermanentSlug,
        migrationResults,
        recentCards: recentCardsResult.recordset,
      },
      message: "Database schema check completed",
    });
  } catch (error) {
    console.error("Database schema check error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Debug: Token arama (Herkese açık - debugging için)
const debugTokenSearch = async (req, res) => {
  try {
    const { token } = req.params;
    const pool = await getPool();

    // SimpleWizardTokens tablosunda ara
    const simpleResult = await pool
      .request()
      .input("token", sql.NVarChar, token).query(`
                    SELECT swt.*, c.customSlug, c.cardName
                    FROM SimpleWizardTokens swt
                    LEFT JOIN Cards c ON swt.cardId = c.id
                    WHERE swt.token = @token
                `);

    // WizardTokens tablosunda ara
    const wizardResult = await pool
      .request()
      .input("token", sql.NVarChar, token).query(`
                    SELECT *
                    FROM WizardTokens
                    WHERE token = @token
                `);

    res.json({
      success: true,
      data: {
        token: token,
        simpleWizardTokens: simpleResult.recordset,
        wizardTokens: wizardResult.recordset,
        foundInSimple: simpleResult.recordset.length > 0,
        foundInWizard: wizardResult.recordset.length > 0,
      },
      message: "Token arama tamamlandı.",
    });
  } catch (error) {
    console.error("Token arama hatası:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

const testPermanentSlug = async (req, res) => {
  try {
    const pool = await getPool();
    const testSlug = "71f358a2-cd21-4dfa-8ec9-6e1b2b68d35d";

    // Test different queries
    const queries = [
      {
        name: "exact_match",
        query: `SELECT id, permanentSlug FROM Cards WHERE permanentSlug = '${testSlug}'`,
      },
      {
        name: "lower_match",
        query: `SELECT id, permanentSlug FROM Cards WHERE LOWER(permanentSlug) = LOWER('${testSlug}')`,
      },
      {
        name: "like_match",
        query: `SELECT id, permanentSlug FROM Cards WHERE permanentSlug LIKE '%${testSlug}%'`,
      },
      {
        name: "all_permanent",
        query: `SELECT id, permanentSlug, LEN(permanentSlug) as len FROM Cards WHERE permanentSlug IS NOT NULL`,
      },
    ];

    const results = {};
    for (const q of queries) {
      const result = await pool.request().query(q.query);
      results[q.name] = result.recordset;
    }

    res.json({
      success: true,
      testSlug,
      results,
    });
  } catch (error) {
    console.error("Test permanent slug error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSimpleWizard,
  validateSimpleWizardToken,
  getCardByToken,
  updateCardByToken,
  updateCardOwnership,
  markSimpleTokenAsUsed,
  getUserSimpleWizards,
  debugDatabaseSchema,
  testPermanentSlug,
};
