(function() {
  try {
    var capApp = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (capApp) {
      capApp.addListener('appUrlOpen', function(data) {
        if (data && data.url && data.url !== location.href) location.href = data.url;
      });
    }
  } catch (e) {}
})();

const T = {
  ar: {
    nav_home:'الرئيسية', nav_about:'من نحن', nav_contact:'تواصل معنا',
    back:'← العودة للرئيسية', footer_about:'من نحن', footer_contact:'تواصل معنا',
    footer_copy:'© 2026 أدواتي — أدوات مجانية، ومعظمها يعمل داخل متصفحك',
    hero_title:'أدوات مجانية أونلاين للحساب والتحويل والإنتاجية',
    hero_sub:'احسب، حوّل، أنشئ واستخدم أدوات مجانية مباشرة من متصفحك — بدون تثبيت، تعمل على الهاتف والكمبيوتر',
    jo_hero_title:'أدوات مجانية للأردن — حاسبات وأدوات لكل يوم',
    jo_hero_sub:'تحويل JOD، حاسبة القسط، المحول الهجري، BMI و40+ أداة مجانية — فورية، بدون تسجيل.',
    cat_kids:'🧒 أطفال', cat_jo_education:'🎓 تعليم', cat_challenges:'🏆 تحديات',
    cat_taxes:'🧾 ضرائب', cat_decisions:'⚖️ قرارات', cat_cars:'🚗 سيارات', cat_daily:'📅 يوميات',
    jo_hero_label:'🇯🇴 أدوات مجانية للمقيمين في الأردن', jo_badge_loan:'🧮 حاسبة القسط', jo_badge_free:'✅ مجاني 100%',
    badge_count:'40+ أداة', badge_free:'مجانية 100%', badge_noreg:'بدون تسجيل', badge_privacy:'معالجة محلية',
cty_global:'العالمي', cty_om:'عمان', cty_ae:'الإمارات', cty_sa:'السعودية', cty_us:'أمريكا', cty_uk:'بريطانيا', cty_jo:'الأردن', cty_in:'الهند', cty_pk:'باكستان', cty_bd:'بنغلاديش', cty_eg:'مصر', cty_ph:'الفلبين', badge_privacy_full:'معظم الأدوات تعمل محلياً في متصفحك', badge_count_full:'+40 أداة ودليل',
    bmi_card_title:'حاسبة مؤشر الجسم', bmi_card_desc:'احسب مؤشر كتلة جسمك واعرف وضعك الصحي',
    diet_card_title:'حاسبة السعرات والخطة الغذائية', diet_card_desc:'احسب احتياجك اليومي + خطة غذائية كاملة',
    loan_card_title:'حاسبة القسط الشهري', loan_card_desc:'احسب قسط أي قرض أو تمويل بسهولة',
    age_card_title:'حاسبة العمر', age_card_desc:'عمرك بالتفصيل — سنوات وأشهر وأيام',
    discount_card_title:'حاسبة نسبة وخصم', discount_card_desc:'احسب النسب المئوية والخصومات بسرعة',
    unit_card_title:'محول الوحدات', unit_card_desc:'حول بين وحدات الطول والوزن والحرارة',
    pass_card_title:'مولد كلمات المرور', pass_card_desc:'كلمات مرور قوية وآمنة بضغطة واحدة',
    word_card_title:'عداد الكلمات والأحرف', word_card_desc:'عداد فوري لمقالاتك ونصوصك',
    start:'ابدأ ←',
    bmi_title:'حاسبة مؤشر كتلة الجسم', bmi_sub:'اعرف وضعك الصحي في ثانية',
    bmi_weight:'الوزن (كيلوغرام)', bmi_height:'الطول (سنتيمتر)', bmi_btn:'احسب المؤشر',
    bmi_underweight:'نقص في الوزن', bmi_normal:'وزن طبيعي ✓', bmi_overweight:'زيادة في الوزن', bmi_obese:'سمنة', bmi_invalid:'الرجاء إدخال أرقام صحيحة',
    age_title:'حاسبة العمر', age_sub:'عمرك بالتفصيل — سنوات وأشهر وأيام',
    age_label:'تاريخ ميلادك', age_btn:'احسب عمري',
    age_years:'سنة', age_months:'شهر', age_days:'يوم', age_total:'إجمالي الأيام', age_next:'يوم حتى عيد ميلادك', age_alert:'اختر تاريخ ميلادك',
    loan_title:'حاسبة القسط الشهري', loan_sub:'احسب قسط أي قرض أو تمويل',
    loan_amount:'مبلغ القرض', loan_rate:'نسبة الفائدة السنوية %', loan_years:'مدة السداد (بالسنوات)',
    loan_monthly:'القسط الشهري', loan_total:'إجمالي المدفوع', loan_interest:'إجمالي الفائدة',
    discount_title:'حاسبة نسبة وخصم', discount_sub:'احسب النسب المئوية والخصومات بسرعة',
    tab_percent:'نسبة مئوية', tab_discount:'خصم',
    percent_label1:'ما هي', percent_label2:'% من الرقم',
    discount_label1:'السعر الأصلي', discount_label2:'نسبة الخصم %',
    unit_title:'محول الوحدات', unit_sub:'حول بين وحدات الطول والوزن',
    tab_length:'الطول', tab_weight:'الوزن', unit_value:'القيمة', unit_from:'من', unit_to:'إلى',
    pass_title:'مولد كلمات المرور', pass_sub:'كلمات مرور قوية وآمنة بضغطة واحدة',
    pass_length:'الطول:', pass_numbers:'أرقام (0–9)', pass_symbols:'رموز (!@#$)', pass_upper:'الأحرف الكبيرة',
    pass_btn:'توليد كلمة مرور جديدة', pass_copied:'تم النسخ ✓',
    word_title:'عداد الكلمات والأحرف', word_sub:'عداد فوري لمقالاتك ونصوصك',
    word_words:'كلمة', word_chars:'حرف', word_nospace:'بدون مسافات', word_sentences:'جملة',
    diet_title:'حاسبة السعرات والخطة الغذائية', diet_sub:'احسب احتياجك اليومي من السعرات والبروتين والكربوهيدرات',
    diet_gender:'الجنس', diet_male:'ذكر', diet_female:'أنثى',
    diet_age:'العمر', diet_weight:'الوزن (كغم)', diet_height:'الطول (سم)',
    diet_activity:'مستوى النشاط', diet_goal:'الهدف', diet_btn:'احسب احتياجي اليومي',
    diet_calories:'سعرة حرارية يومياً', diet_protein:'بروتين (غ)', diet_carb:'كارب (غ)', diet_fat:'دهون (غ)',
    diet_act1:'قليل الحركة (مكتبي)', diet_act2:'نشاط خفيف (1–3 أيام رياضة)',
    diet_act3:'نشاط متوسط (3–5 أيام رياضة)', diet_act4:'نشاط عالي (6–7 أيام رياضة)', diet_act5:'نشاط عالي جداً (رياضي / عمل بدني)',
    diet_goal1:'نزول وزن', diet_goal2:'ثبات الوزن', diet_goal3:'زيادة وزن',
    diet_goal4:'تنشيف الجسم', diet_goal5:'شد الجسم', diet_goal6:'زيادة كتلة العضلات',
    diet_free_badge:'🎉 عرض خاص — أول 21 يوم مجاناً تماماً!',
    diet_pro_title:'🔒 الخطة الغذائية الكاملة',
    diet_pro_f1:'جدول وجبات يومي مفصّل (7 أيام)', diet_pro_f2:'قائمة بدائل الأطعمة حسب ذوقك',
    diet_pro_f3:'ملف قابل للطباعة والتنزيل', diet_pro_f4:'تحديث أسبوعي حسب تقدمك',
    diet_trial:'21 يوم مجاناً • بدون بطاقة ائتمانية', diet_pro_btn:'ابدأ تجربتك المجانية الآن',
    diet_alert:'الرجاء تعبئة العمر والوزن والطول',
    about_title:'من نحن', about_sub:'قصة أدواتي',
    about_p1:'موقع "أدواتي" هو مجموعة أدوات إلكترونية مجانية وبسيطة، صُممت لمساعدتك في إنجاز حسابات ومهام يومية بسرعة وبدون تعقيد.',
    about_p2:'هدفنا تقديم أدوات دقيقة وسهلة الاستخدام على أي جهاز، مع الحفاظ على خصوصية بياناتك — كل الحسابات تتم مباشرة على متصفحك.',
    about_p3:'الموقع في تطوير مستمر، ونضيف أدوات جديدة بشكل دوري بناءً على احتياجات المستخدمين.',
    contact_title:'تواصل معنا', contact_sub:'عندك اقتراح لأداة جديدة أو واجهت مشكلة؟ راسلنا',
    contact_name:'الاسم', contact_email:'البريد الإلكتروني', contact_msg:'رسالتك',
    contact_btn:'إرسال الرسالة', contact_error:'الرجاء تعبئة جميع الحقول', contact_email_invalid:'البريد الإلكتروني غير صحيح',
    word_placeholder:'اكتب أو الصق نصك هنا...',
    signup_btn:'تسجيل', signup_title:'إنشاء حساب مجاني', signup_name:'الاسم', signup_email:'البريد الإلكتروني',
    signup_submit:'إنشاء الحساب', signup_welcome:'مرحباً', signup_logout:'خروج',
    signup_note:'اختياري — احفظ إعداداتك على هذا الجهاز',
    auth_password:'كلمة السر', auth_google_btn:'الدخول عبر Google', auth_switch_to_login:'عندك حساب؟ سجل دخول',
    auth_switch_to_signup:'ما عندك حساب؟ أنشئ واحد', auth_or:'أو',
    auth_error_weak_password:'كلمة السر لازم تكون 6 أحرف عالأقل', auth_error_wrong_password:'البريد الإلكتروني أو كلمة السر غلط',
    auth_error_email_in_use:'هاد البريد الإلكتروني مستخدم قبل', auth_syncing:'جاري مزامنة المفضلة...', auth_signin_title:'تسجيل الدخول',
    hero_label:'أدوات مجانية وسريعة للاستخدام اليومي',
    badge_langs:'6 لغات', stat_tools:'أداة مجانية', stat_games:'🎮 ألعاب', stat_langs:'لغات مدعومة',
    stat_private:'معالجة محلية', stat_available:'متاح دائماً',
    section_tools:'جميع الأدوات', section_tools_sub:'اختر الأداة التي تحتاجها',
    footer_desc:'معظم الأدوات تعمل محلياً في متصفحك، وبعض الأدوات تستخدم خدمات خارجية لتوفير البيانات. مجاني 100%، بدون تسجيل.',
    footer_tools_title:'الأدوات', footer_more_title:'المزيد', footer_links_title:'روابط',
    currency_card_title:'محول العملات', currency_card_desc:'حول بين أكثر من 30 عملة عالمية بأسعار حية',
    tip_card_title:'حاسبة الإكرامية', tip_card_desc:'احسب الإكرامية وقسّم الفاتورة بين الأصدقاء',
    qr_card_title:'مولد رمز QR', qr_card_desc:'ولّد رمز QR لأي رابط أو نص فوراً',
    tz_card_title:'محول المناطق الزمنية', tz_card_desc:'اعرف الوقت في أي مدينة حول العالم',
    rng_card_title:'مولد أرقام عشوائية', rng_card_desc:'ولّد أرقاماً عشوائية للقرعات والألعاب',
    sw_card_title:'ساعة إيقاف ومؤقت', sw_card_desc:'ساعة توقيت ومؤقت احترافي للتمارين والعمل',
    currency_title:'محول العملات', currency_sub:'أسعار صرف حية من الإنترنت',
    currency_amount:'المبلغ', currency_from:'من', currency_to:'إلى',
    currency_loading:'جاري تحميل الأسعار...', currency_offline:'تعذّر تحميل الأسعار — تأكد من اتصالك بالإنترنت',
    tip_title:'حاسبة الإكرامية', tip_sub:'احسب الإكرامية وقسّم الفاتورة بسهولة',
    tip_bill:'إجمالي الفاتورة', tip_pct:'نسبة الإكرامية:', tip_people:'عدد الأشخاص',
    tip_amount:'الإكرامية', tip_total:'الإجمالي', tip_per_person:'للشخص الواحد',
    qr_title:'مولد رمز QR', qr_sub:'ولّد رمز QR لأي رابط أو نص فوراً',
    qr_input:'الرابط أو النص', qr_placeholder:'https://example.com أو أي نص...',
    qr_generate:'توليد الرمز', qr_download:'تنزيل الصورة', qr_hint:'اكتب أي رابط أو نص لتوليد الرمز',
    tz_title:'محول المناطق الزمنية', tz_sub:'اعرف الوقت في أي مدينة حول العالم',
    tz_convert:'حوّل وقتاً محدداً', tz_from:'من منطقة', tz_to:'إلى منطقة',
    rng_title:'مولد أرقام عشوائية', rng_sub:'ولّد أرقاماً عشوائية للقرعات والألعاب',
    rng_min:'أصغر رقم', rng_max:'أكبر رقم', rng_count:'عدد الأرقام:', rng_btn:'🎲 ولّد مرة أخرى', rng_history:'السجل',
    sw_title:'ساعة إيقاف ومؤقت', sw_sub:'ساعة توقيت ومؤقت للتمارين والعمل',
    sw_tab:'ساعة إيقاف', timer_tab:'مؤقت', sw_start:'ابدأ', sw_pause:'إيقاف مؤقت',
    sw_lap:'دورة', sw_reset:'إعادة', timer_min:'دقائق', timer_sec:'ثواني', timer_done:'⏰ انتهى الوقت!',
    cat_all:'الكل', cat_health:'💪 الصحة', cat_money:'💰 المال', cat_productivity:'⚙️ الإنتاجية', cat_quick:'⚡ سريعة',
    search_placeholder:'ابحث عن أداة...', search_no_results:'لم يُعثر على أداة بهذا الاسم',
    related_title:'أدوات ذات صلة',
    pwa_title:'ثبّت التطبيق', pwa_sub:'أضف أدواتي للشاشة الرئيسية للوصول السريع بدون إنترنت', pwa_install:'تثبيت', pwa_later:'لاحقاً',
    cat_oman:'🌍 عمان', cat_games:'🎮 ألعاب', cat_education:'🧒 تعليم',
    guess_card_title:'لعبة تخمين الرقم', guess_card_desc:'خمّن الرقم السري في أقل عدد من المحاولات',
    memory_card_title:'لعبة الذاكرة', memory_card_desc:'طابق البطاقات واختبر ذاكرتك',
    qmath_card_title:'تحدي الأذكياء — الحساب السريع', qmath_card_desc:'100 مستوى — من مبتدئ إلى أسطورة! هل أنت ذكي؟',
    react_card_title:'اختبار رد الفعل', react_card_desc:'اضغط عند اخضرار الزر — كن أسرع!',
    car_card_title:'لعبة السيارات', car_card_desc:'تجنب السيارات الأخرى وحقق أعلى نقطة!',
    jump_card_title:'لعبة القفز — منصات', jump_card_desc:'اقفز بين المنصات واجمع النجوم مثل ماريو!',
    kids_card_title:'تعلّم مع الأطفال', kids_card_desc:'أرقام، ألوان، حيوانات — للأطفال من ٢ إلى ٦ سنوات',
    kids_math_card_title:'Детская игра по математике', kids_math_card_desc:'Сложение и вычитание с картинками — от 6 до 9 лет',
    kids_tt_card_title:'Таблица умножения', kids_tt_card_desc:'Тренировка умножения от 2× до 12× — от 7 до 12 лет',
    kids_alpha_card_title:'Алфавит ABC', kids_alpha_card_desc:'От A до Z с картинками и звуками — от 4 до 8 лет',
    kids_clock_card_title:'Учимся определять время', kids_clock_card_desc:'Интерактивная игра на чтение часов — от 5 до 9 лет',
    kids_spell_card_title:'Конкурс правописания', kids_spell_card_desc:'Слушай и печатай слово — от 6 до 12 лет',
    kids_flags_card_title:'Квиз флагов мира', kids_flags_card_desc:'Угадай страну по её флагу — от 7 до 13 лет',
    kids_sci_card_title:'Исследователь науки', kids_sci_card_desc:'Планеты, части тела и природа — от 8 до 13 лет',
    kids_money_card_title:'Счёт денег', kids_money_card_desc:'Считай оманские риалы и байсы — от 7 до 12 лет',
    kids_typing_card_title:'Тренировка печати', kids_typing_card_desc:'Печатай быстро и точно, измеряй скорость — от 8 до 13 лет',
    kids_math_card_title:'Kinder-Rechenspiel', kids_math_card_desc:'Addition und Subtraktion mit Bildern — 6 bis 9 Jahre',
    kids_tt_card_title:'Einmaleins', kids_tt_card_desc:'Multiplikationsübung 2× bis 12× — 7 bis 12 Jahre',
    kids_alpha_card_title:'ABC-Alphabet', kids_alpha_card_desc:'A bis Z mit Bildern und Tönen — 4 bis 8 Jahre',
    kids_clock_card_title:'Uhrzeit lesen', kids_clock_card_desc:'Interaktives Uhrzeit-Lesespiel — 5 bis 9 Jahre',
    kids_spell_card_title:'Buchstabierwettbewerb', kids_spell_card_desc:'Wort hören und tippen — 6 bis 12 Jahre',
    kids_flags_card_title:'Weltflaggen-Quiz', kids_flags_card_desc:'Errate das Land anhand seiner Flagge — 7 bis 13 Jahre',
    kids_sci_card_title:'Wissenschafts-Entdecker', kids_sci_card_desc:'Planeten, Körperteile & Natur — 8 bis 13 Jahre',
    kids_money_card_title:'Geld zählen', kids_money_card_desc:'Omanische Rial und Baisa zählen — 7 bis 12 Jahre',
    kids_typing_card_title:'Tippübung', kids_typing_card_desc:'Schnell und genau tippen, WPM messen — 8 bis 13 Jahre',
    kids_math_card_title:'Juego de matemáticas para niños', kids_math_card_desc:'Suma y resta con imágenes — 6 a 9 años',
    kids_tt_card_title:'Tablas de multiplicar', kids_tt_card_desc:'Práctica de multiplicación de 2× a 12× — 7 a 12 años',
    kids_alpha_card_title:'Alfabeto ABC', kids_alpha_card_desc:'De la A a la Z con imágenes y sonidos — 4 a 8 años',
    kids_clock_card_title:'Decir la hora', kids_clock_card_desc:'Juego interactivo de lectura del reloj — 5 a 9 años',
    kids_spell_card_title:'Concurso de ortografía', kids_spell_card_desc:'Escucha y escribe la palabra — 6 a 12 años',
    kids_flags_card_title:'Quiz de banderas del mundo', kids_flags_card_desc:'Adivina el país por su bandera — 7 a 13 años',
    kids_sci_card_title:'Explorador científico', kids_sci_card_desc:'Planetas, cuerpo humano y naturaleza — 8 a 13 años',
    kids_money_card_title:'Cuenta el dinero', kids_money_card_desc:'Cuenta Riales y Baisas omaníes — 7 a 12 años',
    kids_typing_card_title:'Práctica de mecanografía', kids_typing_card_desc:'Escribe rápido y preciso, mide tu velocidad — 8 a 13 años',
    kids_math_card_title:'Jeu de calcul pour enfants', kids_math_card_desc:'Addition et soustraction avec visuels — 6 à 9 ans',
    kids_tt_card_title:'Tables de multiplication', kids_tt_card_desc:'Entraînement de multiplication de 2× à 12× — 7 à 12 ans',
    kids_alpha_card_title:'Alphabet ABC', kids_alpha_card_desc:'De A à Z avec images et sons — 4 à 8 ans',
    kids_clock_card_title:'Lire l\'heure', kids_clock_card_desc:'Jeu interactif de lecture de l\'heure — 5 à 9 ans',
    kids_spell_card_title:'Concours d\'orthographe', kids_spell_card_desc:'Écoute et tape le mot — 6 à 12 ans',
    kids_flags_card_title:'Quiz des drapeaux du monde', kids_flags_card_desc:'Devine le pays à partir de son drapeau — 7 à 13 ans',
    kids_sci_card_title:'Explorateur scientifique', kids_sci_card_desc:'Planètes, corps humain et nature — 8 à 13 ans',
    kids_money_card_title:'Compte l\'argent', kids_money_card_desc:'Compte les Rials et Baisas omanais — 7 à 12 ans',
    kids_typing_card_title:'Entraînement à la frappe', kids_typing_card_desc:'Tape vite et juste, mesure ta vitesse — 8 à 13 ans',
    kids_math_card_title:'Kids Math Game', kids_math_card_desc:'Addition & subtraction with visuals — ages 6–9',
    kids_tt_card_title:'Times Tables', kids_tt_card_desc:'Multiplication practice 2× to 12× — ages 7–12',
    kids_alpha_card_title:'ABC Alphabet', kids_alpha_card_desc:'A–Z with pictures and sounds — ages 4–8',
    kids_clock_card_title:'Tell the Time', kids_clock_card_desc:'Interactive clock reading game — ages 5–9',
    kids_spell_card_title:'Spelling Bee', kids_spell_card_desc:'Hear & type the word — ages 6–12',
    kids_flags_card_title:'World Flags Quiz', kids_flags_card_desc:'Guess the country from its flag — ages 7–13',
    kids_sci_card_title:'Science Explorer', kids_sci_card_desc:'Planets, body parts & nature — ages 8–13',
    kids_money_card_title:'Count the Money', kids_money_card_desc:'Count Omani Rials & Baisa — ages 7–12',
    kids_typing_card_title:'Typing Practice', kids_typing_card_desc:'Type fast & accurate, measure WPM — ages 8–13',
    kids_math_card_title:'لعبة الرياضيات للأطفال', kids_math_card_desc:'الجمع والطرح بالصور — من 6 إلى 9 سنوات',
    kids_tt_card_title:'جدول الضرب', kids_tt_card_desc:'تمرين الضرب من 2× إلى 12× — من 7 إلى 12 سنة',
    kids_alpha_card_title:'الأبجدية ABC', kids_alpha_card_desc:'من A إلى Z بالصور والأصوات — من 4 إلى 8 سنوات',
    kids_clock_card_title:'قراءة الساعة', kids_clock_card_desc:'لعبة تفاعلية لقراءة الساعة — من 5 إلى 9 سنوات',
    kids_spell_card_title:'مسابقة التهجئة', kids_spell_card_desc:'استمع واكتب الكلمة — من 6 إلى 12 سنة',
    kids_flags_card_title:'مسابقة أعلام العالم', kids_flags_card_desc:'خمّن الدولة من علمها — من 7 إلى 13 سنة',
    kids_sci_card_title:'مستكشف العلوم', kids_sci_card_desc:'الكواكب وأجزاء الجسم والطبيعة — من 8 إلى 13 سنة',
    kids_money_card_title:'عد النقود', kids_money_card_desc:'عد الريال العماني والبيسة — من 7 إلى 12 سنة',
    kids_typing_card_title:'تمرين الطباعة', kids_typing_card_desc:'اكتب بسرعة ودقة وقس سرعتك — من 8 إلى 13 سنة',
    vat_card_title:'حاسبة VAT الخليج', vat_card_desc:'احسب ضريبة القيمة المضافة لعمان والسعودية والإمارات',
    sal_card_title:'حاسبة الراتب — عمان', sal_card_desc:'احسب راتبك الصافي مع خصم SPF للمواطنين',
    eos_card_title:'حاسبة نهاية الخدمة', eos_card_desc:'احسب مكافأة نهاية خدمتك وفق قانون العمل العماني',
    hijri_card_title:'محوّل التاريخ الهجري', hijri_card_desc:'حوّل بين التقويم الهجري والميلادي بسهولة',
    pct_card_title:'حاسبة النسبة والخصم', pct_card_desc:'احسب النسب المئوية والخصومات والزيادات بسهولة',
    ci_card_title:'حاسبة الفائدة المركبة', ci_card_desc:'احسب نمو استثمارك أو قرضك مع الفائدة المتراكمة',
    dd_card_title:'الفرق بين تاريخين', dd_card_desc:'احسب عدد الأيام والأسابيع والأشهر بين أي تاريخين',
    fc_card_title:'محوّل الملفات', fc_card_desc:'حوّل Word وExcel وCSV في متصفحك',
    ic_card_title:'ضغط الصور', ic_card_desc:'قلّل حجم صورتك بدون رفعها لأي خادم',
    fav_title:'⭐ المفضلة', recent_title:'✨ قد تهمك', add_fav:'أضف للمفضلة', remove_fav:'إزالة من المفضلة', bottom_nav_favorites:'المفضلة',
    badge_count:'40+ أداة', badge_count_lbl:'أداة',
    dark_on:'🌙', dark_off:'☀️',
    related_tools:'أدوات مرتبطة:', popular_title:'أدوات تحتاجها اليوم', country_recommended:'موصى به لـ',
    eos_title:'حاسبة نهاية الخدمة — سلطنة عُمان 🇴🇲',
    eos_sub:'وفق أحكام قانون العمل العماني',
    eos_start:'تاريخ بداية العمل', eos_end:'تاريخ انتهاء العمل',
    eos_salary:'الراتب الأساسي الأخير (ر.ع)', eos_reason:'سبب انتهاء الخدمة',
    eos_resignation:'استقالة', eos_termination:'فصل من الخدمة', eos_retirement:'تقاعد',
    eos_result_lbl:'مكافأة نهاية الخدمة (ر.ع)',
    eos_years_lbl:'سنوات الخدمة', eos_months_lbl:'أشهر إضافية', eos_daily_lbl:'الراتب اليومي (ر.ع)',
    faq_title:'❓ أسئلة شائعة',
    ic_title:'ضغط وتصغير الصور', ic_sub:'يعمل داخل متصفحك — لا يتم رفع صورك لأي خادم ✅',
    ic_drop_text:'اضغط هنا أو اسحب صورتك', ic_drop_sub:'JPG، PNG، WebP — حتى 20MB',
    ic_quality_lbl:'جودة الضغط:', ic_max_compress:'أقصى ضغط', ic_max_quality:'أعلى جودة',
    ic_orig_size_lbl:'الحجم الأصلي', ic_comp_size_lbl:'بعد الضغط', ic_savings_lbl:'التوفير',
    ic_orig_img:'الصورة الأصلية', ic_comp_img:'مضغوطة', ic_quality_short:'جودة',
    ic_download_btn:'⬇️ تحميل الصورة المضغوطة', ic_another_btn:'🔄 اختر صورة أخرى',
    ic_privacy_title:'🔒 خصوصية تامة',
    ic_privacy_text:'يعمل هذا الضاغط بالكامل داخل متصفحك باستخدام تقنية Canvas API. لا يتم إرسال صورتك إلى أي خادم — بياناتك لا تغادر جهازك.',
    ic_small_img:'الصورة صغيرة جداً — جرّب تخفيض الجودة أكثر للحصول على توفير أعلى',
    ic_faq1_q:'هل يُمكن ضغط PNG بدون خسارة؟',
    ic_faq1_a:'PNG يُحوَّل إلى JPEG للضغط (مع خسارة طفيفة). إذا أردت PNG شفافاً بدون خسارة، قلّل الأبعاد بدلاً من الجودة.',
    ic_faq2_q:'ما الجودة الموصى بها لمواقع الويب؟',
    ic_faq2_a:'70-80% تُعطي توازناً جيداً بين الحجم والجودة. للصور التي تُرفع على وسائل التواصل 60-75% كافية.',
    ic_faq3_q:'لماذا الصورة المضغوطة أحياناً أكبر؟',
    ic_faq3_a:'إذا كانت الصورة الأصلية بجودة منخفضة جداً أو تنسيق PNG، قد لا يُقلّل الضغط حجمها. جرّب تخفيض الجودة أكثر.',
    pct_sub:'ثلاثة أنواع من الحسابات في أداة واحدة',
    pct_tab1:'X% من رقم', pct_tab2:'ما النسبة؟', pct_tab3:'نسبة التغيير',
    pct_pct:'النسبة %', pct_num:'الرقم', pct_first:'الرقم الأول', pct_second:'الرقم الثاني',
    pct_from_val:'من القيمة', pct_to_val:'إلى القيمة',
    pct_quick_ref_title:'🧮 مرجع سريع — نسب شائعة',
    pct_increase:'زيادة بنسبة', pct_decrease:'انخفاض بنسبة', pct_pct_of:'% من', pct_is:'هو',
    pct_intro:'ثلاثة أنواع من حسابات النسبة المئوية في أداة واحدة: اعرف X% من رقم (مثلاً 20% من 500)، اعرف ما النسبة التي يمثلها رقم من آخر، واحسب الزيادة أو النقص كنسبة مئوية. مفيد للخصومات وضريبة القيمة المضافة والإحصاء والمقارنات المالية.',
    pct_of:'من', pct_vat5_lbl:'ضريبة عمان/الإمارات', pct_tenth_lbl:'عُشر', pct_vat15_lbl:'ضريبة السعودية', pct_fifth_lbl:'خُمس', pct_quarter_lbl:'رُبع', pct_half_lbl:'نصف',
    pct_ref_table_html:'<table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr style="background:var(--primary);color:#fff;"><th style="padding:9px 12px;text-align:start;">نوع الحساب</th><th style="padding:9px 12px;text-align:start;">الصيغة</th><th style="padding:9px 12px;text-align:start;">مثال</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X% من رقم</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">الرقم × النسبة ÷ 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">20% من 500 = <strong>100</strong></td></tr><tr style="background:var(--surface-2);"><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X ما نسبته من Y؟</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">(X ÷ Y) × 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">30 من 150 = <strong>20%</strong></td></tr><tr><td style="padding:8px 12px;font-weight:700;">نسبة التغيير</td><td style="padding:8px 12px;font-family:monospace;">((الجديد − القديم) ÷ القديم) × 100</td><td style="padding:8px 12px;color:var(--text-muted);">من 100 إلى 130 = <strong>+30%</strong></td></tr></tbody></table>',
    ci_sub:'احسب نمو استثمارك أو قرضك مع الفائدة المتراكمة',
    ci_principal:'رأس المال (المبلغ الأساسي)', ci_rate:'معدل الفائدة السنوي %',
    ci_years:'المدة (بالسنوات)', ci_freq:'تكرار الاحتساب', ci_monthly:'إضافة شهرية اختيارية',
    ci_annually:'سنوياً', ci_quarterly:'ربع سنوي', ci_monthly_f:'شهرياً', ci_daily:'يومياً',
    ci_result_lbl:'المبلغ النهائي', ci_capital_lbl:'رأس المال الأصلي',
    ci_interest_lbl:'إجمالي الفائدة', ci_additions_lbl:'إجمالي الإضافات',
    ci_table_title:'📊 جدول النمو السنوي',
    ci_th_year:'السنة', ci_th_amount:'المبلغ', ci_th_int_added:'الفائدة المضافة', ci_th_total_int:'إجمالي الفائدة',
    dd_sub:'أيام، أسابيع، أشهر وسنوات بين أي تاريخين',
    dd_from_lbl:'التاريخ الأول (من)', dd_to_lbl:'التاريخ الثاني (إلى)',
    dd_preset_today:'من اليوم', dd_preset_ny:'حتى رأس السنة', dd_preset_ramadan:'حتى رمضان 2027',
    dd_result_lbl:'يوم إجمالاً',
    dd_years_lbl:'سنة', dd_months_lbl:'شهر', dd_days_lbl:'يوم',
    dd_weeks_lbl:'أسبوع', dd_hours_lbl:'ساعة', dd_workdays_lbl:'يوم عمل (تقريبي)',
    dd_upcoming_title:'⚡ أحداث قادمة',
    vat_sub:'عمان • السعودية • الإمارات • البحرين',
    vat_country_lbl:'الدولة', vat_mode_lbl:'نوع الحساب',
    vat_add_mode:'إضافة ضريبة', vat_extract_mode:'استخراج ضريبة',
    vat_amount_before:'المبلغ قبل الضريبة', vat_amount_after:'المبلغ شامل الضريبة',
    vat_rate_lbl:'نسبة الضريبة', vat_tax_lbl:'قيمة الضريبة', vat_total_lbl:'الإجمالي شامل الضريبة',
    vat_table_title:'نسب VAT في الخليج',
    sal_sub:'احسب راتبك الصافي مع خصم SPF للمواطنين',
    sal_nationality_lbl:'الجنسية', sal_omani:'عماني (خصم SPF 8%)', sal_expat:'وافد (بدون خصم SPF)',
    sal_basic_lbl:'الراتب الأساسي (ر.ع)', sal_housing_lbl:'بدل السكن (ر.ع)',
    sal_transport_lbl:'بدل النقل (ر.ع)', sal_other_lbl:'بدلات أخرى (ر.ع)',
    sal_net_lbl:'الراتب الصافي (ر.ع)', sal_gross_lbl:'الإجمالي قبل الخصم',
    sal_annual_lbl:'الراتب السنوي', sal_pasi_lbl:'خصم SPF (8%)',
    sal_info_title:'📌 معلومات SPF في عُمان',
    hij_sub:'تحويل فوري ودقيق في كلا الاتجاهين',
    hij_mode_gh:'🗓️ ميلادي → هجري', hij_mode_hg:'🌙 هجري → ميلادي',
    hij_greg_date_lbl:'اختر التاريخ الميلادي',
    hij_day_lbl:'اليوم', hij_month_lbl:'الشهر الهجري', hij_year_lbl:'السنة الهجرية',
    hij_today_title:'📅 التاريخ الهجري لليوم', hij_months_title:'🌙 الأشهر الهجرية',
  },
  en: {
    nav_home:'Home', nav_about:'About', nav_contact:'Contact',
    back:'← Back to Home', footer_about:'About', footer_contact:'Contact',
    footer_copy:'© 2026 Adawati — Free tools; most run locally in your browser',
    hero_title:'Free Online Tools for Calculation, Conversion & Productivity',
    hero_sub:'Calculate, convert, create and use free tools directly from your browser — no install, works on mobile and desktop',
    jo_hero_title:'Free Tools for Jordan — Calculators & Everyday Tools',
    jo_hero_sub:'JOD conversion, installment calculator, Hijri converter, BMI and 40+ free tools — instant, no signup.',
    cat_kids:'🧒 Kids', cat_jo_education:'🎓 Education', cat_challenges:'🏆 Challenges',
    cat_taxes:'🧾 Taxes', cat_decisions:'⚖️ Decisions', cat_cars:'🚗 Cars', cat_daily:'📅 Daily Info',
    jo_hero_label:'🇯🇴 Free Tools for Residents of Jordan', jo_badge_loan:'🧮 Installment Calculator', jo_badge_free:'✅ 100% Free',
    badge_count:'40+ Tools', badge_free:'100% Free', badge_noreg:'No Registration', badge_privacy:'Local Processing',
cty_global:'Global', cty_om:'Oman', cty_ae:'UAE', cty_sa:'Saudi Arabia', cty_us:'USA', cty_uk:'UK', cty_jo:'Jordan', cty_in:'India', cty_pk:'Pakistan', cty_bd:'Bangladesh', cty_eg:'Egypt', cty_ph:'Philippines', badge_privacy_full:'Most tools work locally in your browser', badge_count_full:'40+ Tools & Guides',
    bmi_card_title:'BMI Calculator', bmi_card_desc:'Calculate your Body Mass Index and check your health',
    diet_card_title:'Calorie & Diet Plan Calculator', diet_card_desc:'Calculate your daily needs + get a full diet plan',
    loan_card_title:'Monthly Payment Calculator', loan_card_desc:'Calculate payments for any loan or financing',
    age_card_title:'Age Calculator', age_card_desc:'Your exact age in years, months and days',
    discount_card_title:'Discount Calculator', discount_card_desc:'Calculate percentages and discounts instantly',
    unit_card_title:'Unit Converter', unit_card_desc:'Convert between length, weight and temperature units',
    pass_card_title:'Password Generator', pass_card_desc:'Strong and secure passwords in one click',
    word_card_title:'Word & Character Counter', word_card_desc:'Instant counter for your texts and articles',
    start:'Start →',
    bmi_title:'BMI Calculator', bmi_sub:'Know your health status in seconds',
    bmi_weight:'Weight (kg)', bmi_height:'Height (cm)', bmi_btn:'Calculate BMI',
    bmi_underweight:'Underweight', bmi_normal:'Normal weight ✓', bmi_overweight:'Overweight', bmi_obese:'Obese', bmi_invalid:'Please enter valid numbers',
    age_title:'Age Calculator', age_sub:'Your exact age in years, months and days',
    age_label:'Date of Birth', age_btn:'Calculate My Age',
    age_years:'Years', age_months:'Months', age_days:'Days', age_total:'Total Days', age_next:'Days to Birthday', age_alert:'Please select your date of birth',
    loan_title:'Monthly Payment Calculator', loan_sub:'Calculate payments for any loan or financing',
    loan_amount:'Loan Amount', loan_rate:'Annual Interest Rate %', loan_years:'Repayment Period (Years)',
    loan_monthly:'Monthly Payment', loan_total:'Total Amount Paid', loan_interest:'Total Interest',
    discount_title:'Discount & Percentage Calculator', discount_sub:'Calculate percentages and discounts quickly',
    tab_percent:'Percentage', tab_discount:'Discount',
    percent_label1:'What is', percent_label2:'% of the number',
    discount_label1:'Original Price', discount_label2:'Discount %',
    unit_title:'Unit Converter', unit_sub:'Convert between length and weight units',
    tab_length:'Length', tab_weight:'Weight', unit_value:'Value', unit_from:'From', unit_to:'To',
    pass_title:'Password Generator', pass_sub:'Strong and secure passwords in one click',
    pass_length:'Length:', pass_numbers:'Numbers (0–9)', pass_symbols:'Symbols (!@#$)', pass_upper:'Uppercase Letters',
    pass_btn:'Generate New Password', pass_copied:'Copied ✓',
    word_title:'Word & Character Counter', word_sub:'Instant counter for your texts and articles',
    word_words:'Words', word_chars:'Characters', word_nospace:'Without Spaces', word_sentences:'Sentences',
    diet_title:'Calorie & Diet Plan Calculator', diet_sub:'Calculate your daily calories, protein, carbs and fats',
    diet_gender:'Gender', diet_male:'Male', diet_female:'Female',
    diet_age:'Age', diet_weight:'Weight (kg)', diet_height:'Height (cm)',
    diet_activity:'Activity Level', diet_goal:'Goal', diet_btn:'Calculate My Daily Needs',
    diet_calories:'Calories per Day', diet_protein:'Protein (g)', diet_carb:'Carbs (g)', diet_fat:'Fat (g)',
    diet_act1:'Sedentary (desk job)', diet_act2:'Light activity (1–3 days/week)',
    diet_act3:'Moderate activity (3–5 days/week)', diet_act4:'High activity (6–7 days/week)', diet_act5:'Very active (athlete / physical work)',
    diet_goal1:'Lose Weight', diet_goal2:'Maintain Weight', diet_goal3:'Gain Weight',
    diet_goal4:'Body Shredding', diet_goal5:'Body Toning', diet_goal6:'Muscle Mass Building',
    diet_free_badge:'🎉 Special Offer — First 21 Days Completely Free!',
    diet_pro_title:'🔒 Complete Diet Plan',
    diet_pro_f1:'Detailed daily meal schedule (7 days)', diet_pro_f2:'Food alternatives list based on your taste',
    diet_pro_f3:'Printable and downloadable file', diet_pro_f4:'Weekly update based on your progress',
    diet_trial:'21 days free • No credit card required', diet_pro_btn:'Start Your Free Trial Now',
    diet_alert:'Please fill in age, weight and height',
    about_title:'About Us', about_sub:'The story of Adawati',
    about_p1:'"Adawati" is a collection of free and simple online tools, designed to help you complete daily calculations and tasks quickly and without complexity.',
    about_p2:'Our goal is to provide accurate and easy-to-use tools on any device, while fully protecting your privacy — all calculations happen directly in your browser.',
    about_p3:'The site is continuously evolving, and we regularly add new tools based on user needs.',
    contact_title:'Contact Us', contact_sub:'Have a suggestion or found a problem? Write to us',
    contact_name:'Name', contact_email:'Email Address', contact_msg:'Message',
    contact_btn:'Send Message', contact_error:'Please fill in all fields', contact_email_invalid:'Invalid email address',
    word_placeholder:'Type or paste your text here...',
    signup_btn:'Sign Up', signup_title:'Create Free Account', signup_name:'Name', signup_email:'Email',
    signup_submit:'Create Account', signup_welcome:'Welcome', signup_logout:'Sign Out',
    signup_note:'Optional — save your preferences on this device',
    auth_password:'Password', auth_google_btn:'Sign in with Google', auth_switch_to_login:'Already have an account? Sign in',
    auth_switch_to_signup:"Don't have an account? Sign up", auth_or:'or',
    auth_error_weak_password:'Password must be at least 6 characters', auth_error_wrong_password:'Wrong email or password',
    auth_error_email_in_use:'This email is already in use', auth_syncing:'Syncing your favorites...', auth_signin_title:'Sign In',
    hero_label:'Free tools for your daily use',
    badge_langs:'6 Languages', stat_tools:'Free Tools', stat_games:'🎮 Games', stat_langs:'Languages',
    stat_private:'Local Processing', stat_available:'Always Available',
    section_tools:'All Tools', section_tools_sub:'Choose the tool you need',
    footer_desc:'Most tools work locally in your browser; some use external services to provide live data. 100% free, no registration required.',
    footer_tools_title:'Tools', footer_more_title:'More', footer_links_title:'Links',
    currency_card_title:'Currency Converter', currency_card_desc:'Convert between 30+ world currencies with live rates',
    tip_card_title:'Tip Calculator', tip_card_desc:'Calculate tip and split bill between friends',
    qr_card_title:'QR Code Generator', qr_card_desc:'Generate a QR code for any link or text instantly',
    tz_card_title:'Time Zone Converter', tz_card_desc:'Find the current time in any city around the world',
    rng_card_title:'Random Number Generator', rng_card_desc:'Generate random numbers for draws and games',
    sw_card_title:'Stopwatch & Timer', sw_card_desc:'Professional stopwatch and countdown timer',
    currency_title:'Currency Converter', currency_sub:'Live exchange rates from the internet',
    currency_amount:'Amount', currency_from:'From', currency_to:'To',
    currency_loading:'Loading rates...', currency_offline:'Could not load rates — check your internet connection',
    tip_title:'Tip Calculator', tip_sub:'Calculate tip and split the bill easily',
    tip_bill:'Total Bill', tip_pct:'Tip %:', tip_people:'Number of People',
    tip_amount:'Tip', tip_total:'Total', tip_per_person:'Per Person',
    qr_title:'QR Code Generator', qr_sub:'Generate a QR code for any link or text instantly',
    qr_input:'Link or Text', qr_placeholder:'https://example.com or any text...',
    qr_generate:'Generate Code', qr_download:'Download Image', qr_hint:'Type any link or text to generate the code',
    tz_title:'Time Zone Converter', tz_sub:'Find the current time in any city around the world',
    tz_convert:'Convert a specific time', tz_from:'From Zone', tz_to:'To Zone',
    rng_title:'Random Number Generator', rng_sub:'Generate random numbers for draws and games',
    rng_min:'Min Number', rng_max:'Max Number', rng_count:'Count:', rng_btn:'🎲 Generate Again', rng_history:'History',
    sw_title:'Stopwatch & Timer', sw_sub:'Professional stopwatch and timer for exercise and work',
    sw_tab:'Stopwatch', timer_tab:'Timer', sw_start:'Start', sw_pause:'Pause',
    sw_lap:'Lap', sw_reset:'Reset', timer_min:'Minutes', timer_sec:'Seconds', timer_done:'⏰ Time\'s up!',
    cat_all:'All', cat_health:'💪 Health', cat_money:'💰 Money', cat_productivity:'⚙️ Productivity', cat_quick:'⚡ Quick',
    search_placeholder:'Search tools...', search_no_results:'No tools found with that name',
    related_title:'Related Tools',
    pwa_title:'Install App', pwa_sub:'Add Adawati to your home screen for quick offline access', pwa_install:'Install', pwa_later:'Later',
    cat_oman:'🌍 Oman', cat_games:'🎮 Games', cat_education:'🧒 Kids',
    guess_card_title:'Number Guessing Game', guess_card_desc:'Guess the secret number in as few tries as possible',
    memory_card_title:'Memory Game', memory_card_desc:'Match the cards and test your memory',
    qmath_card_title:'Smart Challenge — Quick Math', qmath_card_desc:'100 levels from Beginner to Legend! Are you smart?',
    react_card_title:'Reaction Test', react_card_desc:'Click when the button turns green — be fastest!',
    car_card_title:'Car Race Game', car_card_desc:'Dodge the other cars and beat the high score!',
    jump_card_title:'Jump Game — Platformer', jump_card_desc:'Jump between platforms and collect stars like Mario!',
    kids_card_title:'Kids Learning Game', kids_card_desc:'Numbers, colors, animals — for children aged 2 to 6 years',
    vat_card_title:'VAT Calculator Gulf', vat_card_desc:'Calculate VAT for Oman, Saudi Arabia and UAE',
    sal_card_title:'Salary Calculator — Oman', sal_card_desc:'Calculate your net salary including SPF deduction',
    eos_card_title:'End of Service Calculator', eos_card_desc:'Calculate your gratuity under Omani labor law',
    hijri_card_title:'Hijri Date Converter', hijri_card_desc:'Convert between Hijri and Gregorian calendars easily',
    pct_card_title:'Percentage & Discount', pct_card_desc:'Calculate percentages, discounts and changes easily',
    ci_card_title:'Compound Interest Calculator', ci_card_desc:'Calculate how your investment or loan grows over time',
    dd_card_title:'Date Difference', dd_card_desc:'Count days, weeks and months between any two dates',
    fc_card_title:'File Converter', fc_card_desc:'Convert Word, Excel & CSV in your browser',
    ic_card_title:'Image Compressor', ic_card_desc:'Reduce image size without uploading to any server',
    fav_title:'⭐ Favorites', recent_title:'✨ You Might Like', add_fav:'Add to Favorites', remove_fav:'Remove from Favorites', bottom_nav_favorites:'Favorites',
    badge_count:'40+ Tools', badge_count_lbl:'Tools',
    dark_on:'🌙', dark_off:'☀️',
    related_tools:'Related Tools:', popular_title:'Tools You May Need Today', country_recommended:'Recommended for',
    eos_title:'End of Service Calculator — Oman 🇴🇲',
    eos_sub:'As per Oman Labor Law',
    eos_start:'Start Date', eos_end:'End Date',
    eos_salary:'Last Basic Salary (OMR)', eos_reason:'Reason for Termination',
    eos_resignation:'Resignation', eos_termination:'Dismissal', eos_retirement:'Retirement',
    eos_result_lbl:'End of Service Gratuity (OMR)',
    eos_years_lbl:'Years of Service', eos_months_lbl:'Additional Months', eos_daily_lbl:'Daily Wage (OMR)',
    faq_title:'❓ FAQ',
    ic_title:'Compress & Resize Images', ic_sub:'Works in your browser — your images never leave your device ✅',
    ic_drop_text:'Click here or drag your image', ic_drop_sub:'JPG, PNG, WebP — up to 20MB',
    ic_quality_lbl:'Compression quality:', ic_max_compress:'Max compression', ic_max_quality:'Best quality',
    ic_orig_size_lbl:'Original size', ic_comp_size_lbl:'After compression', ic_savings_lbl:'Savings',
    ic_orig_img:'Original', ic_comp_img:'Compressed', ic_quality_short:'quality',
    ic_download_btn:'⬇️ Download Compressed Image', ic_another_btn:'🔄 Choose another image',
    ic_privacy_title:'🔒 Full Privacy',
    ic_privacy_text:'This compressor works entirely in your browser using Canvas API. Your image is never sent to any server — your data never leaves your device.',
    ic_small_img:'Image is already small — try lowering quality further for more savings',
    ic_faq1_q:'Can PNG be compressed without loss?',
    ic_faq1_a:'PNG is converted to JPEG for compression (with slight loss). For a transparent PNG without loss, reduce dimensions instead of quality.',
    ic_faq2_q:'What quality is recommended for websites?',
    ic_faq2_a:'70-80% gives a good balance between size and quality. For social media uploads, 60-75% is sufficient.',
    ic_faq3_q:'Why is the compressed image sometimes larger?',
    ic_faq3_a:'If the original image has very low quality or PNG format, compression may not reduce its size. Try lowering quality further.',
    pct_sub:'Three types of calculations in one tool',
    pct_tab1:'X% of a number', pct_tab2:'What percentage?', pct_tab3:'% change',
    pct_pct:'Percentage %', pct_num:'Number', pct_first:'First number', pct_second:'Second number',
    pct_from_val:'From value', pct_to_val:'To value',
    pct_quick_ref_title:'🧮 Quick Reference — Common Rates',
    pct_increase:'increase of', pct_decrease:'decrease of', pct_pct_of:'% of', pct_is:'is',
    pct_intro:'Three types of percentage calculations in one tool: find X% of a number (e.g. 20% of 500), find what percentage one number is of another, and calculate percentage increase or decrease. Useful for discounts, VAT, statistics and financial comparisons.',
    pct_of:'of', pct_vat5_lbl:'VAT Oman/UAE', pct_tenth_lbl:'One tenth', pct_vat15_lbl:'VAT Saudi Arabia', pct_fifth_lbl:'One fifth', pct_quarter_lbl:'One quarter', pct_half_lbl:'Half',
    pct_ref_table_html:'<table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr style="background:var(--primary);color:#fff;"><th style="padding:9px 12px;text-align:start;">Calculation type</th><th style="padding:9px 12px;text-align:start;">Formula</th><th style="padding:9px 12px;text-align:start;">Example</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X% of a number</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">Number × percentage ÷ 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">20% of 500 = <strong>100</strong></td></tr><tr style="background:var(--surface-2);"><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X is what % of Y?</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">(X ÷ Y) × 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">30 of 150 = <strong>20%</strong></td></tr><tr><td style="padding:8px 12px;font-weight:700;">% Change</td><td style="padding:8px 12px;font-family:monospace;">((New − Old) ÷ Old) × 100</td><td style="padding:8px 12px;color:var(--text-muted);">from 100 to 130 = <strong>+30%</strong></td></tr></tbody></table>',
    ci_sub:'Calculate how your investment or loan grows with compound interest',
    ci_principal:'Principal (initial amount)', ci_rate:'Annual interest rate %',
    ci_years:'Duration (years)', ci_freq:'Compounding frequency', ci_monthly:'Optional monthly addition',
    ci_annually:'Annually', ci_quarterly:'Quarterly', ci_monthly_f:'Monthly', ci_daily:'Daily',
    ci_result_lbl:'Final Amount', ci_capital_lbl:'Original Capital',
    ci_interest_lbl:'Total Interest', ci_additions_lbl:'Total Additions',
    ci_table_title:'📊 Annual Growth Table',
    ci_th_year:'Year', ci_th_amount:'Amount', ci_th_int_added:'Interest Added', ci_th_total_int:'Total Interest',
    dd_sub:'Days, weeks, months and years between any two dates',
    dd_from_lbl:'First date (from)', dd_to_lbl:'Second date (to)',
    dd_preset_today:'From today', dd_preset_ny:'Until New Year', dd_preset_ramadan:'Until Ramadan 2027',
    dd_result_lbl:'days total',
    dd_years_lbl:'Year', dd_months_lbl:'Month', dd_days_lbl:'Day',
    dd_weeks_lbl:'Week', dd_hours_lbl:'Hour', dd_workdays_lbl:'Work day (approx.)',
    dd_upcoming_title:'⚡ Upcoming Events',
    vat_sub:'Oman • Saudi Arabia • UAE • Bahrain',
    vat_country_lbl:'Country', vat_mode_lbl:'Calculation type',
    vat_add_mode:'Add tax', vat_extract_mode:'Extract tax',
    vat_amount_before:'Amount before tax', vat_amount_after:'Amount including tax',
    vat_rate_lbl:'Tax rate', vat_tax_lbl:'Tax amount', vat_total_lbl:'Total including tax',
    vat_table_title:'Gulf VAT Rates',
    sal_sub:'Calculate your net salary with SPF deduction for Omanis',
    sal_nationality_lbl:'Nationality', sal_omani:'Omani (8% SPF deduction)', sal_expat:'Expat (no SPF deduction)',
    sal_basic_lbl:'Basic salary (OMR)', sal_housing_lbl:'Housing allowance (OMR)',
    sal_transport_lbl:'Transport allowance (OMR)', sal_other_lbl:'Other allowances (OMR)',
    sal_net_lbl:'Net salary (OMR)', sal_gross_lbl:'Gross before deduction',
    sal_annual_lbl:'Annual salary', sal_pasi_lbl:'SPF deduction (8%)',
    sal_info_title:'📌 SPF Information in Oman',
    hij_sub:'Instant and accurate conversion in both directions',
    hij_mode_gh:'🗓️ Gregorian → Hijri', hij_mode_hg:'🌙 Hijri → Gregorian',
    hij_greg_date_lbl:'Select Gregorian date',
    hij_day_lbl:'Day', hij_month_lbl:'Hijri Month', hij_year_lbl:'Hijri Year',
    hij_today_title:'📅 Today\'s Hijri Date', hij_months_title:'🌙 Hijri Months',
  },
  fr: {
    nav_home:'Accueil', nav_about:'À propos', nav_contact:'Contact',
    back:'← Retour à l\'accueil', footer_about:'À propos', footer_contact:'Contact',
    footer_copy:'© 2026 Adawati — Outils gratuits ; la plupart fonctionnent dans votre navigateur',
    hero_title:'Outils gratuits en ligne pour calculer, convertir et être productif',
    hero_sub:'Outils rapides et précis, fonctionnant directement dans votre navigateur — sans inscription, 100% gratuit',
    badge_count:'40+ Outils', badge_free:'100% Gratuit', badge_noreg:'Sans inscription', badge_privacy:'Traitement local',
cty_global:'Mondial', cty_om:'Oman', cty_ae:'Émirats arabes unis', cty_sa:'Arabie saoudite', cty_us:'États-Unis', cty_uk:'Royaume-Uni', cty_jo:'Jordanie', cty_in:'Inde', cty_pk:'Pakistan', cty_bd:'Bangladesh', cty_eg:'Égypte', cty_ph:'Philippines', badge_privacy_full:'La plupart des outils fonctionnent localement dans votre navigateur', badge_count_full:'40+ outils et guides',
    bmi_card_title:'Calculateur d\'IMC', bmi_card_desc:'Calculez votre indice de masse corporelle',
    diet_card_title:'Calculateur de calories', diet_card_desc:'Calculez vos besoins quotidiens + plan alimentaire',
    loan_card_title:'Calculateur de mensualité', loan_card_desc:'Calculez les mensualités pour n\'importe quel prêt',
    age_card_title:'Calculateur d\'âge', age_card_desc:'Votre âge exact en années, mois et jours',
    discount_card_title:'Calculateur de remise', discount_card_desc:'Calculez les pourcentages et remises instantanément',
    unit_card_title:'Convertisseur d\'unités', unit_card_desc:'Convertissez entre unités de longueur et de poids',
    pass_card_title:'Générateur de mot de passe', pass_card_desc:'Mots de passe forts en un clic',
    word_card_title:'Compteur de mots', word_card_desc:'Compteur instantané pour vos textes',
    start:'Commencer →',
    bmi_title:'Calculateur d\'IMC', bmi_sub:'Connaissez votre état de santé en secondes',
    bmi_weight:'Poids (kg)', bmi_height:'Taille (cm)', bmi_btn:'Calculer l\'IMC',
    bmi_underweight:'Insuffisance pondérale', bmi_normal:'Poids normal ✓', bmi_overweight:'Surpoids', bmi_obese:'Obésité', bmi_invalid:'Veuillez entrer des nombres valides',
    age_title:'Calculateur d\'âge', age_sub:'Votre âge exact en années, mois et jours',
    age_label:'Date de naissance', age_btn:'Calculer mon âge',
    age_years:'Ans', age_months:'Mois', age_days:'Jours', age_total:'Total des jours', age_next:'Jours jusqu\'à votre anniversaire', age_alert:'Veuillez sélectionner votre date de naissance',
    loan_title:'Calculateur de mensualité', loan_sub:'Calculez les mensualités pour n\'importe quel prêt',
    loan_amount:'Montant du prêt', loan_rate:'Taux d\'intérêt annuel %', loan_years:'Durée (années)',
    loan_monthly:'Mensualité', loan_total:'Total payé', loan_interest:'Total des intérêts',
    discount_title:'Calculateur de remise', discount_sub:'Calculez les pourcentages et remises rapidement',
    tab_percent:'Pourcentage', tab_discount:'Remise',
    percent_label1:'Quelle est', percent_label2:'% du nombre',
    discount_label1:'Prix original', discount_label2:'Remise %',
    unit_title:'Convertisseur d\'unités', unit_sub:'Convertissez entre unités de longueur et de poids',
    tab_length:'Longueur', tab_weight:'Poids', unit_value:'Valeur', unit_from:'De', unit_to:'À',
    pass_title:'Générateur de mot de passe', pass_sub:'Mots de passe forts et sécurisés en un clic',
    pass_length:'Longueur :', pass_numbers:'Chiffres (0–9)', pass_symbols:'Symboles (!@#$)', pass_upper:'Majuscules',
    pass_btn:'Générer un nouveau mot de passe', pass_copied:'Copié ✓',
    word_title:'Compteur de mots et caractères', word_sub:'Compteur instantané pour vos textes',
    word_words:'Mots', word_chars:'Caractères', word_nospace:'Sans espaces', word_sentences:'Phrases',
    diet_title:'Calculateur de calories', diet_sub:'Calculez vos besoins quotidiens avec précision',
    diet_gender:'Genre', diet_male:'Homme', diet_female:'Femme',
    diet_age:'Âge', diet_weight:'Poids (kg)', diet_height:'Taille (cm)',
    diet_activity:'Niveau d\'activité', diet_goal:'Objectif', diet_btn:'Calculer mes besoins quotidiens',
    diet_calories:'Calories par jour', diet_protein:'Protéines (g)', diet_carb:'Glucides (g)', diet_fat:'Graisses (g)',
    diet_act1:'Sédentaire (bureau)', diet_act2:'Activité légère (1–3 jours/semaine)',
    diet_act3:'Activité modérée (3–5 jours/semaine)', diet_act4:'Activité élevée (6–7 jours/semaine)', diet_act5:'Très actif (athlète / travail physique)',
    diet_goal1:'Perdre du poids', diet_goal2:'Maintenir le poids', diet_goal3:'Prendre du poids',
    diet_goal4:'Sèche musculaire', diet_goal5:'Tonifier le corps', diet_goal6:'Prise de masse musculaire',
    diet_free_badge:'🎉 Offre spéciale — 21 premiers jours totalement gratuits!',
    diet_pro_title:'🔒 Plan alimentaire complet',
    diet_pro_f1:'Programme de repas détaillé (7 jours)', diet_pro_f2:'Liste d\'alternatives alimentaires',
    diet_pro_f3:'Fichier imprimable et téléchargeable', diet_pro_f4:'Mise à jour hebdomadaire',
    diet_trial:'21 jours gratuits • Sans carte bancaire', diet_pro_btn:'Commencer l\'essai gratuit',
    diet_alert:'Veuillez remplir l\'âge, le poids et la taille',
    about_title:'À propos de nous', about_sub:'L\'histoire d\'Adawati',
    about_p1:'"Adawati" est une collection d\'outils en ligne gratuits et simples, conçus pour vous aider à effectuer des calculs et tâches quotidiennes rapidement.',
    about_p2:'Notre objectif est de fournir des outils précis sur n\'importe quel appareil, tout en protégeant totalement votre vie privée — tous les calculs s\'effectuent dans votre navigateur.',
    about_p3:'Le site est en développement continu, et nous ajoutons régulièrement de nouveaux outils.',
    contact_title:'Contactez-nous', contact_sub:'Une suggestion ou un problème? Écrivez-nous',
    contact_name:'Nom', contact_email:'Adresse e-mail', contact_msg:'Message',
    contact_btn:'Envoyer le message', contact_error:'Veuillez remplir tous les champs', contact_email_invalid:'Adresse e-mail invalide',
    word_placeholder:'Tapez ou collez votre texte ici...',
    signup_btn:'S\'inscrire', signup_title:'Créer un compte gratuit', signup_name:'Nom', signup_email:'E-mail',
    signup_submit:'Créer le compte', signup_welcome:'Bienvenue', signup_logout:'Déconnexion',
    signup_note:'Facultatif — enregistrez vos préférences sur cet appareil',
    auth_password:'Mot de passe', auth_google_btn:'Se connecter avec Google', auth_switch_to_login:'Vous avez déjà un compte ? Connectez-vous',
    auth_switch_to_signup:"Pas de compte ? Inscrivez-vous", auth_or:'ou',
    auth_error_weak_password:'Le mot de passe doit contenir au moins 6 caractères', auth_error_wrong_password:'E-mail ou mot de passe incorrect',
    auth_error_email_in_use:'Cet e-mail est déjà utilisé', auth_syncing:'Synchronisation de vos favoris...', auth_signin_title:'Connexion',
    hero_label:'Outils gratuits pour votre usage quotidien',
    badge_langs:'6 Langues', stat_tools:'Outils gratuits', stat_games:'🎮 Jeux', stat_langs:'Langues',
    stat_private:'Traitement local', stat_available:'Toujours disponible',
    section_tools:'Tous les outils', section_tools_sub:'Choisissez l\'outil dont vous avez besoin',
    footer_desc:'Des outils gratuits qui fonctionnent directement dans votre navigateur.',
    footer_tools_title:'Outils', footer_more_title:'Plus', footer_links_title:'Liens',
    currency_card_title:'Convertisseur de devises', currency_card_desc:'Convertissez entre 30+ devises mondiales avec des taux en direct',
    tip_card_title:'Calculateur de pourboire', tip_card_desc:'Calculez le pourboire et partagez la facture entre amis',
    qr_card_title:'Générateur de QR Code', qr_card_desc:'Générez un QR code pour n\'importe quel lien ou texte instantanément',
    tz_card_title:'Convertisseur de fuseaux horaires', tz_card_desc:'Trouvez l\'heure actuelle dans n\'importe quelle ville',
    rng_card_title:'Générateur de nombres aléatoires', rng_card_desc:'Générez des nombres aléatoires pour les tirages et jeux',
    sw_card_title:'Chronomètre et minuteur', sw_card_desc:'Chronomètre et minuteur professionnels',
    currency_title:'Convertisseur de devises', currency_sub:'Taux de change en direct',
    currency_amount:'Montant', currency_from:'De', currency_to:'À',
    currency_loading:'Chargement des taux...', currency_offline:'Impossible de charger les taux — vérifiez votre connexion',
    tip_title:'Calculateur de pourboire', tip_sub:'Calculez le pourboire et divisez la facture facilement',
    tip_bill:'Total de la facture', tip_pct:'Pourboire %:', tip_people:'Nombre de personnes',
    tip_amount:'Pourboire', tip_total:'Total', tip_per_person:'Par personne',
    qr_title:'Générateur de QR Code', qr_sub:'Générez un QR code instantanément',
    qr_input:'Lien ou texte', qr_placeholder:'https://example.com ou n\'importe quel texte...',
    qr_generate:'Générer le code', qr_download:'Télécharger l\'image', qr_hint:'Entrez un lien ou un texte pour générer le code',
    tz_title:'Convertisseur de fuseaux horaires', tz_sub:'Heure actuelle dans le monde',
    tz_convert:'Convertir une heure', tz_from:'Depuis', tz_to:'Vers',
    rng_title:'Générateur de nombres aléatoires', rng_sub:'Pour les tirages et jeux',
    rng_min:'Min', rng_max:'Max', rng_count:'Quantité:', rng_btn:'🎲 Générer à nouveau', rng_history:'Historique',
    sw_title:'Chronomètre et minuteur', sw_sub:'Chronomètre professionnel',
    sw_tab:'Chronomètre', timer_tab:'Minuteur', sw_start:'Démarrer', sw_pause:'Pause',
    sw_lap:'Tour', sw_reset:'Réinitialiser', timer_min:'Minutes', timer_sec:'Secondes', timer_done:'⏰ Temps écoulé!',
    cat_all:'Tous', cat_health:'💪 Santé', cat_money:'💰 Argent', cat_productivity:'⚙️ Productivité', cat_quick:'⚡ Rapides',
    search_placeholder:'Rechercher un outil...', search_no_results:'Aucun outil trouvé', related_title:'Outils similaires',
    pwa_title:'Installer l\'app', pwa_sub:'Ajoutez Adawati à votre écran d\'accueil', pwa_install:'Installer', pwa_later:'Plus tard',
    cat_oman:'🌍 Oman', cat_games:'🎮 Jeux', cat_education:'🧒 Enfants',
    guess_card_title:'Jeu de devinette de nombre', guess_card_desc:'Devinez le nombre secret en un minimum d\'essais',
    memory_card_title:'Jeu de mémoire', memory_card_desc:'Associez les cartes et testez votre mémoire',
    qmath_card_title:'Défi des Génies — Maths', qmath_card_desc:'100 niveaux de Débutant à Légendaire!',
    react_card_title:'Test de Réaction', react_card_desc:'Cliquez quand le bouton devient vert — soyez le plus rapide!',
    car_card_title:'Jeu de Course Automobile', car_card_desc:'Évitez les voitures et battez le record!',
    jump_card_title:'Jeu de Sauts — Platformer', jump_card_desc:'Sautez entre les plateformes et collectez des étoiles!',
    kids_card_title:'Jeu Éducatif Enfants', kids_card_desc:'Chiffres, couleurs, animaux — pour enfants de 2 à 6 ans',
    vat_card_title:'Calculateur TVA Golfe', vat_card_desc:'Calculez la TVA pour Oman, l\'Arabie Saoudite et les EAU',
    sal_card_title:'Calculateur de salaire — Oman', sal_card_desc:'Calculez votre salaire net avec déductions SPF',
    eos_card_title:'Calculateur de fin de service', eos_card_desc:'Calculez votre indemnité selon le droit du travail omanais',
    hijri_card_title:'Convertisseur de date Hijri', hijri_card_desc:'Convertissez entre les calendriers hijri et grégorien',
    pct_card_title:'Pourcentage & Remise', pct_card_desc:'Calculez les pourcentages, remises et variations',
    ci_card_title:'Intérêts composés', ci_card_desc:'Calculez la croissance de votre investissement',
    dd_card_title:'Différence entre dates', dd_card_desc:'Comptez les jours, semaines et mois entre deux dates',
    fc_card_title:'Convertisseur de fichiers', fc_card_desc:'Convertissez Word, Excel et CSV dans votre navigateur',
    ic_card_title:'Compresseur d\'images', ic_card_desc:'Réduisez la taille de votre image sans envoi au serveur',
    fav_title:'⭐ Favoris', recent_title:'✨ Vous aimerez peut-être', add_fav:'Ajouter aux favoris', remove_fav:'Retirer des favoris', bottom_nav_favorites:'Favoris',
    badge_count:'40+ Outils', badge_count_lbl:'Outils',
    dark_on:'🌙', dark_off:'☀️',
    related_tools:'Outils associés:', popular_title:'Outils utiles aujourd\'hui', country_recommended:'Recommandé pour',
    eos_title:'Calculateur de fin de service — Oman 🇴🇲',
    eos_sub:'Selon le droit du travail omanais',
    eos_start:'Date de début', eos_end:'Date de fin',
    eos_salary:'Dernier salaire de base (OMR)', eos_reason:'Raison de fin de contrat',
    eos_resignation:'Démission', eos_termination:'Licenciement', eos_retirement:'Retraite',
    eos_result_lbl:'Indemnité de fin de service (OMR)',
    eos_years_lbl:'Années de service', eos_months_lbl:'Mois supplémentaires', eos_daily_lbl:'Salaire journalier (OMR)',
    faq_title:'❓ Questions fréquentes',
    ic_title:'Compresser les images', ic_sub:'Fonctionne dans votre navigateur — vos images ne quittent jamais votre appareil ✅',
    ic_drop_text:'Cliquez ici ou faites glisser votre image', ic_drop_sub:'JPG, PNG, WebP — jusqu\'à 20 Mo',
    ic_quality_lbl:'Qualité de compression:', ic_max_compress:'Compression max', ic_max_quality:'Meilleure qualité',
    ic_orig_size_lbl:'Taille originale', ic_comp_size_lbl:'Après compression', ic_savings_lbl:'Économies',
    ic_orig_img:'Original', ic_comp_img:'Compressé', ic_quality_short:'qualité',
    ic_download_btn:'⬇️ Télécharger l\'image compressée', ic_another_btn:'🔄 Choisir une autre image',
    ic_privacy_title:'🔒 Confidentialité totale',
    ic_privacy_text:'Ce compresseur fonctionne entièrement dans votre navigateur via Canvas API. Votre image n\'est jamais envoyée à un serveur.',
    ic_small_img:'Image déjà petite — essayez de réduire la qualité pour plus d\'économies',
    ic_faq1_q:'Peut-on compresser un PNG sans perte?',
    ic_faq1_a:'Le PNG est converti en JPEG pour la compression (avec légère perte). Pour un PNG transparent sans perte, réduisez plutôt les dimensions.',
    ic_faq2_q:'Quelle qualité est recommandée pour les sites web?',
    ic_faq2_a:'70-80% offre un bon équilibre entre taille et qualité. Pour les réseaux sociaux, 60-75% est suffisant.',
    ic_faq3_q:'Pourquoi l\'image compressée est-elle parfois plus grande?',
    ic_faq3_a:'Si l\'image originale est de faible qualité ou en PNG, la compression peut ne pas réduire sa taille. Essayez de baisser davantage la qualité.',
    pct_sub:'Trois types de calculs en un seul outil',
    pct_tab1:'X% d\'un nombre', pct_tab2:'Quel pourcentage?', pct_tab3:'Variation %',
    pct_pct:'Pourcentage %', pct_num:'Nombre', pct_first:'Premier nombre', pct_second:'Deuxième nombre',
    pct_from_val:'De la valeur', pct_to_val:'À la valeur', pct_quick_ref_title:'🧮 Référence rapide',
    pct_increase:'augmentation de', pct_decrease:'diminution de', pct_pct_of:'% de', pct_is:'est',
    pct_intro:'Trois types de calculs en un seul outil : trouvez X% d\'un nombre (ex. 20% de 500), calculez ce que représente un nombre par rapport à un autre, et calculez l\'augmentation ou la diminution en pourcentage. Utile pour les remises, la TVA, les statistiques et les comparaisons financières.',
    pct_of:'de', pct_vat5_lbl:'TVA Oman/Émirats', pct_tenth_lbl:'Un dixième', pct_vat15_lbl:'TVA Arabie Saoudite', pct_fifth_lbl:'Un cinquième', pct_quarter_lbl:'Un quart', pct_half_lbl:'Moitié',
    pct_ref_table_html:'<table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr style="background:var(--primary);color:#fff;"><th style="padding:9px 12px;text-align:start;">Type de calcul</th><th style="padding:9px 12px;text-align:start;">Formule</th><th style="padding:9px 12px;text-align:start;">Exemple</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X% d\'un nombre</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">Nombre × pourcentage ÷ 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">20% de 500 = <strong>100</strong></td></tr><tr style="background:var(--surface-2);"><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X est quel % de Y?</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">(X ÷ Y) × 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">30 de 150 = <strong>20%</strong></td></tr><tr><td style="padding:8px 12px;font-weight:700;">Variation %</td><td style="padding:8px 12px;font-family:monospace;">((Nouveau − Ancien) ÷ Ancien) × 100</td><td style="padding:8px 12px;color:var(--text-muted);">de 100 à 130 = <strong>+30%</strong></td></tr></tbody></table>',
    ci_sub:'Calculez la croissance de votre investissement avec les intérêts composés',
    ci_principal:'Capital initial', ci_rate:'Taux d\'intérêt annuel %', ci_years:'Durée (années)',
    ci_freq:'Fréquence de calcul', ci_monthly:'Ajout mensuel optionnel',
    ci_annually:'Annuellement', ci_quarterly:'Trimestriellement', ci_monthly_f:'Mensuellement', ci_daily:'Quotidiennement',
    ci_result_lbl:'Montant final', ci_capital_lbl:'Capital initial', ci_interest_lbl:'Intérêts totaux', ci_additions_lbl:'Ajouts totaux',
    ci_table_title:'📊 Tableau de croissance annuelle',
    ci_th_year:'Année', ci_th_amount:'Montant', ci_th_int_added:'Intérêts ajoutés', ci_th_total_int:'Total des intérêts',
    dd_sub:'Jours, semaines, mois et années entre deux dates',
    dd_from_lbl:'Première date (de)', dd_to_lbl:'Deuxième date (à)',
    dd_preset_today:'Depuis aujourd\'hui', dd_preset_ny:'Jusqu\'au Nouvel An', dd_preset_ramadan:'Jusqu\'au Ramadan 2027',
    dd_result_lbl:'jours au total', dd_years_lbl:'Année', dd_months_lbl:'Mois', dd_days_lbl:'Jour',
    dd_weeks_lbl:'Semaine', dd_hours_lbl:'Heure', dd_workdays_lbl:'Jour ouvré (approx.)', dd_upcoming_title:'⚡ Événements à venir',
    vat_sub:'Oman • Arabie Saoudite • Émirats • Bahreïn',
    vat_country_lbl:'Pays', vat_mode_lbl:'Type de calcul', vat_add_mode:'Ajouter taxe', vat_extract_mode:'Extraire taxe',
    vat_amount_before:'Montant HT', vat_amount_after:'Montant TTC',
    vat_rate_lbl:'Taux de taxe', vat_tax_lbl:'Montant de la taxe', vat_total_lbl:'Total TTC', vat_table_title:'TVA dans le Golfe',
    sal_sub:'Calculez votre salaire net avec déduction SPF pour Omanais',
    sal_nationality_lbl:'Nationalité', sal_omani:'Omanais (déduction SPF 8%)', sal_expat:'Expatrié (sans SPF)',
    sal_basic_lbl:'Salaire de base (OMR)', sal_housing_lbl:'Indemnité logement (OMR)',
    sal_transport_lbl:'Indemnité transport (OMR)', sal_other_lbl:'Autres indemnités (OMR)',
    sal_net_lbl:'Salaire net (OMR)', sal_gross_lbl:'Brut avant déduction',
    sal_annual_lbl:'Salaire annuel', sal_pasi_lbl:'Déduction SPF (8%)', sal_info_title:'📌 Informations SPF',
    hij_sub:'Conversion instantanée et précise dans les deux sens',
    hij_mode_gh:'🗓️ Grégorien → Hégirien', hij_mode_hg:'🌙 Hégirien → Grégorien',
    hij_greg_date_lbl:'Sélectionner la date grégorienne',
    hij_day_lbl:'Jour', hij_month_lbl:'Mois hégirien', hij_year_lbl:'Année hégirienne',
    hij_today_title:'📅 Date hégirienne d\'aujourd\'hui', hij_months_title:'🌙 Mois hégiriens',
  },
  es: {
    nav_home:'Inicio', nav_about:'Sobre nosotros', nav_contact:'Contacto',
    back:'← Volver al inicio', footer_about:'Sobre nosotros', footer_contact:'Contacto',
    footer_copy:'© 2026 Adawati — Herramientas gratuitas; la mayoría funciona en tu navegador',
    hero_title:'Herramientas gratuitas en línea para calcular, convertir y ser productivo',
    hero_sub:'Herramientas rápidas y precisas que funcionan en tu navegador — sin registro, 100% gratuito',
    badge_count:'40+ Herramientas', badge_free:'100% Gratis', badge_noreg:'Sin registro', badge_privacy:'Procesamiento local',
cty_global:'Global', cty_om:'Omán', cty_ae:'Emiratos Árabes Unidos', cty_sa:'Arabia Saudita', cty_us:'Estados Unidos', cty_uk:'Reino Unido', cty_jo:'Jordania', cty_in:'India', cty_pk:'Pakistán', cty_bd:'Bangladés', cty_eg:'Egipto', cty_ph:'Filipinas', badge_privacy_full:'La mayoría de las herramientas funcionan localmente en tu navegador', badge_count_full:'40+ herramientas y guías',
    bmi_card_title:'Calculadora de IMC', bmi_card_desc:'Calcula tu índice de masa corporal',
    diet_card_title:'Calculadora de calorías', diet_card_desc:'Calcula tus necesidades + plan de dieta',
    loan_card_title:'Calculadora de cuotas', loan_card_desc:'Calcula las cuotas para cualquier préstamo',
    age_card_title:'Calculadora de edad', age_card_desc:'Tu edad exacta en años, meses y días',
    discount_card_title:'Calculadora de descuento', discount_card_desc:'Calcula porcentajes y descuentos al instante',
    unit_card_title:'Conversor de unidades', unit_card_desc:'Convierte entre unidades de longitud y peso',
    pass_card_title:'Generador de contraseñas', pass_card_desc:'Contraseñas fuertes con un clic',
    word_card_title:'Contador de palabras', word_card_desc:'Contador instantáneo para tus textos',
    start:'Empezar →',
    bmi_title:'Calculadora de IMC', bmi_sub:'Conoce tu estado de salud en segundos',
    bmi_weight:'Peso (kg)', bmi_height:'Altura (cm)', bmi_btn:'Calcular IMC',
    bmi_underweight:'Bajo peso', bmi_normal:'Peso normal ✓', bmi_overweight:'Sobrepeso', bmi_obese:'Obesidad', bmi_invalid:'Por favor ingresa números válidos',
    age_title:'Calculadora de edad', age_sub:'Tu edad exacta en años, meses y días',
    age_label:'Fecha de nacimiento', age_btn:'Calcular mi edad',
    age_years:'Años', age_months:'Meses', age_days:'Días', age_total:'Total de días', age_next:'Días hasta tu cumpleaños', age_alert:'Por favor selecciona tu fecha de nacimiento',
    loan_title:'Calculadora de cuota mensual', loan_sub:'Calcula las cuotas para cualquier préstamo',
    loan_amount:'Monto del préstamo', loan_rate:'Tasa de interés anual %', loan_years:'Plazo (años)',
    loan_monthly:'Cuota mensual', loan_total:'Total pagado', loan_interest:'Total de intereses',
    discount_title:'Calculadora de descuento', discount_sub:'Calcula porcentajes y descuentos rápidamente',
    tab_percent:'Porcentaje', tab_discount:'Descuento',
    percent_label1:'¿Cuánto es', percent_label2:'% del número',
    discount_label1:'Precio original', discount_label2:'Descuento %',
    unit_title:'Conversor de unidades', unit_sub:'Convierte entre unidades de longitud y peso',
    tab_length:'Longitud', tab_weight:'Peso', unit_value:'Valor', unit_from:'De', unit_to:'A',
    pass_title:'Generador de contraseñas', pass_sub:'Contraseñas fuertes y seguras con un clic',
    pass_length:'Longitud:', pass_numbers:'Números (0–9)', pass_symbols:'Símbolos (!@#$)', pass_upper:'Letras mayúsculas',
    pass_btn:'Generar nueva contraseña', pass_copied:'Copiado ✓',
    word_title:'Contador de palabras y caracteres', word_sub:'Contador instantáneo para tus textos',
    word_words:'Palabras', word_chars:'Caracteres', word_nospace:'Sin espacios', word_sentences:'Oraciones',
    diet_title:'Calculadora de calorías', diet_sub:'Calcula tus necesidades diarias con precisión',
    diet_gender:'Género', diet_male:'Masculino', diet_female:'Femenino',
    diet_age:'Edad', diet_weight:'Peso (kg)', diet_height:'Altura (cm)',
    diet_activity:'Nivel de actividad', diet_goal:'Objetivo', diet_btn:'Calcular mis necesidades diarias',
    diet_calories:'Calorías por día', diet_protein:'Proteínas (g)', diet_carb:'Carbohidratos (g)', diet_fat:'Grasas (g)',
    diet_act1:'Sedentario (oficina)', diet_act2:'Actividad ligera (1–3 días/semana)',
    diet_act3:'Actividad moderada (3–5 días/semana)', diet_act4:'Actividad alta (6–7 días/semana)', diet_act5:'Muy activo (atleta / trabajo físico)',
    diet_goal1:'Perder peso', diet_goal2:'Mantener peso', diet_goal3:'Ganar peso',
    diet_goal4:'Definición muscular', diet_goal5:'Tonificación corporal', diet_goal6:'Aumento de masa muscular',
    diet_free_badge:'🎉 ¡Oferta especial — Primeros 21 días completamente gratis!',
    diet_pro_title:'🔒 Plan de dieta completo',
    diet_pro_f1:'Horario de comidas detallado (7 días)', diet_pro_f2:'Lista de alternativas alimentarias',
    diet_pro_f3:'Archivo imprimible y descargable', diet_pro_f4:'Actualización semanal según tu progreso',
    diet_trial:'21 días gratis • Sin tarjeta de crédito', diet_pro_btn:'Comenzar prueba gratuita',
    diet_alert:'Por favor completa la edad, peso y altura',
    about_title:'Sobre nosotros', about_sub:'La historia de Adawati',
    about_p1:'"Adawati" es una colección de herramientas en línea gratuitas y simples, diseñadas para ayudarte a realizar cálculos y tareas diarias rápidamente.',
    about_p2:'Nuestro objetivo es proporcionar herramientas precisas en cualquier dispositivo, protegiendo totalmente tu privacidad — todos los cálculos se realizan en tu navegador.',
    about_p3:'El sitio está en desarrollo continuo, y añadimos nuevas herramientas regularmente.',
    contact_title:'Contáctenos', contact_sub:'¿Sugerencia o problema? Escríbenos',
    contact_name:'Nombre', contact_email:'Correo electrónico', contact_msg:'Mensaje',
    contact_btn:'Enviar mensaje', contact_error:'Por favor completa todos los campos', contact_email_invalid:'Correo electrónico inválido',
    word_placeholder:'Escribe o pega tu texto aquí...',
    signup_btn:'Registrarse', signup_title:'Crear cuenta gratis', signup_name:'Nombre', signup_email:'Correo electrónico',
    signup_submit:'Crear cuenta', signup_welcome:'Bienvenido', signup_logout:'Cerrar sesión',
    signup_note:'Opcional — guarda tus preferencias en este dispositivo',
    auth_password:'Contraseña', auth_google_btn:'Iniciar sesión con Google', auth_switch_to_login:'¿Ya tienes cuenta? Inicia sesión',
    auth_switch_to_signup:'¿No tienes cuenta? Regístrate', auth_or:'o',
    auth_error_weak_password:'La contraseña debe tener al menos 6 caracteres', auth_error_wrong_password:'Correo o contraseña incorrectos',
    auth_error_email_in_use:'Este correo ya está en uso', auth_syncing:'Sincronizando tus favoritos...', auth_signin_title:'Iniciar sesión',
    hero_label:'Herramientas gratuitas para tu uso diario',
    badge_langs:'6 Idiomas', stat_tools:'Herramientas', stat_games:'🎮 Juegos', stat_langs:'Idiomas',
    stat_private:'Procesamiento local', stat_available:'Siempre disponible',
    section_tools:'Todas las herramientas', section_tools_sub:'Elige la herramienta que necesitas',
    footer_desc:'Herramientas gratuitas que funcionan directamente en tu navegador.',
    footer_tools_title:'Herramientas', footer_more_title:'Más', footer_links_title:'Enlaces',
    currency_card_title:'Conversor de divisas', currency_card_desc:'Convierte entre 30+ divisas con tasas en vivo',
    tip_card_title:'Calculadora de propina', tip_card_desc:'Calcula la propina y divide la factura entre amigos',
    qr_card_title:'Generador de QR', qr_card_desc:'Genera un código QR para cualquier enlace o texto',
    tz_card_title:'Conversor de zonas horarias', tz_card_desc:'Encuentra la hora en cualquier ciudad del mundo',
    rng_card_title:'Generador de números aleatorios', rng_card_desc:'Genera números aleatorios para sorteos y juegos',
    sw_card_title:'Cronómetro y temporizador', sw_card_desc:'Cronómetro y temporizador profesional',
    currency_title:'Conversor de divisas', currency_sub:'Tasas de cambio en tiempo real',
    currency_amount:'Cantidad', currency_from:'De', currency_to:'A',
    currency_loading:'Cargando tasas...', currency_offline:'No se pudo cargar las tasas',
    tip_title:'Calculadora de propina', tip_sub:'Calcula la propina y divide la factura',
    tip_bill:'Total de la factura', tip_pct:'Propina %:', tip_people:'Número de personas',
    tip_amount:'Propina', tip_total:'Total', tip_per_person:'Por persona',
    qr_title:'Generador de QR', qr_sub:'Genera un código QR instantáneamente',
    qr_input:'Enlace o texto', qr_placeholder:'https://example.com o cualquier texto...',
    qr_generate:'Generar código', qr_download:'Descargar imagen', qr_hint:'Escribe un enlace o texto para generar el código',
    tz_title:'Conversor de zonas horarias', tz_sub:'Hora actual en el mundo',
    tz_convert:'Convertir una hora', tz_from:'Desde', tz_to:'Hacia',
    rng_title:'Generador aleatorio', rng_sub:'Para sorteos y juegos',
    rng_min:'Mínimo', rng_max:'Máximo', rng_count:'Cantidad:', rng_btn:'🎲 Generar de nuevo', rng_history:'Historial',
    sw_title:'Cronómetro y temporizador', sw_sub:'Cronómetro profesional',
    sw_tab:'Cronómetro', timer_tab:'Temporizador', sw_start:'Iniciar', sw_pause:'Pausar',
    sw_lap:'Vuelta', sw_reset:'Reiniciar', timer_min:'Minutos', timer_sec:'Segundos', timer_done:'⏰ ¡Tiempo terminado!',
    cat_all:'Todos', cat_health:'💪 Salud', cat_money:'💰 Dinero', cat_productivity:'⚙️ Productividad', cat_quick:'⚡ Rápidas',
    search_placeholder:'Buscar herramienta...', search_no_results:'No se encontraron herramientas', related_title:'Herramientas relacionadas',
    pwa_title:'Instalar app', pwa_sub:'Añade Adawati a tu pantalla de inicio', pwa_install:'Instalar', pwa_later:'Después',
    cat_oman:'🌍 Omán', cat_games:'🎮 Juegos', cat_education:'🧒 Educación',
    guess_card_title:'Juego de adivinar número', guess_card_desc:'Adivina el número secreto en el menor número de intentos',
    memory_card_title:'Juego de memoria', memory_card_desc:'Empareja las cartas y pon a prueba tu memoria',
    qmath_card_title:'Desafío de Genios — Matemáticas', qmath_card_desc:'¡100 niveles de Principiante a Leyenda!',
    react_card_title:'Test de Reacción', react_card_desc:'¡Haz clic cuando el botón se ponga verde — sé el más rápido!',
    car_card_title:'Juego de Carros', car_card_desc:'¡Esquiva los autos y bate el récord!',
    jump_card_title:'Juego de Saltos — Plataformas', jump_card_desc:'¡Salta entre plataformas y recoge estrellas!',
    kids_card_title:'Juego Educativo Niños', kids_card_desc:'Números, colores, animales — para niños de 2 a 6 años',
    vat_card_title:'Calculadora IVA Golfo', vat_card_desc:'Calcula el IVA para Omán, Arabia Saudí y EAU',
    sal_card_title:'Calculadora de sueldo — Omán', sal_card_desc:'Calcula tu sueldo neto con deducción SPF',
    eos_card_title:'Calculadora de fin de servicio', eos_card_desc:'Calcula tu gratificación según la ley laboral omaní',
    hijri_card_title:'Convertidor de fecha Hijri', hijri_card_desc:'Convierte entre calendarios hijri y gregoriano',
    pct_card_title:'Porcentaje y Descuento', pct_card_desc:'Calcula porcentajes, descuentos y variaciones',
    ci_card_title:'Interés compuesto', ci_card_desc:'Calcula el crecimiento de tu inversión',
    dd_card_title:'Diferencia entre fechas', dd_card_desc:'Cuenta días, semanas y meses entre dos fechas',
    fc_card_title:'Conversor de archivos', fc_card_desc:'Convierte Word, Excel y CSV en tu navegador',
    ic_card_title:'Compresor de imágenes', ic_card_desc:'Reduce el tamaño sin subir al servidor',
    fav_title:'⭐ Favoritos', recent_title:'✨ Puede que te interese', add_fav:'Añadir a favoritos', remove_fav:'Quitar de favoritos', bottom_nav_favorites:'Favoritos',
    badge_count:'40+ Herramientas', badge_count_lbl:'Herramientas',
    dark_on:'🌙', dark_off:'☀️',
    related_tools:'Herramientas relacionadas:', popular_title:'Herramientas útiles hoy', country_recommended:'Recomendado para',
    eos_title:'Calculadora de fin de servicio — Omán 🇴🇲',
    eos_sub:'Según la Ley Laboral de Omán',
    eos_start:'Fecha de inicio', eos_end:'Fecha de fin',
    eos_salary:'Último salario básico (OMR)', eos_reason:'Motivo de terminación',
    eos_resignation:'Renuncia', eos_termination:'Despido', eos_retirement:'Jubilación',
    eos_result_lbl:'Indemnización por fin de servicio (OMR)',
    eos_years_lbl:'Años de servicio', eos_months_lbl:'Meses adicionales', eos_daily_lbl:'Salario diario (OMR)',
    faq_title:'❓ Preguntas frecuentes',
    ic_title:'Comprimir imágenes', ic_sub:'Funciona en tu navegador — tus imágenes nunca salen de tu dispositivo ✅',
    ic_drop_text:'Haz clic aquí o arrastra tu imagen', ic_drop_sub:'JPG, PNG, WebP — hasta 20MB',
    ic_quality_lbl:'Calidad de compresión:', ic_max_compress:'Máxima compresión', ic_max_quality:'Mejor calidad',
    ic_orig_size_lbl:'Tamaño original', ic_comp_size_lbl:'Tras compresión', ic_savings_lbl:'Ahorro',
    ic_orig_img:'Original', ic_comp_img:'Comprimido', ic_quality_short:'calidad',
    ic_download_btn:'⬇️ Descargar imagen comprimida', ic_another_btn:'🔄 Elegir otra imagen',
    ic_privacy_title:'🔒 Privacidad total',
    ic_privacy_text:'Este compresor funciona en tu navegador con Canvas API. Tu imagen nunca se envía a ningún servidor.',
    ic_small_img:'Imagen ya pequeña — prueba reducir la calidad para más ahorro',
    ic_faq1_q:'¿Se puede comprimir PNG sin pérdida?',
    ic_faq1_a:'El PNG se convierte a JPEG para compresión (con ligera pérdida). Para PNG transparente sin pérdida, reduce las dimensiones en lugar de la calidad.',
    ic_faq2_q:'¿Qué calidad se recomienda para sitios web?',
    ic_faq2_a:'70-80% ofrece buen equilibrio entre tamaño y calidad. Para redes sociales, 60-75% es suficiente.',
    ic_faq3_q:'¿Por qué la imagen comprimida a veces es más grande?',
    ic_faq3_a:'Si la imagen original tiene muy baja calidad o formato PNG, la compresión puede no reducir su tamaño. Intenta bajar más la calidad.',
    pct_sub:'Tres tipos de cálculos en una herramienta',
    pct_tab1:'X% de un número', pct_tab2:'¿Qué porcentaje?', pct_tab3:'Variación %',
    pct_pct:'Porcentaje %', pct_num:'Número', pct_first:'Primer número', pct_second:'Segundo número',
    pct_from_val:'Desde valor', pct_to_val:'Hasta valor', pct_quick_ref_title:'🧮 Referencia rápida',
    pct_increase:'aumento de', pct_decrease:'disminución de', pct_pct_of:'% de', pct_is:'es',
    pct_intro:'Tres tipos de cálculos de porcentaje en una herramienta: encuentra X% de un número (ej. 20% de 500), calcula qué porcentaje representa un número de otro, y calcula el aumento o disminución porcentual. Útil para descuentos, IVA, estadísticas y comparaciones financieras.',
    pct_of:'de', pct_vat5_lbl:'IVA Omán/EAU', pct_tenth_lbl:'Un décimo', pct_vat15_lbl:'IVA Arabia Saudita', pct_fifth_lbl:'Un quinto', pct_quarter_lbl:'Un cuarto', pct_half_lbl:'Mitad',
    pct_ref_table_html:'<table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr style="background:var(--primary);color:#fff;"><th style="padding:9px 12px;text-align:start;">Tipo de cálculo</th><th style="padding:9px 12px;text-align:start;">Fórmula</th><th style="padding:9px 12px;text-align:start;">Ejemplo</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X% de un número</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">Número × porcentaje ÷ 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">20% de 500 = <strong>100</strong></td></tr><tr style="background:var(--surface-2);"><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">¿X es qué % de Y?</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">(X ÷ Y) × 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">30 de 150 = <strong>20%</strong></td></tr><tr><td style="padding:8px 12px;font-weight:700;">Variación %</td><td style="padding:8px 12px;font-family:monospace;">((Nuevo − Antiguo) ÷ Antiguo) × 100</td><td style="padding:8px 12px;color:var(--text-muted);">de 100 a 130 = <strong>+30%</strong></td></tr></tbody></table>',
    ci_sub:'Calcula cómo crece tu inversión con interés compuesto',
    ci_principal:'Capital inicial', ci_rate:'Tasa de interés anual %', ci_years:'Duración (años)',
    ci_freq:'Frecuencia de capitalización', ci_monthly:'Adición mensual opcional',
    ci_annually:'Anualmente', ci_quarterly:'Trimestralmente', ci_monthly_f:'Mensualmente', ci_daily:'Diariamente',
    ci_result_lbl:'Cantidad final', ci_capital_lbl:'Capital original', ci_interest_lbl:'Interés total', ci_additions_lbl:'Adiciones totales',
    ci_table_title:'📊 Tabla de crecimiento anual',
    ci_th_year:'Año', ci_th_amount:'Cantidad', ci_th_int_added:'Interés añadido', ci_th_total_int:'Interés total',
    dd_sub:'Días, semanas, meses y años entre dos fechas',
    dd_from_lbl:'Primera fecha (desde)', dd_to_lbl:'Segunda fecha (hasta)',
    dd_preset_today:'Desde hoy', dd_preset_ny:'Hasta Año Nuevo', dd_preset_ramadan:'Hasta Ramadán 2027',
    dd_result_lbl:'días en total', dd_years_lbl:'Año', dd_months_lbl:'Mes', dd_days_lbl:'Día',
    dd_weeks_lbl:'Semana', dd_hours_lbl:'Hora', dd_workdays_lbl:'Día laboral (aprox.)', dd_upcoming_title:'⚡ Próximos eventos',
    vat_sub:'Omán • Arabia Saudita • EAU • Baréin',
    vat_country_lbl:'País', vat_mode_lbl:'Tipo de cálculo', vat_add_mode:'Añadir impuesto', vat_extract_mode:'Extraer impuesto',
    vat_amount_before:'Monto antes de impuesto', vat_amount_after:'Monto con impuesto',
    vat_rate_lbl:'Tasa de impuesto', vat_tax_lbl:'Monto del impuesto', vat_total_lbl:'Total con impuesto', vat_table_title:'IVA en el Golfo',
    sal_sub:'Calcula tu salario neto con deducción SPF',
    sal_nationality_lbl:'Nacionalidad', sal_omani:'Omaní (deducción SPF 8%)', sal_expat:'Expatriado (sin SPF)',
    sal_basic_lbl:'Salario básico (OMR)', sal_housing_lbl:'Subsidio vivienda (OMR)',
    sal_transport_lbl:'Subsidio transporte (OMR)', sal_other_lbl:'Otros subsidios (OMR)',
    sal_net_lbl:'Salario neto (OMR)', sal_gross_lbl:'Bruto antes de deducción',
    sal_annual_lbl:'Salario anual', sal_pasi_lbl:'Deducción SPF (8%)', sal_info_title:'📌 Información SPF en Omán',
    hij_sub:'Conversión instantánea y precisa en ambas direcciones',
    hij_mode_gh:'🗓️ Gregoriano → Hijri', hij_mode_hg:'🌙 Hijri → Gregoriano',
    hij_greg_date_lbl:'Seleccionar fecha gregoriana',
    hij_day_lbl:'Día', hij_month_lbl:'Mes Hijri', hij_year_lbl:'Año Hijri',
    hij_today_title:'📅 Fecha Hijri de hoy', hij_months_title:'🌙 Meses Hijri',
  },
  de: {
    nav_home:'Startseite', nav_about:'Über uns', nav_contact:'Kontakt',
    back:'← Zurück zur Startseite', footer_about:'Über uns', footer_contact:'Kontakt',
    footer_copy:'© 2026 Adawati — Kostenlose Tools; die meisten laufen lokal in Ihrem Browser',
    hero_title:'Kostenlose Online-Tools zum Berechnen, Konvertieren und Produktivsein',
    hero_sub:'Schnelle und genaue Tools, die direkt in Ihrem Browser funktionieren — ohne Registrierung, 100% kostenlos',
    badge_count:'40+ Tools', badge_free:'100% Kostenlos', badge_noreg:'Ohne Registrierung', badge_privacy:'Lokale Verarbeitung',
cty_global:'Global', cty_om:'Oman', cty_ae:'Vereinigte Arabische Emirate', cty_sa:'Saudi-Arabien', cty_us:'USA', cty_uk:'Vereinigtes Königreich', cty_jo:'Jordanien', cty_in:'Indien', cty_pk:'Pakistan', cty_bd:'Bangladesch', cty_eg:'Ägypten', cty_ph:'Philippinen', badge_privacy_full:'Die meisten Tools funktionieren lokal in Ihrem Browser', badge_count_full:'40+ Tools & Anleitungen',
    bmi_card_title:'BMI-Rechner', bmi_card_desc:'Berechnen Sie Ihren Body-Mass-Index',
    diet_card_title:'Kalorienrechner', diet_card_desc:'Berechnen Sie Ihren täglichen Bedarf + Ernährungsplan',
    loan_card_title:'Kreditrechner', loan_card_desc:'Berechnen Sie die Raten für jeden Kredit',
    age_card_title:'Altersrechner', age_card_desc:'Ihr genaues Alter in Jahren, Monaten und Tagen',
    discount_card_title:'Rabattrechner', discount_card_desc:'Prozentsätze und Rabatte sofort berechnen',
    unit_card_title:'Einheitenumrechner', unit_card_desc:'Konvertieren Sie Längen- und Gewichtseinheiten',
    pass_card_title:'Passwort-Generator', pass_card_desc:'Starke Passwörter mit einem Klick',
    word_card_title:'Wörterzähler', word_card_desc:'Sofortzähler für Ihre Texte',
    start:'Starten →',
    bmi_title:'BMI-Rechner', bmi_sub:'Kennen Sie Ihren Gesundheitsstatus in Sekunden',
    bmi_weight:'Gewicht (kg)', bmi_height:'Größe (cm)', bmi_btn:'BMI berechnen',
    bmi_underweight:'Untergewicht', bmi_normal:'Normalgewicht ✓', bmi_overweight:'Übergewicht', bmi_obese:'Fettleibigkeit', bmi_invalid:'Bitte gültige Zahlen eingeben',
    age_title:'Altersrechner', age_sub:'Ihr genaues Alter in Jahren, Monaten und Tagen',
    age_label:'Geburtsdatum', age_btn:'Mein Alter berechnen',
    age_years:'Jahre', age_months:'Monate', age_days:'Tage', age_total:'Gesamttage', age_next:'Tage bis zum Geburtstag', age_alert:'Bitte wählen Sie Ihr Geburtsdatum',
    loan_title:'Kreditrechner', loan_sub:'Berechnen Sie die Raten für jeden Kredit',
    loan_amount:'Kreditbetrag', loan_rate:'Jährlicher Zinssatz %', loan_years:'Laufzeit (Jahre)',
    loan_monthly:'Monatliche Rate', loan_total:'Gesamtzahlung', loan_interest:'Gesamtzinsen',
    discount_title:'Rabattrechner', discount_sub:'Prozentsätze und Rabatte schnell berechnen',
    tab_percent:'Prozentsatz', tab_discount:'Rabatt',
    percent_label1:'Wie viel ist', percent_label2:'% der Zahl',
    discount_label1:'Originalpreis', discount_label2:'Rabatt %',
    unit_title:'Einheitenumrechner', unit_sub:'Konvertieren Sie Längen- und Gewichtseinheiten',
    tab_length:'Länge', tab_weight:'Gewicht', unit_value:'Wert', unit_from:'Von', unit_to:'Nach',
    pass_title:'Passwort-Generator', pass_sub:'Starke und sichere Passwörter mit einem Klick',
    pass_length:'Länge:', pass_numbers:'Zahlen (0–9)', pass_symbols:'Symbole (!@#$)', pass_upper:'Großbuchstaben',
    pass_btn:'Neues Passwort generieren', pass_copied:'Kopiert ✓',
    word_title:'Wörter- und Zeichenzähler', word_sub:'Sofortzähler für Ihre Texte',
    word_words:'Wörter', word_chars:'Zeichen', word_nospace:'Ohne Leerzeichen', word_sentences:'Sätze',
    diet_title:'Kalorienrechner', diet_sub:'Berechnen Sie Ihren täglichen Bedarf',
    diet_gender:'Geschlecht', diet_male:'Männlich', diet_female:'Weiblich',
    diet_age:'Alter', diet_weight:'Gewicht (kg)', diet_height:'Größe (cm)',
    diet_activity:'Aktivitätsniveau', diet_goal:'Ziel', diet_btn:'Meinen täglichen Bedarf berechnen',
    diet_calories:'Kalorien pro Tag', diet_protein:'Protein (g)', diet_carb:'Kohlenhydrate (g)', diet_fat:'Fett (g)',
    diet_act1:'Sitzend (Bürojob)', diet_act2:'Leichte Aktivität (1–3 Tage/Woche)',
    diet_act3:'Mäßige Aktivität (3–5 Tage/Woche)', diet_act4:'Hohe Aktivität (6–7 Tage/Woche)', diet_act5:'Sehr aktiv (Athlet / körperliche Arbeit)',
    diet_goal1:'Gewicht verlieren', diet_goal2:'Gewicht halten', diet_goal3:'Gewicht zunehmen',
    diet_goal4:'Körperdefinition', diet_goal5:'Körperstraffung', diet_goal6:'Muskelaufbau',
    diet_free_badge:'🎉 Sonderangebot — Erste 21 Tage völlig kostenlos!',
    diet_pro_title:'🔒 Vollständiger Ernährungsplan',
    diet_pro_f1:'Detaillierter Mahlzeitenplan (7 Tage)', diet_pro_f2:'Liste von Lebensmittelalternativen',
    diet_pro_f3:'Druckbare und herunterladbare Datei', diet_pro_f4:'Wöchentliche Aktualisierung',
    diet_trial:'21 Tage kostenlos • Keine Kreditkarte', diet_pro_btn:'Kostenlose Testversion starten',
    diet_alert:'Bitte Alter, Gewicht und Größe eingeben',
    about_title:'Über uns', about_sub:'Die Geschichte von Adawati',
    about_p1:'"Adawati" ist eine Sammlung kostenloser Online-Tools, die entwickelt wurden, um tägliche Berechnungen schnell und unkompliziert zu erledigen.',
    about_p2:'Unser Ziel ist es, genaue Tools auf jedem Gerät bereitzustellen und dabei Ihre Privatsphäre vollständig zu schützen — alle Berechnungen erfolgen in Ihrem Browser.',
    about_p3:'Die Website wird kontinuierlich weiterentwickelt, und wir fügen regelmäßig neue Tools hinzu.',
    contact_title:'Kontaktieren Sie uns', contact_sub:'Vorschlag oder Problem? Schreiben Sie uns',
    contact_name:'Name', contact_email:'E-Mail-Adresse', contact_msg:'Nachricht',
    contact_btn:'Nachricht senden', contact_error:'Bitte alle Felder ausfüllen', contact_email_invalid:'Ungültige E-Mail-Adresse',
    word_placeholder:'Geben Sie Ihren Text hier ein oder fügen Sie ihn ein...',
    signup_btn:'Registrieren', signup_title:'Kostenloses Konto erstellen', signup_name:'Name', signup_email:'E-Mail',
    signup_submit:'Konto erstellen', signup_welcome:'Willkommen', signup_logout:'Abmelden',
    signup_note:'Optional — Einstellungen auf diesem Gerät speichern',
    auth_password:'Passwort', auth_google_btn:'Mit Google anmelden', auth_switch_to_login:'Schon ein Konto? Anmelden',
    auth_switch_to_signup:'Kein Konto? Registrieren', auth_or:'oder',
    auth_error_weak_password:'Das Passwort muss mindestens 6 Zeichen lang sein', auth_error_wrong_password:'Falsche E-Mail oder falsches Passwort',
    auth_error_email_in_use:'Diese E-Mail wird bereits verwendet', auth_syncing:'Favoriten werden synchronisiert...', auth_signin_title:'Anmelden',
    hero_label:'Kostenlose Tools für den täglichen Gebrauch',
    badge_langs:'6 Sprachen', stat_tools:'Kostenlose Tools', stat_games:'🎮 Spiele', stat_langs:'Sprachen',
    stat_private:'Lokale Verarbeitung', stat_available:'Immer verfügbar',
    section_tools:'Alle Tools', section_tools_sub:'Wählen Sie das benötigte Tool',
    footer_desc:'Kostenlose Online-Tools, die direkt in Ihrem Browser funktionieren.',
    footer_tools_title:'Tools', footer_more_title:'Mehr', footer_links_title:'Links',
    currency_card_title:'Währungsrechner', currency_card_desc:'Konvertieren Sie zwischen 30+ Währungen mit Live-Kursen',
    tip_card_title:'Trinkgeldrechner', tip_card_desc:'Berechnen Sie Trinkgeld und teilen Sie die Rechnung',
    qr_card_title:'QR-Code-Generator', qr_card_desc:'Erstellen Sie sofort einen QR-Code für jeden Link',
    tz_card_title:'Zeitzonenrechner', tz_card_desc:'Finden Sie die aktuelle Zeit in jeder Stadt der Welt',
    rng_card_title:'Zufallszahlengenerator', rng_card_desc:'Generieren Sie Zufallszahlen für Lotterien und Spiele',
    sw_card_title:'Stoppuhr und Timer', sw_card_desc:'Professionelle Stoppuhr und Countdown-Timer',
    currency_title:'Währungsrechner', currency_sub:'Live-Wechselkurse',
    currency_amount:'Betrag', currency_from:'Von', currency_to:'Nach',
    currency_loading:'Kurse werden geladen...', currency_offline:'Kurse konnten nicht geladen werden',
    tip_title:'Trinkgeldrechner', tip_sub:'Berechnen Sie Trinkgeld einfach',
    tip_bill:'Gesamtrechnung', tip_pct:'Trinkgeld %:', tip_people:'Anzahl Personen',
    tip_amount:'Trinkgeld', tip_total:'Gesamt', tip_per_person:'Pro Person',
    qr_title:'QR-Code-Generator', qr_sub:'Sofort QR-Code erstellen',
    qr_input:'Link oder Text', qr_placeholder:'https://example.com oder beliebiger Text...',
    qr_generate:'Code generieren', qr_download:'Bild herunterladen', qr_hint:'Geben Sie einen Link oder Text ein',
    tz_title:'Zeitzonenrechner', tz_sub:'Aktuelle Zeit weltweit',
    tz_convert:'Bestimmte Zeit umrechnen', tz_from:'Von Zone', tz_to:'Nach Zone',
    rng_title:'Zufallszahlengenerator', rng_sub:'Für Lotterien und Spiele',
    rng_min:'Minimum', rng_max:'Maximum', rng_count:'Anzahl:', rng_btn:'🎲 Erneut generieren', rng_history:'Verlauf',
    sw_title:'Stoppuhr und Timer', sw_sub:'Professionelle Stoppuhr',
    sw_tab:'Stoppuhr', timer_tab:'Timer', sw_start:'Starten', sw_pause:'Pause',
    sw_lap:'Runde', sw_reset:'Zurücksetzen', timer_min:'Minuten', timer_sec:'Sekunden', timer_done:'⏰ Zeit abgelaufen!',
    cat_all:'Alle', cat_health:'💪 Gesundheit', cat_money:'💰 Geld', cat_productivity:'⚙️ Produktivität', cat_quick:'⚡ Schnell',
    search_placeholder:'Werkzeug suchen...', search_no_results:'Kein Werkzeug gefunden', related_title:'Ähnliche Werkzeuge',
    pwa_title:'App installieren', pwa_sub:'Adawati zum Startbildschirm hinzufügen', pwa_install:'Installieren', pwa_later:'Später',
    cat_oman:'🌍 Oman', cat_games:'🎮 Spiele', cat_education:'🧒 Kinder',
    guess_card_title:'Zahlen-Ratespiel', guess_card_desc:'Errate die geheime Zahl in so wenig Versuchen wie möglich',
    memory_card_title:'Gedächtnisspiel', memory_card_desc:'Paare die Karten und teste dein Gedächtnis',
    qmath_card_title:'Genie-Herausforderung — Mathe', qmath_card_desc:'100 Level von Anfänger bis Legende!',
    react_card_title:'Reaktionstest', react_card_desc:'Klicke wenn der Button grün wird — sei der Schnellste!',
    car_card_title:'Autorennspiel', car_card_desc:'Weiche den Autos aus und schlage den Highscore!',
    jump_card_title:'Sprung-Spiel — Plattformer', jump_card_desc:'Springe zwischen Plattformen und sammle Sterne!',
    kids_card_title:'Kinderlernspiel', kids_card_desc:'Zahlen, Farben, Tiere — für Kinder von 2 bis 6 Jahren',
    vat_card_title:'Mehrwertsteuer-Rechner Golf', vat_card_desc:'MwSt. für Oman, Saudi-Arabien und VAE berechnen',
    sal_card_title:'Gehaltsrechner — Oman', sal_card_desc:'Nettogehalt mit SPF-Abzug berechnen',
    eos_card_title:'Abfindungsrechner', eos_card_desc:'Abfindung nach omanischem Arbeitsrecht berechnen',
    hijri_card_title:'Hijri-Datumskonverter', hijri_card_desc:'Zwischen Hijri- und gregorianischem Kalender konvertieren',
    pct_card_title:'Prozent & Rabatt', pct_card_desc:'Prozentsätze, Rabatte und Änderungen berechnen',
    ci_card_title:'Zinseszins-Rechner', ci_card_desc:'Investitionswachstum berechnen',
    dd_card_title:'Datumsdifferenz', dd_card_desc:'Tage, Wochen und Monate zwischen zwei Daten zählen',
    fc_card_title:'Datei-Konverter', fc_card_desc:'Word, Excel und CSV im Browser konvertieren',
    ic_card_title:'Bildkompressor', ic_card_desc:'Bildgröße ohne Server-Upload reduzieren',
    fav_title:'⭐ Favoriten', recent_title:'✨ Das könnte Sie interessieren', add_fav:'Zu Favoriten hinzufügen', remove_fav:'Aus Favoriten entfernen', bottom_nav_favorites:'Favoriten',
    badge_count:'40+ Tools', badge_count_lbl:'Tools',
    dark_on:'🌙', dark_off:'☀️',
    related_tools:'Verwandte Tools:', popular_title:'Nützliche Tools heute', country_recommended:'Empfohlen für',
    eos_title:'Abfindungsrechner — Oman 🇴🇲',
    eos_sub:'Gemäß dem omanischen Arbeitsrecht',
    eos_start:'Startdatum', eos_end:'Enddatum',
    eos_salary:'Letztes Grundgehalt (OMR)', eos_reason:'Beendigungsgrund',
    eos_resignation:'Kündigung', eos_termination:'Entlassung', eos_retirement:'Rente',
    eos_result_lbl:'Abfindung (OMR)',
    eos_years_lbl:'Dienstjahre', eos_months_lbl:'Zusätzliche Monate', eos_daily_lbl:'Tageslohn (OMR)',
    faq_title:'❓ Häufige Fragen',
    ic_title:'Bilder komprimieren', ic_sub:'Läuft in Ihrem Browser — Ihre Bilder verlassen nie Ihr Gerät ✅',
    ic_drop_text:'Hier klicken oder Bild hierher ziehen', ic_drop_sub:'JPG, PNG, WebP — bis zu 20MB',
    ic_quality_lbl:'Komprimierungsqualität:', ic_max_compress:'Max. Komprimierung', ic_max_quality:'Beste Qualität',
    ic_orig_size_lbl:'Originalgröße', ic_comp_size_lbl:'Nach Komprimierung', ic_savings_lbl:'Ersparnis',
    ic_orig_img:'Original', ic_comp_img:'Komprimiert', ic_quality_short:'Qualität',
    ic_download_btn:'⬇️ Komprimiertes Bild herunterladen', ic_another_btn:'🔄 Anderes Bild wählen',
    ic_privacy_title:'🔒 Vollständige Privatsphäre',
    ic_privacy_text:'Dieser Kompressor läuft vollständig in Ihrem Browser via Canvas API. Ihr Bild wird nie an einen Server gesendet.',
    ic_small_img:'Bild ist bereits klein — versuchen Sie, die Qualität weiter zu reduzieren',
    ic_faq1_q:'Kann PNG verlustfrei komprimiert werden?',
    ic_faq1_a:'PNG wird für die Komprimierung in JPEG konvertiert (mit leichtem Verlust). Für transparentes PNG ohne Verlust reduzieren Sie stattdessen die Abmessungen.',
    ic_faq2_q:'Welche Qualität wird für Websites empfohlen?',
    ic_faq2_a:'70-80% bietet eine gute Balance zwischen Größe und Qualität. Für Social-Media-Uploads sind 60-75% ausreichend.',
    ic_faq3_q:'Warum ist das komprimierte Bild manchmal größer?',
    ic_faq3_a:'Wenn das Originalbild sehr niedrige Qualität hat oder im PNG-Format ist, kann die Komprimierung die Größe nicht reduzieren. Senken Sie die Qualität weiter.',
    pct_sub:'Drei Arten von Berechnungen in einem Tool',
    pct_tab1:'X% einer Zahl', pct_tab2:'Welcher Prozentsatz?', pct_tab3:'% Änderung',
    pct_pct:'Prozentsatz %', pct_num:'Zahl', pct_first:'Erste Zahl', pct_second:'Zweite Zahl',
    pct_from_val:'Von Wert', pct_to_val:'Zu Wert', pct_quick_ref_title:'🧮 Schnellreferenz',
    pct_increase:'Zunahme von', pct_decrease:'Abnahme von', pct_pct_of:'% von', pct_is:'ist',
    pct_intro:'Drei Berechnungsarten in einem Tool: X% einer Zahl berechnen (z.B. 20% von 500), ermitteln, wie viel Prozent eine Zahl von einer anderen ausmacht, und die prozentuale Änderung berechnen. Nützlich für Rabatte, MwSt., Statistiken und Finanzvergleiche.',
    pct_of:'von', pct_vat5_lbl:'MwSt. Oman/VAE', pct_tenth_lbl:'Ein Zehntel', pct_vat15_lbl:'MwSt. Saudi-Arabien', pct_fifth_lbl:'Ein Fünftel', pct_quarter_lbl:'Ein Viertel', pct_half_lbl:'Hälfte',
    pct_ref_table_html:'<table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr style="background:var(--primary);color:#fff;"><th style="padding:9px 12px;text-align:start;">Berechnungstyp</th><th style="padding:9px 12px;text-align:start;">Formel</th><th style="padding:9px 12px;text-align:start;">Beispiel</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X% einer Zahl</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">Zahl × Prozent ÷ 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">20% von 500 = <strong>100</strong></td></tr><tr style="background:var(--surface-2);"><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X ist wieviel % von Y?</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">(X ÷ Y) × 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">30 von 150 = <strong>20%</strong></td></tr><tr><td style="padding:8px 12px;font-weight:700;">% Änderung</td><td style="padding:8px 12px;font-family:monospace;">((Neu − Alt) ÷ Alt) × 100</td><td style="padding:8px 12px;color:var(--text-muted);">von 100 auf 130 = <strong>+30%</strong></td></tr></tbody></table>',
    ci_sub:'Berechnen Sie das Wachstum Ihrer Investition mit Zinseszins',
    ci_principal:'Kapital (Anfangsbetrag)', ci_rate:'Jährlicher Zinssatz %', ci_years:'Laufzeit (Jahre)',
    ci_freq:'Verzinsungsfrequenz', ci_monthly:'Optionale monatliche Ergänzung',
    ci_annually:'Jährlich', ci_quarterly:'Vierteljährlich', ci_monthly_f:'Monatlich', ci_daily:'Täglich',
    ci_result_lbl:'Endbetrag', ci_capital_lbl:'Anfangskapital', ci_interest_lbl:'Gesamtzinsen', ci_additions_lbl:'Gesamtergänzungen',
    ci_table_title:'📊 Jährliche Wachstumstabelle',
    ci_th_year:'Jahr', ci_th_amount:'Betrag', ci_th_int_added:'Zinsen hinzugefügt', ci_th_total_int:'Gesamtzinsen',
    dd_sub:'Tage, Wochen, Monate und Jahre zwischen zwei Daten',
    dd_from_lbl:'Erstes Datum (von)', dd_to_lbl:'Zweites Datum (bis)',
    dd_preset_today:'Ab heute', dd_preset_ny:'Bis Neujahr', dd_preset_ramadan:'Bis Ramadan 2027',
    dd_result_lbl:'Tage gesamt', dd_years_lbl:'Jahr', dd_months_lbl:'Monat', dd_days_lbl:'Tag',
    dd_weeks_lbl:'Woche', dd_hours_lbl:'Stunde', dd_workdays_lbl:'Arbeitstag (ca.)', dd_upcoming_title:'⚡ Bevorstehende Ereignisse',
    vat_sub:'Oman • Saudi-Arabien • VAE • Bahrain',
    vat_country_lbl:'Land', vat_mode_lbl:'Berechnungsart', vat_add_mode:'Steuer hinzufügen', vat_extract_mode:'Steuer extrahieren',
    vat_amount_before:'Betrag vor Steuer', vat_amount_after:'Betrag inkl. Steuer',
    vat_rate_lbl:'Steuersatz', vat_tax_lbl:'Steuerbetrag', vat_total_lbl:'Gesamt inkl. Steuer', vat_table_title:'MwSt. am Golf',
    sal_sub:'Berechnen Sie Ihr Nettogehalt mit SPF-Abzug',
    sal_nationality_lbl:'Nationalität', sal_omani:'Omanisch (8% SPF-Abzug)', sal_expat:'Ausländer (ohne SPF)',
    sal_basic_lbl:'Grundgehalt (OMR)', sal_housing_lbl:'Wohnungszulage (OMR)',
    sal_transport_lbl:'Transportzulage (OMR)', sal_other_lbl:'Andere Zulagen (OMR)',
    sal_net_lbl:'Nettogehalt (OMR)', sal_gross_lbl:'Brutto vor Abzug',
    sal_annual_lbl:'Jahresgehalt', sal_pasi_lbl:'SPF-Abzug (8%)', sal_info_title:'📌 SPF-Informationen in Oman',
    hij_sub:'Sofortige und genaue Konvertierung in beide Richtungen',
    hij_mode_gh:'🗓️ Gregorianisch → Hijri', hij_mode_hg:'🌙 Hijri → Gregorianisch',
    hij_greg_date_lbl:'Gregorianisches Datum auswählen',
    hij_day_lbl:'Tag', hij_month_lbl:'Hijri-Monat', hij_year_lbl:'Hijri-Jahr',
    hij_today_title:'📅 Heutiges Hijri-Datum', hij_months_title:'🌙 Hijri-Monate',
  },
  ru: {
    nav_home:'Главная', nav_about:'О нас', nav_contact:'Контакт',
    back:'← Назад на главную', footer_about:'О нас', footer_contact:'Контакт',
    footer_copy:'© 2026 Adawati — Бесплатные инструменты; большинство работает локально в браузере',
    hero_title:'Бесплатные онлайн-инструменты для расчётов, конвертации и продуктивности',
    hero_sub:'Быстрые и точные инструменты, работающие прямо в вашем браузере — без регистрации, 100% бесплатно',
    badge_count:'40+ инструментов', badge_free:'100% бесплатно', badge_noreg:'Без регистрации', badge_privacy:'Локальная обработка',
cty_global:'Глобально', cty_om:'Оман', cty_ae:'ОАЭ', cty_sa:'Саудовская Аравия', cty_us:'США', cty_uk:'Великобритания', cty_jo:'Иордания', cty_in:'Индия', cty_pk:'Пакистан', cty_bd:'Бангладеш', cty_eg:'Египет', cty_ph:'Филиппины', badge_privacy_full:'Большинство инструментов работают локально в вашем браузере', badge_count_full:'40+ инструментов и гидов',
    bmi_card_title:'Калькулятор ИМТ', bmi_card_desc:'Вычислите индекс массы тела',
    diet_card_title:'Калькулятор калорий', diet_card_desc:'Рассчитайте ежедневные потребности + план питания',
    loan_card_title:'Калькулятор платежей', loan_card_desc:'Рассчитайте платежи по любому кредиту',
    age_card_title:'Калькулятор возраста', age_card_desc:'Ваш точный возраст в годах, месяцах и днях',
    discount_card_title:'Калькулятор скидок', discount_card_desc:'Мгновенный расчёт процентов и скидок',
    unit_card_title:'Конвертер единиц', unit_card_desc:'Конвертируйте единицы длины и веса',
    pass_card_title:'Генератор паролей', pass_card_desc:'Надёжные пароли одним кликом',
    word_card_title:'Счётчик слов', word_card_desc:'Мгновенный счётчик для ваших текстов',
    start:'Начать →',
    bmi_title:'Калькулятор ИМТ', bmi_sub:'Узнайте своё состояние здоровья за секунды',
    bmi_weight:'Вес (кг)', bmi_height:'Рост (см)', bmi_btn:'Рассчитать ИМТ',
    bmi_underweight:'Недостаточный вес', bmi_normal:'Нормальный вес ✓', bmi_overweight:'Избыточный вес', bmi_obese:'Ожирение', bmi_invalid:'Пожалуйста, введите корректные числа',
    age_title:'Калькулятор возраста', age_sub:'Ваш точный возраст в годах, месяцах и днях',
    age_label:'Дата рождения', age_btn:'Рассчитать мой возраст',
    age_years:'Лет', age_months:'Месяцев', age_days:'Дней', age_total:'Всего дней', age_next:'Дней до дня рождения', age_alert:'Пожалуйста, выберите дату рождения',
    loan_title:'Калькулятор платежей', loan_sub:'Рассчитайте платежи по любому кредиту',
    loan_amount:'Сумма кредита', loan_rate:'Годовая процентная ставка %', loan_years:'Срок погашения (лет)',
    loan_monthly:'Ежемесячный платёж', loan_total:'Итого выплачено', loan_interest:'Итого процентов',
    discount_title:'Калькулятор скидок', discount_sub:'Быстрый расчёт процентов и скидок',
    tab_percent:'Процент', tab_discount:'Скидка',
    percent_label1:'Сколько составляет', percent_label2:'% от числа',
    discount_label1:'Исходная цена', discount_label2:'Скидка %',
    unit_title:'Конвертер единиц', unit_sub:'Конвертируйте единицы длины и веса',
    tab_length:'Длина', tab_weight:'Вес', unit_value:'Значение', unit_from:'Из', unit_to:'В',
    pass_title:'Генератор паролей', pass_sub:'Надёжные и безопасные пароли одним кликом',
    pass_length:'Длина:', pass_numbers:'Цифры (0–9)', pass_symbols:'Символы (!@#$)', pass_upper:'Заглавные буквы',
    pass_btn:'Создать новый пароль', pass_copied:'Скопировано ✓',
    word_title:'Счётчик слов и символов', word_sub:'Мгновенный счётчик для ваших текстов',
    word_words:'Слов', word_chars:'Символов', word_nospace:'Без пробелов', word_sentences:'Предложений',
    diet_title:'Калькулятор калорий', diet_sub:'Рассчитайте ежедневные потребности',
    diet_gender:'Пол', diet_male:'Мужской', diet_female:'Женский',
    diet_age:'Возраст', diet_weight:'Вес (кг)', diet_height:'Рост (см)',
    diet_activity:'Уровень активности', diet_goal:'Цель', diet_btn:'Рассчитать мои потребности',
    diet_calories:'Калорий в день', diet_protein:'Белки (г)', diet_carb:'Углеводы (г)', diet_fat:'Жиры (г)',
    diet_act1:'Сидячий образ жизни', diet_act2:'Лёгкая активность (1–3 дня/неделю)',
    diet_act3:'Умеренная активность (3–5 дней/неделю)', diet_act4:'Высокая активность (6–7 дней/неделю)', diet_act5:'Очень активный (спортсмен / физический труд)',
    diet_goal1:'Похудеть', diet_goal2:'Сохранить вес', diet_goal3:'Набрать вес',
    diet_goal4:'Сушка тела', diet_goal5:'Тонус тела', diet_goal6:'Набор мышечной массы',
    diet_free_badge:'🎉 Специальное предложение — первые 21 день бесплатно!',
    diet_pro_title:'🔒 Полный план питания',
    diet_pro_f1:'Подробный план питания (7 дней)', diet_pro_f2:'Список альтернативных продуктов',
    diet_pro_f3:'Файл для печати и скачивания', diet_pro_f4:'Еженедельное обновление',
    diet_trial:'21 день бесплатно • Без кредитной карты', diet_pro_btn:'Начать бесплатный пробный период',
    diet_alert:'Пожалуйста, заполните возраст, вес и рост',
    about_title:'О нас', about_sub:'История Adawati',
    about_p1:'"Adawati" — это коллекция бесплатных онлайн-инструментов для быстрого выполнения ежедневных вычислений.',
    about_p2:'Наша цель — предоставить точные инструменты на любом устройстве, полностью защищая вашу конфиденциальность — все вычисления выполняются в вашем браузере.',
    about_p3:'Сайт постоянно развивается, и мы регулярно добавляем новые инструменты.',
    contact_title:'Свяжитесь с нами', contact_sub:'Есть предложение или проблема? Напишите нам',
    contact_name:'Имя', contact_email:'Электронная почта', contact_msg:'Сообщение',
    contact_btn:'Отправить сообщение', contact_error:'Пожалуйста, заполните все поля', contact_email_invalid:'Неверный адрес электронной почты',
    word_placeholder:'Введите или вставьте текст здесь...',
    signup_btn:'Регистрация', signup_title:'Создать бесплатный аккаунт', signup_name:'Имя', signup_email:'Электронная почта',
    signup_submit:'Создать аккаунт', signup_welcome:'Добро пожаловать', signup_logout:'Выйти',
    signup_note:'Необязательно — сохраняйте настройки на этом устройстве',
    auth_password:'Пароль', auth_google_btn:'Войти через Google', auth_switch_to_login:'Уже есть аккаунт? Войти',
    auth_switch_to_signup:'Нет аккаунта? Зарегистрироваться', auth_or:'или',
    auth_error_weak_password:'Пароль должен содержать не менее 6 символов', auth_error_wrong_password:'Неверный email или пароль',
    auth_error_email_in_use:'Этот email уже используется', auth_syncing:'Синхронизация избранного...', auth_signin_title:'Вход',
    hero_label:'Бесплатные инструменты для ежедневного использования',
    badge_langs:'6 Языков', stat_tools:'Бесплатных инструментов', stat_games:'🎮 Игры', stat_langs:'Языков',
    stat_private:'Локальная обработка', stat_available:'Всегда доступен',
    section_tools:'Все инструменты', section_tools_sub:'Выберите нужный инструмент',
    footer_desc:'Бесплатные онлайн-инструменты, работающие прямо в вашем браузере.',
    footer_tools_title:'Инструменты', footer_more_title:'Ещё', footer_links_title:'Ссылки',
    currency_card_title:'Конвертер валют', currency_card_desc:'Конвертируйте между 30+ валютами по актуальным курсам',
    tip_card_title:'Калькулятор чаевых', tip_card_desc:'Рассчитайте чаевые и разделите счёт между друзьями',
    qr_card_title:'Генератор QR-кода', qr_card_desc:'Создайте QR-код для любой ссылки или текста мгновенно',
    tz_card_title:'Конвертер часовых поясов', tz_card_desc:'Узнайте текущее время в любом городе мира',
    rng_card_title:'Генератор случайных чисел', rng_card_desc:'Генерируйте случайные числа для розыгрышей и игр',
    sw_card_title:'Секундомер и таймер', sw_card_desc:'Профессиональный секундомер и таймер обратного отсчёта',
    currency_title:'Конвертер валют', currency_sub:'Актуальные обменные курсы',
    currency_amount:'Сумма', currency_from:'Из', currency_to:'В',
    currency_loading:'Загрузка курсов...', currency_offline:'Не удалось загрузить курсы',
    tip_title:'Калькулятор чаевых', tip_sub:'Рассчитайте чаевые и разделите счёт',
    tip_bill:'Итого по счёту', tip_pct:'Чаевые %:', tip_people:'Количество человек',
    tip_amount:'Чаевые', tip_total:'Итого', tip_per_person:'На человека',
    qr_title:'Генератор QR-кода', qr_sub:'Мгновенно создайте QR-код',
    qr_input:'Ссылка или текст', qr_placeholder:'https://example.com или любой текст...',
    qr_generate:'Создать код', qr_download:'Скачать изображение', qr_hint:'Введите ссылку или текст для генерации кода',
    tz_title:'Конвертер часовых поясов', tz_sub:'Текущее время по всему миру',
    tz_convert:'Конвертировать время', tz_from:'Из зоны', tz_to:'В зону',
    rng_title:'Генератор случайных чисел', rng_sub:'Для розыгрышей и игр',
    rng_min:'Минимум', rng_max:'Максимум', rng_count:'Количество:', rng_btn:'🎲 Сгенерировать снова', rng_history:'История',
    sw_title:'Секундомер и таймер', sw_sub:'Профессиональный секундомер',
    sw_tab:'Секундомер', timer_tab:'Таймер', sw_start:'Старт', sw_pause:'Пауза',
    sw_lap:'Круг', sw_reset:'Сброс', timer_min:'Минуты', timer_sec:'Секунды', timer_done:'⏰ Время вышло!',
    cat_all:'Все', cat_health:'💪 Здоровье', cat_money:'💰 Деньги', cat_productivity:'⚙️ Продуктивность', cat_quick:'⚡ Быстрые',
    search_placeholder:'Поиск инструментов...', search_no_results:'Инструменты не найдены', related_title:'Похожие инструменты',
    pwa_title:'Установить приложение', pwa_sub:'Добавьте Adawati на главный экран', pwa_install:'Установить', pwa_later:'Позже',
    cat_oman:'🌍 Оман', cat_games:'🎮 Игры', cat_education:'🧒 Обучение',
    guess_card_title:'Игра «Угадай число»', guess_card_desc:'Угадайте секретное число за наименьшее количество попыток',
    memory_card_title:'Игра на память', memory_card_desc:'Совмещайте карточки и проверьте свою память',
    qmath_card_title:'Вызов гениев — Математика', qmath_card_desc:'100 уровней от Новичка до Легенды!',
    react_card_title:'Тест на реакцию', react_card_desc:'Нажмите когда кнопка станет зелёной — будьте быстрее!',
    car_card_title:'Автогонка', car_card_desc:'Уворачивайся от машин и бей рекорд!',
    jump_card_title:'Прыжковая игра — Платформер', jump_card_desc:'Прыгай между платформами и собирай звёзды!',
    kids_card_title:'Детская обучающая игра', kids_card_desc:'Цифры, цвета, животные — для детей от 2 до 6 лет',
    vat_card_title:'Калькулятор НДС Залив', vat_card_desc:'Рассчитайте НДС для Омана, Саудовской Аравии и ОАЭ',
    sal_card_title:'Калькулятор зарплаты — Оман', sal_card_desc:'Рассчитайте чистую зарплату с вычетом SPF',
    eos_card_title:'Калькулятор выходного пособия', eos_card_desc:'Рассчитайте выходное пособие по оманскому трудовому праву',
    hijri_card_title:'Конвертер хиджры', hijri_card_desc:'Конвертируйте между хиджрой и григорианским календарём',
    pct_card_title:'Процент и скидки', pct_card_desc:'Рассчитайте проценты, скидки и изменения',
    ci_card_title:'Сложные проценты', ci_card_desc:'Рассчитайте рост инвестиций',
    dd_card_title:'Разница между датами', dd_card_desc:'Считайте дни, недели и месяцы между датами',
    fc_card_title:'Конвертер файлов', fc_card_desc:'Конвертируйте Word, Excel и CSV в браузере',
    ic_card_title:'Компрессор изображений', ic_card_desc:'Уменьшите размер без загрузки на сервер',
    fav_title:'⭐ Избранное', recent_title:'✨ Вам может понравиться', add_fav:'Добавить в избранное', remove_fav:'Удалить из избранного', bottom_nav_favorites:'Избранное',
    badge_count:'40+ инструментов', badge_count_lbl:'инструментов',
    dark_on:'🌙', dark_off:'☀️',
    related_tools:'Связанные инструменты:', popular_title:'Полезные инструменты сегодня', country_recommended:'Рекомендуется для',
    eos_title:'Калькулятор выходного пособия — Оман 🇴🇲',
    eos_sub:'В соответствии с трудовым законодательством Омана',
    eos_start:'Дата начала', eos_end:'Дата окончания',
    eos_salary:'Последний базовый оклад (OMR)', eos_reason:'Причина увольнения',
    eos_resignation:'Увольнение по собственному желанию', eos_termination:'Увольнение', eos_retirement:'Выход на пенсию',
    eos_result_lbl:'Выходное пособие (OMR)',
    eos_years_lbl:'Лет службы', eos_months_lbl:'Дополнительные месяцы', eos_daily_lbl:'Дневная ставка (OMR)',
    faq_title:'❓ Часто задаваемые вопросы',
    ic_title:'Сжать изображения', ic_sub:'Работает в вашем браузере — ваши изображения никуда не загружаются ✅',
    ic_drop_text:'Нажмите или перетащите изображение сюда', ic_drop_sub:'JPG, PNG, WebP — до 20MB',
    ic_quality_lbl:'Качество сжатия:', ic_max_compress:'Макс. сжатие', ic_max_quality:'Лучшее качество',
    ic_orig_size_lbl:'Оригинальный размер', ic_comp_size_lbl:'После сжатия', ic_savings_lbl:'Экономия',
    ic_orig_img:'Оригинал', ic_comp_img:'Сжатое', ic_quality_short:'Качество',
    ic_download_btn:'⬇️ Скачать сжатое изображение', ic_another_btn:'🔄 Выбрать другое изображение',
    ic_privacy_title:'🔒 Полная конфиденциальность',
    ic_privacy_text:'Этот компрессор работает полностью в вашем браузере через Canvas API. Ваше изображение никогда не отправляется на сервер.',
    ic_small_img:'Изображение уже маленькое — попробуйте уменьшить качество для большей экономии',
    ic_faq1_q:'Можно ли сжать PNG без потерь?',
    ic_faq1_a:'PNG конвертируется в JPEG для сжатия (с незначительной потерей). Для прозрачного PNG без потерь уменьшите размеры вместо качества.',
    ic_faq2_q:'Какое качество рекомендуется для сайтов?',
    ic_faq2_a:'70-80% обеспечивает хороший баланс между размером и качеством. Для загрузки в соцсети достаточно 60-75%.',
    ic_faq3_q:'Почему сжатое изображение иногда больше?',
    ic_faq3_a:'Если исходное изображение очень низкого качества или в формате PNG, сжатие может не уменьшить его размер. Попробуйте снизить качество.',
    pct_sub:'Три типа вычислений в одном инструменте',
    pct_tab1:'X% от числа', pct_tab2:'Какой процент?', pct_tab3:'% изменение',
    pct_pct:'Процент %', pct_num:'Число', pct_first:'Первое число', pct_second:'Второе число',
    pct_from_val:'Исходное значение', pct_to_val:'Конечное значение', pct_quick_ref_title:'🧮 Краткий справочник',
    pct_increase:'Увеличение с', pct_decrease:'Уменьшение с', pct_pct_of:'% от', pct_is:'равно',
    pct_intro:'Три типа расчётов в одном инструменте: найдите X% от числа (например, 20% от 500), вычислите, какой процент одно число составляет от другого, и рассчитайте процентное изменение. Удобно для скидок, НДС, статистики и финансовых сравнений.',
    pct_of:'от', pct_vat5_lbl:'НДС Оман/ОАЭ', pct_tenth_lbl:'Одна десятая', pct_vat15_lbl:'НДС Саудовская Аравия', pct_fifth_lbl:'Одна пятая', pct_quarter_lbl:'Одна четвёртая', pct_half_lbl:'Половина',
    pct_ref_table_html:'<table style="width:100%;border-collapse:collapse;font-size:13px;"><thead><tr style="background:var(--primary);color:#fff;"><th style="padding:9px 12px;text-align:start;">Тип расчёта</th><th style="padding:9px 12px;text-align:start;">Формула</th><th style="padding:9px 12px;text-align:start;">Пример</th></tr></thead><tbody><tr><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X% от числа</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">Число × процент ÷ 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">20% от 500 = <strong>100</strong></td></tr><tr style="background:var(--surface-2);"><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-weight:700;">X — какой % от Y?</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);font-family:monospace;">(X ÷ Y) × 100</td><td style="padding:8px 12px;border-bottom:1px solid var(--border);color:var(--text-muted);">30 от 150 = <strong>20%</strong></td></tr><tr><td style="padding:8px 12px;font-weight:700;">% изменение</td><td style="padding:8px 12px;font-family:monospace;">((Новое − Старое) ÷ Старое) × 100</td><td style="padding:8px 12px;color:var(--text-muted);">от 100 до 130 = <strong>+30%</strong></td></tr></tbody></table>',
    ci_sub:'Рассчитайте рост ваших инвестиций с учётом сложных процентов',
    ci_principal:'Начальная сумма', ci_rate:'Годовая процентная ставка %', ci_years:'Срок (лет)',
    ci_freq:'Период начисления', ci_monthly:'Ежемесячное пополнение (опционально)',
    ci_annually:'Ежегодно', ci_quarterly:'Ежеквартально', ci_monthly_f:'Ежемесячно', ci_daily:'Ежедневно',
    ci_result_lbl:'Итоговая сумма', ci_capital_lbl:'Начальный капитал', ci_interest_lbl:'Всего процентов', ci_additions_lbl:'Всего пополнений',
    ci_table_title:'📊 Таблица ежегодного роста',
    ci_th_year:'Год', ci_th_amount:'Сумма', ci_th_int_added:'Начислено %', ci_th_total_int:'Всего %',
    dd_sub:'Дни, недели, месяцы и годы между двумя датами',
    dd_from_lbl:'Первая дата (от)', dd_to_lbl:'Вторая дата (до)',
    dd_preset_today:'От сегодня', dd_preset_ny:'До Нового года', dd_preset_ramadan:'До Рамадан 2027',
    dd_result_lbl:'Всего дней', dd_years_lbl:'Год', dd_months_lbl:'Месяц', dd_days_lbl:'День',
    dd_weeks_lbl:'Неделя', dd_hours_lbl:'Час', dd_workdays_lbl:'Рабочий день (прим.)', dd_upcoming_title:'⚡ Предстоящие события',
    vat_sub:'Оман • Саудовская Аравия • ОАЭ • Бахрейн',
    vat_country_lbl:'Страна', vat_mode_lbl:'Режим расчёта', vat_add_mode:'Добавить налог', vat_extract_mode:'Извлечь налог',
    vat_amount_before:'Сумма до налога', vat_amount_after:'Сумма с налогом',
    vat_rate_lbl:'Ставка налога', vat_tax_lbl:'Сумма налога', vat_total_lbl:'Итого с налогом', vat_table_title:'НДС в Заливе',
    sal_sub:'Рассчитайте чистую зарплату с вычетом SPF',
    sal_nationality_lbl:'Гражданство', sal_omani:'Оманец (8% вычет SPF)', sal_expat:'Иностранец (без SPF)',
    sal_basic_lbl:'Базовая зарплата (OMR)', sal_housing_lbl:'Жилищная надбавка (OMR)',
    sal_transport_lbl:'Транспортная надбавка (OMR)', sal_other_lbl:'Другие надбавки (OMR)',
    sal_net_lbl:'Чистая зарплата (OMR)', sal_gross_lbl:'Брутто до вычетов',
    sal_annual_lbl:'Годовая зарплата', sal_pasi_lbl:'Вычет SPF (8%)', sal_info_title:'📌 Информация о SPF в Омане',
    hij_sub:'Мгновенная и точная конвертация в обе стороны',
    hij_mode_gh:'🗓️ Григорианский → Хиджра', hij_mode_hg:'🌙 Хиджра → Григорианский',
    hij_greg_date_lbl:'Выберите григорианскую дату',
    hij_day_lbl:'День', hij_month_lbl:'Месяц хиджры', hij_year_lbl:'Год хиджры',
    hij_today_title:'📅 Сегодняшняя дата по хиджре', hij_months_title:'🌙 Месяцы хиджры',
  }
};

