-- Cards tablosuna pazaryeri alanları ekleme
ALTER TABLE Cards ADD 
    trendyolUrl NVARCHAR(500) NULL,
    hepsiburadaUrl NVARCHAR(500) NULL,
    ciceksepeti NVARCHAR(500) NULL,
    sahibindenUrl NVARCHAR(500) NULL,
    hepsiemlakUrl NVARCHAR(500) NULL,
    gittigidiyorUrl NVARCHAR(500) NULL,
    n11Url NVARCHAR(500) NULL,
    amazonTrUrl NVARCHAR(500) NULL,
    getirUrl NVARCHAR(500) NULL,
    yemeksepetiUrl NVARCHAR(500) NULL; 