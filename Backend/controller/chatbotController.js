import Product from "../model/productModel.js";
import User from "../model/userModel.js";
import Order from "../model/orderModel.js";

const CANCELLABLE_STATUSES = ["Order Placed", "Packing"];
const SUPPORT_CONTACTS = {
  whatsapp: "+92 341-6788430",
  email: "contact@mycart.com",
};
const PAYMENT_METHODS = [
  {
    name: "Cash on Delivery (COD)",
    description: "Pay when your order is delivered.",
  },
  {
    name: "Stripe Card Payment",
    description: "Pay online securely with a card.",
  },
];

const CATEGORY_ALIASES = {
  men: ["men", "man", "male", "gents", "boys", "boy"],
  women: ["women", "woman", "female", "ladies", "girls", "girl"],
  kids: ["kids", "kid", "children", "child", "baby", "babies"],
};

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeCategoryValue = (value = "") => {
  const normalized = normalizeText(value);
  return normalized
    .replace(/\b(men s|women s|kid s|kids s)\b/g, (m) => m.replace(/\s+s$/, ""))
    .trim();
};

const hasWholeWord = (text = "", word = "") => {
  if (!text || !word) return false;
  try {
    return new RegExp(
      `\\b${word.replace(/[.*+?^${}()|[\]\\\\]/g, "\\$&")}\\b`,
      "i",
    ).test(text);
  } catch (e) {
    return text.includes(word);
  }
};

const getCategoryHintFromMessage = (message = "") => {
  const lower = normalizeText(message);

  // Prefer longer aliases first to avoid substring collisions (e.g. 'men' in 'women')
  const entries = Object.entries(CATEGORY_ALIASES).map(
    ([canonical, aliases]) => ({
      canonical,
      aliases: [...aliases].sort((a, b) => b.length - a.length),
    }),
  );

  for (const { canonical, aliases } of entries) {
    for (const alias of aliases) {
      try {
        const re = new RegExp(
          `\\b${alias.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`,
          "i",
        );
        if (re.test(lower)) return canonical;
      } catch (e) {
        // fallback to simple includes if regex fails for some reason
        if (lower.includes(alias)) return canonical;
      }
    }
  }

  return null;
};

const resolveCategoryFromHint = (categoryHint, knownCategories = []) => {
  if (!categoryHint) return undefined;

  const aliases = (CATEGORY_ALIASES[categoryHint] || [categoryHint])
    .slice()
    .sort((a, b) => b.length - a.length);

  const matched = knownCategories.find((category) => {
    const normalizedCategory = normalizeCategoryValue(category);
    for (const alias of aliases) {
      try {
        const re = new RegExp(
          `\\b${alias.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`,
          "i",
        );
        if (re.test(normalizedCategory)) return true;
      } catch (e) {
        if (normalizedCategory.includes(alias)) return true;
      }
    }
    return false;
  });

  return matched || undefined;
};

const detectLanguage = (text = "") => {
  const value = String(text || "");
  if (/[\u0600-\u06FF]/.test(value)) return "ur";
  return "en";
};

const getPreferredLang = (req, incomingText = "") => {
  const bodyLang = req?.body?.lang;
  if (
    String(bodyLang || "")
      .toLowerCase()
      .startsWith("ur")
  )
    return "ur";
  if (
    String(bodyLang || "")
      .toLowerCase()
      .startsWith("en")
  )
    return "en";

  const queryLang = req?.query?.lang;
  if (
    String(queryLang || "")
      .toLowerCase()
      .startsWith("ur")
  )
    return "ur";
  if (
    String(queryLang || "")
      .toLowerCase()
      .startsWith("en")
  )
    return "en";

  return detectLanguage(incomingText);
};

const chooseLangResponse = (
  incomingText = "",
  messages = { en: "", ur: "" },
  preferredLang,
) => {
  const lang = preferredLang || detectLanguage(incomingText);
  return lang === "ur"
    ? messages.ur || messages.en
    : messages.en || messages.ur;
};

const formatProduct = (product) => ({
  id: product._id,
  name: product.name,
  description: product.description,
  category: product.category,
  subcategory: product.subcategory,
  price: product.price,
  sizes: product.sizes || [],
  bestseller: Boolean(product.bestseller),
  ratingAverage: Number(product.ratingAverage || 0),
  ratingCount: Number(product.ratingCount || 0),
  images: [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean),
});