const LABELS = {ar:'عر', en:'EN', fr:'FR', es:'ES', de:'DE', ru:'RU'};

function setLang(lang) {
  localStorage.setItem('lang', lang);
  const t = T[lang];
  if (!t) return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t[k] !== undefined) el.textContent = t[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.getAttribute('data-i18n-ph');
    if (t[k] !== undefined) el.placeholder = t[k];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const k = el.getAttribute('data-i18n-html');
    if (t[k] !== undefined) el.innerHTML = t[k];
  });
  document.querySelectorAll('.fav-star[data-id]').forEach(el => {
    const id = el.getAttribute('data-id');
    el.title = isFav(id) ? (t.remove_fav || 'Remove from Favorites') : (t.add_fav || 'Add to Favorites');
  });
  const cl = document.getElementById('currentLang');
  if (cl) cl.textContent = LABELS[lang] || lang.toUpperCase();
  const menu = document.getElementById('langMenu');
  if (menu) menu.classList.remove('open');
  // Brand name: Arabic script for AR, Latin for all others
  const brandName = lang === 'ar' ? 'أدواتي' : 'Adawati';
  document.querySelectorAll('.nav-brand, .footer-brand').forEach(function(el) {
    el.textContent = brandName;
  });
  updateAuthBtn();
  // Re-render country section cards with the new language
  const cc = sessionStorage.getItem('adawati_country');
  if (cc && typeof COUNTRY_DATA !== 'undefined' && COUNTRY_DATA[cc] && document.getElementById('countrySection')) {
    renderCountrySection(cc);
  }
  // Update <title> and meta description per page
  const page = _getPageSlug();
  if (PAGE_META[page]) {
    const pm = PAGE_META[page];
    if (pm.title && pm.title[lang]) document.title = pm.title[lang];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && pm.desc && pm.desc[lang]) metaDesc.setAttribute('content', pm.desc[lang]);
  }
  // Render FAQ section if page has one in PAGE_FAQ
  renderFAQ(lang);
  // Fire per-page language hook
  if (typeof window.onLangChange === 'function') window.onLangChange(lang);
  // Hide English-only static sections for non-English
  document.querySelectorAll('[lang="en"]:not(html)').forEach(function(el) {
    el.style.display = lang === 'en' ? '' : 'none';
  });
}

