import { BlogPost, PlatformPartner } from '../types';
import { SDG_TAGS } from './mockData';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'BLOG-2026-001',
    titleAr: 'إعادة تأهيل محمية غابات الفرنلق: خطة مؤسسة التطوير البيئي لإعادة التشجير 2026',
    titleEn: 'Al-Fronlok Forest Reserve Rehabilitation: AlTatweer 2026 Afforestation Strategy',
    summaryAr: 'إطلاق المرحلة التنفيذية الأولى لغرس 50,000 غرسة شوح وسنديان سوري أصلية وإعادة تأهيل المدرجات المائية لحماية التنوع الحيوي.',
    summaryEn: 'Launching phase one of planting 50,000 endemic Cilician Fir and Syrian Oak saplings with contour water terracing.',
    category: 'research',
    authorAr: 'د. طارق الشامي',
    authorEn: 'Dr. Tarek Shami',
    authorRoleAr: 'رئيس فريق التنوع البيولوجي بـ AlTatweer',
    authorRoleEn: 'Head of Biodiversity at AlTatweer',
    date: '2026-07-28',
    readTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=80',
    sdgTags: [SDG_TAGS.SDG15, SDG_TAGS.SDG13],
    featured: true,
    relatedDatasetId: 'SY-ENV-2026-001',
    contentAr: [
      'تعتبر محمية غابات الفرنلق وشوح الفرنلق في محافظة اللاذقية واحدة من أهم الموئل الطبيعية للتنوع الحيوي في شرق المتوسط. وبفضل التمويل المباشر المخصص من مؤسسة التطوير البيئي بالتعاون مع الكوادر الميدانية الوطنية، بدأت فرق العمل تنفيذ خطة التكيف المناخي الشاملة.',
      'تتضمن الخطة في سنتها الأولى تركيب محطات رصد استشعارية دقيقة لدرجات الحرارة والرطوبة النسبية في طبقات الغابة، إلى جانب نشر فرق الرقابة لمنع الاحتطاب غير المشروع وتتبع تجدد الشجيرات التلقائي.',
      'تم اعتماد تقنيات الحصاد المائي الدقيق وإنشاء مصدات التراب لتقليل الانجراف المائي خلال مواسم الأمطار الغزيرة، مما يوفر بيئة مثالية لنمو الشتلات الفتية بنسبة نجاح متوقعة تتجاوز 92%.'
    ],
    contentEn: [
      'Al-Fronlok Fir and Oak Forest Reserve in Latakia Governorate stands as one of the most vital biodiversity strongholds in the Eastern Mediterranean. Backed by direct funding from AlTatweer Environment Foundation alongside national field teams, implementation of the comprehensive climate adaptation plan has officially begun.',
      'During its initial year, the strategy deploys high-precision microclimate sensor posts to observe canopy temperature and relative humidity, alongside patrolling teams enforcing illegal timber felling prevention and natural regeneration tracking.',
      'Micro-water harvesting techniques and contour earthen bunds have been introduced to mitigate soil washouts during heavy rain cycles, yielding an estimated survival rate exceeding 92% for young saplings.'
    ]
  },
  {
    id: 'BLOG-2026-002',
    titleAr: 'تقرير حوض الفرات: مراقبة التغيرات المناخية وجودة المياه في بحيرة الأسد',
    titleEn: 'Euphrates Basin Assessment: Climate Flux & Water Quality at Lake Assad',
    summaryAr: 'نتائج المسح الهيدرولوجي الميداني ونظام الاستشعار الفضائي لمراقبة منسوب مياه الفرات ونسب الملوحة وتدفق السدود.',
    summaryEn: 'Field hydrological survey findings and satellite sensing results cataloging Euphrates water levels, salinity ppt, and dam discharge.',
    category: 'news',
    authorAr: 'د. خالد الزعبي',
    authorEn: 'Dr. Khaled Al-Zoubi',
    authorRoleAr: 'خبير الموارد المائية - مرصد الفرات',
    authorRoleEn: 'Water Resources Expert - Euphrates Observatory',
    date: '2026-07-24',
    readTimeMinutes: 7,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    sdgTags: [SDG_TAGS.SDG6, SDG_TAGS.SDG14, SDG_TAGS.SDG11],
    featured: false,
    relatedDatasetId: 'SY-ENV-2026-005',
    contentAr: [
      'أظهرت نتائج المسح الاستشاري الأخير لحوض نهر الفرات بحيرة الأسد استقرار متوسط جودة مياه الشرب والري مع مؤشرات نمو إيجابية في الأراضي المروية المحيطة.',
      'تظهر بيانات الأقمار الصناعية الملتقطة عبر منصة TSNEIP تعافياً تدريجياً في المساحات الزراعية المروية في الرقة ودير الزور مع انخفاض ملحوظ في معدلات التلوث الكيميائي بفضل أنظمة الفلترة الطبيعية المستحدثة.'
    ],
    contentEn: [
      'Recent consulting survey outcomes for the Euphrates River basin and Lake Assad indicate stable drinking and irrigation water safety alongside encouraging agricultural recovery in surrounding farmlands.',
      'Satellite imaging retrieved via the TSNEIP spatial platform confirms a steady expansion of irrigated green cover across Raqqa and Deir ez-Zor, accompanied by reduced chemical runoffs due to new eco-filtration zones.'
    ]
  },
  {
    id: 'BLOG-2026-003',
    titleAr: 'تطور التنوع الحيوي في جبل عبد العزيز: توثيق شجيرات البطم الأطلسي والطيور المهاجرة',
    titleEn: 'Biodiversity Surge in Jabal Abdul Aziz: Cataloging Wild Pistacia & Migratory Birds',
    summaryAr: 'توثيق 140 نوعاً نباتياً جديداً وتسجيل عودة مسارات الهجرة الموسمية للنسور والطيور الجارحة في المحمية الشمالية الشرقية.',
    summaryEn: 'Cataloging 140 endemic flora species and recording the return of migratory raptor flight corridors across the northeastern reserve.',
    category: 'field',
    authorAr: 'مهندسة ريم الحلبي',
    authorEn: 'Eng. Reem Al-Halabi',
    authorRoleAr: 'باحثة بيئية ميدانية - الحسكة',
    authorRoleEn: 'Field Ecology Researcher - Hasakah',
    date: '2026-07-16',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    sdgTags: [SDG_TAGS.SDG15],
    featured: false,
    relatedDatasetId: 'SY-ENV-2026-004',
    contentAr: [
      'نجح فريق الباحثين الميدانيين بـ AlTatweer في رصد وتوثيق تجمعات شجيرات البطم الأطلسي المهددة بالانقراض في المرتفعات الشمالية لجبل عبد العزيز.',
      'كما رصدت الكاميرات الحرارية الميدانية حركة نسور العقبان والطيور المهاجرة الاستوائية، ما يدل على تعافي النظام البيئي الصحراوي الجبلي بشكل ملحوظ.'
    ],
    contentEn: [
      'AlTatweer field researchers successfully recorded resilient clusters of threatened wild Pistacia atlantica shrubs in the northern ridges of Jabal Abdul Aziz.',
      'Thermal field wildlife cameras also captured nesting activity of migratory golden eagles and raptors, signaling robust recovery across the desert mountain microclimate.'
    ]
  },
  {
    id: 'BLOG-2026-004',
    titleAr: 'إطلاق الشبكة الوطنية للاستشعار عن بعد وتوثيق الغطاء النباتي (NDVI)',
    titleEn: 'Launch of National Remote Sensing Network for NDVI Vegetation Density Mapping',
    summaryAr: 'دمج بيانات أقمار سنتينل وتصاوير الدرون الميدانية لتقديم خرائط حرارية ذات دقة مكانية عالية لكافة المحافظات السورية.',
    summaryEn: 'Integrating Sentinel satellite feeds with high-res UAV field imaging to offer spatial heatmaps across all Syrian governorates.',
    category: 'news',
    authorAr: 'مهندس فراس النجار',
    authorEn: 'Eng. Firas Al-Najjar',
    authorRoleAr: 'مدير نظم المعلومات الجغرافية - AlTatweer',
    authorRoleEn: 'GIS Manager - AlTatweer Environment Foundation',
    date: '2026-07-10',
    readTimeMinutes: 6,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    sdgTags: [SDG_TAGS.SDG13, SDG_TAGS.SDG15],
    featured: false,
    contentAr: [
      'أطلقت منصة TSNEIP رسمياً محرك التحليل الجغرافي الحيوي المباشر، الذي يحلل النطاق النباتي NDVI بدقة 10 أمتار لكل بكسل.',
      'تتيح هذه الأداة للباحثين والمخططين الزراعيين تحديد بؤر الجفاف المبكر والتنبؤ بإنتاجية المحاصيل في غوطة دمشق، سهل الغاب، وحوض Yarmouk.'
    ],
    contentEn: [
      'TSNEIP officially unveiled its real-time spatial bio-analysis engine capable of evaluating vegetation density (NDVI) at 10-meter spatial precision.',
      'This tool empowers environmental researchers and agricultural planners to pinpoint early drought stress and forecast crop yields in Damascus Ghouta, Al-Ghab plain, and the Yarmouk basin.'
    ]
  },
  {
    id: 'BLOG-2026-005',
    titleAr: 'شراكة استراتيجية بين مؤسسة التطوير البيئي وبرنامج الأمم المتحدة الإنمائي لحماية الأحواض المائية',
    titleEn: 'Strategic Partnership between AlTatweer Foundation & UNDP Syria for Watershed Protection',
    summaryAr: 'توقيع ميثاق تعاون مشترك لتأهيل 12 محطة رصد لمياه الينابيع والآبار الجوفية ودعم فرق الإحصاء الديموغرافي البيئي.',
    summaryEn: 'Signing a joint mandate to rehabilitate 12 springhead & aquifer monitoring posts while funding field demographic surveys.',
    category: 'partner',
    authorAr: 'فريق الإعلام البيئي',
    authorEn: 'Environmental Media Team',
    authorRoleAr: 'المكتب الإعلامي - AlTatweer',
    authorRoleEn: 'Media Office - AlTatweer Foundation',
    date: '2026-07-04',
    readTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    sdgTags: [SDG_TAGS.SDG6, SDG_TAGS.SDG11],
    featured: false,
    contentAr: [
      'وقعت مؤسسة التطوير البيئي (AlTatweer) اتفاقية شراكة استراتيجية مع برنامج الأمم المتحدة الإنمائي (UNDP Syria) لتعزيز المنظومة الوطنية لبيانات المياه والبيئة.',
      'تشمل الشراكة تقديم أجهزة قياس الملوحة والحموضة الرقمية، وتدريب 40 مهندساً ميدانياً سورياً على استمارات جمع البيانات الجغرافية المعيارية.'
    ],
    contentEn: [
      'AlTatweer Environment Foundation signed a landmark strategic partnership agreement with UNDP Syria to fortify the national environmental & water GIS infrastructure.',
      'The collaboration includes supplying digital pH/TDS testing kits and training 40 Syrian field engineers on standardized spatial survey protocols.'
    ]
  }
];