const isTopRatedIntent = (message = "") => {
  const lower = normalizeText(message);
  return /\b(top\s*rated|top\s*rating|highest\s*rated|highest\s*rating|best\s*rated|best\s*rating|most\s*rated|most\s*rating)\b/i.test(
    lower,
  );
};

const isSizeIntent = (message = "") => {
  const lower = normalizeText(message);
  return /\b(size|sizes|available sizes|available size)\b/i.test(lower);
};

const extractTopRatedSearchTerm = (message = "") => {
  const lower = normalizeText(message);

  const stripped = lower
    .replace(/\b(top rated|highest rated|best rated|most rated)\b/gi, " ")
    .replace(
      /\b(show|me|find|search|get|give|please|the|a|an|for|of|product|products|item|items|top|rated|rating|best|highest|most)\b/gi,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();

  return stripped || "";
};

const buildTopRatedProductQuery = (searchTerm = "", filters = {}) => {
  const query = buildProductQuery(filters);
  const normalizedSearchTerm = normalizeText(searchTerm);

  if (normalizedSearchTerm) {
    const esc = String(normalizedSearchTerm).replace(
      /[.*+?^${}()|[\\]\\\\]/g,
      "\\$&",
    );
    const termRegex = new RegExp(esc, "i");

    query.$or = [
      { name: termRegex },
      { category: termRegex },
      { subcategory: termRegex },
      { description: termRegex },
    ];
  }

  return query;
};

const buildAvailableSizes = (sizes = []) => {
  const normalizedSizes = sizes
    .map((size) => String(size || "").trim())
    .filter(Boolean);

  return [...new Set(normalizedSizes)].sort((a, b) => a.localeCompare(b));
};

const extractPriceFilters = (message = "") => {
  const lower = String(message).toLowerCase();
  const maxPatterns = [
    /(?:under|below|less than|upto|up to|<=|se kam)\s*(?:rs\.?|pkr)?\s*(\d+)/i,
    /(?:max|maximum)\s*(?:price|budget)?\s*(?:is|=)?\s*(?:rs\.?|pkr)?\s*(\d+)/i,
  ];
  const minPatterns = [
    /(?:above|over|more than|greater than|>=|kam az kam|at least)\s*(?:rs\.?|pkr)?\s*(\d+)/i,
    /(?:min|minimum)\s*(?:price|budget)?\s*(?:is|=)?\s*(?:rs\.?|pkr)?\s*(\d+)/i,
  ];

  let minPrice;
  let maxPrice;

  for (const pattern of maxPatterns) {
    const match = lower.match(pattern);
    if (match?.[1]) {
      maxPrice = Number(match[1]);
      break;
    }
  }

  for (const pattern of minPatterns) {
    const match = lower.match(pattern);
    if (match?.[1]) {
      minPrice = Number(match[1]);
      break;
    }
  }

  return { minPrice, maxPrice };
};

const extractProductFilters = (
  message = "",
  knownCategories = [],
  knownSubcategories = [],
) => {
  const lower = normalizeText(message);
  const { minPrice, maxPrice } = extractPriceFilters(message);

  let category = knownCategories.find((cat) => {
    const normalizedCategory = normalizeCategoryValue(cat);
    return normalizedCategory && hasWholeWord(lower, normalizedCategory);
  });

  if (!category) {
    const categoryHint = getCategoryHintFromMessage(message);
    category = resolveCategoryFromHint(categoryHint, knownCategories);
  }

  const subcategory = knownSubcategories.find((sub) =>
    lower.includes(normalizeText(sub)),
  );

  const onlyBestseller =
    /\b(best\s*seller|bestseller|top\s*seller|top\s*selling|popular)\b/i.test(
      lower,
    );

  const sort =
    lower.includes("cheapest") || lower.includes("low to high")
      ? { price: 1 }
      : lower.includes("expensive") || lower.includes("high to low")
        ? { price: -1 }
        : { createdAt: -1 };

  return {
    category,
    subcategory,
    minPrice,
    maxPrice,
    onlyBestseller,
    sort,
  };
};

const buildProductQuery = (filters = {}) => {
  const query = {};

  if (filters.category) {
    // Match whole words to avoid substring matches (e.g. 'men' matching 'women')
    const esc = String(filters.category).replace(
      /[.*+?^${}()|[\\]\\\\]/g,
      "\\$&",
    );
    query.category = { $regex: new RegExp(`\\b${esc}\\b`, "i") };
  }

  if (filters.subcategory) {
    const escSub = String(filters.subcategory).replace(
      /[.*+?^${}()|[\\]\\\\]/g,
      "\\$&",
    );
    query.subcategory = { $regex: new RegExp(`\\b${escSub}\\b`, "i") };
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }

  if (filters.onlyBestseller) {
    query.bestseller = true;
  }

  return query;
};

const isProductIntent = (message = "", filters = {}) => {
  const lower = normalizeText(message);
  const keywords = [
    "product",
    "products",
    "show",
    "find",
    "search",
    "bestseller",
    "price",
    "cheap",
    "expensive",
    "category",
    "item",
    "size",
    "sizes",
    "rated",
    "rating",
  ];

  const hasKeyword = keywords.some((keyword) => lower.includes(keyword));
  const hasFilter = Boolean(
    filters.category ||
    filters.subcategory ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.onlyBestseller,
  );
  return hasKeyword || hasFilter || isTopRatedIntent(message);
};

const isOrderIntent = (message = "") => {
  const lower = normalizeText(message);
  return (
    lower.includes("order") ||
    lower.includes("track") ||
    lower.includes("status") ||
    lower.includes("delivery")
  );
};

const isCartIntent = (message = "") => {
  const lower = normalizeText(message);
  return (
    lower.includes("cart") || lower.includes("bag") || lower.includes("basket")
  );
};

const isPolicyIntent = (message = "") => {
  const lower = normalizeText(message);
  return (
    lower.includes("refund") ||
    lower.includes("return") ||
    lower.includes("cancel") ||
    lower.includes("payment") ||
    lower.includes("shipping")
  );
};

const isPaymentIntent = (message = "") => {
  const lower = normalizeText(message);
  return (
    lower.includes("payment method") ||
    lower.includes("payment methods") ||
    lower.includes("payment option") ||
    lower.includes("payment options") ||
    lower.includes("pay by") ||
    lower.includes("how can i pay") ||
    lower.includes("which payment") ||
    lower.includes("available payment") ||
    lower.includes("cash on delivery") ||
    lower.includes("cod") ||
    lower.includes("stripe")
  );
};

const callGemini = async (prompt, apiKey) => {
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.55,
          maxOutputTokens: 700,
        },
      }),
    },
  );

  return geminiResponse.json();
};

