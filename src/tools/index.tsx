import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

// Map of slug -> component (ALL 80 tools)
const toolComponents: Record<string, AnyComponent> = {
  // Finance Calculators (12)
  "emi-calculator": dynamic(() => import("./EmiCalculator")),
  "sip-calculator": dynamic(() => import("./SipCalculator")),
  "gst-calculator": dynamic(() => import("./GstCalculator")),
  "fd-calculator": dynamic(() => import("./FdCalculator")),
  "rd-calculator": dynamic(() => import("./RdCalculator")),
  "ppf-calculator": dynamic(() => import("./PpfCalculator")),
  "compound-interest-calculator": dynamic(() => import("./CompoundInterestCalculator")),
  "simple-interest-calculator": dynamic(() => import("./SimpleInterestCalculator")),
  "income-tax-calculator": dynamic(() => import("./IncomeTaxCalculator")),
  "gratuity-calculator": dynamic(() => import("./GratuityCalculator")),
  "lumpsum-calculator": dynamic(() => import("./LumpsumCalculator")),
  "salary-calculator": dynamic(() => import("./SalaryCalculator")),
  "mutual-fund-calculator": dynamic(() => import("./MutualFundCalculator")),
  "car-loan-calculator": dynamic(() => import("./CarLoanCalculator")),
  "home-loan-calculator": dynamic(() => import("./HomeLoanCalculator")),
  "education-loan-calculator": dynamic(() => import("./EducationLoanCalculator")),
  "inflation-calculator": dynamic(() => import("./InflationCalculator")),
  "cagr-calculator": dynamic(() => import("./CagrCalculator")),
  "sukanya-samriddhi-calculator": dynamic(() => import("./SukanyaSamriddhiCalculator")),
  "post-office-savings-calculator": dynamic(() => import("./PostOfficeSavingsCalculator")),

  // Math & Numbers (8)
  "percentage-calculator": dynamic(() => import("./PercentageCalculator")),
  "age-calculator": dynamic(() => import("./AgeCalculator")),
  "bmi-calculator": dynamic(() => import("./BmiCalculator")),
  "discount-calculator": dynamic(() => import("./DiscountCalculator")),
  "margin-calculator": dynamic(() => import("./MarginCalculator")),
  "average-calculator": dynamic(() => import("./AverageCalculator")),
  "number-to-words": dynamic(() => import("./NumberToWords")),
  "random-number-generator": dynamic(() => import("./RandomNumberGenerator")),

  // Text Tools (16)
  "word-counter": dynamic(() => import("./WordCounter")),
  "case-converter": dynamic(() => import("./CaseConverter")),
  "lorem-ipsum-generator": dynamic(() => import("./LoremIpsumGenerator")),
  "text-repeater": dynamic(() => import("./TextRepeater")),
  "remove-duplicate-lines": dynamic(() => import("./RemoveDuplicateLines")),
  "text-to-slug": dynamic(() => import("./TextToSlug")),
  "fancy-text-generator": dynamic(() => import("./FancyTextGenerator")),
  "text-reverser": dynamic(() => import("./TextReverser")),
  "plagiarism-checker": dynamic(() => import("./PlagiarismChecker")),
  "readability-checker": dynamic(() => import("./ReadabilityChecker")),
  "text-to-speech": dynamic(() => import("./TextToSpeech")),
  "speech-to-text": dynamic(() => import("./SpeechToText")),
  "paragraph-rewriter": dynamic(() => import("./ParagraphRewriter")),
  "grammar-checker": dynamic(() => import("./GrammarChecker")),
  "sentence-counter": dynamic(() => import("./SentenceCounter")),
  "text-encryption": dynamic(() => import("./TextEncryption")),

  // Converter Tools (8)
  "length-converter": dynamic(() => import("./LengthConverter")),
  "weight-converter": dynamic(() => import("./WeightConverter")),
  "temperature-converter": dynamic(() => import("./TemperatureConverter")),
  "speed-converter": dynamic(() => import("./SpeedConverter")),
  "data-storage-converter": dynamic(() => import("./DataStorageConverter")),
  "area-converter": dynamic(() => import("./AreaConverter")),
  "volume-converter": dynamic(() => import("./VolumeConverter")),
  "number-system-converter": dynamic(() => import("./NumberSystemConverter")),

  // Developer Tools (10)
  "json-formatter": dynamic(() => import("./JsonFormatter")),
  "base64-encoder-decoder": dynamic(() => import("./Base64Tool")),
  "url-encoder-decoder": dynamic(() => import("./UrlEncoderDecoder")),
  "html-encoder-decoder": dynamic(() => import("./HtmlEncoderDecoder")),
  "color-picker": dynamic(() => import("./ColorPicker")),
  "hash-generator": dynamic(() => import("./HashGenerator")),
  "regex-tester": dynamic(() => import("./RegexTester")),
  "css-minifier": dynamic(() => import("./CssMinifier")),
  "javascript-minifier": dynamic(() => import("./JavascriptMinifier")),
  "sql-formatter": dynamic(() => import("./SqlFormatter")),
  "cron-expression-generator": dynamic(() => import("./CronExpressionGenerator")),
  "jwt-decoder": dynamic(() => import("./JwtDecoder")),
  "json-validator": dynamic(() => import("./JsonValidator")),
  "xml-to-json": dynamic(() => import("./XmlToJson")),
  "yaml-to-json": dynamic(() => import("./YamlToJson")),
  "html-to-markdown": dynamic(() => import("./HtmlToMarkdown")),
  "markdown-to-html": dynamic(() => import("./MarkdownToHtml")),
  "code-beautifier": dynamic(() => import("./CodeBeautifier")),

  // Image Tools (14)
  "image-compressor": dynamic(() => import("./ImageCompressor")),
  "image-resizer": dynamic(() => import("./ImageResizer")),
  "image-to-png": dynamic(() => import("./ImageToPng")),
  "image-to-jpg": dynamic(() => import("./ImageToJpg")),
  "image-cropper": dynamic(() => import("./ImageCropper")),
  "qr-code-generator": dynamic(() => import("./QrCodeGenerator")),
  "screenshot-to-code": dynamic(() => import("./ScreenshotToCode")),
  "favicon-generator": dynamic(() => import("./FaviconGenerator")),
  "meme-generator": dynamic(() => import("./MemeGenerator")),
  "image-watermark": dynamic(() => import("./ImageWatermark")),
  "background-remover": dynamic(() => import("./BackgroundRemover")),
  "image-filters": dynamic(() => import("./ImageFilters")),
  "collage-maker": dynamic(() => import("./CollageMaker")),
  "image-rotate-flip": dynamic(() => import("./ImageRotateFlip")),
  "passport-photo-maker": dynamic(() => import("./PassportPhotoMaker")),
  "heic-to-jpg": dynamic(() => import("./HeicToJpg")),
  "photo-to-sketch": dynamic(() => import("./PhotoToSketch")),
  "blur-background": dynamic(() => import("./BlurBackground")),
  "photo-enhancer": dynamic(() => import("./PhotoEnhancer")),
  "image-to-webp": dynamic(() => import("./ImageToWebp")),
  "webp-to-jpg": dynamic(() => import("./WebpToJpg")),
  "webp-to-png": dynamic(() => import("./WebpToPng")),
  "instagram-grid-maker": dynamic(() => import("./InstagramGridMaker")),
  "certificate-generator": dynamic(() => import("./CertificateGenerator")),
  "thumbnail-maker": dynamic(() => import("./ThumbnailMaker")),
  "avatar-profile-pic-maker": dynamic(() => import("./AvatarProfilePicMaker")),
  "photo-frame-maker": dynamic(() => import("./PhotoFrameMaker")),
  "color-palette-extractor": dynamic(() => import("./ColorPaletteExtractor")),
  "image-to-ascii-art": dynamic(() => import("./ImageToAsciiArt")),
  "photo-color-changer": dynamic(() => import("./PhotoColorChanger")),
  "red-eye-remover": dynamic(() => import("./RedEyeRemover")),
  "old-photo-restorer": dynamic(() => import("./OldPhotoRestorer")),
  "noise-reducer": dynamic(() => import("./NoiseReducer")),
  "svg-to-png": dynamic(() => import("./SvgToPng")),
  "bulk-image-resizer": dynamic(() => import("./BulkImageResizer")),
  "image-dpi-changer": dynamic(() => import("./ImageDpiChanger")),
  "screenshot-beautifier": dynamic(() => import("./ScreenshotBeautifier")),
  "image-text-extractor-ocr": dynamic(() => import("./ImageTextExtractorOcr")),
  "image-comparison-slider": dynamic(() => import("./ImageComparisonSlider")),
  "photo-calendar-maker": dynamic(() => import("./PhotoCalendarMaker")),
  "id-card-generator": dynamic(() => import("./IdCardGenerator")),
  "business-card-maker": dynamic(() => import("./BusinessCardMaker")),
  "pixel-art-maker": dynamic(() => import("./PixelArtMaker")),
  "image-border-adder": dynamic(() => import("./ImageBorderAdder")),
  "image-format-converter": dynamic(() => import("./ImageFormatConverter")),

  // SEO Tools (8)
  "meta-tag-generator": dynamic(() => import("./MetaTagGenerator")),
  "open-graph-generator": dynamic(() => import("./OpenGraphGenerator")),
  "robots-txt-generator": dynamic(() => import("./RobotsTxtGenerator")),
  "sitemap-generator": dynamic(() => import("./SitemapGenerator")),
  "utm-link-builder": dynamic(() => import("./UtmLinkBuilder")),
  "keyword-density-checker": dynamic(() => import("./KeywordDensityChecker")),
  "schema-markup-generator": dynamic(() => import("./SchemaMarkupGenerator")),
  "twitter-card-generator": dynamic(() => import("./TwitterCardGenerator")),

  // Date & Time (8)
  "date-difference-calculator": dynamic(() => import("./DateDifferenceCalculator")),
  "countdown-timer": dynamic(() => import("./CountdownTimer")),
  "timezone-converter": dynamic(() => import("./TimezoneConverter")),
  "unix-timestamp-converter": dynamic(() => import("./UnixTimestampConverter")),
  "date-add-subtract": dynamic(() => import("./DateAddSubtract")),
  "working-days-calculator": dynamic(() => import("./WorkingDaysCalculator")),
  "stopwatch": dynamic(() => import("./Stopwatch")),
  "world-clock": dynamic(() => import("./WorldClock")),

  // Security & Privacy (11)
  "password-generator": dynamic(() => import("./PasswordGenerator")),
  "privacy-policy-generator": dynamic(() => import("./PrivacyPolicyGenerator")),
  "terms-conditions-generator": dynamic(() => import("./TermsConditionsGenerator")),
  "password-strength-checker": dynamic(() => import("./PasswordStrengthChecker")),
  "email-leak-checker": dynamic(() => import("./EmailLeakChecker")),
  "website-ssl-checker": dynamic(() => import("./WebsiteSslChecker")),
  "http-header-checker": dynamic(() => import("./HttpHeaderChecker")),
  "dns-lookup-tool": dynamic(() => import("./DnsLookupTool")),
  "whois-lookup": dynamic(() => import("./WhoisLookup")),
  "ip-geolocation": dynamic(() => import("./IpGeolocation")),
  "user-agent-parser": dynamic(() => import("./UserAgentParser")),

  // WhatsApp & UPI (5)
  "whatsapp-link-generator": dynamic(() => import("./WhatsappLinkGenerator")),
  "whatsapp-formatter": dynamic(() => import("./WhatsappFormatter")),
  "upi-qr-generator": dynamic(() => import("./UpiQrGenerator")),
  "mobile-number-tracker": dynamic(() => import("./MobileNumberTracker")),
  "ifsc-bank-details": dynamic(() => import("./IfscBankDetails")),

  // Health & Fitness (5)
  "bmr-calculator": dynamic(() => import("./BmrCalculator")),
  "calorie-calculator": dynamic(() => import("./CalorieCalculator")),
  "pregnancy-calculator": dynamic(() => import("./PregnancyCalculator")),
  "water-intake-calculator": dynamic(() => import("./WaterIntakeCalculator")),
  "body-fat-calculator": dynamic(() => import("./BodyFatCalculator")),

  // Tax & Salary India (9)
  "hra-calculator": dynamic(() => import("./HraCalculator")),
  "epf-calculator": dynamic(() => import("./EpfCalculator")),
  "nps-calculator": dynamic(() => import("./NpsCalculator")),
  "tds-calculator": dynamic(() => import("./TdsCalculator")),
  "stamp-duty-calculator": dynamic(() => import("./StampDutyCalculator")),
  "rent-receipt-generator": dynamic(() => import("./RentReceiptGenerator")),
  "salary-hike-calculator": dynamic(() => import("./SalaryHikeCalculator")),
  "electricity-bill-calculator": dynamic(() => import("./ElectricityBillCalculator")),
  "gold-price-calculator": dynamic(() => import("./GoldPriceCalculator")),

  // Fun & Utility (10)
  "typing-speed-test": dynamic(() => import("./TypingSpeedTest")),
  "love-calculator": dynamic(() => import("./LoveCalculator")),
  "flip-a-coin": dynamic(() => import("./FlipACoin")),
  "roll-a-dice": dynamic(() => import("./RollADice")),
  "pomodoro-timer": dynamic(() => import("./PomodoroTimer")),
  "scientific-calculator": dynamic(() => import("./ScientificCalculator")),
  "fuel-cost-calculator": dynamic(() => import("./FuelCostCalculator")),
  "tip-calculator": dynamic(() => import("./TipCalculator")),
  "screen-resolution-checker": dynamic(() => import("./ScreenResolutionChecker")),
  "ip-address-lookup": dynamic(() => import("./IpAddressLookup")),

  // CSS & Design (6)
  "css-gradient-generator": dynamic(() => import("./CssGradientGenerator")),
  "box-shadow-generator": dynamic(() => import("./BoxShadowGenerator")),
  "border-radius-generator": dynamic(() => import("./BorderRadiusGenerator")),
  "color-palette-generator": dynamic(() => import("./ColorPaletteGenerator")),
  "glassmorphism-generator": dynamic(() => import("./GlassmorphismGenerator")),
  "text-shadow-generator": dynamic(() => import("./TextShadowGenerator")),

  // Data Tools (6)
  "json-to-csv": dynamic(() => import("./JsonToCsv")),
  "csv-to-json": dynamic(() => import("./CsvToJson")),
  "text-diff-checker": dynamic(() => import("./TextDiffChecker")),
  "markdown-preview": dynamic(() => import("./MarkdownPreview")),
  "image-to-base64": dynamic(() => import("./ImageToBase64")),
  "aspect-ratio-calculator": dynamic(() => import("./AspectRatioCalculator")),

  // Social Media (6)
  "instagram-bio-generator": dynamic(() => import("./InstagramBioGenerator")),
  "hashtag-generator": dynamic(() => import("./HashtagGenerator")),
  "social-media-image-resizer": dynamic(() => import("./SocialMediaImageResizer")),
  "tweet-character-counter": dynamic(() => import("./TweetCharacterCounter")),
  "youtube-timestamp-generator": dynamic(() => import("./YouTubeTimestampGenerator")),
  "youtube-thumbnail-downloader": dynamic(() => import("./YouTubeThumbnailDownloader")),

  // Education (5)
  "gpa-calculator": dynamic(() => import("./GpaCalculator")),
  "cgpa-to-percentage": dynamic(() => import("./CgpaToPercentage")),
  "percentage-to-cgpa": dynamic(() => import("./PercentageToCgpa")),
  "grade-calculator": dynamic(() => import("./GradeCalculator")),
  "study-time-planner": dynamic(() => import("./StudyTimePlanner")),

  // Business (8)
  "gst-invoice-generator": dynamic(() => import("./GstInvoiceGenerator")),
  "business-name-generator": dynamic(() => import("./BusinessNameGenerator")),
  "profit-loss-calculator": dynamic(() => import("./ProfitLossCalculator")),
  "break-even-calculator": dynamic(() => import("./BreakEvenCalculator")),
  "roi-calculator": dynamic(() => import("./RoiCalculator")),
  "home-loan-affordability": dynamic(() => import("./HomeLoanAffordability")),
  "rent-vs-buy-calculator": dynamic(() => import("./RentVsBuyCalculator")),
  "carpet-area-calculator": dynamic(() => import("./CarpetAreaCalculator")),

  // PDF Tools (8)
  "pdf-to-word": dynamic(() => import("./PdfToWord")),
  "word-to-pdf": dynamic(() => import("./WordToPdf")),
  "merge-pdf": dynamic(() => import("./MergePdf")),
  "split-pdf": dynamic(() => import("./SplitPdf")),
  "compress-pdf": dynamic(() => import("./CompressPdf")),
  "image-to-pdf": dynamic(() => import("./ImageToPdf")),
  "pdf-to-image": dynamic(() => import("./PdfToImage")),
  "pdf-page-remover": dynamic(() => import("./PdfPageRemover")),

  // Converter Tools (additional 8)
  "currency-converter": dynamic(() => import("./CurrencyConverter")),
  "bytes-converter": dynamic(() => import("./BytesConverter")),
  "hex-to-rgb": dynamic(() => import("./HexToRgb")),
  "decimal-to-binary": dynamic(() => import("./DecimalToBinary")),
  "pixels-to-rem": dynamic(() => import("./PixelsToRem")),
  "feet-to-meters": dynamic(() => import("./FeetToMeters")),
  "liters-to-gallons": dynamic(() => import("./LitersToGallons")),
  "acres-to-sqfeet": dynamic(() => import("./AcresToSqFeet")),

  // Everyday Utility (8)
  "vehicle-number-info": dynamic(() => import("./VehicleNumberInfo")),
  "ifsc-code-lookup": dynamic(() => import("./IfscCodeLookup")),
  "pin-code-lookup": dynamic(() => import("./PinCodeLookup")),
  "pan-card-validator": dynamic(() => import("./PanCardValidator")),
  "aadhaar-validator": dynamic(() => import("./AadhaarValidator")),
  "gst-number-validator": dynamic(() => import("./GstNumberValidator")),
  "indian-railway-pnr": dynamic(() => import("./IndianRailwayPnr")),
  "ration-card-info": dynamic(() => import("./RationCardInfo")),

  // Fun & Games (additional 8)
  "random-name-generator": dynamic(() => import("./RandomNameGenerator")),
  "baby-name-generator": dynamic(() => import("./BabyNameGenerator")),
  "numerology-calculator": dynamic(() => import("./NumerologyCalculator")),
  "lucky-number-generator": dynamic(() => import("./LuckyNumberGenerator")),
  "would-you-rather": dynamic(() => import("./WouldYouRather")),
  "truth-or-dare": dynamic(() => import("./TruthOrDare")),
  "quote-generator": dynamic(() => import("./QuoteGenerator")),
  "nickname-generator": dynamic(() => import("./NicknameGenerator")),

  // SEO & Marketing (additional 6)
  "serp-preview": dynamic(() => import("./SerpPreview")),
  "headline-analyzer": dynamic(() => import("./HeadlineAnalyzer")),
  "backlink-checker": dynamic(() => import("./BacklinkChecker")),
  "domain-age-checker": dynamic(() => import("./DomainAgeChecker")),
  "page-speed-estimator": dynamic(() => import("./PageSpeedEstimator")),
  "sitemap-validator": dynamic(() => import("./SitemapValidator")),

  // Health & Fitness (additional 8)
  "blood-alcohol-calculator": dynamic(() => import("./BloodAlcoholCalculator")),
  "heart-rate-zone-calculator": dynamic(() => import("./HeartRateZoneCalculator")),
  "macro-calculator": dynamic(() => import("./MacroCalculator")),
  "ideal-weight-calculator": dynamic(() => import("./IdealWeightCalculator")),
  "protein-intake-calculator": dynamic(() => import("./ProteinIntakeCalculator")),
  "sleep-calculator": dynamic(() => import("./SleepCalculator")),
  "blood-pressure-checker": dynamic(() => import("./BloodPressureChecker")),
  "menstrual-cycle-calculator": dynamic(() => import("./MenstrualCycleCalculator")),

  // Real Estate (6)
  "plot-area-calculator": dynamic(() => import("./PlotAreaCalculator")),
  "paint-calculator": dynamic(() => import("./PaintCalculator")),
  "tile-calculator": dynamic(() => import("./TileCalculator")),
  "brick-calculator": dynamic(() => import("./BrickCalculator")),
  "cement-calculator": dynamic(() => import("./CementCalculator")),
  "interior-cost-estimator": dynamic(() => import("./InteriorCostEstimator")),

  // Electrical & Engineering (6)
  "wire-size-calculator": dynamic(() => import("./WireSizeCalculator")),
  "voltage-drop-calculator": dynamic(() => import("./VoltageDropCalculator")),
  "power-consumption-calculator": dynamic(() => import("./PowerConsumptionCalculator")),
  "ohms-law-calculator": dynamic(() => import("./OhmsLawCalculator")),
  "transformer-calculator": dynamic(() => import("./TransformerCalculator")),
  "solar-panel-calculator": dynamic(() => import("./SolarPanelCalculator")),

  // Cooking & Kitchen (5)
  "recipe-unit-converter": dynamic(() => import("./RecipeUnitConverter")),
  "cooking-time-calculator": dynamic(() => import("./CookingTimeCalculator")),
  "indian-food-calorie-counter": dynamic(() => import("./IndianFoodCalorieCounter")),
  "gas-cylinder-calculator": dynamic(() => import("./GasCylinderCalculator")),
  "water-tds-calculator": dynamic(() => import("./WaterTdsCalculator")),

  // Wedding & Events (5)
  "wedding-budget-calculator": dynamic(() => import("./WeddingBudgetCalculator")),
  "guest-list-manager": dynamic(() => import("./GuestListManager")),
  "wedding-date-finder": dynamic(() => import("./WeddingDateFinder")),
  "gift-registry-calculator": dynamic(() => import("./GiftRegistryCalculator")),
  "event-checklist-generator": dynamic(() => import("./EventChecklistGenerator")),

  // Agriculture (6)
  "crop-yield-calculator": dynamic(() => import("./CropYieldCalculator")),
  "fertilizer-calculator": dynamic(() => import("./FertilizerCalculator")),
  "land-measurement-converter": dynamic(() => import("./LandMeasurementConverter")),
  "irrigation-calculator": dynamic(() => import("./IrrigationCalculator")),
  "farm-profit-calculator": dynamic(() => import("./FarmProfitCalculator")),
  "seed-rate-calculator": dynamic(() => import("./SeedRateCalculator")),

  // Exam & Competitive (8)
  "marks-percentage-calculator": dynamic(() => import("./MarksPercentageCalculator")),
  "neet-score-predictor": dynamic(() => import("./NeetScorePredictor")),
  "jee-rank-predictor": dynamic(() => import("./JeeRankPredictor")),
  "gate-score-calculator": dynamic(() => import("./GateScoreCalculator")),
  "cat-percentile-calculator": dynamic(() => import("./CatPercentileCalculator")),
  "board-percentage-calculator": dynamic(() => import("./BoardPercentageCalculator")),
  "scholarship-eligibility-checker": dynamic(() => import("./ScholarshipEligibilityChecker")),
  "college-fee-calculator": dynamic(() => import("./CollegeFeeCalculator")),

  // Vehicle & Transport (6)
  "mileage-calculator": dynamic(() => import("./MileageCalculator")),
  "road-trip-planner": dynamic(() => import("./RoadTripPlanner")),
  "car-insurance-estimator": dynamic(() => import("./CarInsuranceEstimator")),
  "tyre-size-calculator": dynamic(() => import("./TyreSizeCalculator")),
  "vehicle-depreciation-calculator": dynamic(() => import("./VehicleDepreciationCalculator")),
  "toll-calculator": dynamic(() => import("./TollCalculator")),

  // Astrology & Spiritual (6)
  "kundli-calculator": dynamic(() => import("./KundliCalculator")),
  "rashi-calculator": dynamic(() => import("./RashiCalculator")),
  "nakshatra-calculator": dynamic(() => import("./NakshatraCalculator")),
  "panchang-calculator": dynamic(() => import("./PanchangCalculator")),
  "name-numerology-calculator": dynamic(() => import("./NameNumerologyCalculator")),
  "gemstone-recommendation": dynamic(() => import("./GemstoneRecommendation")),

  // Banking & Finance (additional 6)
  "fd-comparison": dynamic(() => import("./FdComparison")),
  "credit-score-estimator": dynamic(() => import("./CreditScoreEstimator")),
  "loan-eligibility-calculator": dynamic(() => import("./LoanEligibilityCalculator")),
  "swp-calculator": dynamic(() => import("./SwpCalculator")),
  "elss-tax-calculator": dynamic(() => import("./ElssTaxCalculator")),
  "pension-calculator": dynamic(() => import("./PensionCalculator")),

  // Legal & Government (5)
  "court-fee-calculator": dynamic(() => import("./CourtFeeCalculator")),
  "legal-notice-generator": dynamic(() => import("./LegalNoticeGenerator")),
  "rti-application-generator": dynamic(() => import("./RtiApplicationGenerator")),
  "affidavit-generator": dynamic(() => import("./AffidavitGenerator")),
  "voter-id-info": dynamic(() => import("./VoterIdInfo")),

  // Additional tools
  "indian-calendar": dynamic(() => import("./IndianCalendar")),
  "unit-price-calculator": dynamic(() => import("./UnitPriceCalculator")),
  "emi-bridge-calculator": dynamic(() => import("./EmiBridgeCalculator")),
  "split-bill-calculator": dynamic(() => import("./SplitBillCalculator")),
  "age-on-planet-calculator": dynamic(() => import("./AgeOnPlanetCalculator")),

  // AI Writing Tools (16)
  "ai-paragraph-rewriter": dynamic(() => import("./AiParagraphRewriter")),
  "ai-text-summarizer": dynamic(() => import("./AiTextSummarizer")),
  "ai-story-generator": dynamic(() => import("./AiStoryGenerator")),
  "ai-email-writer": dynamic(() => import("./AiEmailWriter")),
  "ai-bio-generator": dynamic(() => import("./AiBioGenerator")),
  "ai-slogan-generator": dynamic(() => import("./AiSloganGenerator")),
  "ai-blog-title-generator": dynamic(() => import("./AiBlogTitleGenerator")),
  "ai-cover-letter-generator": dynamic(() => import("./AiCoverLetterGenerator")),
  "ai-resume-bullet-points": dynamic(() => import("./AiResumeBulletPoints")),
  "ai-product-description": dynamic(() => import("./AiProductDescription")),
  "ai-social-caption-generator": dynamic(() => import("./AiSocialCaptionGenerator")),
  "ai-thank-you-note": dynamic(() => import("./AiThankYouNote")),
  "ai-apology-letter": dynamic(() => import("./AiApologyLetter")),
  "ai-wedding-invitation": dynamic(() => import("./AiWeddingInvitation")),
  "ai-youtube-script-outline": dynamic(() => import("./AiYoutubeScriptOutline")),
  "ai-interview-questions": dynamic(() => import("./AiInterviewQuestions")),
  "ai-essay-writer": dynamic(() => import("./AiEssayWriter")),
  "ai-paragraph-completer": dynamic(() => import("./AiParagraphCompleter")),
  "ai-article-outline-generator": dynamic(() => import("./AiArticleOutlineGenerator")),
  "ai-poem-generator": dynamic(() => import("./AiPoemGenerator")),
  "ai-formal-letter-writer": dynamic(() => import("./AiFormalLetterWriter")),
  "ai-speech-writer": dynamic(() => import("./AiSpeechWriter")),
  "ai-hashtag-generator-pro": dynamic(() => import("./AiHashtagGeneratorPro")),
  "ai-ad-copy-generator": dynamic(() => import("./AiAdCopyGenerator")),
  "ai-meta-description-generator": dynamic(() => import("./AiMetaDescriptionGenerator")),
  "ai-linkedin-post-generator": dynamic(() => import("./AiLinkedinPostGenerator")),
  "ai-whatsapp-message-writer": dynamic(() => import("./AiWhatsappMessageWriter")),
  "ai-complaint-letter-generator": dynamic(() => import("./AiComplaintLetterGenerator")),

  // AI Writing Tools (additional 13)
  "ai-birthday-wish-generator": dynamic(() => import("./AiBirthdayWishGenerator")),
  "ai-love-letter-generator": dynamic(() => import("./AiLoveLetterGenerator")),
  "ai-breakup-text-generator": dynamic(() => import("./AiBreakupTextGenerator")),
  "ai-pickup-line-generator": dynamic(() => import("./AiPickupLineGenerator")),
  "ai-rap-lyrics-generator": dynamic(() => import("./AiRapLyricsGenerator")),
  "ai-motivational-quote-generator": dynamic(() => import("./AiMotivationalQuoteGenerator")),
  "ai-tone-changer": dynamic(() => import("./AiToneChanger")),
  "ai-bullets-to-paragraph": dynamic(() => import("./AiBulletsToParag")),
  "ai-paragraph-to-bullets": dynamic(() => import("./AiParagToBullets")),
  "ai-text-expander": dynamic(() => import("./AiTextExpander")),
  "ai-cold-email-generator": dynamic(() => import("./AiColdEmailGenerator")),
  "ai-testimonial-generator": dynamic(() => import("./AiTestimonialGenerator")),
  "ai-press-release-generator": dynamic(() => import("./AiPressReleaseGenerator")),
  "ai-about-us-generator": dynamic(() => import("./AiAboutUsGenerator")),
  "ai-assignment-helper": dynamic(() => import("./AiAssignmentHelper")),
  "ai-explain-simply": dynamic(() => import("./AiExplainSimply")),
  "ai-flashcard-generator": dynamic(() => import("./AiFlashcardGenerator")),
  "ai-job-description-generator": dynamic(() => import("./AiJobDescriptionGenerator")),
  "ai-math-solver": dynamic(() => import("./AiMathSolver")),
  "ai-meeting-notes-summarizer": dynamic(() => import("./AiMeetingNotesSummarizer")),
  "ai-quiz-generator": dynamic(() => import("./AiQuizGenerator")),
  "ai-study-notes-generator": dynamic(() => import("./AiStudyNotesGenerator")),

  // Science & Math (10)
  "graphing-calculator": dynamic(() => import("./GraphingCalculator")),
  "matrix-calculator": dynamic(() => import("./MatrixCalculator")),
  "fraction-calculator": dynamic(() => import("./FractionCalculator")),
  "quadratic-solver": dynamic(() => import("./QuadraticSolver")),
  "prime-number-checker": dynamic(() => import("./PrimeNumberChecker")),
  "statistics-calculator": dynamic(() => import("./StatisticsCalculator")),
  "probability-calculator": dynamic(() => import("./ProbabilityCalculator")),
  "algebra-solver": dynamic(() => import("./AlgebraSolver")),
  "trig-calculator": dynamic(() => import("./TrigCalculator")),
  "binary-calculator": dynamic(() => import("./BinaryCalculator")),

  // Construction (10)
  "concrete-calculator": dynamic(() => import("./ConcreteCalculator")),
  "steel-weight-calculator": dynamic(() => import("./SteelWeightCalculator")),
  "plywood-calculator": dynamic(() => import("./PlywoodCalculator")),
  "flooring-cost-calculator": dynamic(() => import("./FlooringCostCalculator")),
  "water-tank-calculator": dynamic(() => import("./WaterTankCalculator")),
  "staircase-calculator": dynamic(() => import("./StaircaseCalculator")),
  "roof-area-calculator": dynamic(() => import("./RoofAreaCalculator")),
  "pipe-size-calculator": dynamic(() => import("./PipeSizeCalculator")),
  "electrical-load-calculator": dynamic(() => import("./ElectricalLoadCalculator")),
  "room-paint-visualizer": dynamic(() => import("./RoomPaintVisualizer")),

  // Data & Charts (7)
  "chart-maker": dynamic(() => import("./ChartMaker")),
  "table-generator": dynamic(() => import("./TableGenerator")),
  "flowchart-maker": dynamic(() => import("./FlowchartMaker")),
  "mind-map-generator": dynamic(() => import("./MindMapGenerator")),
  "csv-viewer-editor": dynamic(() => import("./CsvViewerEditor")),
  "sql-table-generator": dynamic(() => import("./SqlTableGenerator")),
  "json-to-table-viewer": dynamic(() => import("./JsonToTableViewer")),

  // Advanced CSS & SEO Tools (8)
  "css-grid-generator": dynamic(() => import("./CssGridGenerator")),
  "flexbox-playground": dynamic(() => import("./FlexboxPlayground")),
  "tailwind-generator": dynamic(() => import("./TailwindGenerator")),
  "svg-editor": dynamic(() => import("./SvgEditor")),
  "structured-data-generator": dynamic(() => import("./StructuredDataGenerator")),
  "htaccess-generator": dynamic(() => import("./HtaccessGenerator")),
  "redirect-checker": dynamic(() => import("./RedirectChecker")),
  "website-speed-estimator": dynamic(() => import("./WebsiteSpeedEstimator")),

  // Career Tools (7)
  "resume-builder": dynamic(() => import("./ResumeBuilder")),
  "resume-score-checker": dynamic(() => import("./ResumeScoreChecker")),
  "salary-comparison-tool": dynamic(() => import("./SalaryComparisonTool")),
  "notice-period-calculator": dynamic(() => import("./NoticePeriodCalculator")),
  "experience-calculator": dynamic(() => import("./ExperienceCalculator")),
  "appraisal-hike-calculator": dynamic(() => import("./AppraisalHikeCalculator")),
  "in-hand-salary-calculator": dynamic(() => import("./InHandSalaryCalculator")),

  // Shopping Tools (5)
  "advanced-discount-calculator": dynamic(() => import("./AdvancedDiscountCalculator")),
  "gst-inclusive-exclusive": dynamic(() => import("./GstInclusiveExclusive")),
  "emi-affordability-calculator": dynamic(() => import("./EmiAffordabilityCalculator")),
  "price-per-unit-comparator": dynamic(() => import("./PricePerUnitComparator")),
  "cashback-calculator": dynamic(() => import("./CashbackCalculator")),

  // Student Tools (5)
  "graph-paper-generator": dynamic(() => import("./GraphPaperGenerator")),
  "flashcard-maker": dynamic(() => import("./FlashcardMaker")),
  "timetable-generator": dynamic(() => import("./TimetableGenerator")),
  "handwriting-page-generator": dynamic(() => import("./HandwritingPageGenerator")),
  "assignment-word-counter": dynamic(() => import("./AssignmentWordCounter")),

  // India Guide (10)
  "aadhaar-masked-generator": dynamic(() => import("./AadhaarMaskedGenerator")),
  "indian-festival-calendar": dynamic(() => import("./IndianFestivalCalendar")),
  "train-seat-layout": dynamic(() => import("./TrainSeatLayout")),
  "indian-pin-code-directory": dynamic(() => import("./IndianPinCodeDirectory")),
  "lpg-subsidy-calculator": dynamic(() => import("./LpgSubsidyCalculator")),
  "electricity-rate-finder": dynamic(() => import("./ElectricityRateFinder")),
  "wedding-food-calculator": dynamic(() => import("./WeddingFoodCalculator")),
  "emi-vs-rent-calculator": dynamic(() => import("./EmiVsRentCalculator")),
  "indian-name-meaning": dynamic(() => import("./IndianNameMeaning")),
  "govt-scheme-checker": dynamic(() => import("./GovtSchemeChecker")),
};

function ComingSoonWrapper({ name }: { name: string }) {
  const ComingSoon = dynamic(() => import("./ComingSoon"));
  return <ComingSoon name={name} />;
}

export function getToolComponent(slug: string): AnyComponent {
  if (toolComponents[slug]) return toolComponents[slug];
  const displayName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return () => <ComingSoonWrapper name={displayName} />;
}