export const PLATFORM_PARTNERS: PlatformPartner[] = [
  {
    id: 'PARTNER-ALTATWEER',
    nameAr: 'مؤسسة التطوير البيئي (AlTatweer)',
    nameEn: 'AlTatweer Environment Foundation',
    typeAr: 'المؤسسة الوطنية الراعية',
    typeEn: 'Lead Founding Organization',
    logoUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=300&q=80',
    descriptionAr: 'المؤسسة الوطنية غير الحكومية الرائدة في مجالات حماية البيئة السورية وإدارة النظم الجغرافية وإعادة التأهيل الحرجي والمائي.',
    descriptionEn: 'The leading non-governmental foundation dedicated to Syrian ecological preservation, spatial GIS infrastructure, afforestation & water security.',
    roleAr: 'إدارة المنصة، التمويل الرئيسي، وإدارة الفرق الميدانية',
    roleEn: 'Platform Oversight, Core Funding & Field Operations Management',
    website: 'https://altatweer-environment.org.sy',
    datasetsCount: 42,
    establishedYear: 2018,
    badgeColor: '#009600'
  },
  {
    id: 'PARTNER-UNDP',
    nameAr: 'برنامج الأمم المتحدة الإنمائي (UNDP Syria)',
    nameEn: 'United Nations Development Programme - Syria',
    typeAr: 'منظمة دولية شريكة',
    typeEn: 'International UN Partner',
    logoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80',
    descriptionAr: 'برنامج حماية البيئة والموارد المائية وتنمية المجتمعات المحلية المستدامة وتوفير تقنيات الطاقة النظيفة.',
    descriptionEn: 'Environmental protection, watershed resilience, and sustainable community energy initiatives in Syria.',
    roleAr: 'دعم مراصد المياه، برامج الاستصلاح البيئي، والمساهمة في استدامة المجتمعات',
    roleEn: 'Water Station Funding, Watershed Restoration & Community Resilience',
    website: 'https://undp.org/syria',
    datasetsCount: 28,
    establishedYear: 1965,
    badgeColor: '#006BB2'
  },
  {
    id: 'PARTNER-FAO',
    nameAr: 'منظمة الأغذية والزراعة (FAO Syria)',
    nameEn: 'Food and Agriculture Organization - Syria',
    typeAr: 'وكالة متخصصة دولية',
    typeEn: 'UN Specialized Agency',
    logoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
    descriptionAr: 'دعم سلامة التربة الزراعية ومكافحة التصحر وتحسين كفاءة الري الريفي.',
    descriptionEn: 'Protecting agricultural soil health, combating land degradation, and enhancing rural irrigation efficiency.',
    roleAr: 'تقديم خرائط التربة، فحص خصوبة السهول، وأنظمة الري الذكي',
    roleEn: 'Soil Mapping Data, Plain Soil Fertility Testing & Drip Irrigation Models',
    website: 'https://fao.org/syria',
    datasetsCount: 19,
    establishedYear: 1945,
    badgeColor: '#57B039'
  },
  {
    id: 'PARTNER-MINAGRI',
    nameAr: 'وزارة الزراعة والإصلاح الزراعي السورية',
    nameEn: 'Syrian Ministry of Agriculture & Agrarian Reform',
    typeAr: 'جهة حكومية وطنية',
    typeEn: 'National Government Authority',
    logoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80',
    descriptionAr: 'مديرية الغابات والمحميات الطبيعية، والمسؤولة عن تطبيق قوانين حماية التنوع الحيوي.',
    descriptionEn: 'Directorate of Forests & Nature Reserves enforcing biodiversity conservation legislation.',
    roleAr: 'التحقق الرسمي من بيانات المحميات، التراخيص الميدانية، وتدقيق المسوحات',
    roleEn: 'Official Reserve Data Audit, Field Permits & National Census Verification',
    website: 'http://moaar.gov.sy',
    datasetsCount: 35,
    establishedYear: 1947,
    badgeColor: '#326B32'
  },
  {
    id: 'PARTNER-ICARDA',
    nameAr: 'المركز الدولي للبحوث الزراعية (ICARDA)',
    nameEn: 'International Center for Agricultural Research in the Dry Areas',
    typeAr: 'مركز بحوث دولي',
    typeEn: 'International Research Center',
    logoUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=300&q=80',
    descriptionAr: 'أبحاث المحاصيل المقاومة للجفاف، بنك البذور البلدية والأعشاب الطبية الجبلية.',
    descriptionEn: 'Research on drought-resilient seed varieties, endemic germplasm bank, and dryland ecology.',
    roleAr: 'تقديم البيانات السلالية للأشجار، والتحليل المختبري لصحة المحميات',
    roleEn: 'Flora Germplasm Data & Laboratory Soil Analysis Support',
    website: 'https://icarda.org',
    datasetsCount: 15,
    establishedYear: 1977,
    badgeColor: '#D97706'
  },
  {
    id: 'PARTNER-SES',
    nameAr: 'الجمعية السورية لحماية البيئة (SES)',
    nameEn: 'Syrian Environmental Society',
    typeAr: 'جمعية أهلية تطوعية',
    typeEn: 'National Environmental NGO',
    logoUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=300&q=80',
    descriptionAr: 'شبكة المتطوعين البيئيين والمستكشفين الميدانيين لتصحيح قراءات الأحواض وحملات التوعية.',
    descriptionEn: 'Field volunteer network for species observations, plastic cleanup campaigns, and public awareness.',
    roleAr: 'المسح الميداني التطوعي وتوثيق التهديدات البيئية المباشرة',
    roleEn: 'Volunteer Field Expeditions & Direct Incident Reporting',
    website: 'https://ses-syria.org',
    datasetsCount: 22,
    establishedYear: 1998,
    badgeColor: '#0284C7'
  }
];