const getUserContext = async (userId) => {
  const user = await User.findById(userId).select("name email cartData");
  if (!user) return null;

  const orders = await Order.find({
    userId,
    deletedByUser: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("status amount date items PaymentMethod payment trackingNumber");

  return {
    name: user.name,
    email: user.email,
    cartData: user.cartData || {},
    latestOrders: orders.map((order) => ({
      id: order._id,
      status: order.status,
      amount: order.amount,
      date: order.date,
      paymentMethod: order.PaymentMethod,
      payment: order.payment,
      trackingNumber: order.trackingNumber,
      itemsCount: Array.isArray(order.items) ? order.items.length : 0,
      cancellable: CANCELLABLE_STATUSES.includes(order.status),
    })),
  };
};

const getCartSummary = async (userId) => {
  const user = await User.findById(userId).select("cartData");
  if (!user?.cartData) {
    return { itemsCount: 0, totalQuantity: 0, totalAmount: 0, lines: [] };
  }

  const productIds = Object.keys(user.cartData || {});
  if (!productIds.length) {
    return { itemsCount: 0, totalQuantity: 0, totalAmount: 0, lines: [] };
  }

  const products = await Product.find({ _id: { $in: productIds } }).select(
    "name price",
  );
  const productMap = new Map(
    products.map((product) => [String(product._id), product]),
  );

  const lines = [];
  let totalQuantity = 0;
  let totalAmount = 0;

  for (const productId of productIds) {
    const product = productMap.get(String(productId));
    if (!product) continue;

    const sizeMap = user.cartData[productId] || {};
    for (const [size, quantityRaw] of Object.entries(sizeMap)) {
      const quantity = Number(quantityRaw) || 0;
      if (quantity <= 0) continue;

      const lineTotal = quantity * Number(product.price || 0);
      lines.push({
        productId,
        name: product.name,
        size,
        quantity,
        unitPrice: product.price,
        lineTotal,
      });

      totalQuantity += quantity;
      totalAmount += lineTotal;
    }
  }

  return {
    itemsCount: lines.length,
    totalQuantity,
    totalAmount,
    lines: lines.slice(0, 10),
  };
};

const getLocalHelpResponse = (message = "") => {
  const lower = normalizeText(message);

  if (
    lower.includes("payment method") ||
    lower.includes("payment methods") ||
    lower.includes("payment option") ||
    lower.includes("payment options") ||
    lower.includes("how can i pay") ||
    lower.includes("which payment")
  ) {
    return {
      en: `You can pay using these methods: ${PAYMENT_METHODS.map((item) => item.name).join(", ")}. ${PAYMENT_METHODS.map((item) => `${item.name}: ${item.description}`).join(" ")}`,
      ur: `Aap in payment methods se pay kar sakte hain: ${PAYMENT_METHODS.map((item) => item.name).join(", ")}. ${PAYMENT_METHODS.map((item) => `${item.name}: ${item.description}`).join(" ")}`,
    };
  }

  if (lower.includes("refund") || lower.includes("return")) {
    return {
      en: `For refunds/returns, please contact our support team on WhatsApp ${SUPPORT_CONTACTS.whatsapp} or email ${SUPPORT_CONTACTS.email}. Share your order ID, product name, reason for return, and clear photos if the item is damaged or incorrect. Usually, the team verifies the request first and then guides you through pickup, replacement, or refund processing. If the order is still not shipped, I can also help check whether it can be cancelled.`,
      ur: `Refund/return ke liye please WhatsApp ${SUPPORT_CONTACTS.whatsapp} ya email ${SUPPORT_CONTACTS.email} par support team se rabta karein. Apni order ID, product name, return ka reason, aur agar item damaged ya wrong ho to clear photos share karein. Aksar team pehle request verify karti hai aur phir pickup, replacement, ya refund process guide karti hai. Agar order abhi ship nahi hua, to main check kar sakta hoon ke cancel ho sakta hai ya nahi.`,
    };
  }

  if (
    lower.includes("delivery") ||
    lower.includes("shipping") ||
    lower.includes("track")
  ) {
    return {
      en: "I can help with delivery and order tracking. Ask: 'track my latest order' or 'show my order status'.",
      ur: "Main delivery aur order tracking mein help kar sakta hoon. Poochain: 'track my latest order' ya 'show my order status'.",
    };
  }

  if (lower.includes("cart")) {
    return {
      en: "I can summarize your cart and suggest best products based on your budget or category.",
      ur: "Main aapka cart summarize kar sakta hoon aur budget/category ke hisaab se products suggest kar sakta hoon.",
    };
  }

  return {
    en: "I can help with product search, cart summary, order status, cancellation guidance, and shopping suggestions.",
    ur: "Main product search, cart summary, order status, cancellation guidance, aur shopping suggestions mein help kar sakta hoon.",
  };
};

export const processMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: chooseLangResponse(
          message,
          {
            en: "Message cannot be empty",
            ur: "Message khali nahi ho sakta",
          },
          getPreferredLang(req, message),
        ),
      });
    }

    const preferredLang = getPreferredLang(req, message);

    const [knownCategories, knownSubcategories, userContext] =
      await Promise.all([
        Product.distinct("category"),
        Product.distinct("subcategory"),
        getUserContext(req.userId),
      ]);

    const filters = extractProductFilters(
      message,
      knownCategories,
      knownSubcategories,
    );
    const categoryHint = getCategoryHintFromMessage(message);
    const shouldSearchProducts = isProductIntent(message, filters);
    const shouldSearchTopRatedProducts = isTopRatedIntent(message);
    const shouldAskAboutSizes = isSizeIntent(message);
    const shouldFetchOrders = isOrderIntent(message);
    const shouldFetchCart = isCartIntent(message);
    const shouldGivePolicyHelp = isPolicyIntent(message);
    const shouldAskAboutPaymentMethods = isPaymentIntent(message);

    const productQuery = buildProductQuery(filters);
    const topRatedSearchTerm = shouldSearchTopRatedProducts
      ? extractTopRatedSearchTerm(message)
      : "";
    const productSearchQuery = shouldSearchTopRatedProducts
      ? buildTopRatedProductQuery(topRatedSearchTerm, filters)
      : productQuery;
    const productSort = shouldSearchTopRatedProducts
      ? { ratingAverage: -1, ratingCount: -1, createdAt: -1 }
      : filters.sort;

    const shouldBlockBroadQuery = Boolean(categoryHint) && !filters.category;

    let matchedProducts = [];

    if (shouldSearchProducts) {
      if (shouldBlockBroadQuery) {
        matchedProducts = [];
      } else {
        matchedProducts = await Product.find(productSearchQuery)
          .sort(productSort)
          .limit(12);

        if (shouldSearchTopRatedProducts && matchedProducts.length === 0) {
          matchedProducts = await Product.find(productQuery)
            .sort(productSort)
            .limit(12);
        }
      }
    }

    const [latestOrder, cartSummary] = await Promise.all([
      shouldFetchOrders
        ? Order.findOne({ userId: req.userId, deletedByUser: { $ne: true } })
            .sort({ createdAt: -1 })
            .select("status amount date trackingNumber PaymentMethod payment")
        : Promise.resolve(null),
      shouldFetchCart ? getCartSummary(req.userId) : Promise.resolve(null),
    ]);

    const products = matchedProducts.map(formatProduct);
    const allMatchingSizes = shouldSearchProducts
      ? buildAvailableSizes(await Product.distinct("sizes", productSearchQuery))
      : [];
    const topRatedProducts = products.slice(0, 4);
    const topRatedProduct = topRatedProducts[0] || null;
    const topRatedNames = topRatedProducts
      .map(
        (item) =>
          `${item.name} (${Number(item.ratingAverage || 0).toFixed(1)}/5)`,
      )
      .join(", ");
    const topRatedResponse = chooseLangResponse(
      message,
      {
        en: topRatedProduct
          ? `I checked the database and found these top rated products: ${topRatedNames}.`
          : "I couldn't find an exact match, so I checked the database and fetched the top rated products available.",
        ur: topRatedProduct
          ? `Maine database check kiya aur yeh top rated products mile: ${topRatedNames}.`
          : "Mujhe exact match nahi mila, is liye maine database se available top rated products fetch kar liye hain.",
      },
      preferredLang,
    );
    const sizeResponse = chooseLangResponse(
      message,
      {
        en: allMatchingSizes.length
          ? `I checked the database and the matching products are available in these sizes: ${allMatchingSizes.join(", ")}.`
          : "I checked the database but couldn't find matching product sizes for your request. Try sharing the product name or category, and I’ll look it up again.",
        ur: allMatchingSizes.length
          ? `Maine database check kiya aur matching products in sizes available hain: ${allMatchingSizes.join(", ")}.`
          : "Maine database check kiya lekin aapki request ke mutabiq matching product sizes nahi mile. Product ka naam ya category share karein, main dobara check kar leta hoon.",
      },
      preferredLang,
    );
    const paymentMethodsResponse = chooseLangResponse(
      message,
      {
        en: `Available payment methods are: ${PAYMENT_METHODS.map((item) => item.name).join(", ")}. ${PAYMENT_METHODS.map((item) => `${item.name}: ${item.description}`).join(" ")}`,
        ur: `Available payment methods ye hain: ${PAYMENT_METHODS.map((item) => item.name).join(", ")}. ${PAYMENT_METHODS.map((item) => `${item.name}: ${item.description}`).join(" ")}`,
      },
      preferredLang,
    );

    if (!GEMINI_API_KEY) {
      const localMessage = getLocalHelpResponse(message);
      const responseMessage = shouldAskAboutSizes
        ? sizeResponse
        : shouldAskAboutPaymentMethods
          ? paymentMethodsResponse
          : shouldSearchTopRatedProducts
            ? topRatedResponse
            : chooseLangResponse(message, localMessage, preferredLang);

      return res.status(200).json({
        success: true,
        message: responseMessage,
        products,
        count: products.length,
        appliedFilters: filters,
        latestOrder,
        cartSummary,
      });
    }

    const systemPrompt = `You are MyCart AI assistant for an ecommerce website.
Rules:
1) Be concise, friendly, and practical.
2) Always prioritize DATABASE CONTEXT facts.
3) If user asks products, suggest relevant items with prices.
4) If user asks order/tracking, use order context and mention cancellation only for statuses: Order Placed/Packing.
  5) If user asks cart, summarize quantity and amount from context.
  6) If user asks refund/return policy, guide them to contact support on WhatsApp ${SUPPORT_CONTACTS.whatsapp} or email ${SUPPORT_CONTACTS.email}, and explain the usual refund workflow: share order ID, item details, reason, and photos if needed.
  7) If no exact product found, suggest closest alternatives (budget/category based).
  8) Respond only in ${preferredLang === "ur" ? "Urdu" : "English"}.`;

    const promptContext = {
      message,
      appliedFilters: filters,
      productsCount: products.length,
      products: products.slice(0, 8).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        price: item.price,
        sizes: item.sizes,
        bestseller: item.bestseller,
        ratingAverage: item.ratingAverage,
        ratingCount: item.ratingCount,
      })),
      availableSizes: allMatchingSizes,
      userContext,
      latestOrder,
      cartSummary,
      supportContacts: SUPPORT_CONTACTS,
      paymentMethods: PAYMENT_METHODS,
      knownCategories: knownCategories.slice(0, 30),
      knownSubcategories: knownSubcategories.slice(0, 30),
      policyHints: shouldGivePolicyHelp
        ? {
            cancellableStatuses: CANCELLABLE_STATUSES,
            note: "Orders can be cancelled before shipped stage.",
            refundWorkflow: [
              "Contact support on WhatsApp or email",
              "Share order ID and item details",
              "Mention reason for return/refund",
              "Attach photos if the item is damaged or incorrect",
              "Wait for verification and follow the next steps",
            ],
            supportContacts: SUPPORT_CONTACTS,
          }
        : null,
    };

    const prompt = `${systemPrompt}\n\nDATABASE CONTEXT(JSON):\n${JSON.stringify(promptContext, null, 2)}\n\nUser: ${message}`;

    const geminiData = await callGemini(prompt, GEMINI_API_KEY);

    let botMessage = chooseLangResponse(
      message,
      {
        en: "I can help with products, cart, and order support. Try asking: show me best products under 5000.",
        ur: "Main products, cart aur order support mein madad kar sakta hoon. Poochain: best products under 5000.",
      },
      preferredLang,
    );

    if (geminiData?.candidates?.length > 0) {
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) botMessage = text;
    }

    if (geminiData?.error) {
      const localMessage = getLocalHelpResponse(message);
      botMessage = chooseLangResponse(message, localMessage, preferredLang);
    }

    if (shouldAskAboutSizes) {
      botMessage = sizeResponse;
    }

    if (shouldAskAboutPaymentMethods) {
      botMessage = paymentMethodsResponse;
    }

    if (shouldSearchTopRatedProducts) {
      botMessage = topRatedResponse;
    }

    if (
      shouldSearchProducts &&
      products.length === 0 &&
      !shouldSearchTopRatedProducts
    ) {
      botMessage = chooseLangResponse(
        message,
        {
          en: "I checked products but no exact match found for your filters. Try changing category or budget and I will fetch again instantly.",
          ur: "Maine products check kiye lekin aapke filters ke mutabiq exact match nahi mila. Category ya budget change karein, main turant dobara fetch kar doon ga.",
        },
        preferredLang,
      );

      if (shouldBlockBroadQuery) {
        botMessage = chooseLangResponse(
          message,
          {
            en: "I understood you want a specific category (like men/women/kids), but that category isn't available in current data. Try another category.",
            ur: "Mujhe samajh aaya ke aap specific category (men/women/kids) chahte hain, lekin woh category current data mein available nahi. Koi aur category try karein.",
          },
          preferredLang,
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: botMessage,
      products,
      count: products.length,
      appliedFilters: filters,
      latestOrder,
      cartSummary,
      timestamp: new Date(),
    });
  } catch (error) {
    console.log("processMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to process request right now",
      error: error.message,
    });
  }
};

export const searchProductsForChat = async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, bestseller, sortBy } =
      req.body;

    const filters = {
      category,
      subcategory,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      onlyBestseller: Boolean(bestseller),
      sort:
        sortBy === "price-asc"
          ? { price: 1 }
          : sortBy === "price-desc"
            ? { price: -1 }
            : sortBy === "rating-desc" || sortBy === "top-rated"
              ? { ratingAverage: -1, ratingCount: -1, createdAt: -1 }
              : { createdAt: -1 },
    };

    const products = await Product.find(buildProductQuery(filters))
      .sort(filters.sort)
      .limit(20);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: products.map(formatProduct),
      count: products.length,
      appliedFilters: filters,
    });
  } catch (error) {
    console.log("searchProductsForChat error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to search products",
      error: error.message,
    });
  }
};

export const getProductDetailsForChat = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: formatProduct(product),
    });
  } catch (error) {
    console.log("getProductDetailsForChat error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch product details",
      error: error.message,
    });
  }
};

export default {
  processMessage,
  searchProductsForChat,
  getProductDetailsForChat,
};