function toggleLangMenu() {
  document.getElementById('langMenu').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.lang-switcher')) {
    const m = document.getElementById('langMenu');
    if (m) m.classList.remove('open');
  }
});

/* ── Auth (Firebase, lazy-loaded — see loadFirebaseAuth) ── */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAO8ZKfiaKlqTIw8xUfEp5xHFy0ilBztKQ",
  authDomain: "adawati-challenges.firebaseapp.com",
  projectId: "adawati-challenges",
  storageBucket: "adawati-challenges.firebasestorage.app",
  messagingSenderId: "360902823980",
  appId: "1:360902823980:web:bd85f87de77dcfc315c189"
};
let _fbAuthReady = null;
function loadFirebaseAuth() {
  if (_fbAuthReady) return _fbAuthReady;
  _fbAuthReady = new Promise(function(resolve, reject) {
    function loadScript(src) {
      return new Promise(function(res, rej) {
        const s = document.createElement('script');
        s.src = src; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    Promise.resolve()
      .then(function() { return (typeof firebase === 'undefined') ? loadScript('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js') : null; })
      .then(function() { return (typeof firebase.auth === 'function') ? null : loadScript('https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js'); })
      .then(function() { return (typeof firebase.firestore === 'function') ? null : loadScript('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js'); })
      .then(function() {
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        resolve({ auth: firebase.auth(), db: firebase.firestore() });
      })
      .catch(reject);
  });
  return _fbAuthReady;
}

function mergeArraysUnion(a, b) {
  return Array.from(new Set([].concat(a || [], b || [])));
}

function onAuthSuccessSync(user) {
  try { localStorage.setItem('adawati_uid', user.uid); } catch (e) {}
  return loadFirebaseAuth().then(function(fb) {
    const ref = fb.db.collection('users').doc(user.uid);
    return ref.get().then(function(snap) {
      const localFavs = getFavs(), localRecent = getRecent();
      let mergedFavs = localFavs, mergedRecent = localRecent.slice(0, 6);
      if (snap.exists) {
        const cloud = snap.data() || {};
        mergedFavs = mergeArraysUnion(localFavs, cloud.favorites);
        mergedRecent = mergeArraysUnion(cloud.recent, localRecent).slice(0, 6);
      }
      saveFavs(mergedFavs);
      localStorage.setItem('adawati_recent', JSON.stringify(mergedRecent));
      return ref.set({ favorites: mergedFavs, recent: mergedRecent, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })
        .then(function() {
          if (document.getElementById('toolsGrid')) { renderFavSection(); renderRecentSection(); injectStarBtns(); }
        });
    });
  }).catch(function() { /* offline, or Firestore rules for users/{uid} not deployed yet — local stays authoritative */ });
}

function syncFavsToCloud() {
  if (typeof firebase === 'undefined' || !firebase.auth || !firebase.auth().currentUser || !navigator.onLine) return;
  firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    .set({ favorites: getFavs(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })
    .catch(function() {});
}
function syncRecentToCloud() {
  if (typeof firebase === 'undefined' || !firebase.auth || !firebase.auth().currentUser || !navigator.onLine) return;
  firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    .set({ recent: getRecent(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })
    .catch(function() {});
}

function restoreSessionIfAny() {
  let hasUid = false;
  try { hasUid = !!localStorage.getItem('adawati_uid'); } catch (e) {}
  if (!hasUid) return;
  loadFirebaseAuth().then(function(fb) {
    fb.auth.onAuthStateChanged(function(user) {
      if (user) { onAuthSuccessSync(user); updateAuthBtn(); }
    });
  }).catch(function() {});
}

function getCurrentAuthUser() {
  return (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
}

function injectAuthBtn() {
  const nav = document.querySelector('.nav-links');
  if (!nav || document.getElementById('authNavBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'authNavBtn';
  btn.style.cssText = 'background:none;border:none;font-family:inherit;font-size:14px;cursor:pointer;color:inherit;padding:6px 4px;';
  btn.onclick = openAuthModal;
  const darkBtn = document.getElementById('darkToggleBtn');
  const langSwitcher = nav.querySelector('.lang-switcher');
  if (darkBtn) nav.insertBefore(btn, darkBtn);
  else if (langSwitcher) nav.insertBefore(btn, langSwitcher);
  else nav.appendChild(btn);
  updateAuthBtn();
}

function updateAuthBtn() {
  const btn = document.getElementById('authNavBtn');
  if (!btn) return;
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const user = getCurrentAuthUser();
  if (user) {
    const label = (user.displayName || user.email || '').split(' ')[0].split('@')[0];
    btn.textContent = '👤 ' + label;
  } else {
    btn.textContent = t.signup_btn || 'Sign Up';
  }
}

let _authMode = 'signup';

function openAuthModal() {
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const user = getCurrentAuthUser();
  const existing = document.getElementById('signupModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'signupModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';

  const box = document.createElement('div');
  box.style.cssText = 'background:#fff;border-radius:16px;padding:32px 28px;max-width:380px;width:100%;box-shadow:0 20px 40px rgba(0,0,0,0.15);';

  if (user) {
    box.style.textAlign = 'center';
    const avatar = document.createElement('div');
    avatar.style.cssText = 'font-size:48px;margin-bottom:12px;';
    avatar.textContent = '👤';
    const greeting = document.createElement('div');
    greeting.style.cssText = 'font-size:20px;font-weight:700;margin-bottom:4px;';
    greeting.textContent = (t.signup_welcome || 'Welcome') + ', ' + (user.displayName || user.email) + '!';
    const emailEl = document.createElement('div');
    emailEl.style.cssText = 'font-size:14px;color:#64748b;margin-bottom:24px;';
    emailEl.textContent = user.email || '';
    const logoutBtn = document.createElement('button');
    logoutBtn.style.cssText = 'width:100%;padding:12px;background:#ef4444;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px;';
    logoutBtn.textContent = t.signup_logout || 'Sign Out';
    logoutBtn.onclick = logoutUser;
    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'width:100%;padding:12px;background:#f1f5f9;color:#334155;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => document.getElementById('signupModal').remove();
    box.append(avatar, greeting, emailEl, logoutBtn, closeBtn);
  } else {
    box.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const isSignup = _authMode === 'signup';
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;';
    const title = document.createElement('div');
    title.style.cssText = 'font-size:19px;font-weight:700;';
    title.textContent = isSignup ? (t.signup_title || 'Create Account') : (t.auth_signin_title || 'Sign In');
    const xBtn = document.createElement('button');
    xBtn.style.cssText = 'background:none;border:none;font-size:20px;cursor:pointer;color:#94a3b8;';
    xBtn.textContent = '✕';
    xBtn.onclick = () => document.getElementById('signupModal').remove();
    header.append(title, xBtn);
    const note = document.createElement('div');
    note.style.cssText = 'font-size:13px;color:#64748b;margin-bottom:20px;';
    note.textContent = isSignup ? (t.signup_note || '') : '';
    const errBox = document.createElement('div');
    errBox.id = 'authErrBox';
    errBox.style.cssText = 'font-size:13px;color:#ef4444;margin-bottom:12px;display:none;';

    const fields = [];
    if (isSignup) {
      const lbl1 = document.createElement('label');
      lbl1.style.cssText = 'display:block;font-size:13px;font-weight:700;margin-bottom:6px;';
      lbl1.textContent = t.signup_name || 'Name';
      const inp1 = document.createElement('input');
      inp1.id = 'su_name'; inp1.type = 'text'; inp1.maxLength = 60;
      inp1.style.cssText = 'width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:15px;font-family:inherit;margin-bottom:14px;box-sizing:border-box;';
      fields.push(lbl1, inp1);
    }
    const lbl2 = document.createElement('label');
    lbl2.style.cssText = 'display:block;font-size:13px;font-weight:700;margin-bottom:6px;';
    lbl2.textContent = t.signup_email || 'Email';
    const inp2 = document.createElement('input');
    inp2.id = 'su_email'; inp2.type = 'email'; inp2.dir = 'ltr'; inp2.maxLength = 120;
    inp2.style.cssText = 'width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:15px;font-family:inherit;margin-bottom:14px;box-sizing:border-box;';
    const lbl3 = document.createElement('label');
    lbl3.style.cssText = 'display:block;font-size:13px;font-weight:700;margin-bottom:6px;';
    lbl3.textContent = t.auth_password || 'Password';
    const inp3 = document.createElement('input');
    inp3.id = 'su_pass'; inp3.type = 'password'; inp3.dir = 'ltr'; inp3.maxLength = 100;
    inp3.style.cssText = 'width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:15px;font-family:inherit;margin-bottom:20px;box-sizing:border-box;';
    fields.push(lbl2, inp2, lbl3, inp3);

    const submitBtn = document.createElement('button');
    submitBtn.id = 'authSubmitBtn';
    submitBtn.style.cssText = 'width:100%;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:10px;';
    submitBtn.textContent = isSignup ? (t.signup_submit || 'Create Account') : (t.auth_signin_title || 'Sign In');
    submitBtn.onclick = () => submitAuthForm(_authMode, lang);

    const switchLink = document.createElement('div');
    switchLink.style.cssText = 'text-align:center;font-size:13px;color:#2563eb;cursor:pointer;';
    switchLink.textContent = isSignup ? (t.auth_switch_to_login || 'Already have an account? Sign in') : (t.auth_switch_to_signup || "Don't have an account? Sign up");
    switchLink.onclick = () => { _authMode = isSignup ? 'signin' : 'signup'; openAuthModal(); };

    box.append(header, note, errBox, ...fields, submitBtn, switchLink);
  }

  modal.appendChild(box);

  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  const firstInput = document.getElementById('su_name') || document.getElementById('su_email');
  if (firstInput) firstInput.focus();
}

function showToast(msg, type) {
  const existing = document.getElementById('adawatiToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'adawatiToast';
  const bg = type === 'error' ? '#ef4444' : '#22c55e';
  toast.style.cssText = `position:fixed;bottom:28px;${document.documentElement.dir==='rtl'?'right':'left'}:50%;transform:translateX(${document.documentElement.dir==='rtl'?'50%':'-50%'});background:${bg};color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;font-weight:600;z-index:99999;box-shadow:0 4px 16px rgba(0,0,0,0.18);pointer-events:none;`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 2800);
}

function submitAuthForm(mode, lang) {
  const t = T[lang] || T.ar;
  const errBox = document.getElementById('authErrBox');
  const showErr = function(msg) { if (errBox) { errBox.textContent = msg; errBox.style.display = 'block'; } };
  const email = (document.getElementById('su_email').value || '').trim();
  const pass = (document.getElementById('su_pass').value || '');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRe.test(email)) { showErr(t.contact_email_invalid || 'Invalid email address'); return; }
  if (pass.length < 6) { showErr(t.auth_error_weak_password || 'Password must be at least 6 characters'); return; }
  let name = '';
  if (mode === 'signup') {
    name = (document.getElementById('su_name').value || '').trim();
    if (!name) { showErr(t.contact_error || 'Please fill in all fields'); return; }
  }
  const btn = document.getElementById('authSubmitBtn');
  if (btn) { btn.disabled = true; btn.textContent = t.auth_syncing || 'Working...'; }
  loadFirebaseAuth().then(function(fb) {
    const action = mode === 'signup'
      ? fb.auth.createUserWithEmailAndPassword(email, pass).then(function(cred) {
          return cred.user.updateProfile({ displayName: name.slice(0, 60) }).then(function() { return cred.user; });
        })
      : fb.auth.signInWithEmailAndPassword(email, pass).then(function(cred) { return cred.user; });
    return action;
  }).then(function(user) {
    return onAuthSuccessSync(user).then(function() {
      const modal = document.getElementById('signupModal');
      if (modal) modal.remove();
      updateAuthBtn();
      showToast((t.signup_welcome || 'Welcome') + ', ' + (user.displayName || user.email).split(' ')[0] + '!', 'success');
    });
  }).catch(function(err) {
    if (btn) { btn.disabled = false; btn.textContent = mode === 'signup' ? (t.signup_submit || 'Create Account') : (t.auth_signin_title || 'Sign In'); }
    const code = err && err.code;
    if (code === 'auth/email-already-in-use') showErr(t.auth_error_email_in_use || 'This email is already in use');
    else if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') showErr(t.auth_error_wrong_password || 'Wrong email or password');
    else if (code === 'auth/weak-password') showErr(t.auth_error_weak_password || 'Password must be at least 6 characters');
    else showErr(t.generic_error || 'Something went wrong — try again');
  });
}

function logoutUser() {
  loadFirebaseAuth().then(function(fb) { return fb.auth.signOut(); }).finally(function() {
    try { localStorage.removeItem('adawati_uid'); } catch (e) {}
    const modal = document.getElementById('signupModal');
    if (modal) modal.remove();
    updateAuthBtn();
  });
}

/* ── PAGE_META: dynamic <title> + meta description per language ── */
const PAGE_META = {
  'percentage-calculator': {
    title: {
      en:'Free Percentage Calculator — Discount, VAT & Ratio | Adawati',
      ar:'حاسبة النسبة المئوية المجانية — خصم، ضريبة ونسبة | أدواتي',
      fr:'Calculateur de pourcentage — Remise, TVA & ratio | Adawati',
      es:'Calculadora de porcentaje — Descuento, IVA y ratio | Adawati',
      de:'Prozentrechner — Rabatt, MwSt & Verhältnis | Adawati',
      ru:'Калькулятор процентов — Скидка, НДС и отношение | Adawati'
    },
    desc: {
      en:'Free online percentage calculator: find X% of any number, calculate percentage increase or decrease, and percentage ratio. Instant results, no signup.',
      ar:'حاسبة نسبة مئوية مجانية: احسب X% من أي رقم، نسبة الزيادة أو النقص، والنسبة بين رقمين. نتائج فورية بدون تسجيل.',
      fr:'Calculateur de pourcentage gratuit en ligne : trouvez X% d\'un nombre, calculez l\'augmentation ou la diminution en pourcentage. Résultats instantanés.',
      es:'Calculadora de porcentaje gratuita en línea: encuentra X% de cualquier número, calcula aumento o disminución porcentual. Resultados instantáneos.',
      de:'Kostenloser Online-Prozentrechner: X% einer Zahl berechnen, prozentuale Zu- oder Abnahme ermitteln. Sofortige Ergebnisse, keine Anmeldung.',
      ru:'Бесплатный онлайн-калькулятор процентов: вычислите X% от числа, процентный рост или снижение. Мгновенные результаты без регистрации.'
    }
  },
  'loan-calculator': {
    title: {
      en:'Free Loan & Monthly Payment Calculator | Adawati',
      ar:'حاسبة القسط الشهري والقرض المجانية | أدواتي',
      fr:'Calculateur de prêt et mensualités gratuit | Adawati',
      es:'Calculadora de préstamo y cuota mensual gratuita | Adawati',
      de:'Kostenloser Kredit- und Ratenrechner | Adawati',
      ru:'Бесплатный калькулятор кредита и ежемесячных платежей | Adawati'
    },
    desc: {
      en:'Calculate monthly loan payments, total interest and repayment schedule for any loan amount, interest rate and duration. Free, instant, no signup.',
      ar:'احسب القسط الشهري للقرض، إجمالي الفائدة وجدول السداد لأي مبلغ ومدة. مجاني وفوري بدون تسجيل.',
      fr:'Calculez vos mensualités de prêt, le coût total des intérêts et le calendrier de remboursement. Gratuit, instantané, sans inscription.',
      es:'Calcula cuotas mensuales de préstamo, intereses totales y cronograma de pago. Gratis, instantáneo, sin registro.',
      de:'Berechnen Sie monatliche Kreditraten, Gesamtzinsen und Rückzahlungsplan. Kostenlos, sofort, ohne Anmeldung.',
      ru:'Рассчитайте ежемесячные платежи по кредиту, общую сумму процентов и график погашения. Бесплатно, мгновенно, без регистрации.'
    }
  },
  'vat-calculator': {
    title: {
      en:'Free VAT Calculator — Oman, Saudi Arabia, UAE & Gulf | Adawati',
      ar:'حاسبة VAT — عمان، السعودية والإمارات | أدواتي',
      fr:'Calculateur de TVA gratuit — Oman, Arabie Saoudite, EAU | Adawati',
      es:'Calculadora de IVA gratuita — Omán, Arabia Saudita, EAU | Adawati',
      de:'Kostenloser MwSt-Rechner — Oman, Saudi-Arabien, VAE | Adawati',
      ru:'Калькулятор НДС — Оман, Саудовская Аравия, ОАЭ | Adawati'
    },
    desc: {
      en:'Calculate VAT for Oman (5%), Saudi Arabia (15%), UAE (5%) and Bahrain (10%). Add or extract VAT instantly. Free tool, no signup required.',
      ar:'احسب ضريبة القيمة المضافة لعمان (5%)، السعودية (15%)، الإمارات (5%) والبحرين (10%). أضف أو استخرج الضريبة فوراً.',
      fr:'Calculez la TVA pour Oman (5%), Arabie Saoudite (15%), EAU (5%) et Bahreïn (10%). Ajoutez ou extrayez la TVA instantanément.',
      es:'Calcula el IVA para Omán (5%), Arabia Saudita (15%), EAU (5%) y Baréin (10%). Añade o extrae el IVA al instante.',
      de:'Berechnen Sie die MwSt für Oman (5%), Saudi-Arabien (15%), VAE (5%) und Bahrain (10%). Sofort hinzufügen oder extrahieren.',
      ru:'Рассчитайте НДС для Омана (5%), Саудовской Аравии (15%), ОАЭ (5%) и Бахрейна (10%). Добавьте или извлеките НДС мгновенно.'
    }
  },
  'bmi-calculator': {
    title: {
      en:'Free BMI Calculator — Body Mass Index Online | Adawati',
      ar:'حاسبة مؤشر كتلة الجسم BMI المجانية | أدواتي',
      fr:'Calculateur d\'IMC gratuit en ligne | Adawati',
      es:'Calculadora de IMC gratuita en línea | Adawati',
      de:'Kostenloser BMI-Rechner online | Adawati',
      ru:'Бесплатный онлайн-калькулятор ИМТ | Adawati'
    },
    desc: {
      en:'Calculate your Body Mass Index (BMI) instantly. Enter your height and weight to get your BMI and health status classification. Free, no signup.',
      ar:'احسب مؤشر كتلة جسمك (BMI) فوراً. أدخل طولك ووزنك للحصول على المؤشر وتصنيف وضعك الصحي. مجاني بدون تسجيل.',
      fr:'Calculez votre indice de masse corporelle (IMC) instantanément. Entrez votre taille et votre poids pour connaître votre IMC.',
      es:'Calcula tu índice de masa corporal (IMC) al instante. Introduce tu altura y peso para obtener tu IMC y clasificación de salud.',
      de:'Berechnen Sie Ihren Body-Mass-Index (BMI) sofort. Geben Sie Größe und Gewicht ein, um BMI und Gesundheitsstatus zu erhalten.',
      ru:'Рассчитайте свой индекс массы тела (ИМТ) мгновенно. Введите рост и вес, чтобы получить ИМТ и оценку состояния здоровья.'
    }
  },
  'currency-converter': {
    title: {
      en:'Free Currency Converter — Live Exchange Rates | Adawati',
      ar:'محول العملات المجاني — أسعار صرف حية | أدواتي',
      fr:'Convertisseur de devises — Taux de change en direct | Adawati',
      es:'Conversor de divisas gratuito — Tasas de cambio en vivo | Adawati',
      de:'Kostenloser Währungsrechner — Live-Wechselkurse | Adawati',
      ru:'Бесплатный конвертер валют — Актуальные курсы обмена | Adawati'
    },
    desc: {
      en:'Convert between 30+ world currencies with live exchange rates. Free currency converter — USD, EUR, GBP, SAR, AED, OMR and more. No signup required.',
      ar:'حول بين أكثر من 30 عملة عالمية بأسعار صرف حية. محول عملات مجاني — دولار، يورو، جنيه، ريال سعودي، درهم، ريال عماني والمزيد.',
      fr:'Convertissez entre plus de 30 devises mondiales avec des taux en direct. Convertisseur de devises gratuit — USD, EUR, GBP, SAR, AED, OMR.',
      es:'Convierte entre más de 30 divisas mundiales con tasas de cambio en vivo. Conversor de divisas gratis — USD, EUR, GBP, SAR, AED, OMR.',
      de:'Rechnen Sie zwischen 30+ Weltwährungen mit Live-Kursen um. Kostenloser Währungsrechner — USD, EUR, GBP, SAR, AED, OMR und mehr.',
      ru:'Конвертируйте между 30+ мировыми валютами по актуальным курсам. Бесплатный конвертер — USD, EUR, GBP, SAR, AED, OMR и другие.'
    }
  },
  'salary-calculator': {
    title: {
      en:'Free Salary Calculator Oman — Net Pay with SPF | Adawati',
      ar:'حاسبة الراتب عمان المجانية — الراتب الصافي مع SPF | أدواتي',
      fr:'Calculateur salaire Oman — Salaire net avec SPF | Adawati',
      es:'Calculadora salario Omán — Salario neto con SPF | Adawati',
      de:'Kostenloser Gehaltsrechner Oman — Nettogehalt mit SPF | Adawati',
      ru:'Калькулятор зарплаты Оман — Чистая зарплата с SPF | Adawati'
    },
    desc: {
      en:'Calculate your net salary in Oman including SPF deduction (8% for Omanis). Add basic salary, housing and transport allowances. Free, instant results.',
      ar:'احسب راتبك الصافي في عمان مع خصم SPF (8% للمواطنين). أضف الراتب الأساسي وبدلات السكن والنقل. مجاني ونتائج فورية.',
      fr:'Calculez votre salaire net à Oman avec déduction SPF (8% pour les Omanais). Ajoutez salaire de base, logement et transport.',
      es:'Calcula tu salario neto en Omán con deducción SPF (8% para omaníes). Añade salario básico, vivienda y transporte.',
      de:'Berechnen Sie Ihr Nettogehalt in Oman mit SPF-Abzug (8% für Omaner). Fügen Sie Grundgehalt, Wohn- und Transportzulage hinzu.',
      ru:'Рассчитайте чистую зарплату в Омане с вычетом SPF (8% для оманцев). Добавьте базовую зарплату, жилищные и транспортные надбавки.'
    }
  },
  'end-of-service': {
    title: {
      en:'End of Service Calculator Oman — Gratuity under Omani Labor Law | Adawati',
      ar:'حاسبة نهاية الخدمة — قانون العمل العماني | أدواتي',
      fr:'Calculateur d\'indemnité de fin de service Oman | Adawati',
      es:'Calculadora de indemnización por fin de servicio Omán | Adawati',
      de:'Abfindungsrechner Oman — Omanisches Arbeitsrecht | Adawati',
      ru:'Выходное пособие Оман — Трудовое законодательство | Adawati'
    },
    desc: {
      en:'Calculate end-of-service gratuity for Oman under the Omani Labor Law. Enter start date, end date, salary and reason for termination. Free, accurate.',
      ar:'احسب مكافأة نهاية الخدمة في عمان وفق قانون العمل العماني. أدخل تاريخ البداية والنهاية والراتب وسبب انتهاء الخدمة.',
      fr:'Calculez l\'indemnité de fin de service pour Oman selon le droit du travail omanais.',
      es:'Calcula la indemnización por fin de servicio en Omán según el derecho laboral omaní.',
      de:'Berechnen Sie die Abfindung für Oman gemäß omanischem Arbeitsrecht.',
      ru:'Рассчитайте выходное пособие в Омане по omanskому трудовому законодательству.'
    }
  },
  'age-calculator': {
    title: {
      en:'Free Age Calculator — Exact Age in Years, Months & Days | Adawati',
      ar:'حاسبة العمر — السنوات والأشهر والأيام | أدواتي',
      fr:'Calculateur d\'âge — Âge en années, mois et jours | Adawati',
      es:'Calculadora de edad — Edad en años, meses y días | Adawati',
      de:'Altersrechner — Alter in Jahren, Monaten und Tagen | Adawati',
      ru:'Калькулятор возраста — возраст в годах, месяцах и днях | Adawati'
    },
    desc: {
      en:'Calculate your exact age in years, months and days. Find days until your next birthday. Free online age calculator, no signup required.',
      ar:'احسب عمرك بالتفصيل — سنوات وأشهر وأيام. اعرف عدد الأيام حتى عيد ميلادك القادم. حاسبة عمر مجانية بدون تسجيل.',
      fr:'Calculez votre âge exact en années, mois et jours. Trouvez le nombre de jours jusqu\'à votre prochain anniversaire.',
      es:'Calcula tu edad exacta en años, meses y días. Encuentra los días hasta tu próximo cumpleaños.',
      de:'Berechnen Sie Ihr genaues Alter in Jahren, Monaten und Tagen. Erfahren Sie, wie viele Tage bis zu Ihrem nächsten Geburtstag.',
      ru:'Рассчитайте свой точный возраст в годах, месяцах и днях. Узнайте количество дней до следующего дня рождения.'
    }
  },
  'compound-interest': {
    title:{en:'Free Compound Interest Calculator — Investment Growth | Adawati',ar:'حاسبة الفائدة المركبة المجانية — نمو الاستثمار | أدواتي',fr:'Intérêts composés — Croissance des investissements | Adawati',es:'Interés compuesto — Crecimiento de inversión | Adawati',de:'Kostenloser Zinseszinsrechner — Investitionswachstum | Adawati',ru:'Сложные проценты — Рост инвестиций | Adawati'},
    desc:{en:'Calculate compound interest and investment growth over time. Enter principal, interest rate, compounding frequency and duration. Free online calculator.',ar:'احسب الفائدة المركبة ونمو استثمارك مع الوقت. أدخل رأس المال وسعر الفائدة ومدة الاحتساب. مجاني وفوري.',fr:'Calculez les intérêts composés et la croissance de vos investissements. Entrez le capital, le taux d\'intérêt et la durée.',es:'Calcula el interés compuesto y el crecimiento de tu inversión. Ingresa el capital, tasa de interés y período.',de:'Berechnen Sie Zinseszinsen und Investitionswachstum. Geben Sie Kapital, Zinssatz und Laufzeit ein.',ru:'Рассчитайте сложные проценты и рост инвестиций. Введите капитал, процентную ставку и срок.'}
  },
  'date-diff': {
    title:{en:'Free Date Difference Calculator — Days Between Dates | Adawati',ar:'حاسبة الفرق بين التواريخ — أيام بين تاريخين | أدواتي',fr:'Différence de dates — Jours entre deux dates | Adawati',es:'Diferencia de fechas — Días entre dos fechas | Adawati',de:'Kostenloser Datumsrechner — Tage zwischen zwei Daten | Adawati',ru:'Бесплатный калькулятор разницы дат — Дни между датами | Adawati'},
    desc:{en:'Calculate the exact number of days, weeks and months between any two dates. Free date difference calculator. Instant results, no signup.',ar:'احسب الفرق الدقيق بالأيام والأسابيع والأشهر بين أي تاريخين. حاسبة فرق التواريخ مجانية. نتائج فورية بدون تسجيل.',fr:'Calculez le nombre exact de jours, semaines et mois entre deux dates. Résultats instantanés, sans inscription.',es:'Calcula el número exacto de días, semanas y meses entre dos fechas. Resultados instantáneos, sin registro.',de:'Berechnen Sie die genaue Anzahl von Tagen, Wochen und Monaten zwischen zwei Daten. Sofortige Ergebnisse.',ru:'Рассчитайте точное количество дней, недель и месяцев между двумя датами. Мгновенные результаты.'}
  },
  'diet-plan': {
    title:{en:'Free Daily Calorie Calculator & Diet Plan | Adawati',ar:'حاسبة السعرات الحرارية اليومية والخطة الغذائية المجانية | أدواتي',fr:'Calories quotidiennes et plan de régime | Adawati',es:'Calculadora de calorías diarias y plan de dieta gratis | Adawati',de:'Kostenloser Tageskalorienrechner und Ernährungsplan | Adawati',ru:'Бесплатный калькулятор дневных калорий и план питания | Adawati'},
    desc:{en:'Calculate your daily calorie needs based on weight, height, age and activity level. Get a personalized diet plan. Free, no signup required.',ar:'احسب احتياجك اليومي من السعرات الحرارية بناءً على وزنك وطولك وعمرك ومستوى نشاطك. احصل على خطة غذائية مخصصة. مجاني بدون تسجيل.',fr:'Calculez vos besoins caloriques quotidiens selon votre poids, taille, âge et activité. Plan alimentaire personnalisé.',es:'Calcula tus necesidades calóricas diarias según peso, altura, edad y actividad. Plan de dieta personalizado.',de:'Berechnen Sie Ihren täglichen Kalorienbedarf nach Gewicht, Größe, Alter und Aktivität. Personalisierter Ernährungsplan.',ru:'Рассчитайте дневную норму калорий по весу, росту, возрасту и уровню активности. Персонализированный план питания.'}
  },
  'discount-calculator': {
    title:{en:'Free Discount Calculator — Sale Price & Savings | Adawati',ar:'حاسبة الخصم المجانية — سعر البيع والتوفير | أدواتي',fr:'Calculateur de remise — Prix de vente et économies | Adawati',es:'Calculadora de descuento — Precio de venta y ahorro | Adawati',de:'Rabattrechner — Verkaufspreis und Ersparnisse | Adawati',ru:'Бесплатный калькулятор скидки — Цена продажи и экономия | Adawati'},
    desc:{en:'Calculate the final sale price after any discount percentage. Find out exactly how much you save. Free discount calculator, instant results, no signup.',ar:'احسب السعر النهائي بعد الخصم. اعرف كم ستوفر بالضبط. حاسبة خصم مجانية وفورية بدون تسجيل.',fr:'Calculez le prix final après remise. Découvrez exactement vos économies. Gratuit, sans inscription.',es:'Calcula el precio final después del descuento. Descubre exactamente cuánto ahorras. Gratis, sin registro.',de:'Berechnen Sie den Endpreis nach Rabatt. Erfahren Sie genau, wie viel Sie sparen. Kostenlos.',ru:'Рассчитайте итоговую цену после скидки. Узнайте точно, сколько сэкономите. Бесплатно.'}
  },
  'file-converter': {
    title:{en:'Free File Converter — Convert Images Online | Adawati',ar:'محول الملفات المجاني — تحويل الصور أونلاين | أدواتي',fr:'Convertisseur de fichiers gratuit — Images en ligne | Adawati',es:'Conversor de archivos gratis — Imágenes en línea | Adawati',de:'Kostenloser Dateikonverter — Bilder online | Adawati',ru:'Бесплатный конвертер файлов — Изображения онлайн | Adawati'},
    desc:{en:'Convert image files online for free. Supports JPG, PNG, WebP and more. No upload to servers — all processing in your browser. No signup.',ar:'حول ملفات الصور أونلاين مجاناً. يدعم JPG وPNG وWebP والمزيد. لا رفع لخوادم — كل المعالجة في متصفحك. بدون تسجيل.',fr:'Convertissez des images en ligne gratuitement. Supporte JPG, PNG, WebP. Traitement dans le navigateur, sans inscription.',es:'Convierte imágenes en línea gratis. Soporta JPG, PNG, WebP. Procesamiento en el navegador, sin registro.',de:'Konvertieren Sie Bilder kostenlos online. Unterstützt JPG, PNG, WebP. Verarbeitung im Browser, ohne Anmeldung.',ru:'Конвертируйте изображения онлайн бесплатно. Поддерживает JPG, PNG, WebP. Обработка в браузере, без регистрации.'}
  },
  'hijri-converter': {
    title:{en:'Free Hijri Date Converter — Islamic & Gregorian Calendar | Adawati',ar:'محول التاريخ الهجري المجاني — التقويم الإسلامي والميلادي | أدواتي',fr:'Convertisseur date Hijri — Calendrier islamique | Adawati',es:'Convertidor fecha Hijri — Calendario islámico | Adawati',de:'Hijri-Datumskonverter — Islamischer Kalender | Adawati',ru:'Конвертер даты Хиджры — Исламский календарь | Adawati'},
    desc:{en:'Convert between Hijri (Islamic) and Gregorian calendar dates instantly. Free online Hijri date converter, accurate and easy to use. No signup.',ar:'حول بين التاريخ الهجري والميلادي فوراً. محول تاريخ هجري مجاني ودقيق وسهل الاستخدام. بدون تسجيل.',fr:'Convertissez instantanément entre les dates Hijri et grégoriennes. Convertisseur gratuit et facile à utiliser.',es:'Convierte fechas Hijri y gregorianas al instante. Conversor gratuito y fácil de usar.',de:'Konvertieren Sie sofort zwischen Hijri- und gregorianischen Daten. Kostenloser und einfacher Konverter.',ru:'Мгновенно конвертируйте даты между Хиджрой и григорианским календарём. Бесплатный и удобный конвертер.'}
  },
  'image-compressor': {
    title:{en:'Free Image Compressor — Reduce Photo Size Online | Adawati',ar:'ضاغط الصور المجاني — تقليل حجم الصور أونلاين | أدواتي',fr:'Compresseur d\'images — Réduire la taille en ligne | Adawati',es:'Compresor de imágenes gratis — Reducir tamaño en línea | Adawati',de:'Bildkompressor — Fotogröße online reduzieren | Adawati',ru:'Компрессор изображений — Уменьшить размер онлайн | Adawati'},
    desc:{en:'Compress images online for free without quality loss. Reduce JPG, PNG and WebP sizes instantly. No upload to servers — all in your browser. No signup.',ar:'اضغط الصور أونلاين مجاناً بدون فقدان الجودة. قلل حجم JPG وPNG وWebP فوراً. لا رفع لخوادم — كل شيء في متصفحك.',fr:'Compressez des images en ligne gratuitement sans perte de qualité. Réduisez JPG, PNG et WebP instantanément.',es:'Comprime imágenes en línea gratis sin pérdida de calidad. Reduce JPG, PNG y WebP al instante.',de:'Bilder kostenlos online komprimieren ohne Qualitätsverlust. JPG, PNG und WebP sofort reduzieren.',ru:'Сжимайте изображения онлайн бесплатно без потери качества. Уменьшайте JPG, PNG и WebP мгновенно.'}
  },
  'password-generator': {
    title:{en:'Free Password Generator — Strong & Secure Passwords | Adawati',ar:'مولّد كلمات المرور المجاني — كلمات مرور قوية وآمنة | أدواتي',fr:'Générateur de mots de passe — Mots de passe forts | Adawati',es:'Generador de contraseñas — Contraseñas fuertes | Adawati',de:'Passwort-Generator — Starke & sichere Passwörter | Adawati',ru:'Генератор паролей — Надёжные и безопасные пароли | Adawati'},
    desc:{en:'Generate strong, random and secure passwords instantly. Choose length and character types. Free password generator, no signup, nothing stored.',ar:'ولّد كلمات مرور قوية وعشوائية وآمنة فوراً. اختر الطول ونوع الأحرف. مجاني، بدون تسجيل، لا شيء يُحفظ.',fr:'Générez des mots de passe forts et sécurisés instantanément. Choisissez longueur et caractères. Gratuit, sans inscription.',es:'Genera contraseñas fuertes y seguras al instante. Elige longitud y tipos de caracteres. Gratis, sin registro.',de:'Generieren Sie sofort starke und sichere Passwörter. Länge und Zeichentypen wählen. Kostenlos, ohne Anmeldung.',ru:'Генерируйте надёжные случайные пароли мгновенно. Выберите длину и типы символов. Бесплатно, без регистрации.'}
  },
  'qr-generator': {
    title:{en:'Free QR Code Generator — Create QR Codes Instantly | Adawati',ar:'مولّد رموز QR المجاني — أنشئ رموز QR فوراً | أدواتي',fr:'Générateur QR codes — Créez des QR codes | Adawati',es:'Generador QR — Crea códigos QR al instante | Adawati',de:'QR-Code-Generator — QR-Codes sofort erstellen | Adawati',ru:'Генератор QR-кодов — Создавайте QR-коды мгновенно | Adawati'},
    desc:{en:'Generate QR codes for URLs, text or contact info instantly. Download as PNG or SVG. Free online QR code generator, no signup, no watermark.',ar:'ولّد رموز QR للروابط والنصوص ومعلومات الاتصال فوراً. حمّل بصيغة PNG أو SVG. مجاني بدون تسجيل وبدون علامة مائية.',fr:'Générez des QR codes pour URLs, textes ou contacts instantanément. Téléchargez en PNG ou SVG. Gratuit, sans filigrane.',es:'Genera códigos QR para URLs, texto o contactos al instante. Descarga en PNG o SVG. Gratis, sin marca de agua.',de:'QR-Codes für URLs, Text oder Kontakte sofort erstellen. Als PNG oder SVG herunterladen. Kostenlos, kein Wasserzeichen.',ru:'Создавайте QR-коды для URL, текста или контактов мгновенно. Скачивайте в PNG или SVG. Бесплатно, без водяного знака.'}
  },
  'random-number': {
    title:{en:'Free Random Number Generator — Pick Random Numbers | Adawati',ar:'مولّد الأرقام العشوائية المجاني — اختيار أرقام عشوائية | أدواتي',fr:'Générateur de nombres aléatoires gratuit | Adawati',es:'Generador de números aleatorios gratis | Adawati',de:'Kostenloser Zufallszahlengenerator | Adawati',ru:'Бесплатный генератор случайных чисел | Adawati'},
    desc:{en:'Generate random numbers in any range. Pick lottery numbers, random list items or dice rolls. Free, instant, no signup required.',ar:'ولّد أرقاماً عشوائية في أي نطاق. اختر أرقام يانصيب أو عناصر من قائمة. مجاني وفوري بدون تسجيل.',fr:'Générez des nombres aléatoires dans n\'importe quelle plage. Numéros de loterie, dés ou sélections. Gratuit, instantané.',es:'Genera números aleatorios en cualquier rango. Números de lotería, dados o selecciones. Gratis, instantáneo.',de:'Zufallszahlen in jedem Bereich generieren. Lottozahlen, Würfel oder zufällige Auswahlen. Kostenlos, sofort.',ru:'Генерируйте случайные числа в любом диапазоне. Лотерейные номера, броски кубика. Бесплатно, мгновенно.'}
  },
  'stopwatch': {
    title:{en:'Free Online Stopwatch & Timer | Adawati',ar:'ساعة إيقاف وموقت أونلاين مجاني | أدواتي',fr:'Chronomètre et minuterie en ligne gratuits | Adawati',es:'Cronómetro y temporizador en línea gratis | Adawati',de:'Kostenlose Online-Stoppuhr & Timer | Adawati',ru:'Бесплатный онлайн-секундомер и таймер | Adawati'},
    desc:{en:'Free online stopwatch and countdown timer. Start, stop, pause and record laps. Works in your browser — no download needed. Free, no signup.',ar:'ساعة إيقاف وموقت عد تنازلي أونلاين. ابدأ وأوقف وسجّل الأشواط. يعمل في متصفحك بدون تنزيل. مجاني بدون تسجيل.',fr:'Chronomètre et minuterie en ligne gratuits. Démarrez, arrêtez et enregistrez les tours. Fonctionne dans votre navigateur.',es:'Cronómetro y temporizador en línea gratis. Inicia, detén y registra vueltas. Funciona en tu navegador.',de:'Kostenlose Online-Stoppuhr und Timer. Starten, stoppen und Runden aufzeichnen. Im Browser, kein Download.',ru:'Бесплатный онлайн-секундомер и обратный отсчёт. Запускайте, останавливайте и записывайте круги. В браузере.'}
  },
  'timezone-converter': {
    title:{en:'Free Time Zone Converter — World Clock Online | Adawati',ar:'محول المناطق الزمنية المجاني — الساعة العالمية أونلاين | أدواتي',fr:'Convertisseur fuseaux horaires — Horloge mondiale | Adawati',es:'Conversor de zonas horarias gratis — Reloj mundial | Adawati',de:'Kostenloser Zeitzonenkonverter — Weltzeituhr online | Adawati',ru:'Бесплатный конвертер часовых поясов — Мировые часы | Adawati'},
    desc:{en:'Convert time between world time zones instantly. Plan international meetings and calls. Free online timezone converter, no signup required.',ar:'حول الوقت بين مناطق زمنية عالمية فوراً. خطّط للاجتماعات الدولية. محول مناطق زمنية مجاني بدون تسجيل.',fr:'Convertissez l\'heure entre les fuseaux horaires mondiaux instantanément. Planifiez des réunions internationales.',es:'Convierte el tiempo entre zonas horarias mundiales al instante. Planifica reuniones internacionales.',de:'Zeit zwischen Weltzeitzonien sofort konvertieren. Internationale Meetings planen. Kostenlos.',ru:'Мгновенно конвертируйте время между мировыми часовыми поясами. Планируйте международные встречи.'}
  },
  'tip-calculator': {
    title:{en:'Free Tip Calculator — Split Bill & Calculate Gratuity | Adawati',ar:'حاسبة الإكرامية — تقسيم الفاتورة | أدواتي',fr:'Calculateur de pourboire gratuit — Partager l\'addition | Adawati',es:'Calculadora de propina — Dividir cuenta y propina | Adawati',de:'Kostenloser Trinkgeldrechner — Rechnung aufteilen | Adawati',ru:'Бесплатный калькулятор чаевых — Разделить счёт | Adawati'},
    desc:{en:'Calculate tip amount and split the bill between any number of people. Choose tip percentage and see totals per person. Free, instant, no signup.',ar:'احسب مبلغ الإكرامية وقسّم الفاتورة بين أي عدد من الأشخاص. اختر نسبة الإكرامية وشاهد المجموع لكل شخص. مجاني وفوري.',fr:'Calculez le pourboire et partagez l\'addition. Choisissez le pourcentage et voyez les totaux par personne.',es:'Calcula la propina y divide la cuenta. Elige el porcentaje y ve los totales por persona.',de:'Trinkgeldbetrag berechnen und Rechnung aufteilen. Prozentsatz wählen und Summen pro Person sehen.',ru:'Рассчитайте чаевые и разделите счёт. Выберите процент и посмотрите итоги на человека.'}
  },
  'unit-converter': {
    title:{en:'Free Unit Converter — Length, Weight, Volume & Temperature | Adawati',ar:'محول الوحدات المجاني — طول، وزن، حجم ودرجة حرارة | أدواتي',fr:'Convertisseur d\'unités — Longueur, poids & volume | Adawati',es:'Convertidor de unidades — Longitud, peso y volumen | Adawati',de:'Einheitenrechner — Länge, Gewicht & Volumen | Adawati',ru:'Конвертер единиц — Длина, вес, объём и температура | Adawati'},
    desc:{en:'Convert units of length, weight, volume, temperature and more. Metric and imperial supported. Free online unit converter, instant results.',ar:'حول وحدات الطول والوزن والحجم ودرجة الحرارة والمزيد. يدعم النظام المتري والإمبريالي. مجاني وفوري.',fr:'Convertissez longueur, poids, volume, température et plus. Métrique et impérial supportés.',es:'Convierte longitud, peso, volumen, temperatura y más. Sistemas métrico e imperial soportados.',de:'Einheiten für Länge, Gewicht, Volumen, Temperatur konvertieren. Metrisch und imperial unterstützt.',ru:'Конвертируйте длину, вес, объём, температуру и многое другое. Метрическая и британская системы.'}
  },
  'word-counter': {
    title:{en:'Free Word Counter — Count Words, Characters & Reading Time | Adawati',ar:'عدّاد الكلمات المجاني — كلمات، أحرف ووقت القراءة | أدواتي',fr:'Compteur de mots — Mots, caractères et temps de lecture | Adawati',es:'Contador de palabras — Palabras, caracteres y lectura | Adawati',de:'Kostenloser Wortzähler — Wörter, Zeichen & Lesezeit | Adawati',ru:'Бесплатный счётчик слов — Слова, символы и время чтения | Adawati'},
    desc:{en:'Count words, characters, sentences and estimate reading time instantly. Paste any text to analyze. Free online word counter, no signup.',ar:'عدّ الكلمات والأحرف والجمل وقدّر وقت القراءة فوراً. الصق أي نص للتحليل. مجاني بدون تسجيل.',fr:'Comptez mots, caractères, phrases et estimez le temps de lecture. Collez n\'importe quel texte. Gratuit.',es:'Cuenta palabras, caracteres, oraciones y estima el tiempo de lectura. Pega cualquier texto. Gratis.',de:'Wörter, Zeichen, Sätze zählen und Lesezeit schätzen. Text einfügen. Kostenlos, ohne Anmeldung.',ru:'Считайте слова, символы, предложения и оценивайте время чтения. Вставьте любой текст. Бесплатно.'}
  },
  'kids-learn': {
    title:{en:'Free Kids Learning Game — Letters, Numbers & Colors | Adawati',ar:'لعبة تعليمية للأطفال المجانية — حروف، أرقام وألوان | أدواتي',fr:'Jeu éducatif enfants — Lettres, chiffres et couleurs | Adawati',es:'Juego educativo para niños — Letras, números y colores | Adawati',de:'Lernspiel für Kinder — Buchstaben, Zahlen & Farben | Adawati',ru:'Обучающая игра для детей — Буквы, цифры и цвета | Adawati'},
    desc:{en:'Help children learn letters, numbers and colors with fun interactive activities. Free online learning game for kids, works on all devices. No signup.',ar:'ساعد الأطفال على تعلم الحروف والأرقام والألوان بأنشطة تفاعلية ممتعة. لعبة تعليمية مجانية تعمل على جميع الأجهزة.',fr:'Aidez les enfants à apprendre lettres, chiffres et couleurs avec des activités interactives. Gratuit pour tous appareils.',es:'Ayuda a los niños a aprender letras, números y colores con actividades interactivas. Gratuito para todos los dispositivos.',de:'Kindern beim Lernen von Buchstaben, Zahlen und Farben helfen. Kostenloses Lernspiel für alle Geräte.',ru:'Помогите детям учить буквы, цифры и цвета с интерактивными заданиями. Бесплатная игра для всех устройств.'}
  },
  'memory-game': {
    title:{en:'Free Memory Card Game — Train Your Memory Online | Adawati',ar:'لعبة الذاكرة المجانية — درّب ذاكرتك أونلاين | أدواتي',fr:'Jeu de mémoire — Entraînez votre mémoire en ligne | Adawati',es:'Juego de memoria gratis — Entrena tu memoria en línea | Adawati',de:'Gedächtnisspiel — Gedächtnis online trainieren | Adawati',ru:'Бесплатная игра на память — Тренируйте память онлайн | Adawati'},
    desc:{en:'Match pairs of cards and train your memory. 6 difficulty levels from beginner to legend. Free online memory game, works on all devices. No signup.',ar:'طابق أزواج البطاقات ودرّب ذاكرتك. 6 مستويات من المبتدئ إلى الأسطوري. لعبة ذاكرة مجانية تعمل على جميع الأجهزة.',fr:'Associez des paires de cartes et entraînez votre mémoire. 6 niveaux du débutant à la légende. Gratuit, tous appareils.',es:'Empareja tarjetas y entrena tu memoria. 6 niveles de principiante a leyenda. Gratuito para todos los dispositivos.',de:'Kartenpaare finden und Gedächtnis trainieren. 6 Schwierigkeitsgrade. Kostenloses Spiel für alle Geräte.',ru:'Находите пары карточек и тренируйте память. 6 уровней сложности. Бесплатная онлайн-игра.'}
  },
  'number-guess': {
    title:{en:'Free Number Guessing Game — Guess the Hidden Number | Adawati',ar:'لعبة تخمين الأرقام المجانية — خمّن الرقم المخفي | أدواتي',fr:'Devinette de nombres — Devinez le nombre caché | Adawati',es:'Adivinanza de números — Adivina el número oculto | Adawati',de:'Kostenloses Zahlratespiel — Errate die versteckte Zahl | Adawati',ru:'Бесплатная игра угадай число — Угадайте скрытое число | Adawati'},
    desc:{en:'Guess the hidden number with hints. Multiple difficulty levels. Fun brain game for all ages. Free, instant, no signup required.',ar:'خمّن الرقم المخفي مع تلميحات. مستويات صعوبة متعددة. لعبة ذكاء ممتعة لجميع الأعمار. مجاني بدون تسجيل.',fr:'Devinez le nombre caché avec des indices. Plusieurs niveaux. Jeu cérébral pour tous les âges. Gratuit.',es:'Adivina el número oculto con pistas. Múltiples niveles. Juego mental para todas las edades. Gratis.',de:'Versteckte Zahl mit Hinweisen erraten. Verschiedene Schwierigkeitsgrade. Gehirnspiel für alle. Kostenlos.',ru:'Угадайте скрытое число с подсказками. Несколько уровней. Игра для всех возрастов. Бесплатно.'}
  },
  'quick-math': {
    title:{en:'Free Quick Math Game — 100-Level Smart Challenge | Adawati',ar:'لعبة الرياضيات السريعة — تحدي الأذكياء 100 مستوى | أدواتي',fr:'Calcul rapide — Défi intelligent 100 niveaux | Adawati',es:'Matemáticas rápidas — Desafío inteligente 100 niveles | Adawati',de:'Schnellrechenspiel — 100-Level Intelligenz-Challenge | Adawati',ru:'Быстрый счёт — 100 уровней умного вызова | Adawati'},
    desc:{en:'Test your mental math speed across 100 progressive levels from beginner to unbelievable. Free online math game, no signup required.',ar:'اختبر سرعتك في الحساب الذهني عبر 100 مستوى متصاعد من المبتدئ إلى غير قابل للتصديق. مجاني بدون تسجيل.',fr:'Testez votre calcul mental sur 100 niveaux progressifs. Du débutant à l\'incroyable. Gratuit, sans inscription.',es:'Prueba tu velocidad de cálculo mental en 100 niveles progresivos. De principiante a increíble. Gratis.',de:'Kopfrechenfähigkeiten in 100 progressiven Leveln testen. Vom Anfänger zum Unglaublichen. Kostenlos.',ru:'Проверьте скорость устного счёта на 100 прогрессивных уровнях. Бесплатно, без регистрации.'}
  },
  'reaction-test': {
    title:{en:'Free Reaction Time Test — How Fast Are You? | Adawati',ar:'اختبار سرعة رد الفعل المجاني — كم هي سرعتك؟ | أدواتي',fr:'Test de temps de réaction gratuit — Êtes-vous rapide? | Adawati',es:'Test de reacción — ¿Qué tan rápido eres? | Adawati',de:'Kostenloser Reaktionszeit-Test — Wie schnell bist du? | Adawati',ru:'Бесплатный тест скорости реакции — Насколько быстры вы? | Adawati'},
    desc:{en:'Test your reaction time across 6 difficulty levels. Click when the button turns green, avoid red. Free online reaction game, no signup.',ar:'اختبر سرعة رد فعلك عبر 6 مستويات. اضغط عندما يتحول الزر للأخضر، تجنب الأحمر. مجاني بدون تسجيل.',fr:'Testez votre temps de réaction sur 6 niveaux. Cliquez quand le bouton devient vert, évitez le rouge. Gratuit.',es:'Prueba tu tiempo de reacción en 6 niveles. Haz clic cuando el botón se vuelva verde, evita el rojo. Gratis.',de:'Reaktionszeit in 6 Schwierigkeitsgraden testen. Klicken wenn der Button grün wird, Rot vermeiden. Kostenlos.',ru:'Проверьте скорость реакции на 6 уровнях. Нажимайте при зелёной кнопке, избегайте красной. Бесплатно.'}
  },
  'car-game': {
    title:{en:'Free Car Racing Game — Dodge Traffic & Set High Scores | Adawati',ar:'لعبة سباق السيارات — تجنب المرور وسجّل نقاط | أدواتي',fr:'Jeu de course de voitures gratuit — Évitez le trafic | Adawati',es:'Juego de carreras de coches gratis — Esquiva el tráfico | Adawati',de:'Kostenloses Autorennenspiel — Verkehr ausweichen | Adawati',ru:'Бесплатная гоночная игра — Уворачивайтесь от трафика | Adawati'},
    desc:{en:'Drive your car and dodge oncoming traffic. Survive as long as possible and beat your high score. Free browser car game, no download needed.',ar:'قد سيارتك وتجنب السيارات القادمة. تمسّك أطول فترة ممكنة وحطّم رقمك القياسي. لعبة سيارات مجانية في المتصفح.',fr:'Conduisez et évitez le trafic. Survivez le plus longtemps possible. Jeu gratuit dans le navigateur.',es:'Conduce y esquiva el tráfico. Sobrevive el mayor tiempo posible. Juego de coches gratis en el navegador.',de:'Auto fahren und Verkehr ausweichen. So lange wie möglich überleben. Kostenloses Browserspiel.',ru:'Ведите машину и уворачивайтесь от встречного транспорта. Бесплатная браузерная игра.'}
  },
  'jump-game': {
    title:{en:'Free Jump Game — Endless Platformer Challenge | Adawati',ar:'لعبة القفز المجانية — تحدي المنصات اللانهائي | أدواتي',fr:'Jeu de saut gratuit — Défi de plateforme sans fin | Adawati',es:'Juego de salto gratis — Desafío de plataformas infinito | Adawati',de:'Kostenloses Sprungspiel — Endloser Plattform-Challenge | Adawati',ru:'Бесплатная прыжковая игра — Бесконечный платформер | Adawati'},
    desc:{en:'Jump over obstacles and survive as long as possible. Simple endless platformer. Free, plays in your browser, no download or signup needed.',ar:'اقفز فوق العقبات وتمسّك أطول فترة ممكنة. لعبة منصات بسيطة ولانهائية. مجانية في متصفحك بدون تنزيل.',fr:'Sautez par-dessus les obstacles et survivez. Jeu de plateforme sans fin. Gratuit dans le navigateur.',es:'Salta sobre obstáculos y sobrevive. Juego de plataformas infinito. Gratis en el navegador.',de:'Über Hindernisse springen und überleben. Endloser Platformer. Kostenlos im Browser.',ru:'Прыгайте через препятствия и продержитесь как можно дольше. Бесплатная игра в браузере.'}
  }
};

/* ── PAGE_FAQ: per-page FAQ in all 6 languages ── */
const PAGE_FAQ = {
  'percentage-calculator': {
    en: [
      {q:'How do I calculate 20% of 500?', a:'Multiply the number by the percentage then divide by 100: 500 × 20 ÷ 100 = 100. Or simply 500 × 0.20 = 100. Use the first tab in the calculator above for instant results.'},
      {q:'How do I calculate percentage price increase?', a:'% Change = ((New price − Old price) ÷ Old price) × 100. Example: 100 to 130 = ((130−100)÷100)×100 = 30% increase. Use the "% change" tab in the calculator.'},
      {q:'What percentage is 30 of 150?', a:'Divide the first number by the second then multiply by 100: 30 ÷ 150 × 100 = 20%. Use the "What percentage?" tab.'},
      {q:'How do I calculate a price after a 30% discount?', a:'Multiply the original price by (1 − discount rate). Example: 200 with 30% discount = 200 × 0.70 = 140. Or use Tab 1: enter 30 as percentage and 200 as the number to get the discount amount (60), then subtract from the original.'},
      {q:'How do I calculate 5% VAT on a price?', a:'Multiply the price by 0.05 to get the tax amount. Example: 100 × 0.05 = 5 tax, total = 105. Oman and UAE: VAT 5%. Saudi Arabia: VAT 15%.'},
      {q:'What is the difference between percentage and percentage point?', a:'A percentage point (pp) is the absolute difference between two percentages. Example: rising from 10% to 15% is +5 percentage points, but a 50% increase (since 5 ÷ 10 × 100 = 50%). This confusion is common in financial reporting.'},
      {q:'How do I calculate profit or loss percentage?', a:'% Profit/Loss = ((Sell price − Buy price) ÷ Buy price) × 100. Example: bought at 200, sold at 250 = ((250−200)÷200)×100 = 25% profit. Use the "% change" tab.'},
      {q:'How do I calculate 15% of my monthly salary?', a:'Multiply the salary by 0.15. Example: salary 1000 × 0.15 = 150. In Tab 1: enter 15 as the percentage and your salary as the number.'}
    ],
    ar: [
      {q:'كيف أحسب 20% من 500؟', a:'اضرب العدد في النسبة المئوية ثم اقسم على 100: 500 × 20 ÷ 100 = 100. أو ببساطة 500 × 0.20 = 100. استخدم التبويب الأول في الحاسبة للنتيجة الفورية.'},
      {q:'كيف أحسب نسبة الزيادة في السعر؟', a:'نسبة التغيير = ((السعر الجديد − السعر القديم) ÷ السعر القديم) × 100. مثال: من 100 إلى 130 = ((130−100)÷100)×100 = 30% زيادة. استخدم تبويب «نسبة التغيير» في الحاسبة.'},
      {q:'ما نسبة 30 من 150؟', a:'اقسم الرقم الأول على الثاني ثم اضرب في 100: 30 ÷ 150 × 100 = 20%. استخدم تبويب «ما النسبة؟».'},
      {q:'كيف أحسب السعر بعد خصم 30%؟', a:'اضرب السعر الأصلي في (1 − نسبة الخصم). مثال: 200 بخصم 30% = 200 × 0.70 = 140. أو استخدم التبويب الأول: أدخل 30 كنسبة و200 كرقم للحصول على الخصم (60) ثم اطرحه من الأصلي.'},
      {q:'كيف أحسب ضريبة القيمة المضافة 5% على سعر؟', a:'اضرب السعر في 0.05 للحصول على قيمة الضريبة. مثال: 100 × 0.05 = 5 ضريبة، والإجمالي = 105. عمان والإمارات: VAT 5%. السعودية: VAT 15%.'},
      {q:'ما الفرق بين النسبة المئوية والنقطة المئوية؟', a:'النقطة المئوية هي الفرق المطلق بين نسبتين. مثال: الارتفاع من 10% إلى 15% هو +5 نقاط مئوية، لكن نسبة الزيادة هي 50% (لأن 5 ÷ 10 × 100 = 50%). هذا الخلط شائع في التقارير المالية.'},
      {q:'كيف أحسب نسبة الربح أو الخسارة؟', a:'نسبة الربح/الخسارة = ((سعر البيع − سعر الشراء) ÷ سعر الشراء) × 100. مثال: اشتريت بـ 200 وبعت بـ 250 = ((250−200)÷200)×100 = 25% ربح. استخدم تبويب «نسبة التغيير».'},
      {q:'كيف أحسب 15% من راتبي الشهري؟', a:'اضرب الراتب في 0.15. مثال: راتب 1000 × 0.15 = 150. في التبويب الأول: أدخل 15 كنسبة وراتبك كرقم.'}
    ],
    fr: [
      {q:'Comment calculer 20% de 500?', a:'Multipliez le nombre par le pourcentage puis divisez par 100 : 500 × 20 ÷ 100 = 100. Ou simplement 500 × 0,20 = 100. Utilisez le premier onglet de la calculatrice.'},
      {q:'Comment calculer une augmentation de prix en pourcentage?', a:'% Variation = ((Nouveau prix − Ancien prix) ÷ Ancien prix) × 100. Exemple : de 100 à 130 = 30% d\'augmentation. Utilisez l\'onglet «% de variation».'},
      {q:'Quel pourcentage représente 30 sur 150?', a:'Divisez le premier nombre par le second puis multipliez par 100 : 30 ÷ 150 × 100 = 20%.'},
      {q:'Comment calculer un prix après une remise de 30%?', a:'Multipliez le prix original par (1 − taux de remise). Exemple : 200 avec 30% de remise = 200 × 0,70 = 140.'},
      {q:'Comment calculer une TVA de 5% sur un prix?', a:'Multipliez le prix par 0,05 pour obtenir le montant de la taxe. Exemple : 100 × 0,05 = 5 de taxe, total = 105.'},
      {q:'Quelle est la différence entre pourcentage et point de pourcentage?', a:'Un point de pourcentage (pp) est la différence absolue entre deux pourcentages. Exemple : passer de 10% à 15% représente +5 points de pourcentage, mais une augmentation de 50%.'},
      {q:'Comment calculer un pourcentage de profit ou de perte?', a:'% Profit/Perte = ((Prix de vente − Prix d\'achat) ÷ Prix d\'achat) × 100.'},
      {q:'Comment calculer 15% de mon salaire mensuel?', a:'Multipliez le salaire par 0,15. Exemple : salaire 1000 × 0,15 = 150.'}
    ],
    es: [
      {q:'¿Cómo calculo el 20% de 500?', a:'Multiplica el número por el porcentaje y divide entre 100: 500 × 20 ÷ 100 = 100. O simplemente 500 × 0,20 = 100.'},
      {q:'¿Cómo calculo el aumento porcentual de un precio?', a:'% Cambio = ((Precio nuevo − Precio anterior) ÷ Precio anterior) × 100. Ejemplo: de 100 a 130 = 30% de aumento.'},
      {q:'¿Qué porcentaje representa 30 de 150?', a:'Divide el primer número entre el segundo y multiplica por 100: 30 ÷ 150 × 100 = 20%.'},
      {q:'¿Cómo calculo un precio después de un descuento del 30%?', a:'Multiplica el precio original por (1 − tasa de descuento). Ejemplo: 200 con 30% descuento = 200 × 0,70 = 140.'},
      {q:'¿Cómo calculo el IVA del 5% sobre un precio?', a:'Multiplica el precio por 0,05 para obtener el monto del impuesto. Ejemplo: 100 × 0,05 = 5 de impuesto, total = 105.'},
      {q:'¿Cuál es la diferencia entre porcentaje y punto porcentual?', a:'Un punto porcentual (pp) es la diferencia absoluta entre dos porcentajes. Subir del 10% al 15% son +5 puntos porcentuales, pero un aumento del 50%.'},
      {q:'¿Cómo calculo el porcentaje de ganancia o pérdida?', a:'% Ganancia/Pérdida = ((Precio de venta − Precio de compra) ÷ Precio de compra) × 100.'},
      {q:'¿Cómo calculo el 15% de mi salario mensual?', a:'Multiplica el salario por 0,15. Ejemplo: salario 1000 × 0,15 = 150.'}
    ],
    de: [
      {q:'Wie berechne ich 20% von 500?', a:'Multiplizieren Sie die Zahl mit dem Prozentsatz und dividieren Sie durch 100: 500 × 20 ÷ 100 = 100. Oder einfach 500 × 0,20 = 100.'},
      {q:'Wie berechne ich einen prozentualen Preisanstieg?', a:'% Änderung = ((Neuer Preis − Alter Preis) ÷ Alter Preis) × 100. Beispiel: von 100 auf 130 = 30% Anstieg.'},
      {q:'Wie viel Prozent sind 30 von 150?', a:'Teilen Sie die erste Zahl durch die zweite und multiplizieren Sie mit 100: 30 ÷ 150 × 100 = 20%.'},
      {q:'Wie berechne ich einen Preis nach einem 30% Rabatt?', a:'Multiplizieren Sie den Originalpreis mit (1 − Rabattrate). Beispiel: 200 mit 30% Rabatt = 200 × 0,70 = 140.'},
      {q:'Wie berechne ich 5% MwSt auf einen Preis?', a:'Multiplizieren Sie den Preis mit 0,05, um den Steuerbetrag zu erhalten. Beispiel: 100 × 0,05 = 5 Steuer, Gesamt = 105.'},
      {q:'Was ist der Unterschied zwischen Prozent und Prozentpunkt?', a:'Ein Prozentpunkt (pp) ist die absolute Differenz zwischen zwei Prozentwerten. Von 10% auf 15% = +5 Prozentpunkte, aber 50% Anstieg.'},
      {q:'Wie berechne ich den Gewinn- oder Verlustsatz?', a:'% Gewinn/Verlust = ((Verkaufspreis − Kaufpreis) ÷ Kaufpreis) × 100.'},
      {q:'Wie berechne ich 15% meines monatlichen Gehalts?', a:'Multiplizieren Sie das Gehalt mit 0,15. Beispiel: Gehalt 1000 × 0,15 = 150.'}
    ],
    ru: [
      {q:'Как вычислить 20% от 500?', a:'Умножьте число на процент и разделите на 100: 500 × 20 ÷ 100 = 100. Или просто 500 × 0,20 = 100.'},
      {q:'Как рассчитать процентный рост цены?', a:'% Изменения = ((Новая цена − Старая цена) ÷ Старая цена) × 100. Пример: от 100 до 130 = 30% рост.'},
      {q:'Каков процент 30 от 150?', a:'Разделите первое число на второе и умножьте на 100: 30 ÷ 150 × 100 = 20%.'},
      {q:'Как рассчитать цену после скидки 30%?', a:'Умножьте исходную цену на (1 − ставка скидки). Пример: 200 со скидкой 30% = 200 × 0,70 = 140.'},
      {q:'Как рассчитать НДС 5% на цену?', a:'Умножьте цену на 0,05, чтобы получить сумму налога. Пример: 100 × 0,05 = 5 налог, итого = 105.'},
      {q:'В чём разница между процентом и процентным пунктом?', a:'Процентный пункт (пп) — это абсолютная разница между двумя процентами. Рост с 10% до 15% = +5 процентных пунктов, но увеличение на 50%.'},
      {q:'Как рассчитать процент прибыли или убытка?', a:'% Прибыли/Убытка = ((Цена продажи − Цена покупки) ÷ Цена покупки) × 100.'},
      {q:'Как рассчитать 15% от моей ежемесячной зарплаты?', a:'Умножьте зарплату на 0,15. Пример: зарплата 1000 × 0,15 = 150.'}
    ]
  }
};

/* ── Also add T entries for SEO article content (data-i18n-html) ── */
T.en.pct_seo_html = '<h2 style="font-size:17px;font-weight:700;margin-bottom:10px;">Percentage Calculator — How It Works</h2><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">This free percentage calculator handles three of the most common percentage problems in one tool — no signup, no ads interrupting results, and everything runs instantly in your browser.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">What percentage of a number (X% of Y)</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Use this mode to find a percentage of any number. Common uses: calculate a 20% discount on a price, find 5% VAT (Oman/UAE) or 15% VAT (Saudi Arabia) on a purchase, or split a tip. Formula: <strong>result = number × percentage ÷ 100</strong>. Example: 15% of 80 = 12.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">What percentage is X of Y</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Answers questions like "30 is what percent of 200?" Formula: <strong>(X ÷ Y) × 100</strong>. Useful for test scores, survey results, and sales ratios. Example: you scored 45 out of 60 — that\'s 75%.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Percentage increase or decrease</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Calculate how much something changed as a percentage. Formula: <strong>((new − old) ÷ old) × 100</strong>. Positive = increase, negative = decrease.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Common percentage shortcuts</h3><ul style="font-size:14px;color:var(--text-muted);line-height:2;padding-inline-start:18px;margin:0;"><li>10% of any number: move the decimal one place left (10% of 350 = 35)</li><li>5% = half of 10% (5% of 350 = 17.5)</li><li>25% = divide by 4 (25% of 200 = 50)</li><li>50% = divide by 2 (50% of 90 = 45)</li></ul>';
T.ar.pct_seo_html = '<h2 style="font-size:17px;font-weight:700;margin-bottom:10px;">حاسبة النسبة المئوية — كيف تعمل؟</h2><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">تتعامل حاسبة النسبة المئوية المجانية هذه مع ثلاثة من أكثر مسائل النسبة شيوعاً في أداة واحدة — بدون تسجيل، بدون إعلانات تقاطع النتائج، وكل شيء يعمل فورياً في متصفحك.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">ما النسبة المئوية من رقم (X% من Y)</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">استخدم هذا الوضع لإيجاد نسبة من أي رقم. استخدامات شائعة: حساب خصم 20% على سعر، إيجاد ضريبة VAT 5% (عمان/الإمارات) أو 15% (السعودية). الصيغة: <strong>النتيجة = الرقم × النسبة ÷ 100</strong>. مثال: 15% من 80 = 12.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">ما النسبة التي يمثلها X من Y</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">تجيب على أسئلة مثل «30 هو كم بالمئة من 200؟» الصيغة: <strong>(X ÷ Y) × 100</strong>. مفيد لنتائج الاختبارات ونسب المبيعات. مثال: حصلت على 45 من 60 — هذا يساوي 75%.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">الزيادة أو النقص كنسبة مئوية</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">احسب مقدار تغير شيء ما كنسبة مئوية. الصيغة: <strong>((الجديد − القديم) ÷ القديم) × 100</strong>. موجب = زيادة، سالب = نقص.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">اختصارات النسبة المئوية الشائعة</h3><ul style="font-size:14px;color:var(--text-muted);line-height:2;padding-inline-start:18px;margin:0;"><li>10% من أي رقم: انقل الفاصلة مكاناً واحداً لليسار (10% من 350 = 35)</li><li>5% = نصف 10% (5% من 350 = 17.5)</li><li>25% = اقسم على 4 (25% من 200 = 50)</li><li>50% = اقسم على 2 (50% من 90 = 45)</li></ul>';
T.fr.pct_seo_html = '<h2 style="font-size:17px;font-weight:700;margin-bottom:10px;">Calculateur de pourcentage — Comment ça marche</h2><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Ce calculateur de pourcentage gratuit gère trois des problèmes de pourcentage les plus courants en un seul outil — sans inscription, sans publicités, et tout fonctionne instantanément dans votre navigateur.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Quel pourcentage d\'un nombre (X% de Y)</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Utilisez ce mode pour trouver un pourcentage de n\'importe quel nombre. Formule : <strong>résultat = nombre × pourcentage ÷ 100</strong>. Exemple : 15% de 80 = 12.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Quel pourcentage X représente-t-il de Y</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Répond à des questions comme «30 représente quel % de 200?» Formule : <strong>(X ÷ Y) × 100</strong>.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Augmentation ou diminution en pourcentage</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Formule : <strong>((nouveau − ancien) ÷ ancien) × 100</strong>. Positif = augmentation, négatif = diminution.</p>';
T.es.pct_seo_html = '<h2 style="font-size:17px;font-weight:700;margin-bottom:10px;">Calculadora de porcentaje — Cómo funciona</h2><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Esta calculadora de porcentaje gratuita resuelve tres de los problemas de porcentaje más comunes en una sola herramienta — sin registro, sin anuncios, y todo funciona instantáneamente en tu navegador.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Qué porcentaje de un número (X% de Y)</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Fórmula: <strong>resultado = número × porcentaje ÷ 100</strong>. Ejemplo: 15% de 80 = 12.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Qué porcentaje es X de Y</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Responde preguntas como «¿30 es qué porcentaje de 200?» Fórmula: <strong>(X ÷ Y) × 100</strong>.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Aumento o disminución porcentual</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Fórmula: <strong>((nuevo − anterior) ÷ anterior) × 100</strong>. Positivo = aumento, negativo = disminución.</p>';
T.de.pct_seo_html = '<h2 style="font-size:17px;font-weight:700;margin-bottom:10px;">Prozentrechner — So funktioniert er</h2><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Dieser kostenlose Prozentrechner löst drei der häufigsten Prozentprobleme in einem Tool — ohne Anmeldung, ohne unterbrechende Werbung, und alles läuft sofort in Ihrem Browser.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Prozentteil einer Zahl (X% von Y)</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Formel: <strong>Ergebnis = Zahl × Prozent ÷ 100</strong>. Beispiel: 15% von 80 = 12.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Wie viel Prozent ist X von Y</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Beantwortet Fragen wie «30 ist wie viel % von 200?» Formel: <strong>(X ÷ Y) × 100</strong>.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Prozentualer Anstieg oder Rückgang</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Formel: <strong>((Neu − Alt) ÷ Alt) × 100</strong>. Positiv = Anstieg, negativ = Rückgang.</p>';
T.ru.pct_seo_html = '<h2 style="font-size:17px;font-weight:700;margin-bottom:10px;">Калькулятор процентов — Как это работает</h2><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Этот бесплатный калькулятор процентов решает три наиболее распространённые задачи на проценты в одном инструменте — без регистрации, без рекламы, всё работает мгновенно в вашем браузере.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Процент от числа (X% от Y)</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Формула: <strong>результат = число × процент ÷ 100</strong>. Пример: 15% от 80 = 12.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Какой процент X составляет от Y</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Отвечает на вопросы вроде «30 — это сколько процентов от 200?» Формула: <strong>(X ÷ Y) × 100</strong>.</p><h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">Процентный рост или снижение</h3><p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">Формула: <strong>((новое − старое) ÷ старое) × 100</strong>. Положительное = рост, отрицательное = снижение.</p>';

/* ── renderFAQ: inject FAQ from PAGE_FAQ for current page ── */
function renderFAQ(lang) {
  const page = _getPageSlug();
  const faqData = PAGE_FAQ[page];
  if (!faqData) return;
  const t = T[lang] || T.en;
  const faqCard = document.getElementById('faqCard');
  if (!faqCard) return;
  const items = faqData[lang] || faqData.en;
  if (!items || !items.length) return;
  // Clear existing details elements and rebuild
  faqCard.querySelectorAll('details').forEach(function(d) { d.remove(); });
  // Ensure title exists
  let titleEl = faqCard.querySelector('[data-i18n="faq_title"]');
  if (!titleEl) {
    titleEl = document.createElement('div');
    titleEl.className = 'card-title';
    titleEl.style.fontSize = '15px';
    titleEl.setAttribute('data-i18n', 'faq_title');
    titleEl.textContent = t.faq_title || '❓ FAQ';
    faqCard.insertBefore(titleEl, faqCard.firstChild);
  } else {
    titleEl.textContent = t.faq_title || '❓ FAQ';
  }
  items.forEach(function(item, i) {
    const details = document.createElement('details');
    details.style.cssText = 'margin-top:' + (i === 0 ? '12' : '8') + 'px;border:1px solid var(--border);border-radius:8px;padding:12px;';
    const summary = document.createElement('summary');
    summary.style.cssText = 'font-weight:700;cursor:pointer;font-size:14px;';
    summary.textContent = item.q;
    const p = document.createElement('p');
    p.style.cssText = 'margin-top:8px;font-size:14px;color:var(--text-muted);line-height:1.7;';
    p.textContent = item.a;
    details.append(summary, p);
    faqCard.appendChild(details);
  });
}

function _getPageSlug() {
  var parts = location.pathname.split('/').filter(function(s) { return s.length > 0; });
  var last = parts[parts.length - 1] || '';
  return last.replace('.html', '') || (parts[parts.length - 2] || 'index');
}

function detectDefaultLang() {
  var urlLangs = ['ar', 'fr', 'es', 'de', 'ru'];
  var pathParts = location.pathname.split('/').filter(function(s) { return s.length > 0; });
  // 1. Explicit language code in URL path — /ar/tool/, /fr/tool/ etc.
  for (var i = 0; i < pathParts.length; i++) {
    if (urlLangs.indexOf(pathParts[i]) !== -1) {
      try { localStorage.setItem('lang', pathParts[i]); } catch(e) {}
      return pathParts[i];
    }
  }
  // 2. Country-specific pages — /om/ → ar, /sa/ → ar, /ae/ /us/ /uk/ → en
  var cmap = {om:'ar', sa:'ar', jo:'ar', ae:'en', us:'en', uk:'en'};
  for (var j = 0; j < pathParts.length; j++) {
    if (cmap[pathParts[j]] !== undefined) return cmap[pathParts[j]];
  }
  // 3. Root pages (no language in URL): check this session's detected country
  //    (set by initCountryDetect() when the user visited a country hub like /jo/)
  //    rather than blindly forcing English and discarding that context.
  try {
    var sessCountry = sessionStorage.getItem('adawati_country');
    var countryLangMap = {OM:'ar', SA:'ar', JO:'ar', AE:'en', US:'en', GB:'en'};
    if (sessCountry && countryLangMap[sessCountry]) return countryLangMap[sessCountry];
  } catch(e) {}
  // No session country detected: default to English.
  //    Arabic/French/Spanish users should use /ar/ /fr/ /es/ subdirectories.
  return 'en';
}

/* ── Dark Mode ── */
function initDarkMode() {
  if (localStorage.getItem('dark') === '1') document.documentElement.classList.add('dark');
}
function toggleDark() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('dark', isDark ? '1' : '0');
  updateDarkBtn();
}
function updateDarkBtn() {
  const btn = document.getElementById('darkToggleBtn');
  if (!btn) return;
  const isDark = document.documentElement.classList.contains('dark');
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.title = isDark ? 'Light mode' : 'Dark mode';
}
function injectDarkToggle() {
  const nav = document.querySelector('.nav-links');
  if (!nav || document.getElementById('darkToggleBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'darkToggleBtn';
  btn.className = 'dark-toggle';
  btn.onclick = toggleDark;
  const isDark = document.documentElement.classList.contains('dark');
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.title = isDark ? 'Light mode' : 'Dark mode';
  const langSwitcher = nav.querySelector('.lang-switcher');
  if (langSwitcher) nav.insertBefore(btn, langSwitcher);
  else nav.appendChild(btn);
}

/* ── PWA / Service Worker ── */
let _deferredInstall = null;
// Auto-reload when a new SW takes over, so stale HTML is never served to users
if ('serviceWorker' in navigator && !sessionStorage.getItem('sw_reloaded')) {
  navigator.serviceWorker.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'SW_UPDATED') {
      sessionStorage.setItem('sw_reloaded', '1');
      location.reload();
    }
  });
}
function initPWA() {
  if (!('serviceWorker' in navigator)) return;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  navigator.serviceWorker.register(base + '/sw.js', {updateViaCache:'none'}).catch(() => {});

  if (!document.querySelector('link[rel="manifest"]')) {
    const l = document.createElement('link');
    l.rel = 'manifest'; l.href = base + '/manifest.json';
    document.head.appendChild(l);
  }
  if (!document.querySelector('meta[name="theme-color"]')) {
    const m = document.createElement('meta');
    m.name = 'theme-color'; m.content = '#2563eb';
    document.head.appendChild(m);
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _deferredInstall = e;
    if (!localStorage.getItem('pwa_dismissed')) showPWABanner();
  });
}

function showPWABanner() {
  if (document.getElementById('pwaBanner')) return;
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const banner = document.createElement('div');
  banner.id = 'pwaBanner';
  banner.className = 'pwa-banner';
  banner.innerHTML = '';
  const title = document.createElement('div');
  title.className = 'pwa-banner-title';
  title.textContent = '⚡ ' + (t.pwa_title || 'Install App');
  const sub = document.createElement('div');
  sub.className = 'pwa-banner-sub';
  sub.textContent = t.pwa_sub || 'Add to your home screen';
  const btns = document.createElement('div');
  btns.className = 'pwa-banner-btns';
  const installBtn = document.createElement('button');
  installBtn.className = 'pwa-install-btn';
  installBtn.textContent = t.pwa_install || 'Install';
  installBtn.onclick = () => { if (_deferredInstall) { _deferredInstall.prompt(); _deferredInstall.userChoice.then(() => { banner.remove(); }); } };
  const dismissBtn = document.createElement('button');
  dismissBtn.className = 'pwa-dismiss-btn';
  dismissBtn.textContent = t.pwa_later || 'Later';
  dismissBtn.onclick = () => { localStorage.setItem('pwa_dismissed', '1'); banner.remove(); };
  btns.append(installBtn, dismissBtn);
  banner.append(title, sub, btns);
  document.body.appendChild(banner);
}

/* ── Related Tools ── */
const RELATED_MAP = {
  'bmi-calculator':      [['diet-plan','🥗','diet_card_title'],['age-calculator','📅','age_card_title']],
  'diet-plan':           [['bmi-calculator','⚖️','bmi_card_title'],['unit-converter','🔄','unit_card_title']],
  'currency-converter':  [['loan-calculator','🧮','loan_card_title'],['tip-calculator','🤝','tip_card_title']],
  'loan-calculator':     [['currency-converter','💱','currency_card_title'],['discount-calculator','💯','discount_card_title']],
  'age-calculator':      [['bmi-calculator','⚖️','bmi_card_title'],['diet-plan','🥗','diet_card_title']],
  'discount-calculator': [['loan-calculator','🧮','loan_card_title'],['tip-calculator','🤝','tip_card_title']],
  'tip-calculator':      [['currency-converter','💱','currency_card_title'],['discount-calculator','💯','discount_card_title']],
  'unit-converter':      [['currency-converter','💱','currency_card_title'],['word-counter','🔤','word_card_title']],
  'password-generator':  [['qr-generator','📱','qr_card_title'],['word-counter','🔤','word_card_title']],
  'word-counter':        [['password-generator','🔑','pass_card_title'],['qr-generator','📱','qr_card_title']],
  'qr-generator':        [['password-generator','🔑','pass_card_title'],['word-counter','🔤','word_card_title']],
  'timezone-converter':  [['stopwatch','⏱️','sw_card_title'],['currency-converter','💱','currency_card_title']],
  'random-number':       [['stopwatch','⏱️','sw_card_title'],['qr-generator','📱','qr_card_title']],
  'stopwatch':           [['random-number','🎲','rng_card_title'],['timezone-converter','🕐','tz_card_title']],
  'vat-calculator':     [['salary-calculator','💼','sal_card_title'],['loan-calculator','🧮','loan_card_title']],
  'salary-calculator':  [['end-of-service','📋','eos_card_title'],['vat-calculator','🧾','vat_card_title']],
  'end-of-service':     [['salary-calculator','💼','sal_card_title'],['loan-calculator','🧮','loan_card_title']],
  'hijri-converter':    [['age-calculator','📅','age_card_title'],['end-of-service','📋','eos_card_title']],
  'percentage-calculator': [['vat-calculator','🧾','vat_card_title'],['loan-calculator','🧮','loan_card_title'],['discount-calculator','💯','discount_card_title']],
};

function injectRelatedTools() {
  const page = _getPageSlug();
  const related = RELATED_MAP[page];
  if (!related) return;
  const card = document.querySelector('.card');
  if (!card) return;
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  const section = document.createElement('div');
  section.className = 'related-tools';
  const heading = document.createElement('h3');
  heading.textContent = t.related_title || 'Related Tools';
  const links = document.createElement('div');
  links.className = 'related-links';
  related.forEach(([slug, icon, titleKey]) => {
    const a = document.createElement('a');
    a.href = base + '/' + slug + '.html';
    a.className = 'related-link';
    a.textContent = icon + ' ' + (t[titleKey] || slug);
    links.appendChild(a);
  });
  section.append(heading, links);
  card.appendChild(section);
}

/* ── Favorites & Recent ── */
const TOOL_META = {
  'bmi-calculator':      {icon:'⚖️', bg:'#eff6ff', titleKey:'bmi_card_title', descKey:'bmi_card_desc'},
  'diet-plan':           {icon:'🥗', bg:'#f0fdf4', titleKey:'diet_card_title', descKey:'diet_card_desc'},
  'currency-converter':  {icon:'💱', bg:'#fefce8', titleKey:'currency_card_title', descKey:'currency_card_desc'},
  'loan-calculator':     {icon:'🧮', bg:'#faf5ff', titleKey:'loan_card_title', descKey:'loan_card_desc'},
  'age-calculator':      {icon:'📅', bg:'#fff7ed', titleKey:'age_card_title', descKey:'age_card_desc'},
  'discount-calculator': {icon:'💯', bg:'#fef2f2', titleKey:'discount_card_title', descKey:'discount_card_desc'},
  'tip-calculator':      {icon:'🤝', bg:'#fdf4ff', titleKey:'tip_card_title', descKey:'tip_card_desc'},
  'unit-converter':      {icon:'🔄', bg:'#f0f9ff', titleKey:'unit_card_title', descKey:'unit_card_desc'},
  'password-generator':  {icon:'🔑', bg:'#f8fafc', titleKey:'pass_card_title', descKey:'pass_card_desc'},
  'word-counter':        {icon:'🔤', bg:'#fefce8', titleKey:'word_card_title', descKey:'word_card_desc'},
  'qr-generator':        {icon:'📱', bg:'#f0fdf4', titleKey:'qr_card_title', descKey:'qr_card_desc'},
  'timezone-converter':  {icon:'🕐', bg:'#fff7ed', titleKey:'tz_card_title', descKey:'tz_card_desc'},
  'random-number':       {icon:'🎲', bg:'#fdf4ff', titleKey:'rng_card_title', descKey:'rng_card_desc'},
  'stopwatch':           {icon:'⏱️', bg:'#eff6ff', titleKey:'sw_card_title', descKey:'sw_card_desc'},
  'vat-calculator':      {icon:'🧾', bg:'#fefce8', titleKey:'vat_card_title', descKey:'vat_card_desc'},
  'salary-calculator':   {icon:'💼', bg:'#f0fdf4', titleKey:'sal_card_title', descKey:'sal_card_desc'},
  'end-of-service':      {icon:'📋', bg:'#f0f9ff', titleKey:'eos_card_title', descKey:'eos_card_desc'},
  'hijri-converter':     {icon:'🌙', bg:'#fdf4ff', titleKey:'hijri_card_title', descKey:'hijri_card_desc'},
  'percentage-calculator':{icon:'💯', bg:'#fef2f2', titleKey:'pct_card_title', descKey:'pct_card_desc'},
  'compound-interest':   {icon:'📈', bg:'#f0fdf4', titleKey:'ci_card_title', descKey:'ci_card_desc'},
  'date-diff':           {icon:'📆', bg:'#fff7ed', titleKey:'dd_card_title', descKey:'dd_card_desc'},
  'file-converter':      {icon:'📂', bg:'#f0fdf4', titleKey:'fc_card_title', descKey:'fc_card_desc'},
  'image-compressor':    {icon:'🖼️', bg:'#f0f9ff', titleKey:'ic_card_title', descKey:'ic_card_desc'},
  'number-guess':        {icon:'🎯', bg:'#fdf4ff', titleKey:'guess_card_title', descKey:'guess_card_desc'},
  'memory-game':         {icon:'🃏', bg:'#fef9c3', titleKey:'memory_card_title', descKey:'memory_card_desc'},
  'quick-math':          {icon:'🔢', bg:'#fef3c7', titleKey:'qmath_card_title', descKey:'qmath_card_desc'},
  'reaction-test':       {icon:'⚡', bg:'#f0fdf4', titleKey:'react_card_title', descKey:'react_card_desc'},
  'car-game':            {icon:'🚗', bg:'#fef3c7', titleKey:'car_card_title',  descKey:'car_card_desc'},
  'jump-game':           {icon:'🦸', bg:'#f0fdf4', titleKey:'jump_card_title', descKey:'jump_card_desc'},
  'kids-learn':          {icon:'🧒', bg:'#fef9c3', titleKey:'kids_card_title', descKey:'kids_card_desc'},
};

function getFavs() {
  try { return JSON.parse(localStorage.getItem('adawati_favs') || '[]'); } catch { return []; }
}
function saveFavs(arr) { localStorage.setItem('adawati_favs', JSON.stringify(arr)); }
function isFav(id) { return getFavs().includes(id); }
function toggleFav(id) {
  const favs = getFavs();
  const idx = favs.indexOf(id);
  if (idx > -1) favs.splice(idx, 1); else favs.push(id);
  saveFavs(favs);
  syncFavsToCloud();
  renderFavSection();
  document.querySelectorAll('.fav-star[data-id="' + id + '"]').forEach(function(s) {
    s.textContent = isFav(id) ? '⭐' : '☆';
    s.classList.toggle('fav-active', isFav(id));
  });
}
function getRecent() {
  try { return JSON.parse(localStorage.getItem('adawati_recent') || '[]'); } catch { return []; }
}
function trackRecent(id) {
  var list = getRecent().filter(function(x) { return x !== id; });
  list.unshift(id);
  localStorage.setItem('adawati_recent', JSON.stringify(list.slice(0, 6)));
  syncRecentToCloud();
}

function buildMiniCard(id, t, base) {
  const meta = TOOL_META[id];
  if (!meta) return null;
  const a = document.createElement('a');
  a.href = base + '/' + id + '.html';
  a.className = 'tool-card';
  a.style.position = 'relative';
  a.innerHTML =
    '<div class="tool-icon-wrap" style="background:' + meta.bg + ';">' + meta.icon + '</div>' +
    '<div class="tool-card-title" data-i18n="' + meta.titleKey + '">' + (t[meta.titleKey] || id) + '</div>' +
    '<div class="tool-card-desc" data-i18n="' + meta.descKey + '">' + (t[meta.descKey] || '') + '</div>' +
    '<div class="tool-card-arrow" data-i18n="start">' + (t.start || '→') + '</div>';
  return a;
}

function renderFavSection() {
  const favSection = document.getElementById('favSection');
  const favGrid = document.getElementById('favGrid');
  if (!favSection || !favGrid) return;
  const favs = getFavs();
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  favGrid.innerHTML = '';
  if (favs.length === 0) { favSection.style.display = 'none'; return; }
  const validFavs = [];
  favs.forEach(function(id) {
    const card = buildMiniCard(id, t, base);
    if (card) { favGrid.appendChild(card); validFavs.push(id); }
  });
  if (validFavs.length !== favs.length) saveFavs(validFavs);
  favSection.style.display = favGrid.querySelector('.tool-card') ? '' : 'none';
  injectStarBtns();
}

function renderRecentSection() {
  const recentSection = document.getElementById('recentSection');
  const recentGrid = document.getElementById('recentGrid');
  if (!recentSection || !recentGrid) return;
  const recent = getRecent();
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  recentGrid.innerHTML = '';
  if (recent.length === 0) { recentSection.style.display = 'none'; return; }
  recent.forEach(function(id) {
    const card = buildMiniCard(id, t, base);
    if (card) recentGrid.appendChild(card);
  });
  recentSection.style.display = recentGrid.querySelector('.tool-card') ? '' : 'none';
}

function injectStarBtns() {
  if (!document.getElementById('toolsGrid')) return;
  var lang = localStorage.getItem('lang') || 'en';
  var t = T[lang] || T.en;
  document.querySelectorAll('#toolsGrid .tool-card, #favGrid .tool-card, #recentGrid .tool-card').forEach(function(card) {
    if (card.querySelector('.fav-star')) return;
    const href = card.getAttribute('href') || '';
    const id = href.split('/').pop().replace('.html', '');
    if (!TOOL_META[id]) return;
    const star = document.createElement('button');
    star.className = 'fav-star' + (isFav(id) ? ' fav-active' : '');
    star.setAttribute('data-id', id);
    star.textContent = isFav(id) ? '⭐' : '☆';
    star.title = isFav(id) ? (t.remove_fav || 'Remove from Favorites') : (t.add_fav || 'Add to Favorites');
    star.onclick = function(e) { e.preventDefault(); e.stopPropagation(); toggleFav(id); };
    card.style.position = 'relative';
    card.appendChild(star);
  });
}

/* ── Country Detection & Geo-recommended tools ── */
const COUNTRY_DATA = {
  // ── Gulf & Levant ──────────────────────────────────────────────────────────
  'OM': { flag:'🇴🇲', name:'عُمان',          nameEn:'Oman',
    tools:['vat-calculator','salary-calculator','end-of-service','hijri-converter'] },
  'SA': { flag:'🇸🇦', name:'السعودية',        nameEn:'Saudi Arabia',
    tools:['vat-calculator','loan-calculator','hijri-converter','currency-converter'] },
  'AE': { flag:'🇦🇪', name:'الإمارات',        nameEn:'UAE',
    tools:['vat-calculator','loan-calculator','currency-converter','hijri-converter'] },
  'KW': { flag:'🇰🇼', name:'الكويت',          nameEn:'Kuwait',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'QA': { flag:'🇶🇦', name:'قطر',             nameEn:'Qatar',
    tools:['currency-converter','loan-calculator','discount-calculator','hijri-converter'] },
  'BH': { flag:'🇧🇭', name:'البحرين',         nameEn:'Bahrain',
    tools:['vat-calculator','loan-calculator','currency-converter','hijri-converter'] },
  'JO': { flag:'🇯🇴', name:'الأردن',          nameEn:'Jordan',
    tools:['currency-converter','loan-calculator','age-calculator','hijri-converter'] },
  'PS': { flag:'🇵🇸', name:'فلسطين',          nameEn:'Palestine',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'SY': { flag:'🇸🇾', name:'سوريا',           nameEn:'Syria',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'LB': { flag:'🇱🇧', name:'لبنان',           nameEn:'Lebanon',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'IQ': { flag:'🇮🇶', name:'العراق',          nameEn:'Iraq',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  // ── North Africa ───────────────────────────────────────────────────────────
  'EG': { flag:'🇪🇬', name:'مصر',             nameEn:'Egypt',
    tools:['currency-converter','loan-calculator','discount-calculator','age-calculator'] },
  'MA': { flag:'🇲🇦', name:'المغرب',          nameEn:'Morocco',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'DZ': { flag:'🇩🇿', name:'الجزائر',         nameEn:'Algeria',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'TN': { flag:'🇹🇳', name:'تونس',            nameEn:'Tunisia',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'LY': { flag:'🇱🇾', name:'ليبيا',           nameEn:'Libya',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'SD': { flag:'🇸🇩', name:'السودان',         nameEn:'Sudan',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  // ── Sub-Saharan & Horn of Africa (Arab League members) ────────────────────
  'SO': { flag:'🇸🇴', name:'الصومال',         nameEn:'Somalia',
    tools:['currency-converter','loan-calculator','age-calculator','hijri-converter'] },
  'MR': { flag:'🇲🇷', name:'موريتانيا',       nameEn:'Mauritania',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'DJ': { flag:'🇩🇯', name:'جيبوتي',          nameEn:'Djibouti',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'KM': { flag:'🇰🇲', name:'جزر القمر',       nameEn:'Comoros',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'YE': { flag:'🇾🇪', name:'اليمن',           nameEn:'Yemen',
    tools:['currency-converter','loan-calculator','age-calculator','hijri-converter'] },
  // ── Top world countries by internet users ─────────────────────────────────
  'CN': { flag:'🇨🇳', name:'الصين',           nameEn:'China',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'IN': { flag:'🇮🇳', name:'الهند',           nameEn:'India',
    tools:['currency-converter','bmi-calculator','loan-calculator','percentage-calculator'] },
  'US': { flag:'🇺🇸', name:'الولايات المتحدة',nameEn:'USA',
    tools:['tip-calculator','discount-calculator','loan-calculator','currency-converter'] },
  'ID': { flag:'🇮🇩', name:'إندونيسيا',       nameEn:'Indonesia',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'BR': { flag:'🇧🇷', name:'البرازيل',        nameEn:'Brazil',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'RU': { flag:'🇷🇺', name:'روسيا',           nameEn:'Russia',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'JP': { flag:'🇯🇵', name:'اليابان',         nameEn:'Japan',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'NG': { flag:'🇳🇬', name:'نيجيريا',        nameEn:'Nigeria',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'PK': { flag:'🇵🇰', name:'باكستان',         nameEn:'Pakistan',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'BD': { flag:'🇧🇩', name:'بنغلاديش',        nameEn:'Bangladesh',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'DE': { flag:'🇩🇪', name:'ألمانيا',         nameEn:'Germany',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'GB': { flag:'🇬🇧', name:'المملكة المتحدة', nameEn:'United Kingdom',
    tools:['tip-calculator','currency-converter','loan-calculator','discount-calculator'] },
  'TR': { flag:'🇹🇷', name:'تركيا',           nameEn:'Turkey',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'FR': { flag:'🇫🇷', name:'فرنسا',           nameEn:'France',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'MX': { flag:'🇲🇽', name:'المكسيك',         nameEn:'Mexico',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'PH': { flag:'🇵🇭', name:'الفلبين',         nameEn:'Philippines',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'ET': { flag:'🇪🇹', name:'إثيوبيا',         nameEn:'Ethiopia',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'KR': { flag:'🇰🇷', name:'كوريا الجنوبية', nameEn:'South Korea',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'IT': { flag:'🇮🇹', name:'إيطاليا',         nameEn:'Italy',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'ES': { flag:'🇪🇸', name:'إسبانيا',         nameEn:'Spain',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
};

// Map browser language to country code
const LANG_COUNTRY = {
  // Arabic dialects → Arab countries
  'ar-om':'OM','ar-sa':'SA','ar-ae':'AE','ar-kw':'KW','ar-qa':'QA','ar-bh':'BH',
  'ar-jo':'JO','ar-ps':'PS','ar-sy':'SY','ar-eg':'EG','ar-iq':'IQ','ar-ye':'YE',
  'ar-ma':'MA','ar-dz':'DZ','ar-tn':'TN','ar-lb':'LB','ar-ly':'LY','ar-sd':'SD',
  'ar-so':'SO','ar-mr':'MR','ar-dj':'DJ','ar-km':'KM','ar':'SA',
  // Major world languages
  'zh':'CN','zh-cn':'CN','zh-hans':'CN','zh-hant':'CN','zh-tw':'CN',
  'hi':'IN','hi-in':'IN','en-in':'IN',
  'en-us':'US','en-ca':'US',
  'id':'ID','id-id':'ID',
  'pt-br':'BR','pt':'BR',
  'ru':'RU','ru-ru':'RU',
  'ja':'JP','ja-jp':'JP',
  'ha':'NG','en-ng':'NG',
  'ur':'PK','ur-pk':'PK',
  'bn':'BD','bn-bd':'BD',
  'de':'DE','de-de':'DE','de-at':'DE','de-ch':'DE',
  'en-gb':'GB','en-au':'GB','en-nz':'GB',
  'tr':'TR','tr-tr':'TR',
  'fr':'FR','fr-fr':'FR','fr-be':'FR','fr-ch':'FR','fr-ca':'FR',
  'es-mx':'MX','es':'ES','es-es':'ES','es-ar':'MX','es-co':'MX',
  'fil':'PH','tl':'PH','en-ph':'PH',
  'am':'ET',
  'ko':'KR','ko-kr':'KR',
  'it':'IT','it-it':'IT',
};

function detectCountryFromLang() {
  const lang = (navigator.language || navigator.languages && navigator.languages[0] || '').toLowerCase();
  return LANG_COUNTRY[lang] || null;
}

function renderCountrySection(countryCode) {
  const cd = COUNTRY_DATA[countryCode];
  if (!cd || !document.getElementById('toolsGrid')) return;
  const existing = document.getElementById('countrySection');
  if (existing) existing.remove();

  const lang = document.documentElement.lang || localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.en;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';

  const section = document.createElement('div');
  section.id = 'countrySection';
  section.style.cssText = 'margin-bottom:28px;';

  const heading = document.createElement('div');
  heading.style.cssText = 'font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;';
  const countryName = lang === 'ar' ? cd.name : cd.nameEn;
  heading.textContent = '📍 ' + (t.country_recommended || 'Recommended for') + ' ' + countryName;

  const grid = document.createElement('div');
  grid.className = 'tools-grid';
  grid.id = 'countryGrid';

  cd.tools.forEach(function(id) {
    const card = buildMiniCard(id, t, base);
    if (card) grid.appendChild(card);
  });

  section.append(heading, grid);

  // Insert before favSection (or before toolsGrid if no favSection)
  const favSection = document.getElementById('favSection');
  const toolsGrid = document.getElementById('toolsGrid');
  const parent = toolsGrid.parentNode;
  const ref = favSection || toolsGrid;
  parent.insertBefore(section, ref);
  injectStarBtns();

  // Hide Oman tab + Oman tool cards for non-Oman users
  const omanTab = document.querySelector('.cat-tab[data-cat="oman"]');
  if (omanTab) omanTab.style.display = countryCode === 'OM' ? '' : 'none';
  window._hideOmanTools = (countryCode !== 'OM');
  if (typeof filterTools === 'function') filterTools();
}

async function initCountryDetect() {
  if (!document.getElementById('toolsGrid')) return;
  // URL override for testing — ?country=jo (not saved to sessionStorage)
  const _urlCode = (new URLSearchParams(location.search).get('country') || '').toUpperCase();
  if (_urlCode && COUNTRY_DATA[_urlCode]) { renderCountrySection(_urlCode); return; }
  // Country-specific pages override country from URL path (/om/ → OM, /ae/ → AE …)
  var _urlCountryMap = {om:'OM',ae:'AE',sa:'SA',us:'US',uk:'GB',jo:'JO',in:'IN',pk:'PK',bd:'BD',eg:'EG',ph:'PH'};
  var _pathParts = location.pathname.split('/').filter(function(s){return s.length>0;});
  for (var _pi = 0; _pi < _pathParts.length; _pi++) {
    var _mapped = _urlCountryMap[_pathParts[_pi]];
    if (_mapped && COUNTRY_DATA[_mapped]) {
      sessionStorage.setItem('adawati_country', _mapped);
      renderCountrySection(_mapped);
      return;
    }
  }
  // Use sessionStorage so country detection is fresh each browser session
  let code = sessionStorage.getItem('adawati_country');
  if (!code) {
    code = detectCountryFromLang();
    if (!code) {
      // Try free IP API as fallback (no key needed)
      try {
        const r = await fetch('https://api.country.is/');
        const d = await r.json();
        code = d.country || null;
      } catch(e) {}
    }
    if (code) sessionStorage.setItem('adawati_country', code);
  }
  if (code && COUNTRY_DATA[code]) renderCountrySection(code);
}

/* ── Track recent on tool pages ── */
function autoTrackRecent() {
  const page = _getPageSlug();
  if (TOOL_META[page] && page !== 'index') trackRecent(page);
}

/* ── Country-aware "home" link: respects the country hub the user is actually in ── */
function getHomeHref() {
  var base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  try {
    var country = sessionStorage.getItem('adawati_country');
    var countryHubMap = {OM:'om/', SA:'sa/', JO:'jo/', AE:'ae/', US:'us/', GB:'uk/'};
    if (country && countryHubMap[country]) return base + '/' + countryHubMap[country];
  } catch(e) {}
  return base + '/index.html';
}

/* ── Fix the static "← Back to Home" link on tool pages to respect country context ── */
function fixBackLink() {
  var link = document.querySelector('.page-header a[data-i18n="back"]');
  if (link) link.setAttribute('href', getHomeHref());
}

/* ── Universal "Return to Home" floating prompt ── */
var _homePromptShown = false;
var _homePromptTimer = null;

function showHomePrompt() {
  if (_homePromptShown) return;
  // Don't show on the homepage itself
  var page = _getPageSlug();
  if (!TOOL_META[page]) return;
  _homePromptShown = true;
  if (_homePromptTimer) { clearTimeout(_homePromptTimer); _homePromptTimer = null; }

  var lang = localStorage.getItem('lang') || 'en';
  var msgs = {
    ar: '🏠 العودة للصفحة الرئيسية',
    en: '🏠 Back to Home',
    fr: '🏠 Retour à l\'accueil',
    es: '🏠 Volver al inicio',
    de: '🏠 Zur Startseite',
    ru: '🏠 На главную'
  };
  var msg = msgs[lang] || msgs.en;
  var homeHref = getHomeHref();

  // Inject CSS once
  if (!document.getElementById('hp-style')) {
    var s = document.createElement('style');
    s.id = 'hp-style';
    s.textContent = [
      '.hp-prompt{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);',
      'background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;border-radius:99px;',
      'padding:12px 20px 12px 16px;display:flex;align-items:center;gap:10px;',
      'box-shadow:0 4px 24px rgba(37,99,235,0.35);z-index:9999;font-weight:700;',
      'font-size:14px;white-space:nowrap;font-family:inherit;',
      'animation:hp-up 0.35s cubic-bezier(.4,0,.2,1);}',
      '@keyframes hp-up{from{transform:translateX(-50%) translateY(80px);opacity:0}',
      'to{transform:translateX(-50%) translateY(0);opacity:1}}',
      '.hp-prompt a{color:#fff;text-decoration:none;flex:1;}',
      '.hp-dismiss{background:rgba(255,255,255,0.2);border:none;color:#fff;',
      'border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:13px;',
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;',
      'font-family:inherit;line-height:1;}'
    ].join('');
    document.head.appendChild(s);
  }

  var prompt = document.createElement('div');
  prompt.className = 'hp-prompt';
  prompt.innerHTML = '<a href="' + homeHref + '">' + msg + '</a>' +
    '<button class="hp-dismiss" onclick="this.parentNode.remove()" title="Dismiss">✕</button>';
  document.body.appendChild(prompt);

  // Auto-dismiss after 10 seconds
  setTimeout(function() { if (prompt.parentNode) prompt.remove(); }, 10000);
}

function initHomePrompt() {
  var page = _getPageSlug();
  if (!TOOL_META[page]) return;
  // Show after 15 seconds of being on a tool page
  _homePromptTimer = setTimeout(showHomePrompt, 15000);
}

/* ── Favorite-star button on individual tool pages ──
   injectStarBtns() only adds stars to cards on a hub page's #toolsGrid —
   there was previously no way to favorite a tool while actually looking at
   it, which meant most visitors would never populate their favorites list
   at all (user-reported: opening a tool page showed no way to add it, and
   the bottom-nav Favorites link therefore always led to an empty, hidden
   section). Reuses the exact same isFav()/toggleFav() and .fav-star class
   the hub-grid stars use, so both stay in sync automatically. */
function injectPageFavStar() {
  var page = _getPageSlug();
  if (!TOOL_META[page]) return;
  var header = document.querySelector('.page-header');
  if (!header || header.querySelector('.fav-star')) return;
  var lang = localStorage.getItem('lang') || 'en';
  var t = T[lang] || T.en;
  var star = document.createElement('button');
  star.className = 'fav-star' + (isFav(page) ? ' fav-active' : '');
  star.setAttribute('data-id', page);
  star.title = isFav(page) ? (t.remove_fav || 'Remove from Favorites') : (t.add_fav || 'Add to Favorites');
  star.innerHTML = '<span class="fav-star-icon">' + (isFav(page) ? '⭐' : '☆') + '</span>';
  star.onclick = function() {
    toggleFav(page);
    var lang2 = localStorage.getItem('lang') || 'en';
    var t2 = T[lang2] || T.en;
    star.title = isFav(page) ? (t2.remove_fav || 'Remove from Favorites') : (t2.add_fav || 'Add to Favorites');
  };
  header.appendChild(star);
}

/* ── Bottom Navigation (mobile app shell) ── */
function initBottomNav() {
  var home = getHomeHref();
  var nav = document.getElementById('bottomNav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.id = 'bottomNav';
    nav.className = 'bottom-nav';
    // Label spans use data-i18n so applyTranslations() (called on every
    // setLang(), not just on first load) keeps them in sync — a prior version
    // baked the text in once here, so switching language after page load left
    // this nav showing the auto-detected default language forever.
    nav.innerHTML =
      '<div class="bottom-nav-inner">' +
        '<a class="bottom-nav-item" href="' + home + '"><span class="bn-icon">🏠</span><span data-i18n="nav_home">Home</span></a>' +
        '<a class="bottom-nav-item" href="' + home + '#toolsGrid"><span class="bn-icon">🧰</span><span data-i18n="section_tools">Tools</span></a>' +
        '<a class="bottom-nav-item" href="' + home + '#favSection"><span class="bn-icon">⭐</span><span data-i18n="bottom_nav_favorites">Favorites</span></a>' +
      '</div>';
    document.body.appendChild(nav);
    document.body.classList.add('has-bottom-nav');
  } else {
    // Home href is country-dependent and can only be known after country
    // detection runs, which happens after this first fires — refresh it.
    var links = nav.querySelectorAll('a.bottom-nav-item');
    if (links[0]) links[0].setAttribute('href', home);
    if (links[1]) links[1].setAttribute('href', home + '#toolsGrid');
    if (links[2]) links[2].setAttribute('href', home + '#favSection');
  }
}

/* ── Offline banner ── */
function initOfflineBanner() {
  var lang = localStorage.getItem('lang') || 'en';
  var msg = lang === 'ar'
    ? '📡 أنت غير متصل بالإنترنت — بعض المزايا الحية قد لا تعمل، لكن الحاسبات الأساسية تعمل بدون نت.'
    : '📡 You\'re offline — live features may be unavailable, but core calculators still work without internet.';
  var banner = document.getElementById('offlineBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'offlineBanner';
    banner.className = 'offline-banner';
    document.body.insertBefore(banner, document.body.firstChild);
  }
  banner.textContent = msg;
  banner.style.display = navigator.onLine ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();
  setLang(detectDefaultLang());
  updateAuthBtn();
  injectDarkToggle();
  injectAuthBtn();
  restoreSessionIfAny();
  injectRelatedTools();
  initPWA();
  autoTrackRecent();
  initHomePrompt();
  injectPageFavStar();
  fixBackLink();
  initBottomNav();
  initOfflineBanner();
  if (document.getElementById('toolsGrid')) {
    renderFavSection();
    renderRecentSection();
    injectStarBtns();
    initCountryDetect();
  }
});

window.addEventListener('online', initOfflineBanner);
window.addEventListener('offline', initOfflineBanner);
