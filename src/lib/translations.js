/** @type {{ en: Record<string,string>, hi: Record<string,string> }} */
export const translations = {
  en: {
    // App
    appName: 'AgriFusion Hub',

    // Navbar
    home: 'Home',
    dashboard: 'Dashboard',
    admin: 'Admin Panel',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',

    // Landing
    heroTitle: 'Empowering Farmers with Smart AgriTech Credits',
    heroSubtitle:
      'Buy credits for CropLens, DizMatrix, SenseOrbit & Quallis — all in one place.',
    getStarted: 'Get Started',
    loginBtn: 'Login',
    solutionsHeading: 'Our 4 AgriTech Solutions',

    // Auth — Login
    farmerLogin: 'Farmer Login',
    adminLogin: 'Admin Login',
    phoneNumber: 'Phone Number',
    password: 'Password',
    loginSubmit: 'Login',
    invalidCredentials: 'Invalid phone number or password',
    noAccount: "Don't have an account?",
    registerHere: 'Register here',

    // Auth — Register
    createAccount: 'Create Your Account',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    registerBtn: 'Register',
    registrationSuccess:
      'Registration successful! Please wait for admin verification.',
    redirectingToLogin: 'Redirecting to login…',
    passwordMismatch: 'Passwords do not match.',
    phoneExists: 'This phone number is already registered.',

    // Dashboard
    welcomeBack: 'Welcome back',
    yourCredits: 'Your Current Credits',
    pendingVerification:
      'Your account is pending admin verification. You will be able to create carts once verified.',
    noDif: 'No DIF assigned yet.',
    difCode: 'DIF Code',
    createCart: 'Create New Cart',
    yourCarts: 'Your Cart Requests',
    cartStatus: 'Status',
    cartDate: 'Date',
    cartTotal: 'Total Cost',
    noCartsYet: 'No carts created yet.',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    clickToVisit: 'Click to open app',

    // Create Cart
    createCartTitle: 'Create Credit Purchase Cart',
    creditCost: 'Cost per credit',
    totalCost: 'Total Cost',
    submitCart: 'Submit Cart',
    cartSubmitted: 'Cart submitted successfully!',
    creditsLabel: 'credits',
    selectAtLeastOne: 'Please select at least 1 credit for any solution.',
    cancel: 'Cancel',

    // Admin — Dashboard
    adminDashboard: 'Admin Dashboard',
    totalFarmers: 'Total Farmers',
    pendingFarmers: 'Pending Verification',
    pendingCarts: 'Pending Carts',
    manageFarmers: 'Manage Farmers',
    manageCarts: 'Manage Carts',
    allVerified: 'All verified',
    noPendingCarts: 'No pending carts',

    // Admin — Farmers
    allFarmers: 'All Farmers',
    verifyFarmer: 'Verify & Assign DIF',
    difCodePlaceholder: '4-char DIF (e.g. AB27)',
    verify: 'Verify',
    verified: 'Verified',
    notVerified: 'Not Verified',
    enterDifFirst: 'Please enter a DIF code first.',
    noFarmersFound: 'No farmers found.',

    // Admin — Carts
    cartRequests: 'Cart Requests',
    farmerName: 'Farmer Name',
    farmerPhone: 'Phone',
    approve: 'Approve',
    reject: 'Reject',
    cartApproved: 'Cart approved and credits added ✅',
    cartRejected: 'Cart rejected.',
    noCartsFound: 'No carts found.',
    all: 'All',
    reviewed: 'Reviewed',
    back: '← Back',

    // General
    loading: 'Loading…',
    error: 'An error occurred. Please try again.',
    save: 'Save',
  },

  hi: {
    // App
    appName: 'एग्रीफ्यूजन हब',

    // Navbar
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    admin: 'एडमिन पैनल',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    register: 'रजिस्टर',

    // Landing
    heroTitle: 'स्मार्ट एग्रीटेक क्रेडिट से किसानों को सशक्त बनाना',
    heroSubtitle:
      'CropLens, DizMatrix, SenseOrbit और Quallis के लिए क्रेडिट खरीदें — एक ही जगह पर।',
    getStarted: 'शुरू करें',
    loginBtn: 'लॉगिन',
    solutionsHeading: 'हमारे 4 एग्रीटेक समाधान',

    // Auth — Login
    farmerLogin: 'किसान लॉगिन',
    adminLogin: 'एडमिन लॉगिन',
    phoneNumber: 'फ़ोन नंबर',
    password: 'पासवर्ड',
    loginSubmit: 'लॉगिन करें',
    invalidCredentials: 'गलत फ़ोन नंबर या पासवर्ड',
    noAccount: 'खाता नहीं है?',
    registerHere: 'यहाँ रजिस्टर करें',

    // Auth — Register
    createAccount: 'अपना खाता बनाएं',
    fullName: 'पूरा नाम',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    registerBtn: 'रजिस्टर करें',
    registrationSuccess:
      'रजिस्ट्रेशन सफल! कृपया एडमिन सत्यापन की प्रतीक्षा करें।',
    redirectingToLogin: 'लॉगिन पेज पर जा रहे हैं…',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते।',
    phoneExists: 'यह फ़ोन नंबर पहले से रजिस्टर है।',

    // Dashboard
    welcomeBack: 'वापस स्वागत है',
    yourCredits: 'आपके मौजूदा क्रेडिट',
    pendingVerification:
      'आपका खाता एडमिन सत्यापन के लिए लंबित है। सत्यापन के बाद आप कार्ट बना सकेंगे।',
    noDif: 'अभी तक DIF नहीं दिया गया।',
    difCode: 'DIF कोड',
    createCart: 'नया कार्ट बनाएं',
    yourCarts: 'आपके कार्ट अनुरोध',
    cartStatus: 'स्थिति',
    cartDate: 'तारीख',
    cartTotal: 'कुल लागत',
    noCartsYet: 'अभी तक कोई कार्ट नहीं बनाया।',
    pending: 'लंबित',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    clickToVisit: 'ऐप खोलें',

    // Create Cart
    createCartTitle: 'क्रेडिट खरीद कार्ट बनाएं',
    creditCost: 'प्रति क्रेडिट लागत',
    totalCost: 'कुल लागत',
    submitCart: 'कार्ट जमा करें',
    cartSubmitted: 'कार्ट सफलतापूर्वक जमा किया गया!',
    creditsLabel: 'क्रेडिट',
    selectAtLeastOne: 'कृपया किसी समाधान के लिए कम से कम 1 क्रेडिट चुनें।',
    cancel: 'रद्द करें',

    // Admin — Dashboard
    adminDashboard: 'एडमिन डैशबोर्ड',
    totalFarmers: 'कुल किसान',
    pendingFarmers: 'सत्यापन लंबित',
    pendingCarts: 'लंबित कार्ट',
    manageFarmers: 'किसान प्रबंधन',
    manageCarts: 'कार्ट प्रबंधन',
    allVerified: 'सभी सत्यापित',
    noPendingCarts: 'कोई लंबित कार्ट नहीं',

    // Admin — Farmers
    allFarmers: 'सभी किसान',
    verifyFarmer: 'सत्यापित करें और DIF दें',
    difCodePlaceholder: '4 अंकों का DIF (जैसे AB27)',
    verify: 'सत्यापित करें',
    verified: 'सत्यापित',
    notVerified: 'सत्यापित नहीं',
    enterDifFirst: 'कृपया पहले DIF कोड दर्ज करें।',
    noFarmersFound: 'कोई किसान नहीं मिला।',

    // Admin — Carts
    cartRequests: 'कार्ट अनुरोध',
    farmerName: 'किसान का नाम',
    farmerPhone: 'फ़ोन',
    approve: 'स्वीकार करें',
    reject: 'अस्वीकार करें',
    cartApproved: 'कार्ट स्वीकृत और क्रेडिट जोड़े गए ✅',
    cartRejected: 'कार्ट अस्वीकृत किया गया।',
    noCartsFound: 'कोई कार्ट नहीं मिला।',
    all: 'सभी',
    reviewed: 'समीक्षित',
    back: '← वापस',

    // General
    loading: 'लोड हो रहा है…',
    error: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    save: 'सेव करें',
  },
};
